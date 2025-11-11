import { Request, Response } from 'express';
import HeroSlide from '../models/HeroSlide';

export const getHeroSlides = async (req: Request, res: Response) => {
  try {
    const slides = await HeroSlide.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']],
    });
    res.json(slides);
  } catch (error) {
    console.error('Error al obtener slides del hero:', error);
    res.status(500).json({ error: 'Error al obtener slides del hero' });
  }
};

export const createHeroSlide = async (req: Request, res: Response) => {
  try {
    const { titulo, tipo } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' });
    }

    const slide = await HeroSlide.create({
      titulo,
      tipo,
      archivo: file.filename,
      orden: 0,
      activo: true,
    });

    res.status(201).json(slide);
  } catch (error) {
    console.error('Error al crear slide del hero:', error);
    res.status(500).json({ error: 'Error al crear slide del hero' });
  }
};

export const updateHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, tipo, orden, activo } = req.body;
    const file = req.file;

    const slide = await HeroSlide.findByPk(id);
    if (!slide) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }

    const updateData: any = { titulo, tipo, orden, activo };
    if (file) {
      updateData.archivo = file.filename;
    }

    await slide.update(updateData);
    res.json(slide);
  } catch (error) {
    console.error('Error al actualizar slide del hero:', error);
    res.status(500).json({ error: 'Error al actualizar slide del hero' });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const slide = await HeroSlide.findByPk(id);
    
    if (!slide) {
      return res.status(404).json({ error: 'Slide no encontrado' });
    }

    await slide.destroy();
    res.json({ message: 'Slide eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar slide del hero:', error);
    res.status(500).json({ error: 'Error al eliminar slide del hero' });
  }
};
