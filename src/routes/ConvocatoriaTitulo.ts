import { Router } from "express";
import ConvocatoriaTituloController from "../controllers/convocatoria-titulo/ConvocatoriaTituloController";
import { ConvocatoriaDocumentoController } from "../controllers/convocatoria-titulo/ConvocatoriaDocumentoController";
import { handleValidationErrors } from "../middleware/validation";
import { body } from "express-validator";
import fileUpload from "express-fileupload";

export default class ConvocatoriaTituloRoute {

  static get routes() {
    const router = Router();
    const controller = new ConvocatoriaTituloController();
    const documentoController = new ConvocatoriaDocumentoController();

    // ==================== INFO PRINCIPAL ====================

    // POST - Crear o actualizar información principal
    router.post('/convocatoria-titulo/mainInfo',
      body('titulo')
        .isString().withMessage('El título debe ser una cadena de texto.')
        .notEmpty().withMessage('El título es requerido.')
        .isLength({ min: 5, max: 200 }).withMessage('El título debe tener entre 5 y 200 caracteres.'),
      body('subtitulo')
        .isString().withMessage('El subtítulo/descripción debe ser una cadena de texto.')
        .notEmpty().withMessage('El subtítulo/descripción es requerido.')
        .isLength({ min: 10, max: 500 }).withMessage('El subtítulo debe tener entre 10 y 500 caracteres.'),
      body('nombreSeccionDocumentos')
        .isString().withMessage('El nombre de la sección debe ser una cadena de texto.')
        .notEmpty().withMessage('El nombre de la sección es requerido.')
        .isLength({ min: 5, max: 200 }).withMessage('El nombre de la sección debe tener entre 5 y 200 caracteres.'),
      handleValidationErrors,
      controller.createOrUpdate
    );

    // GET - Obtener información principal
    router.get('/convocatoria-titulo/mainInfo', controller.get);

    // DELETE - Eliminar información por ID
    router.delete('/convocatoria-titulo/mainInfo/:id', controller.delete);

    // ==================== DOCUMENTOS ====================

    // POST - Subir documento PDF
    router.post('/convocatoria-titulo/documentos',
      fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        abortOnLimit: true,
        preserveExtension: 4,
      }),
      body('titulo')
        .isString().withMessage('El título debe ser una cadena de texto.')
        .notEmpty().withMessage('El título es requerido.')
        .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres.'),
      handleValidationErrors,
      documentoController.create
    );

    // GET - Obtener todos los documentos
    router.get('/convocatoria-titulo/documentos', documentoController.getAll);

    // GET - Descargar/visualizar documento PDF
    router.get('/convocatoria-titulo/documentos/:id/download', documentoController.download);

    // DELETE - Eliminar documento por ID
    router.delete('/convocatoria-titulo/documentos/:id', documentoController.delete);

    // DELETE - Eliminar todos los documentos
    router.delete('/convocatoria-titulo/documentos', documentoController.deleteAll);

    return router;
  }
}
