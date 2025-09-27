import { Router } from 'express';
import {
  listarTextos,
  obtenerTexto,
  crearTexto,
  actualizarTexto,
  eliminarTexto,
  estadisticasTextos
} from '../controllers/textoController';

const router = Router();

// Rutas CRUD
router.get('/', listarTextos);
router.get('/stats', estadisticasTextos);
router.get('/:id', obtenerTexto);
router.post('/', crearTexto);
router.put('/:id', actualizarTexto);
router.delete('/:id', eliminarTexto);

export default router;