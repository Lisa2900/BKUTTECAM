import { Request, Response } from 'express';
import MiembroSniiTipo from '../models/MiembroSniiTipo';
import MiembroSNII from '../models/MiembroSNII';

export const getTipos = async (req: Request, res: Response) => {
  try {
    const tipos = await MiembroSniiTipo.findAll({
      order: [['Nombre', 'ASC']]
    });
    res.json(tipos);
  } catch (error) {
    console.error('Error al obtener tipos:', error);
    res.status(500).json({ message: 'Error al obtener tipos de miembros SNII' });
  }
};

export const createTipo = async (req: Request, res: Response) => {
  try {
    const { Nombre } = req.body;
    if (!Nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const nuevoTipo = await MiembroSniiTipo.create({ Nombre: Nombre.trim() });
    res.status(201).json(nuevoTipo);
  } catch (error: any) {
    console.error('Error al crear tipo:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    res.status(500).json({ message: 'Error al crear tipo' });
  }
};

export const updateTipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { Nombre } = req.body;

    if (!Nombre) {
      return res.status(400).json({ message: 'El nombre es requerido' });
    }

    const tipo = await MiembroSniiTipo.findByPk(id);
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }

    // if (tipo.Nombre === 'General') {
    //   return res.status(403).json({ message: 'No se puede modificar la categoría General' });
    // }

    const oldName = tipo.Nombre;
    const newName = Nombre.trim();

    // Actualizar el nombre del tipo
    console.log(`Actualizando tipo ID ${id} de '${oldName}' a '${newName}'`);
    await tipo.update({ Nombre: newName });

    // Actualizar todos los documentos que tenían el nombre anterior
    if (oldName !== newName) {
      console.log(`Actualizando documentos de tipo '${oldName}' a '${newName}'`);
      const [updatedCount] = await MiembroSNII.update(
        { tipo: newName },
        { where: { tipo: oldName } }
      );
      console.log(`Se actualizaron ${updatedCount} documentos.`);
    }

    res.json(tipo);
  } catch (error: any) {
    console.error('Error al actualizar tipo:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    res.status(500).json({ message: 'Error al actualizar tipo', error: error.message });
  }
};

export const deleteTipo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tipo = await MiembroSniiTipo.findByPk(id);
    
    if (!tipo) {
      return res.status(404).json({ message: 'Tipo no encontrado' });
    }

    // if (tipo.Nombre === 'General') {
    //   return res.status(403).json({ message: 'No se puede eliminar la categoría General' });
    // }

    const typeName = tipo.Nombre;

    // Eliminar el tipo
    await tipo.destroy();

    // Actualizar los documentos asociados para que tengan un tipo genérico o nulo
    // En este caso, los moveremos a "General" para no dejarlos huérfanos
    await MiembroSNII.update(
      { tipo: 'General' },
      { where: { tipo: typeName } }
    );

    res.json({ message: 'Tipo eliminado correctamente y documentos reasignados a General' });
  } catch (error) {
    console.error('Error al eliminar tipo:', error);
    res.status(500).json({ message: 'Error al eliminar tipo' });
  }
};
