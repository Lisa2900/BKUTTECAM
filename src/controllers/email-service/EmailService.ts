import nodemailer, { SentMessageInfo, Transporter } from 'nodemailer'



export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments: Attachement[];
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
      host: "smtp.gmail.com",
      port: 465,
      from: 'web uttecam',
      service: process.env.MAILER_SERVICE,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      }
    })
  }


  async sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {

    const mailOptions = {
      from: `'Mi App' <${process.env.SMTP_USER}>`, // sender address
      to: options.to, // lista de destinatarios
      subject: options.subject, // Subject line
      html: options.htmlBody, // html body
      attachments: options.attachments // array of attachments
    }

    const info = await this.transporter.sendMail(mailOptions);
    return info;

  }
}