import { UploadedFile } from "express-fileupload";
import { CustomError } from "../../errors/CustomErrors";
import { ProcesoAdmision } from "../../models/ProcesoAdmision";
import path from "path";
import fs from "fs";

interface ProcesoAdmisionData {
  titulo: string;
  subtitulo: string;
  attachment: UploadedFile;
}

interface ProcesoAdmisionResponse {
  id: string;
  titulo: string;
  subtitulo: string;
  archivoPath: string;
  createdAt: Date;
}

export class ProcesoAdmisionService {

  // Tipos MIME permitidos y su extensión correspondiente
  private readonly mimeToExtension: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png"
  };
  private readonly uploadDir = path.join(process.cwd(), "uploads", "ProcesoAdmision");

  constructor() {
    // Crear la carpeta si no existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Valida que el archivo sea de tipo JPG, JPEG o PNG usando solo el MIME type
   */
  private validateFileType(file: UploadedFile): void {
    const mimetype = file.mimetype.toLowerCase();

    if (!this.mimeToExtension[mimetype]) {
      throw CustomError.invalidFileType(
        `Tipo de archivo no permitido. Solo se aceptan imágenes JPG, JPEG o PNG. Tipo recibido: ${file.mimetype}`
      );
    }
  }

  /**
   * Obtiene la extensión correcta basándose en el MIME type
   */
  private getExtensionFromMime(mimetype: string): string {
    return this.mimeToExtension[mimetype.toLowerCase()] || ".jpg";
  }

  /**
   * Guarda el archivo en uploads/ProcesoAdmision y retorna el path
   */
  private async saveFile(file: UploadedFile): Promise<string> {
    // Generar nombre único usando el MIME type para la extensión correcta
    const timestamp = Date.now();
    const baseName = path.basename(file.name, path.extname(file.name));
    const safeName = baseName.replace(/[^a-zA-Z0-9-]/g, "_");
    const extension = this.getExtensionFromMime(file.mimetype);
    const fileName = `${timestamp}-${safeName}${extension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Mover el archivo
    await file.mv(filePath);

    // Retornar el path relativo para guardar en BD
    return `/uploads/ProcesoAdmision/${fileName}`;
  }

  /**
   * Elimina el archivo temporal si existe
   */
  private cleanupTempFile(file: UploadedFile): void {
    try {
      if (file.tempFilePath && fs.existsSync(file.tempFilePath)) {
        fs.unlinkSync(file.tempFilePath);
      }
    } catch (error) {
      console.error("Error al eliminar archivo temporal:", error);
    }
  }

  /**
   * Procesa y guarda la información del proceso de admisión
   * Elimina el registro existente (si hay) antes de crear uno nuevo
   */
  async create(data: ProcesoAdmisionData): Promise<ProcesoAdmisionResponse> {
    const { titulo, subtitulo, attachment } = data;

    // Validar que el campo attachment exista
    if (!attachment) {
      throw CustomError.badRequest("El campo 'attachment' es requerido.");
    }

    try {
      // 1. Eliminar registro existente si hay uno
      const registroExistente = await ProcesoAdmision.findOne();
      if (registroExistente) {
        // Eliminar archivo físico anterior
        const archivoAnteriorPath = path.join(process.cwd(), registroExistente.archivoPath);
        if (fs.existsSync(archivoAnteriorPath)) {
          fs.unlinkSync(archivoAnteriorPath);
        }
        // Eliminar registro de la BD
        await registroExistente.destroy();
      }

      // 2. Validar tipo de archivo
      this.validateFileType(attachment);

      // 3. Guardar archivo en uploads/ProcesoAdmision
      const archivoPath = await this.saveFile(attachment);

      // 4. Guardar en la base de datos
      const registro = await ProcesoAdmision.create({
        titulo,
        subtitulo,
        archivoPath
      });

      // 5. Limpiar archivo temporal
      this.cleanupTempFile(attachment);

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        archivoPath: registro.archivoPath,
        createdAt: registro.createdAt
      };

    } catch (error) {
      // Limpiar archivo temporal en caso de error
      this.cleanupTempFile(attachment);

      // Re-lanzar si es CustomError
      if (error instanceof CustomError) {
        throw error;
      }

      // Error genérico
      console.error("Error en ProcesoAdmisionService.create:", error);
      throw CustomError.internalServer(
        `Error al procesar el registro de admisión: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }

  /**
   * Obtiene el último registro del proceso de admisión
   */
  async getLatest(): Promise<{
    id: string;
    titulo: string;
    subtitulo: string;
    archivoBuffer: Buffer;
    archivoMimeType: string;
    archivoNombre: string;
  }> {
    // Buscar el último registro
    const registro = await ProcesoAdmision.findOne({
      order: [['createdAt', 'DESC']]
    });

    if (!registro) {
      throw CustomError.notFound("No se encontró ningún registro de proceso de admisión.");
    }

    // Construir el path absoluto del archivo
    const archivoAbsolutePath = path.join(process.cwd(), registro.archivoPath);

    // Verificar que el archivo existe
    if (!fs.existsSync(archivoAbsolutePath)) {
      throw CustomError.notFound(`El archivo de imagen no existe: ${registro.archivoPath}`);
    }

    // Leer el archivo
    const archivoBuffer = fs.readFileSync(archivoAbsolutePath);

    // Determinar el MIME type basado en la extensión
    const ext = path.extname(registro.archivoPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png"
    };
    const archivoMimeType = mimeTypes[ext] || "application/octet-stream";

    // Obtener el nombre del archivo
    const archivoNombre = path.basename(registro.archivoPath);

    return {
      id: registro.id,
      titulo: registro.titulo,
      subtitulo: registro.subtitulo,
      archivoBuffer,
      archivoMimeType,
      archivoNombre
    };
  }

  /**
   * Elimina un registro del proceso de admisión por ID
   */
  async delete(id: string): Promise<{ message: string }> {
    // Buscar el registro
    const registro = await ProcesoAdmision.findByPk(id);

    if (!registro) {
      throw CustomError.notFound(`No se encontró el registro con ID: ${id}`);
    }

    // Eliminar el archivo físico
    const archivoAbsolutePath = path.join(process.cwd(), registro.archivoPath);
    if (fs.existsSync(archivoAbsolutePath)) {
      fs.unlinkSync(archivoAbsolutePath);
    }

    // Eliminar el registro de la base de datos
    await registro.destroy();

    return { message: "Registro eliminado exitosamente" };
  }

  /**
   * Actualiza un registro del proceso de admisión por ID
   */
  async update(id: string, data: {
    titulo?: string;
    subtitulo?: string;
    attachment?: UploadedFile;
  }): Promise<ProcesoAdmisionResponse> {
    const { titulo, subtitulo, attachment } = data;

    // Buscar el registro
    const registro = await ProcesoAdmision.findByPk(id);

    if (!registro) {
      throw CustomError.notFound(`No se encontró el registro con ID: ${id}`);
    }

    try {
      // Actualizar campos de texto si vienen
      if (titulo) registro.titulo = titulo;
      if (subtitulo) registro.subtitulo = subtitulo;

      // Si viene un nuevo archivo, validar, guardar y eliminar el anterior
      if (attachment) {
        // Validar tipo de archivo
        this.validateFileType(attachment);

        // Eliminar archivo anterior
        const archivoAnteriorPath = path.join(process.cwd(), registro.archivoPath);
        if (fs.existsSync(archivoAnteriorPath)) {
          fs.unlinkSync(archivoAnteriorPath);
        }

        // Guardar nuevo archivo
        const nuevoArchivoPath = await this.saveFile(attachment);
        registro.archivoPath = nuevoArchivoPath;

        // Limpiar archivo temporal
        this.cleanupTempFile(attachment);
      }

      // Guardar cambios en la base de datos
      await registro.save();

      return {
        id: registro.id,
        titulo: registro.titulo,
        subtitulo: registro.subtitulo,
        archivoPath: registro.archivoPath,
        createdAt: registro.createdAt
      };

    } catch (error) {
      // Limpiar archivo temporal en caso de error
      if (attachment) {
        this.cleanupTempFile(attachment);
      }

      // Re-lanzar si es CustomError
      if (error instanceof CustomError) {
        throw error;
      }

      // Error genérico
      console.error("Error en ProcesoAdmisionService.update:", error);
      throw CustomError.internalServer(
        `Error al actualizar el registro: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    }
  }
}
