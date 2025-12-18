import { Request, Response } from 'express';
import Comite from '../models/Comite';
import DocumentoComite from '../models/DocumentoComite';
import fs from 'fs';
import path from 'path';
import { deleteFile } from '../middleware/uploadMiddleware';

export const getComites = async (req: Request, res: Response) => {
    try {
        const { admin, slug } = req.query;

        const includeInactive = admin === 'true';
        const whereClause: any = includeInactive ? {} : { activo: true };

        if (slug) {
            whereClause.slug = slug;
        }

        const docWhereClause = includeInactive ? {} : { activo: true };

        const comites = await Comite.findAll({
            where: whereClause,
            include: [{
                model: DocumentoComite,
                as: 'documentos',
                where: docWhereClause,
                required: false // LEFT JOIN to include comites without documents
            }],
            order: [['id', 'ASC']]
        });

        // Siempre devolver array (vacío si no hay datos)
        res.json(comites || []);
    } catch (error: any) {
        console.error('Error en getComites:', error.message);
        // Si la tabla no existe o hay error, devolver array vacío para permitir crear
        if (error.name === 'SequelizeDatabaseError' || error.message?.includes('doesn\'t exist')) {
            return res.json([]);
        }
        res.status(500).json({ message: 'Error al obtener comités' });
    }
};

export const getComiteBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const { admin } = req.query;

        const includeInactive = admin === 'true';
        const docWhereClause = includeInactive ? {} : { activo: true };

        const comite = await Comite.findOne({
            where: { slug: slug },
            include: [{
                model: DocumentoComite,
                as: 'documentos',
                where: docWhereClause,
                required: false
            }]
        });

        if (!comite) {
            return res.status(404).json({ message: 'Comité no encontrado' });
        }
        res.json(comite);
    } catch (error: any) {
        console.error('Error en getComiteBySlug:', error.message);
        // Si la tabla no existe, devolver 404 para permitir inicializar
        if (error.name === 'SequelizeDatabaseError' || error.message?.includes('doesn\'t exist')) {
            return res.status(404).json({ message: 'Comité no encontrado' });
        }
        res.status(500).json({ message: 'Error al obtener el comité' });
    }
}

export const createComite = async (req: Request, res: Response) => {
    try {
        const { titulo, descripcion, activo, slug } = req.body;

        // Auto-generate slug if not provided, from titulo
        let generatedSlug = slug;
        if (!generatedSlug) {
            generatedSlug = titulo.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        // Check if already exists to prevent UniqueConstraintError
        const existingComite = await Comite.findOne({ where: { slug: generatedSlug } });
        if (existingComite) {
            return res.status(200).json(existingComite);
        }

        const comite = await Comite.create({
            slug: generatedSlug,
            titulo,
            descripcion,
            activo: activo === 'true' || activo === true
        });
        res.status(201).json(comite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear comité' });
    }
};

export const updateComite = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { titulo, descripcion, activo, slug } = req.body;
        const comite = await Comite.findByPk(id);
        if (!comite) return res.status(404).json({ message: 'Comité no encontrado' });

        await comite.update({
            slug: slug || comite.slug,
            titulo,
            descripcion,
            activo: activo === 'true' || activo === true
        });
        res.json(comite);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar comité' });
    }
};

export const deleteComite = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const comite = await Comite.findByPk(id, {
            include: [{ model: DocumentoComite, as: 'documentos' }]
        });
        if (!comite) return res.status(404).json({ message: 'Comité no encontrado' });

        // 1. Eliminar archivos físicos de todos los documentos del comité
        if (comite.documentos && Array.isArray(comite.documentos)) {
            for (const doc of comite.documentos) {
                if (doc.archivo) {
                    deleteFile(doc.archivo);
                }
            }
        }

        // 2. Eliminar registros de la BD (primero documentos, luego comité)
        await DocumentoComite.destroy({ where: { comiteId: id } });
        await comite.destroy();
        res.json({ message: 'Comité y sus documentos eliminados física y lógicamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar comité' });
    }
};

// Document Management
export const addDocumento = async (req: Request, res: Response) => {
    try {
        console.log('[Comite Documento] Body:', req.body);
        console.log('[Comite Documento] File:', req.file);

        const { comiteId, titulo, activo } = req.body;

        if (!req.file) {
            console.log('[Comite Documento] Error: No hay archivo');
            return res.status(400).json({ message: 'Se requiere un archivo' });
        }

        const archivoPath = `/uploads/documentos/${req.file.filename}`;
        console.log('[Comite Documento] Guardando en:', archivoPath);

        const doc = await DocumentoComite.create({
            comiteId,
            titulo,
            archivo: archivoPath,
            activo: activo === 'true' || activo === true
        });

        console.log('[Comite Documento] Documento creado:', doc.id);
        res.status(201).json(doc);
    } catch (error: any) {
        console.error('[Comite Documento] Error:', error.message);
        res.status(500).json({ message: 'Error al agregar documento', error: error.message });
    }
};

export const deleteDocumento = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doc = await DocumentoComite.findByPk(id);
        if (!doc) return res.status(404).json({ message: 'Documento no encontrado' });

        // Limpieza del archivo físico
        if (doc.archivo) {
            deleteFile(doc.archivo);
        }

        await doc.destroy();
        res.json({ message: 'Documento eliminado física y lógicamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar documento' });
    }
};
