import { Router } from 'express';
import { 
  getInfo, 
  updateInfo, 
  getCursos, 
  getPublicCursos, 
  createCurso, 
  updateCurso, 
  deleteCurso, 
  toggleCursoStatus, 
  updateCursoOrder 
} from '../controllers/educacionContinuaController';
import { uploadEducacionContinuaImagen } from '../middleware/educacionContinuaUpload';
import { authenticateToken } from '../middleware/authMiddleware'; // Assuming auth is needed for admin routes

const router = Router();

// Public routes
router.get('/public/cursos', getPublicCursos);
router.get('/info', getInfo);

// Admin routes (protected)
router.put('/info', authenticateToken, updateInfo);
router.get('/cursos', authenticateToken, getCursos);
router.post('/cursos', authenticateToken, uploadEducacionContinuaImagen, createCurso);
router.put('/cursos/reorder', authenticateToken, updateCursoOrder);
router.put('/cursos/:id', authenticateToken, uploadEducacionContinuaImagen, updateCurso);
router.delete('/cursos/:id', authenticateToken, deleteCurso);
router.patch('/cursos/:id/status', authenticateToken, toggleCursoStatus);

export default router;
