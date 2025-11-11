import { Request, Response } from 'express';
import Noticia from '../models/Noticia';

export const getNoticias = async (req: Request, res: Response) => {
  try {
    const noticias = await Noticia.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']],
    });
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
};

export const createNoticia = async (req: Request, res: Response) => {
  try {
    const { titulo } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó imagen' });
    }

    const noticia = await Noticia.create({
      titulo,
      imagen: file.filename,
      orden: 0,
      activo: true,
    });

    res.status(201).json(noticia);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ error: 'Error al crear noticia' });
  }
};

export const updateNoticia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, orden, activo } = req.body;
    const file = req.file;

    const noticia = await Noticia.findByPk(id);
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    const updateData: any = { titulo, orden, activo };
    if (file) {
      updateData.imagen = file.filename;
    }

    await noticia.update(updateData);
    res.json(noticia);
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
};

export const deleteNoticia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findByPk(id);
    
    if (!noticia) {
      return res.status(404).json({ error: 'Noticia no encontrada' });
    }

    await noticia.destroy();
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
};
