import { Router } from "express";
import { uploadNosotros } from "../middleware/uploadMiddleware";

import { 
  crearContenido,
  getNosotrosContenido,
  getNosotrosContenidoPorId,
  updateNosotrosContenido,
  deleteNosotrosContenido,
  getTiposContenido
} from "../controllers/nosotrosController";

// Middleware de seguridad
import { authenticateToken } from '../middleware/auth';
import { validateNosotros, validateId, handleValidationErrors } from '../middleware/validation';

const router = Router();

// Rutas públicas (solo lectura)
router.get("/tipos", getTiposContenido);
router.get("/contenido", getNosotrosContenido);
router.get("/contenido/:id", validateId, handleValidationErrors, getNosotrosContenidoPorId);

// Rutas protegidas (requieren autenticación)
router.post("/contenido", authenticateToken, uploadNosotros.single('imagen'), validateNosotros, handleValidationErrors, crearContenido);
router.put("/contenido/:id", authenticateToken, validateId, uploadNosotros.single('imagen'), validateNosotros, handleValidationErrors, updateNosotrosContenido);
router.delete("/contenido/:id", authenticateToken, validateId, handleValidationErrors, deleteNosotrosContenido);

export default router;
