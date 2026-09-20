import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity.js';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendLoginEmail(user: User) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'abc@gmail.com',
        subject: 'login email',
        html: `<h1>hiiii ${user.email}</h1>`,
      });
    } catch (error) {
      // Log but never re-throw — email failure must not break the login response
      console.error('Failed to send login email:', error);
    }
  }
}
