import Organigrama from "../models/Organigrama";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "sequelize";

// Función auxiliar para construir el árbol jerárquico
const buildTree = (items: any[], parentId: number | null = null): any[] => {
  return items
    .filter(item => item.parent_id === parentId)
    .map(item => ({
      key: item.key,
      expanded: item.expanded,
      type: item.type,
      data: {
        image: item.image,
        name: item.name,
        title: item.title,
        text: item.text
      },
      children: buildTree(items, item.id)
    }))
    .sort((a, b) => {
      const aItem = items.find(i => i.data?.name === a.data.name);
      const bItem = items.find(i => i.data?.name === b.data.name);
      return (aItem?.order_position || 0) - (bItem?.order_position || 0);
    });
};

export const getAllOrganigrama = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Organigrama.findAll({
      order: [['order_position', 'ASC']]
    });
    
    // Construir árbol jerárquico
    const tree = buildTree(items.map(item => item.toJSON()));
    
    res.status(200).json({
      message: "Organigrama obtenido correctamente",
      data: tree
    });
  } catch (error) {
    console.error('Error al obtener organigrama:', error);
    next(error);
  }
};

export const getOrganigramaFlat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await Organigrama.findAll({
      order: [['order_position', 'ASC']]
    });
    
    res.status(200).json({
      message: "Organigrama (lista plana) obtenido correctamente",
      data: items
    });
  } catch (error) {
    console.error('Error al obtener organigrama:', error);
    next(error);
  }
};

export const getOrganigramaById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const item = await Organigrama.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: "Elemento de organigrama no encontrado" });
    }

    res.status(200).json({
      message: "Elemento encontrado",
      data: item
    });
  } catch (error) {
    console.error('Error al obtener elemento de organigrama:', error);
    next(error);
  }
};

export const createOrganigrama = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, parent_id, expanded, type, name, title, text, order_position } = req.body;
    let image = req.file ? req.file.filename : req.body.image;

    // Validar campos requeridos
    if (!name || !title || !image) {
      return res.status(400).json({ error: "Nombre, título e imagen son campos requeridos" });
    }

    // Crear nuevo elemento
    const nuevoItem = await Organigrama.create({
      key,
      parent_id: parent_id || null,
      expanded: expanded !== undefined ? expanded : true,
      type: type || 'person',
      image,
      name,
      title,
      text,
      order_position: order_position || 0
    });

    res.status(201).json({
      message: "Elemento de organigrama creado correctamente",
      data: nuevoItem
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: "Error de validación",
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    console.error('Error al crear elemento de organigrama:', error);
    next(error);
  }
};

export const updateOrganigrama = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { key, parent_id, expanded, type, name, title, text, order_position } = req.body;
    let image = req.file ? req.file.filename : req.body.image;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar el elemento existente
    const itemExistente = await Organigrama.findByPk(id);
    if (!itemExistente) {
      return res.status(404).json({ message: "Elemento de organigrama no encontrado" });
    }

    // Preparar datos de actualización
    const datosActualizacion: any = {
      name,
      title,
      text,
      expanded: expanded !== undefined ? expanded : itemExistente.expanded,
      type: type || itemExistente.type,
      order_position: order_position !== undefined ? order_position : itemExistente.order_position
    };

    if (key !== undefined) datosActualizacion.key = key;
    if (parent_id !== undefined) datosActualizacion.parent_id = parent_id || null;
    if (image) datosActualizacion.image = image;

    // Actualizar elemento
    await itemExistente.update(datosActualizacion);

    res.status(200).json({
      message: "Elemento de organigrama actualizado correctamente",
      data: itemExistente
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({
        error: "Error de validación",
        details: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    console.error('Error al actualizar elemento de organigrama:', error);
    next(error);
  }
};

export const deleteOrganigrama = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID inválido" });
    }

    // Buscar el elemento existente
    const itemExistente = await Organigrama.findByPk(id);
    if (!itemExistente) {
      return res.status(404).json({ message: "Elemento de organigrama no encontrado" });
    }

    // Verificar si tiene hijos
    const hijos = await Organigrama.findAll({
      where: { parent_id: id }
    });

    if (hijos.length > 0) {
      return res.status(400).json({
        error: "No se puede eliminar un elemento con hijos. Elimine primero los elementos dependientes."
      });
    }

    // Eliminar elemento
    await itemExistente.destroy();

    res.status(200).json({
      message: "Elemento de organigrama eliminado correctamente",
      data: { id: itemExistente.id }
    });
  } catch (error) {
    console.error('Error al eliminar elemento de organigrama:', error);
    next(error);
  }
};

// Endpoint para sincronizar desde datos del cliente
export const syncOrganigramaFromClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Se esperaba un array de datos" });
    }

    // Limpiar tabla existente
    await Organigrama.destroy({ where: {}, truncate: true });

    // Función recursiva para insertar el árbol
    const insertTree = async (nodes: any[], parentId: number | null = null, position: number = 0) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const newItem = await Organigrama.create({
          key: node.key,
          parent_id: parentId,
          expanded: node.expanded !== undefined ? node.expanded : true,
          type: node.type || 'person',
          image: node.data.image,
          name: node.data.name,
          title: node.data.title,
          text: node.data.text,
          order_position: position + i
        });

        // Insertar hijos si existen
        if (node.children && node.children.length > 0) {
          await insertTree(node.children, newItem.id, 0);
        }
      }
    };

    await insertTree(data);

    res.status(200).json({
      message: "Organigrama sincronizado correctamente desde el cliente",
      count: await Organigrama.count()
    });
  } catch (error) {
    console.error('Error al sincronizar organigrama:', error);
    next(error);
  }
};
