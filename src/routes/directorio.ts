import { Router } from 'express';
import {
  getAllDirectorios,
  getDirectorioById,
  createDirectorio,
  updateDirectorio,
  deleteDirectorio
} from '../controllers/directorioControler';
import { uploadDirectorios } from '../middleware/uploadMiddleware';

const router = Router();

// GET /api/directorios - Obtener todos los directorios
router.get('/', getAllDirectorios);

// GET /api/directorios/:id - Obtener un directorio por ID
router.get('/:id', getDirectorioById);

// POST /api/directorios - Crear un nuevo directorio
router.post('/', uploadDirectorios.single('imagen'), createDirectorio);

// PUT /api/directorios/:id - Actualizar un directorio
router.put('/:id', uploadDirectorios.single('imagen'), updateDirectorio);

// DELETE /api/directorios/:id - Eliminar un directorio
router.delete('/:id', deleteDirectorio);

export default router;