import { Router } from 'express';
import * as extensionController from '../controllers/extensionController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadExtension, validateUploadedFile } from '../middleware/uploadMiddleware';

const router = Router();

// Sections & Items
router.get('/sections/:slug', extensionController.getSection);
router.put('/sections/:slug', extensionController.updateSection);
router.post('/sections/:slug/items', authenticateToken, uploadExtension.single('image'), validateUploadedFile, extensionController.createItem);
// Upload banner for section (authenticated)
router.post('/sections/:slug/upload-image', authenticateToken, uploadExtension.single('image'), validateUploadedFile, extensionController.uploadSectionBanner);
router.put('/items/:id', authenticateToken, uploadExtension.single('image'), validateUploadedFile, extensionController.updateItem);
router.delete('/items/:id', extensionController.deleteItem);

// Documents
router.get('/documents/:category', extensionController.getDocuments);
router.post('/documents', extensionController.createDocument);
router.delete('/documents/:id', extensionController.deleteDocument);

export default router;
