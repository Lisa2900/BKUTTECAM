import { Router } from 'express';
import {
    getComites,
    createComite,
    updateComite,
    deleteComite,
    addDocumento,
    deleteDocumento,
    getComiteBySlug
} from '../controllers/comiteController';
import { uploadDocumentos } from '../middleware/uploadMiddleware';

const router = Router();

// Comites CRUD
router.get('/', getComites);
router.get('/:slug', getComiteBySlug);
router.post('/', createComite); // Optional: add Image upload if needed later
router.put('/:id', updateComite);
router.delete('/:id', deleteComite);

// Document Management
// Ensure 'archivo' matches the field name expected by frontend
router.post('/documentos', uploadDocumentos.single('archivo'), addDocumento);
router.delete('/documentos/:id', deleteDocumento);

export default router;
