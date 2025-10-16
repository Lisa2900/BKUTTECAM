import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'



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
}


export class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: /* process.env.SMTP_SECURE === 'true' */ false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      },
      tls: {
        // A veces se necesita esta opción si hay problemas de cifrado o certificados
        ciphers: "SSLv3",
        rejectUnauthorized: false
      }
    })
  }


  async sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {
    const fromAddress = process.env.MAILER_EMAIL || process.env.SMTP_USER || '';
    const mailOptions = {
      from: `'UTTECAM' <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
      attachments: options.attachments
    };
    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}