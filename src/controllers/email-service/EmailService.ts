import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'
import path from 'path';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
  contentType?: string;
  cid?: string;  // Content-ID para imágenes embebidas
}


export class EmailService {
  private transporter: Transporter;
  private logoPath: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      }
    });

    // Ruta al logo institucional
    this.logoPath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail.png');
  }


  async sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {
    const fromAddress = process.env.MAILER_EMAIL || 'noreply@uttecam.edu.mx';

    // Imagen embebida del logo (CID)
    const logoAttachment: Attachement = {
      filename: 'logo-uttecam.png',
      path: this.logoPath,
      cid: 'logo',  // mismo ID usado en el HTML como src="cid:logo"
      contentType: 'image/png'
    };

    // Filtra archivos adjuntos del usuario (excluye header.jpg si existe)
    const userAttachments = (options.attachments || []).filter(
      att => att.filename !== 'header.jpg'
    );

    // Combina logo embebido + archivos adjuntos filtrados
    const allAttachments = [logoAttachment, ...userAttachments];

    const mailOptions = {
      from: `UTTECAM - Servicios Escolares <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
      attachments: allAttachments
    };

    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}