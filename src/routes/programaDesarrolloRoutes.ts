import { Router } from 'express';
import { uploadDocumentos, validateUploadedDocument } from '../middleware/uploadMiddleware';
import {
    getProgramas,
    getProgramaById,
    createPrograma,
    updatePrograma,
    deletePrograma
} from '../controllers/programaDesarrolloController';

const router = Router();

router.get('/', getProgramas);
router.get('/:id', getProgramaById);
router.post('/', uploadDocumentos.single('archivo'), validateUploadedDocument, createPrograma);
router.put('/:id', uploadDocumentos.single('archivo'), validateUploadedDocument, updatePrograma);
router.delete('/:id', deletePrograma);

export default router;
