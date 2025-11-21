import { Request, Response } from 'express';
import Carrera from '../models/Carrera';
import fs from 'fs/promises';
import path from 'path';

// GET - Obtener todas las carreras
export const getCarreras = async (req: Request, res: Response) => {
  try {
    const carreras = await Carrera.findAll({
      where: { activo: true },
      order: [['orden', 'ASC'], ['nivel', 'ASC']],
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ message: 'Error al obtener carreras' });
  }
};

// GET - Obtener todas las carreras (incluyendo inactivas) - Admin
export const getAllCarreras = async (req: Request, res: Response) => {
  try {
    const carreras = await Carrera.findAll({
      order: [['orden', 'ASC'], ['nivel', 'ASC']],
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ message: 'Error al obtener carreras' });
  }
};

// GET - Obtener carreras por nivel
export const getCarrerasByNivel = async (req: Request, res: Response) => {
  try {
    const { nivel } = req.params;
    const carreras = await Carrera.findAll({
      where: { 
        nivel,
        activo: true 
      },
      order: [['orden', 'ASC']],
    });
    res.json(carreras);
  } catch (error) {
    console.error('Error al obtener carreras por nivel:', error);
    res.status(500).json({ message: 'Error al obtener carreras por nivel' });
  }
};

// GET - Obtener una carrera por ID
export const getCarreraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.findByPk(id);
    
    if (!carrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    
    res.json(carrera);
  } catch (error) {
    console.error('Error al obtener carrera:', error);
    res.status(500).json({ message: 'Error al obtener carrera' });
  }
};

// POST - Crear nueva carrera
export const createCarrera = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      siglas,
      nivel,
      modalidad,
      duracion,
      objetivo,
      perfil_ingreso,
      perfil_egreso,
      campo_laboral,
      orden,
      activo,
    } = req.body;

    const imagen = (req as any).savedImagePath || '';
    const video_url = (req as any).savedVideoPath || '';
    const plan_estudios_url = (req as any).savedPlanPath || '';

    const carrera = await Carrera.create({
      nombre,
      siglas,
      nivel,
      modalidad,
      duracion,
      objetivo,
      perfil_ingreso,
      perfil_egreso,
      campo_laboral,
      imagen,
      video_url,
      plan_estudios_url,
      orden: parseInt(orden) || 0,
      activo: activo === 'true' || activo === true,
    });

    res.status(201).json(carrera);
  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({ message: 'Error al crear carrera' });
  }
};

// PUT - Actualizar carrera
export const updateCarrera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.findByPk(id);

    if (!carrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    const {
      nombre,
      siglas,
      nivel,
      modalidad,
      duracion,
      objetivo,
      perfil_ingreso,
      perfil_egreso,
      campo_laboral,
      orden,
      activo,
    } = req.body;

    // Actualizar imagen si se proporciona una nueva
    if ((req as any).savedImagePath) {
      // Eliminar imagen anterior si existe
      if (carrera.imagen) {
        const oldImagePath = path.join(__dirname, '../../uploads/carreras', carrera.imagen);
        try {
          await fs.unlink(oldImagePath);
        } catch (error) {
          console.error('Error al eliminar imagen anterior:', error);
        }
      }
      carrera.imagen = (req as any).savedImagePath;
    }

    // Actualizar video si se proporciona uno nuevo
    if ((req as any).savedVideoPath) {
      // Eliminar video anterior si existe
      if (carrera.video_url) {
        const oldVideoPath = path.join(__dirname, '../../uploads/carreras/videos', carrera.video_url);
        try {
          await fs.unlink(oldVideoPath);
        } catch (error) {
          console.error('Error al eliminar video anterior:', error);
        }
      }
      carrera.video_url = (req as any).savedVideoPath;
    }

    // Actualizar plan de estudios si se proporciona uno nuevo
    if ((req as any).savedPlanPath) {
      // Eliminar plan anterior si existe
      if (carrera.plan_estudios_url) {
        const oldPlanPath = path.join(__dirname, '../../uploads/carreras/planes', carrera.plan_estudios_url);
        try {
          await fs.unlink(oldPlanPath);
        } catch (error) {
          console.error('Error al eliminar plan anterior:', error);
        }
      }
      carrera.plan_estudios_url = (req as any).savedPlanPath;
    }

    // Actualizar otros campos
    carrera.nombre = nombre || carrera.nombre;
    carrera.siglas = siglas || carrera.siglas;
    carrera.nivel = nivel || carrera.nivel;
    carrera.modalidad = modalidad || carrera.modalidad;
    carrera.duracion = duracion || carrera.duracion;
    carrera.objetivo = objetivo || carrera.objetivo;
    carrera.perfil_ingreso = perfil_ingreso || carrera.perfil_ingreso;
    carrera.perfil_egreso = perfil_egreso || carrera.perfil_egreso;
    carrera.campo_laboral = campo_laboral || carrera.campo_laboral;
    carrera.orden = orden !== undefined ? parseInt(orden) : carrera.orden;
    carrera.activo = activo !== undefined ? (activo === 'true' || activo === true) : carrera.activo;

    await carrera.save();
    res.json(carrera);
  } catch (error) {
    console.error('Error al actualizar carrera:', error);
    res.status(500).json({ message: 'Error al actualizar carrera' });
  }
};

// DELETE - Eliminar carrera
export const deleteCarrera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const carrera = await Carrera.findByPk(id);

    if (!carrera) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }

    // Eliminar archivos asociados
    if (carrera.imagen) {
      const imagePath = path.join(__dirname, '../../uploads/carreras', carrera.imagen);
      try {
        await fs.unlink(imagePath);
      } catch (error) {
        console.error('Error al eliminar imagen:', error);
      }
    }

    if (carrera.video_url) {
      const videoPath = path.join(__dirname, '../../uploads/carreras/videos', carrera.video_url);
      try {
        await fs.unlink(videoPath);
      } catch (error) {
        console.error('Error al eliminar video:', error);
      }
    }

    if (carrera.plan_estudios_url) {
      const planPath = path.join(__dirname, '../../uploads/carreras/planes', carrera.plan_estudios_url);
      try {
        await fs.unlink(planPath);
      } catch (error) {
        console.error('Error al eliminar plan de estudios:', error);
      }
    }

    await carrera.destroy();
    res.json({ message: 'Carrera eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar carrera:', error);
    res.status(500).json({ message: 'Error al eliminar carrera' });
  }
};
