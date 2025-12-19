import { Router } from 'express';
import { getAllBanners, createBanner, updateBanner, deleteBanner } from '../controllers/practicasEstadiasBannerController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { uploadPracticasEstadiasImagen } from '../middleware/practicasEstadiasUpload';

const router = Router();

// Rutas públicas
router.get('/', getAllBanners);

// Rutas protegidas
router.post('/', authenticateToken, requireAdmin, uploadPracticasEstadiasImagen, createBanner);
router.put('/:id', authenticateToken, requireAdmin, uploadPracticasEstadiasImagen, updateBanner);
router.delete('/:id', authenticateToken, requireAdmin, deleteBanner);

export default router;
