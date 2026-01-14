import { Injectable } from '@nestjs/common';
import { Subscriber } from './subscribers.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class SubscribersNotifyService {
  async notifyAll(subscribers: Subscriber[], subject: string, message: string) {
    // Configurez votre transporteur SMTP ici
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // à remplacer
      port: 587,
      secure: false,
      auth: {
        user: 'your@email.com', // à remplacer
        pass: 'yourpassword',   // à remplacer
      },
    });
    for (const sub of subscribers) {
      if (sub.email) {
        await transporter.sendMail({
          from: 'FADIDI <your@email.com>',
          to: sub.email,
          subject,
          text: message,
        });
      }
      // Pour SMS, intégrer Twilio ou autre ici si besoin
    }
  }
}
