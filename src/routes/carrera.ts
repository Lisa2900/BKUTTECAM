import express from 'express';
import {
  getCarreras,
  getAllCarreras,
  getCarrerasByNivel,
  getCarreraById,
  createCarrera,
  updateCarrera,
  deleteCarrera,
} from '../controllers/carreraController';
import { authenticateToken } from '../middleware/authMiddleware';
import { uploadCarrera, saveCarreraFiles } from '../middleware/uploadMiddleware';

const router = express.Router();

// Rutas públicas
router.get('/', getCarreras);
router.get('/nivel/:nivel', getCarrerasByNivel);
router.get('/:id', getCarreraById);

// Rutas protegidas (requieren autenticación)
router.get('/admin/all', authenticateToken, getAllCarreras);
router.post('/', authenticateToken, uploadCarrera, saveCarreraFiles, createCarrera);
router.put('/:id', authenticateToken, uploadCarrera, saveCarreraFiles, updateCarrera);
router.delete('/:id', authenticateToken, deleteCarrera);

export default router;
