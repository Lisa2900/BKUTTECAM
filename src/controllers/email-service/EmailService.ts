import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'
import path from 'path';
import fs from 'fs';

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

const EMAIL_TIMEOUT = 30000; // 30 segundos timeout
const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024; // 25MB total

export class EmailService {
  private transporter: Transporter;
  private logoPath: string;

  constructor() {
    // Validar que las credenciales de email estén configuradas
    if (!process.env.MAILER_EMAIL || !process.env.MAILER_SECRET_KEY) {
      console.warn('⚠️ MAILER_EMAIL o MAILER_SECRET_KEY no están configurados. El servicio de email no estará disponible.');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      },
      connectionTimeout: EMAIL_TIMEOUT,
      greetingTimeout: EMAIL_TIMEOUT,
      socketTimeout: EMAIL_TIMEOUT,
    });

    // Ruta al logo institucional
    this.logoPath = path.resolve(process.cwd(), 'public/emailPhotos/motocleEmail.png');
    
    // Verificar que el logo existe
    if (!fs.existsSync(this.logoPath)) {
      console.warn(`⚠️ Logo institucional no encontrado en: ${this.logoPath}`);
    }
  }

  private validateEmailOptions(options: SendEmailOptions): void {
    if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
      throw new Error('Debe especificar al menos un destinatario');
    }
    
    if (!options.subject || options.subject.trim().length === 0) {
      throw new Error('El asunto del email es requerido');
    }
    
    if (!options.htmlBody || options.htmlBody.trim().length === 0) {
      throw new Error('El cuerpo del email es requerido');
    }
    
    // Validar tamaño de adjuntos
    if (options.attachments && options.attachments.length > 0) {
      let totalSize = 0;
      for (const att of options.attachments) {
        if (!fs.existsSync(att.path)) {
          throw new Error(`Archivo adjunto no encontrado: ${att.path}`);
        }
        const stats = fs.statSync(att.path);
        totalSize += stats.size;
      }
      
      if (totalSize > MAX_ATTACHMENT_SIZE) {
        throw new Error(`El tamaño total de los adjuntos (${Math.round(totalSize / 1024 / 1024)}MB) excede el límite de ${MAX_ATTACHMENT_SIZE / 1024 / 1024}MB`);
      }
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {
    try {
      // Validar opciones
      this.validateEmailOptions(options);
      
      // Validar que el servicio esté configurado
      if (!process.env.MAILER_EMAIL || !process.env.MAILER_SECRET_KEY) {
        throw new Error('Servicio de email no configurado. Verifique las variables MAILER_EMAIL y MAILER_SECRET_KEY');
      }

      const fromAddress = process.env.MAILER_EMAIL;

      // Imagen embebida del logo (CID) - solo si el archivo existe
      const attachments: Attachement[] = [];
      if (fs.existsSync(this.logoPath)) {
        attachments.push({
          filename: 'logo-uttecam.png',
          path: this.logoPath,
          cid: 'logo',
          contentType: 'image/png'
        });
      }

      // Filtra archivos adjuntos del usuario (excluye header.jpg si existe)
      const userAttachments = (options.attachments || []).filter(
        att => att.filename !== 'header.jpg'
      );

      // Combina logo embebido + archivos adjuntos filtrados
      attachments.push(...userAttachments);

      const mailOptions = {
        from: `UTTECAM - Servicios Escolares <${fromAddress}>`,
        to: options.to,
        subject: options.subject,
        html: options.htmlBody,
        attachments: attachments
      };

      console.log(`📧 Enviando email a: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
      
      // Enviar con timeout
      const info = await Promise.race([
        this.transporter.sendMail(mailOptions),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout: El envío tardó más de 30 segundos')), EMAIL_TIMEOUT)
        )
      ]);
      
      console.log(`✅ Email enviado exitosamente. MessageId: ${info.messageId}`);
      return info;
    } catch (error: any) {
      console.error('❌ Error al enviar email:', {
        message: error.message,
        code: error.code,
        command: error.command,
        to: options.to,
        subject: options.subject,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  // Método para verificar la configuración del servicio
  async verifyConnection(): Promise<boolean> {
    try {
      if (!process.env.MAILER_EMAIL || !process.env.MAILER_SECRET_KEY) {
        return false;
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('❌ Error al verificar conexión SMTP:', error);
      return false;
    }
  }
}