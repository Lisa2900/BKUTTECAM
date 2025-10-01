
import { NextFunction, Request, Response } from "express";
import NosotrosContenido, { TipoContenido } from "../models/nosotros";
import { ValidationError, Op } from "sequelize";
import { deleteFile } from "../middleware/uploadMiddleware";
import path from "path";

// Validar tipos de contenido permitidos
const tiposPermitidos = Object.values(TipoContenido);

export const crearContenido = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tipo, titulo, descripcion, lista } = req.body;

    // Validaciones básicas
    if (!tipo || !titulo) {
      // Si hay archivo subido y falla la validación, eliminarlo
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ 
        error: "Tipo y título son campos requeridos" 
      });
    }

    // Validar tipo de contenido
    if (!tiposPermitidos.includes(tipo)) {
      // Si hay archivo subido y falla la validación, eliminarlo
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ 
        error: `Tipo no válido. Tipos permitidos: ${tiposPermitidos.join(', ')}` 
      });
    }

    // Procesar imagen si existe
    let rutaImagen = null;
    if (req.file) {
      rutaImagen = `nosotros/${req.file.filename}`;
    }

    // Validar y procesar lista si se proporciona
    let listaArray = null;
    if (lista) {
      try {
        listaArray = typeof lista === 'string' ? JSON.parse(lista) : lista;
        if (!Array.isArray(listaArray)) {
          // Si hay archivo subido y falla la validación, eliminarlo
          if (req.file) {
            deleteFile(req.file.path);
          }
          return res.status(400).json({ 
            error: "La lista debe ser un array válido" 
          });
        }
      } catch (error) {
        // Si hay archivo subido y falla la validación, eliminarlo
        if (req.file) {
          deleteFile(req.file.path);
        }
        return res.status(400).json({ 
          error: "Formato de lista inválido" 
        });
      }
    }

    const nuevoContenido = await NosotrosContenido.create({ 
      tipo,
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      imagen: rutaImagen,
      lista: listaArray
    });

    res.status(201).json({ 
      message: "Contenido creado correctamente", 
      data: {
        ...nuevoContenido.toJSON(),
        imageUrl: rutaImagen ? `/uploads/${rutaImagen}` : null
      }
    });
  } catch (error) {
    // Si hay archivo subido y ocurre un error, eliminarlo
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        error: "Datos de validación incorrectos",
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    console.error('Error al crear contenido:', error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getNosotrosContenido = async (req: Request, res: Response) => {
  try {
    const { tipo, id } = req.query;
    let whereClause: any = {};

    // Filtrar por tipo si se proporciona
    if (tipo) {
      if (!tiposPermitidos.includes(tipo as TipoContenido)) {
        return res.status(400).json({ 
          error: `Tipo no válido. Tipos permitidos: ${tiposPermitidos.join(', ')}` 
        });
      }
      whereClause.tipo = tipo;
    }

    // Filtrar por ID si se proporciona
    if (id) {
      whereClause.id = id;
    }

    const contenidos = await NosotrosContenido.findAll({
      where: whereClause,
      order: [['fechaCreacion', 'DESC']]
    });

    // Agregar URL completa de imagen a cada contenido
    const contenidosConImagenes = contenidos.map(contenido => ({
      ...contenido.toJSON(),
      imageUrl: contenido.imagen ? `/uploads/${contenido.imagen}` : null
    }));

    res.status(200).json({ 
      message: "Contenido obtenido correctamente", 
      count: contenidos.length,
      data: contenidosConImagenes 
    });
  } catch (error) {
    console.error('Error al obtener contenido:', error);
    res.status(500).json({ message: "Error al obtener contenido" });
  }
};

export const getNosotrosContenidoPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const contenido = await NosotrosContenido.findByPk(id);

    if (!contenido) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    // Agregar URL completa de imagen
    const contenidoConImagen = {
      ...contenido.toJSON(),
      imageUrl: contenido.imagen ? `/uploads/${contenido.imagen}` : null
    };

    res.status(200).json({ 
      message: "Contenido obtenido correctamente", 
      data: contenidoConImagen 
    });
  } catch (error) {
    console.error('Error al obtener contenido por ID:', error);
    res.status(500).json({ message: "Error al obtener contenido" });
  }
};

