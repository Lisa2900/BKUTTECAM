import { Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import { ProcesoAdmisionService } from './ProcesoAdmisionService';
import { CustomError } from '../../errors/CustomErrors';


export class ServiciosEscolaresController {

  private procesoAdmisionService = new ProcesoAdmisionService();

  procesoAdmision = async (req: Request, res: Response) => {
    try {
      const { titulo, subtitulo } = req.body;
      const attachment = (req.files as any).attachment as fileUpload.UploadedFile;

      const resultado = await this.procesoAdmisionService.create({
        titulo,
        subtitulo,
        attachment
      });

      return res.status(201).json({
        message: "Proceso de admisión registrado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en procesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  getProcesoAdmision = async (req: Request, res: Response) => {
    try {
      const data = await this.procesoAdmisionService.getLatest();

      return res.status(200).json({
        id: data.id,
        titulo: data.titulo,
        subtitulo: data.subtitulo,
        archivo: {
          nombre: data.archivoNombre,
          mimeType: data.archivoMimeType,
          base64: data.archivoBuffer.toString('base64')
        }
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en getProcesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  deleteProcesoAdmision = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const resultado = await this.procesoAdmisionService.delete(id);

      return res.status(200).json(resultado);

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en deleteProcesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

  updateProcesoAdmision = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { titulo, subtitulo } = req.body;
      const attachment = (req.files as any)?.attachment as fileUpload.UploadedFile | undefined;

      const resultado = await this.procesoAdmisionService.update(id, {
        titulo,
        subtitulo,
        attachment
      });

      return res.status(200).json({
        message: "Proceso de admisión actualizado exitosamente",
        data: resultado
      });

    } catch (error) {
      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
          error: error.message
        });
      }

      console.error("Error en updateProcesoAdmision:", error);
      return res.status(500).json({
        error: "Error interno del servidor"
      });
    }
  }

}