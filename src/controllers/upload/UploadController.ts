import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { UploadService, SavedFile } from "./UploadService";
import { EmailService } from "../email-service";
import { FormType } from "../../types/formType";
import generateEmailHTML from "../../helpers/htmlEmail";
import { CustomError } from "../../errors/CustomErrors";
import { EmailRoutingService } from "../email-service/EmailRoutingService";

export class UploadController {
  constructor(
    public readonly uploadService: UploadService,
    public readonly emailService: EmailService
  ) { }

  async saveTempFile(req: Request, res: Response) {
    let savedFiles: SavedFile[] = [];

    // Normaliza archivos del request
    const reqFiles = req.files || undefined;
    const raw = (reqFiles as any)?.attachment as UploadedFile | UploadedFile[] | undefined;
    const files: UploadedFile[] = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
    const tituloFormulario: string = req.body['titulo-formulario'];
    if (!tituloFormulario) throw CustomError.badRequest('El título del formulario es obligatorio.');

    const infoForm: FormType = {
      nombre: req.body.nombre!,
      matricula: req.body.matricula!,
      email: req.body.email!,
      telefono: req.body.telefono!,
      carrera: req.body.carrera!,
      nivel: req.body.nivel,
      entrega: req.body.entrega,
      'documentos-solicitados': req.body['documentos-solicitados'],
      referencia: req.body.referencia,
      'numero-seguro': req.body['numero-seguro'],
      attachment: raw,
      comentarios: req.body.comentarios
    };

    //* Determina los correos destino: responsable + admin (ahora async)
    const destinationEmails = await EmailRoutingService.getAllDestinations(
      infoForm.nivel || 'TSU',
      infoForm.carrera
    );

    // Si no hay archivos, envía correo sin adjunto
    if (files.length === 0) {
      try {
        const info = await this.emailService.sendEmail({
          to: destinationEmails,
          subject: tituloFormulario,
          htmlBody: generateEmailHTML(infoForm, tituloFormulario),
        });
        return res.status(200).json({
          ok: true,
          message: 'Email sent',
          sentTo: destinationEmails,
          emailInfo: { messageId: info.messageId }
        });
      } catch (error) {
        console.error(error);
        return res.status(502).json({ ok: false, message: 'Error sending email without attachment' });
      }
    }

    try {
      // Guarda todos los archivos
      savedFiles = await Promise.all(files.map(f => this.uploadService.savedFile(f)));

      // Si el middleware dejó un temp distinto, límpialo
      await Promise.all(files.map(async (f, i) => {
        const tmp = (f as any).tempFilePath as string | undefined;
        if (tmp && tmp !== savedFiles[i].tempFilePath) {
          try { await this.uploadService.deleteFile(tmp); } catch { }
        }
      }));

      // Envía correo con todos los adjuntos
      const info = await this.emailService.sendEmail({
        to: destinationEmails,
        subject: tituloFormulario,
        htmlBody: generateEmailHTML(infoForm, tituloFormulario),
        attachments: savedFiles.map(sf => ({
          filename: sf.filename,
          path: sf.tempFilePath,
          contentType: sf.mimetype
        }))
      });

      // Limpieza final de todos los guardados
      await Promise.allSettled(savedFiles.map(sf => this.uploadService.deleteFile(sf.tempFilePath)));

      return res.status(200).json({
        ok: true,
        message: 'Files uploaded and email sent',
        sentTo: destinationEmails,
        attachments: savedFiles.map(sf => sf.filename),
        emailInfo: { messageId: info.messageId }
      });
    } catch (error) {
      // Limpieza defensiva
      await Promise.allSettled(savedFiles.map(sf => this.uploadService.deleteFile(sf.tempFilePath)));
      await Promise.allSettled(files.map(async f => {
        const tmp = (f as any)?.tempFilePath as string | undefined;
        if (tmp) await this.uploadService.deleteFile(tmp);
      }));

      if (error instanceof CustomError) {
        return res.status(error.statusCode).json({ ok: false, message: error.message });
      }
      return res.status(500).json({ ok: false, message: 'Error uploading files or sending email' });
    }
  }
}