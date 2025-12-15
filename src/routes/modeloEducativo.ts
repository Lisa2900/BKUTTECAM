import { Router } from 'express';
import { getModeloEducativo, updateModeloEducativo } from '../controllers/modeloEducativoController';
import { uploadModelo, validateUploadedFile, saveModeloFile } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/auth'; // Assuming auth middleware exists

const router = Router();

router.get('/', getModeloEducativo);
router.put('/:id', authenticateToken, uploadModelo, validateUploadedFile, saveModeloFile, updateModeloEducativo);

export default router;
