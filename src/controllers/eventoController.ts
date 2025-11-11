import { Request, Response } from 'express';
import Evento from '../models/Evento';
import { Op } from 'sequelize';

export const getEventos = async (req: Request, res: Response) => {
  try {
    const eventos = await Evento.findAll({
      where: { 
        activo: true,
        fecha_evento: {
          [Op.gte]: new Date()
        }
      },
      order: [['fecha_evento', 'ASC']],
    });
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
};

export const getEventoActivo = async (req: Request, res: Response) => {
  try {
    const evento = await Evento.findOne({
      where: { 
        activo: true,
        fecha_evento: {
          [Op.gte]: new Date()
        }
      },
      order: [['fecha_evento', 'ASC']],
    });
    
    if (!evento) {
      return res.status(404).json({ message: 'No hay eventos activos próximos' });
    }
    
    res.json(evento);
  } catch (error) {
    console.error('Error al obtener evento activo:', error);
    res.status(500).json({ error: 'Error al obtener evento activo' });
  }
};

export const createEvento = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion, fecha_evento, activo } = req.body;

    const evento = await Evento.create({
      titulo,
      descripcion,
      fecha_evento,
      activo: activo !== undefined ? activo : true,
    });

    res.status(201).json(evento);
  } catch (error) {
    console.error('Error al crear evento:', error);
    res.status(500).json({ error: 'Error al crear evento' });
  }
};

export const updateEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fecha_evento, activo } = req.body;

    const evento = await Evento.findByPk(id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.update({ titulo, descripcion, fecha_evento, activo });
    res.json(evento);
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
};

export const deleteEvento = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const evento = await Evento.findByPk(id);
    
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    await evento.destroy();
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
};
