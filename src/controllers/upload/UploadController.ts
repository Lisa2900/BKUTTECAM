import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { UploadService } from "./UploadService";
import { EmailService } from "../email-service";

export class UploadController {
  constructor(
    public readonly uploadService: UploadService,
    public readonly emailService: EmailService
  ) { }

  async saveTempFile(req: Request, res: Response) {
    let savedFileInfo: { tempFilePath: string; filename: string; mimetype: string } | null = null;
    let file: UploadedFile | undefined; // <-- para poder limpiar en el catch

    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
      }

      file = (req.files.attachment as UploadedFile) || undefined;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded with key "attachment".' });
      }

      const allowedTypes = ['application/pdf', 'image/png', 'image/jpg', 'image/jpeg'];
      if (!allowedTypes.includes(file.mimetype)) {
        // limpia el temporal creado por express-fileupload
        const tmp = (file as any).tempFilePath as string | undefined;
        if (tmp) await this.uploadService.deleteFile(tmp);
        return res.status(400).json({ error: 'Invalid file type. Only PDF and images are allowed.' });
      }

      // mueve del temp del middleware a tu carpeta final
      savedFileInfo = await this.uploadService.savedFile(file);

      const info = await this.emailService.sendEmail({
        to: 'jesus.sr0704@gmail.com',
        subject: 'Archivo adjunto desde API',
        htmlBody: '<h1>Archivo adjunto</h1><p>Se ha adjuntado un archivo desde la API.</p>',
        attachments: [
          {
            filename: savedFileInfo.filename,
            path: savedFileInfo.tempFilePath,
            contentType: savedFileInfo.mimetype
          }
        ]
      });

      // borra el archivo final tras enviarlo
      await this.uploadService.deleteFile(savedFileInfo.tempFilePath);

      return res.json({ message: 'File uploaded and email sent successfully', emailInfo: info });
    } catch (error) {
      // limpia el temp del middleware si existe
      const tmp = (file as any)?.tempFilePath as string | undefined;
      if (tmp) {
        try { await this.uploadService.deleteFile(tmp); } catch { }
      }
      // limpia el archivo final si ya se había movido
      if (savedFileInfo?.tempFilePath) {
        try { await this.uploadService.deleteFile(savedFileInfo.tempFilePath); } catch { }
      }

      console.error('Error in saveTempFile:', error);
      return res.status(500).json({ error: 'Error uploading file or sending email' });
    }
  }
}