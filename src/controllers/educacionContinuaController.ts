import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import EducacionContinuaCurso from '../models/EducacionContinuaCurso';
import EducacionContinuaInfo from '../models/EducacionContinuaInfo';

// --- INFO CONTROLLERS ---

export const getInfo = async (req: Request, res: Response) => {
  try {
    let info = await EducacionContinuaInfo.findOne();
    if (!info) {
      info = await EducacionContinuaInfo.create({
        titulo_principal: 'Cursos de Educación Continua',
        descripcion_final: '¡Descubre nuestros cursos y potencia tu desarrollo profesional!'
      });
    }
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la información', error });
  }
};

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const { titulo_principal, descripcion_final } = req.body;
    let info = await EducacionContinuaInfo.findOne();
    
    if (!info) {
      info = await EducacionContinuaInfo.create({
        titulo_principal: titulo_principal || 'Cursos de Educación Continua',
        descripcion_final: descripcion_final || '¡Descubre nuestros cursos y potencia tu desarrollo profesional!'
      });
    } else {
      await info.update({ titulo_principal, descripcion_final });
    }
    
    res.json(info);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la información', error });
  }
};

// --- CURSOS CONTROLLERS ---

export const getCursos = async (req: Request, res: Response) => {
  try {
    const cursos = await EducacionContinuaCurso.findAll({
      order: [['orden', 'ASC']]
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos', error });
  }
};

export const getPublicCursos = async (req: Request, res: Response) => {
  try {
    const cursos = await EducacionContinuaCurso.findAll({
      where: { activo: true },
      order: [['orden', 'ASC']]
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos públicos', error });
  }
};

export const createCurso = async (req: Request, res: Response) => {
  try {
    const { titulo } = req.body;
    const imagenPath = (req as any).savedImagePath;

    if (!imagenPath) {
      return res.status(400).json({ message: 'La imagen es requerida' });
    }

    // Obtener el último orden para agregar al final
    const lastCurso = await EducacionContinuaCurso.findOne({
      order: [['orden', 'DESC']]
    });
    const newOrder = lastCurso ? lastCurso.orden + 1 : 0;

    const newCurso = await EducacionContinuaCurso.create({
      titulo: titulo || 'Sin título',
      imagen: imagenPath,
      orden: newOrder,
      activo: true
    });

    res.status(201).json(newCurso);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso', error });
  }
};

export const updateCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { titulo, activo } = req.body;
    const imagenPath = (req as any).savedImagePath;

    const curso = await EducacionContinuaCurso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Si hay nueva imagen, eliminar la anterior
    if (imagenPath) {
      const oldImagePath = path.join(__dirname, '../../uploads', curso.imagen);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      curso.imagen = imagenPath;
    }

    if (titulo !== undefined) curso.titulo = titulo;
    if (activo !== undefined) curso.activo = activo === 'true' || activo === true;

    await curso.save();
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso', error });
  }
};

export const deleteCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const curso = await EducacionContinuaCurso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Eliminar imagen física
    const imagePath = path.join(__dirname, '../../uploads', curso.imagen);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await curso.destroy();
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso', error });
  }
};

export const toggleCursoStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const curso = await EducacionContinuaCurso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    curso.activo = activo;
    await curso.save();
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al cambiar estado del curso', error });
  }
};

export const updateCursoOrder = async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body; // Array de IDs en el nuevo orden

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'Formato de datos inválido' });
    }

    // Actualizar el orden de cada curso
    const promises = orderedIds.map((id, index) => {
      return EducacionContinuaCurso.update({ orden: index }, { where: { id } });
    });

    await Promise.all(promises);
    
    const cursos = await EducacionContinuaCurso.findAll({
      order: [['orden', 'ASC']]
    });
    
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al reordenar los cursos', error });
  }
};
