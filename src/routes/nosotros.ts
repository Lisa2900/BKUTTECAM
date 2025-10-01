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

const router = Router();

// Ruta para obtener tipos disponibles
router.get("/tipos", getTiposContenido);

// Rutas para contenido con manejo de imágenes
router.post("/contenido", uploadNosotros.single('imagen'), crearContenido);
router.get("/contenido", getNosotrosContenido);
router.get("/contenido/:id", getNosotrosContenidoPorId);
router.put("/contenido/:id", uploadNosotros.single('imagen'), updateNosotrosContenido);
router.delete("/contenido/:id", deleteNosotrosContenido);

export default router;
