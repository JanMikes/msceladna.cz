import nodemailer from 'nodemailer';
import { config } from './config';

export interface EmailOptions {
  to: string[];
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: config.smtp.user ? {
        user: config.smtp.user,
        pass: config.smtp.password,
      } : undefined,
    });

    await transporter.sendMail({
      from: config.smtp.from,
      to: options.to.join(', '),
      subject: options.subject,
      html: options.html,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });

    return true;
  } catch (error) {
    console.error('[Email] Send error:', error);
    return false;
  }
}
