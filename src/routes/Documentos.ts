import { Router } from "express";
import {
  // Controladores de Áreas
  obtenerAreas,
  obtenerAreaPorId,
  crearArea,
  actualizarArea,
  eliminarArea,
  // Controladores de Categorías
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
  // Controladores de Archivos
  obtenerArchivos,
  obtenerArchivoPorId,
  obtenerArchivosPorArea,
  crearArchivo,
  subirArchivo,
  actualizarArchivo,
  eliminarArchivo,
  // Estadísticas
  obtenerEstadisticas
} from "../controllers/DocumentsController";
import { uploadDocumentos, validateUploadedDocument } from "../middleware/uploadMiddleware";

const router = Router();

// ============================================
// RUTAS PARA ÁREAS
// ============================================
router.get("/areas", obtenerAreas);
router.get("/areas/:id", obtenerAreaPorId);
router.post("/areas", crearArea);
router.put("/areas/:id", actualizarArea);
router.delete("/areas/:id", eliminarArea);

// ============================================
// RUTAS PARA CATEGORÍAS
// ============================================
router.get("/categorias", obtenerCategorias);
router.get("/categorias/:id", obtenerCategoriaPorId);
router.post("/categorias", crearCategoria);
router.put("/categorias/:id", actualizarCategoria);
router.delete("/categorias/:id", eliminarCategoria);

// ============================================
// RUTAS PARA ARCHIVOS
// ============================================
router.get("/archivos", obtenerArchivos);
router.get("/archivos/:id", obtenerArchivoPorId);
router.get("/archivos/area/:areaId", obtenerArchivosPorArea);
router.post("/archivos", crearArchivo);
router.post("/archivos/upload", uploadDocumentos.single('archivo'), validateUploadedDocument, subirArchivo);
router.put("/archivos/:id", actualizarArchivo);
router.delete("/archivos/:id", eliminarArchivo);

// ============================================
// RUTAS PARA ESTADÍSTICAS
// ============================================
router.get("/estadisticas", obtenerEstadisticas);

export default router;
