import { Request, Response } from 'express';
import ProgramaDesarrollo from '../models/ProgramaDesarrollo';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getProgramas = async (req: Request, res: Response) => {
    try {
        const { admin } = req.query;
        const where: any = {};
        if (admin !== 'true') {
            where.activo = true;
        }
        const programas = await ProgramaDesarrollo.findAll({ where });
        res.json(programas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programas', error });
    }
};

export const getProgramaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const programa = await ProgramaDesarrollo.findByPk(id);
        if (!programa) return res.status(404).json({ message: 'Programa no encontrado' });
        res.json(programa);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener programa', error });
    }
};

export const createPrograma = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, activo } = req.body;
        const archivo = req.file ? `/uploads/documentos/${req.file.filename}` : '';

        if (!archivo) {
            return res.status(400).json({ message: 'El archivo es requerido' });
        }

        const nuevoPrograma = await ProgramaDesarrollo.create({
            titulo,
            descripcion,
            archivo,
            activo: activo === 'true',
        });
        res.status(201).json(nuevoPrograma);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear programa', error });
    }
};

export const updatePrograma = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, activo } = req.body;
        const programa = await ProgramaDesarrollo.findByPk(id);

        if (!programa) {
            return res.status(404).json({ message: 'Programa no encontrado' });
        }

        const updateData: any = { titulo, descripcion, activo: activo === 'true' };
        if (req.file) {
            // Eliminar archivo anterior si existe
            if (programa.archivo) {
                deleteFile(programa.archivo);
            }
            updateData.archivo = `/uploads/documentos/${req.file.filename}`;
        }

        await programa.update(updateData);
        res.json(programa);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar programa', error });
    }
};

export const deletePrograma = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const programa = await ProgramaDesarrollo.findByPk(id);
        if (!programa) {
            return res.status(404).json({ message: 'Programa no encontrado' });
        }
        // Eliminar archivo físico si existe
        if (programa.archivo) {
            deleteFile(programa.archivo);
        }

        await programa.destroy();
        res.json({ message: 'Programa eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar programa', error });
    }
};