export const updateNosotrosContenido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tipo, titulo, descripcion, lista } = req.body;

    if (!id || isNaN(Number(id))) {
      // Si hay archivo subido y el ID es inválido, eliminarlo
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar el contenido existente
    const contenidoExistente = await NosotrosContenido.findByPk(id);
    if (!contenidoExistente) {
      // Si hay archivo subido y el contenido no existe, eliminarlo
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    // Validar tipo si se proporciona
    if (tipo && !tiposPermitidos.includes(tipo)) {
      // Si hay archivo subido y el tipo es inválido, eliminarlo
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ 
        error: `Tipo no válido. Tipos permitidos: ${tiposPermitidos.join(', ')}` 
      });
    }

    // Validar y procesar lista si se proporciona
    let listaArray = undefined;
    if (lista !== undefined) {
      try {
        listaArray = typeof lista === 'string' ? JSON.parse(lista) : lista;
        if (listaArray !== null && !Array.isArray(listaArray)) {
          // Si hay archivo subido y la lista es inválida, eliminarlo
          if (req.file) {
            deleteFile(req.file.path);
          }
          return res.status(400).json({ 
            error: "La lista debe ser un array válido o null" 
          });
        }
      } catch (error) {
        // Si hay archivo subido y el formato de lista es inválido, eliminarlo
        if (req.file) {
          deleteFile(req.file.path);
        }
        return res.status(400).json({ 
          error: "Formato de lista inválido" 
        });
      }
    }

    // Preparar datos para actualizar (solo los campos proporcionados)
    const datosActualizacion: any = {};
    if (tipo) datosActualizacion.tipo = tipo;
    if (titulo) datosActualizacion.titulo = titulo.trim();
    if (descripcion !== undefined) datosActualizacion.descripcion = descripcion?.trim() || null;
    if (lista !== undefined) datosActualizacion.lista = listaArray;

    // Manejar nueva imagen
    if (req.file) {
      // Eliminar imagen anterior si existe
      if (contenidoExistente.imagen) {
        const rutaAnterior = path.join(__dirname, '../../uploads', contenidoExistente.imagen);
        deleteFile(rutaAnterior);
      }
      datosActualizacion.imagen = `nosotros/${req.file.filename}`;
    }

    // Actualizar el contenido
    await contenidoExistente.update(datosActualizacion);

    // Recargar para obtener los datos actualizados
    await contenidoExistente.reload();

    // Agregar URL completa de imagen
    const contenidoConImagen = {
      ...contenidoExistente.toJSON(),
      imageUrl: contenidoExistente.imagen ? `/uploads/${contenidoExistente.imagen}` : null
    };

    res.status(200).json({ 
      message: "Contenido actualizado correctamente",
      data: contenidoConImagen
    });
  } catch (error) {
    // Si hay archivo subido y ocurre un error, eliminarlo
    if (req.file) {
      deleteFile(req.file.path);
    }
    
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        error: "Datos de validación incorrectos",
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    console.error('Error al actualizar contenido:', error);
    res.status(500).json({ message: "Error al actualizar contenido" });
  }
};

export const deleteNosotrosContenido = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar el contenido existente
    const contenidoExistente = await NosotrosContenido.findByPk(id);
    if (!contenidoExistente) {
      return res.status(404).json({ message: "Contenido no encontrado" });
    }

    // Eliminar imagen asociada si existe
    if (contenidoExistente.imagen) {
      const rutaImagen = path.join(__dirname, '../../uploads', contenidoExistente.imagen);
      deleteFile(rutaImagen);
    }

    // Eliminar el contenido de la base de datos
    await contenidoExistente.destroy();

    res.status(200).json({ 
      message: "Contenido eliminado correctamente",
      data: { id: Number(id) }
    });
  } catch (error) {
    console.error('Error al eliminar contenido:', error);
    res.status(500).json({ message: "Error al eliminar contenido" });
  }
};

// Endpoint adicional para obtener todos los tipos disponibles
export const getTiposContenido = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ 
      message: "Tipos de contenido disponibles",
      data: tiposPermitidos.map(tipo => ({
        value: tipo,
        label: tipo.replace(/_/g, ' ').toUpperCase()
      }))
    });
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    res.status(500).json({ message: "Error al obtener tipos de contenido" });
  }
};

