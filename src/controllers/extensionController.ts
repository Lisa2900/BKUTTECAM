import { Request, Response } from 'express';
import ExtensionSection from '../models/ExtensionSection';
import { deleteFile } from '../middleware/uploadMiddleware';
import path from 'path';
import ExtensionItem from '../models/ExtensionItem';
import ExtensionDocument from '../models/ExtensionDocument';

// --- SECTIONS & ITEMS ---

export const getSection = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const section = await ExtensionSection.findOne({
      where: { slug },
      include: [{ model: ExtensionItem, as: 'items' }]
    });

    if (!section) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    res.json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la sección' });
  }
};

export const updateSection = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, description, banner_url } = req.body;

    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    await section.update({ title, description, banner_url });
    res.json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la sección' });
  }
};

// POST /api/extension/sections/:slug/upload-image
export const uploadSectionBanner = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) return res.status(404).json({ message: 'Sección no encontrada' });

    if (!req.file) {
      return res.status(400).json({ message: 'No se proporcionó archivo' });
    }

    // Determine banner_url (relative to /uploads)
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    const resolvedFile = path.resolve(req.file.path);
    let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
    relativePath = `/uploads/${relativePath}`;

    // Clean up previous banner if present and is in uploads
    const prevBanner = section.banner_url;
    if (prevBanner && prevBanner.startsWith('/uploads/')) {
      // Convert banner_url to system path
      const prevPath = path.join(uploadsDir, prevBanner.replace('/uploads/', ''));
      try {
        deleteFile(prevPath);
      } catch (err) {
        // Non-blocking: log & continue
        console.warn('No se pudo eliminar banner anterior:', err);
      }
    }

    await section.update({ banner_url: relativePath });
    res.json(section);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir banner' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, content, icon } = req.body;

    const section = await ExtensionSection.findOne({ where: { slug } });
    if (!section) {
      return res.status(404).json({ message: 'Sección no encontrada' });
    }

    let image_url = null;
    if (req.file) {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const resolvedFile = path.resolve(req.file.path);
      let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
      image_url = `/uploads/${relativePath}`;
    }

    const item = await ExtensionItem.create({
      section_id: section.id,
      title,
      content,
      icon,
      image_url
    });

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el item' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, icon } = req.body;

    const item = await ExtensionItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    let image_url = item.image_url;
    if (req.file) {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const resolvedFile = path.resolve(req.file.path);
      let relativePath = path.relative(uploadsDir, resolvedFile).replace(/\\/g, '/');
      image_url = `/uploads/${relativePath}`;

      // Clean up previous image if present and is in uploads
      const prevImage = item.image_url;
      if (prevImage && prevImage.startsWith('/uploads/')) {
        const prevPath = path.join(uploadsDir, prevImage.replace('/uploads/', ''));
        try {
          deleteFile(prevPath);
        } catch (err) {
          console.warn('No se pudo eliminar imagen anterior:', err);
        }
      }
    }

    await item.update({ title, content, icon, image_url });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el item' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await ExtensionItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }
    // Delete associated image if present
    const prevImage = item.image_url;
    if (prevImage && prevImage.startsWith('/uploads/')) {
      const uploadsDir = path.resolve(__dirname, '../../uploads');
      const prevPath = path.join(uploadsDir, prevImage.replace('/uploads/', ''));
      try {
        deleteFile(prevPath);
      } catch (err) {
        console.warn('No se pudo eliminar imagen anterior:', err);
      }
    }

    await item.destroy();
    res.json({ message: 'Item eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el item' });
  }
};

// --- DOCUMENTS (Gacetas / Promocion) ---

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const { category } = req.params; // 'gaceta' or 'promocion'
    const documents = await ExtensionDocument.findAll({
      where: { category },
      order: [['publication_date', 'DESC'], ['created_at', 'DESC']]
    });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener documentos' });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { category, title, file_url, cover_url, publication_date } = req.body;
    const document = await ExtensionDocument.create({
      category,
      title,
      file_url,
      cover_url,
      publication_date
    });
    res.status(201).json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear documento' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await ExtensionDocument.findByPk(id);
    if (!document) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    await document.destroy();
    res.json({ message: 'Documento eliminado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar documento' });
  }
};
