import { Router } from "express";
import { EmailService } from "../controllers/email-service";
import { UploadController } from "../controllers/upload/UploadController";
import { UploadService } from "../controllers/upload/UploadService";
import fileUpload, { Options } from "express-fileupload";
import { body } from "express-validator";



export default class EmailRoute {
  constructor() {

  }

  static get routes(): Router {
    const router = Router();
    const emailService = new EmailService();
    const uploadService = new UploadService();
    const controller = new UploadController(uploadService, emailService);

    const uploadOptions: Options = {
      useTempFiles: true,
      tempFileDir: "./temp_uploads",  // carpeta temporal dentro del proyecto
      limits: { fileSize: 5 * 1024 * 1024 },  // máximo 5 MB
      abortOnLimit: true,  // aborta la subida si se excede el límite
      safeFileNames: true,         // sanitiza nombres peligrosos
      preserveExtension: true,     // conserva la extensión original
      createParentPath: true       // crea la ruta si no existe
    }

    router.post('/single',
      body('email').isEmail().withMessage('Invalid email format'),




      fileUpload(uploadOptions), controller.saveTempFile.bind(controller));

    return router;
  }
}