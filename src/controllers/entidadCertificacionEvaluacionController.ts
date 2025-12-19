import { Request, Response } from 'express';
import EntidadCertificacionEvaluacion from '../models/EntidadCertificacionEvaluacion';
import fs from 'fs';
import path from 'path';

export const getEntidadResources = async (req: Request, res: Response) => {
    try {
        const items = await EntidadCertificacionEvaluacion.findAll({
            order: [['orden', 'ASC']],
            where: { activo: true }
        });
        
        const mappedItems = items.map(item => ({
            id: item.id,
            titulo: item.titulo,
            descripcion: item.descripcion,
            url: `/uploads/${item.archivo}`,
            tipo: item.tipo,
            fecha_subida: item.createdAt,
            is_active: item.activo
        }));
        res.json(mappedItems);
    } catch (error) {
        console.error('Error al obtener recursos de entidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const createEntidadResource = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, tipo, orden } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }

        // The file is saved in 'uploads/entidad-certificacion' by multer
        // We store the relative path 'entidad-certificacion/filename'
        const savedFilePath = `entidad-certificacion/${req.file.filename}`;

        const newItem = await EntidadCertificacionEvaluacion.create({
            titulo,
            descripcion,
            archivo: savedFilePath,
            tipo: tipo || 'image',
            orden: orden ? parseInt(orden) : 0,
            activo: true
        });

        res.status(201).json({
            id: newItem.id,
            titulo: newItem.titulo,
            descripcion: newItem.descripcion,
            url: `/uploads/${newItem.archivo}`,
            tipo: newItem.tipo,
            fecha_subida: newItem.createdAt,
            is_active: newItem.activo
        });
    } catch (error) {
        console.error('Error al crear recurso de entidad:', error);
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Error al eliminar archivo tras fallo:', unlinkError);
            }
        }
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const deleteEntidadResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await EntidadCertificacionEvaluacion.findByPk(id);

        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

        const filePath = path.join(__dirname, '../../uploads', item.archivo);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (e) {
            console.error('Error deleting file:', e);
        }

        await item.destroy();
        res.json({ message: 'Elemento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar recurso de entidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const updateEntidadResource = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, is_active } = req.body;

        const item = await EntidadCertificacionEvaluacion.findByPk(id);
        if (!item) {
            return res.status(404).json({ message: 'Elemento no encontrado' });
        }

        await item.update({
            titulo: titulo || item.titulo,
            descripcion: descripcion !== undefined ? descripcion : item.descripcion,
            activo: is_active !== undefined ? is_active : item.activo
        });

        res.json({
            id: item.id,
            titulo: item.titulo,
            descripcion: item.descripcion,
            url: `/uploads/${item.archivo}`,
            tipo: item.tipo,
            fecha_subida: item.createdAt,
            is_active: item.activo
        });
    } catch (error) {
        console.error('Error al actualizar recurso de entidad:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
