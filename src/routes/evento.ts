import { Router } from 'express';
import * as eventoController from '../controllers/eventoController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Rutas públicas
router.get('/', eventoController.getEventos);
router.get('/activo', eventoController.getEventoActivo);

// Rutas protegidas (requieren autenticación)
router.post(
  '/',
  authenticateToken,
  eventoController.createEvento
);

router.put(
  '/:id',
  authenticateToken,
  eventoController.updateEvento
);

router.delete(
  '/:id',
  authenticateToken,
  eventoController.deleteEvento
);

export default router;
