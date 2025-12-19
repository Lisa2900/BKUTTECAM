import { Request, Response } from 'express';
import PracticasEstadiasBanner from '../models/PracticasEstadiasBanner';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';

export const getAllBanners = async (req: Request, res: Response) => {
  try {
    const banners = await PracticasEstadiasBanner.findAll({
      where: { activo: true },
      order: [['fecha_creacion', 'DESC']]
    });
    res.json(banners);
  } catch (error) {
    console.error('Error al obtener banners de prácticas y estadías:', error);
    res.status(500).json({ message: 'Error al obtener los registros' });
  }
};

export const createBanner = async (req: Request, res: Response) => {
  try {
    const { titulo, descripcion } = req.body;
    const savedImagePath = (req as any).savedImagePath;

    if (!savedImagePath) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    const nuevoBanner = await PracticasEstadiasBanner.create({
      titulo,
      descripcion,
      imagen: savedImagePath,
      activo: true
    });

    res.status(201).json(nuevoBanner);
  } catch (error) {
    console.error('Error al crear banner de prácticas y estadías:', error);
    if ((req as any).savedImagePath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedImagePath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al crear el registro' });
  }
};

export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, activo } = req.body;
    const savedImagePath = (req as any).savedImagePath;

    const banner = await PracticasEstadiasBanner.findByPk(id);

    if (!banner) {
      if (savedImagePath) {
        const fullPath = path.join(__dirname, '../../uploads', savedImagePath);
        deleteFile(fullPath);
      }
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (savedImagePath && banner.imagen) {
      const oldPath = path.join(__dirname, '../../uploads', banner.imagen);
      deleteFile(oldPath);
    }

    await banner.update({
      titulo: titulo || banner.titulo,
      descripcion: descripcion !== undefined ? descripcion : banner.descripcion,
      activo: activo !== undefined ? activo === 'true' || activo === true : banner.activo,
      imagen: savedImagePath || banner.imagen
    });

    res.json(banner);
  } catch (error) {
    console.error('Error al actualizar banner de prácticas y estadías:', error);
    if ((req as any).savedImagePath) {
      const fullPath = path.join(__dirname, '../../uploads', (req as any).savedImagePath);
      deleteFile(fullPath);
    }
    res.status(500).json({ message: 'Error al actualizar el registro' });
  }
};

export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const banner = await PracticasEstadiasBanner.findByPk(id);

    if (!banner) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    if (banner.imagen) {
      const fullPath = path.join(__dirname, '../../uploads', banner.imagen);
      deleteFile(fullPath);
    }

    await banner.destroy();
    res.json({ message: 'Registro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar banner de prácticas y estadías:', error);
    res.status(500).json({ message: 'Error al eliminar el registro' });
  }
};
