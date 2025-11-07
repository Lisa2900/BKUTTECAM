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
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
      }
    })
  }


  async sendEmail(options: SendEmailOptions): Promise<SentMessageInfo> {
    const fromAddress = 'uttecam.edu.mx'
    const mailOptions = {
      from: `'WEB UTTECAM': <${fromAddress}>`,
      to: options.to,
      subject: options.subject,
      html: options.htmlBody,
      attachments: options.attachments
    };
    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}