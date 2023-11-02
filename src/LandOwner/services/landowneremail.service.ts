import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'SMTP', etc.
      auth: {
        user: 'evanahmedfahad@gmail.com',
        pass: '12345',
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'evanahmedfahad@gmail.com',
      to: to, // Use the 'to' parameter here
      subject: subject, // Use the 'subject' parameter here
      text: text, // Use the 'text' parameter here
    };

    await this.transporter.sendMail(mailOptions);
  }

  //
  //
}
