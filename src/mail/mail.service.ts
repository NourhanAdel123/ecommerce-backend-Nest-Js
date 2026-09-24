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
      console.error('Failed to send login email:', error);
    }
  }

  public async sendVerificationEmail(user: User, token: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'abc@gmail.com',
        subject: 'verification email',
        html: `<h1>hiiii ${user.email} ,click on this link to verify your email</h1>
        <a href="http://localhost:5000/api/users/verify-email/${user.id}/${token}">Verify your email</a>
        `,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }
  }

  public async sendResetPasswordEmail(user: User, token: string) {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        from: 'abc@gmail.com',
        subject: 'reset password email',
        html: `<h1>hiiii ${user.email} ,click on this link to reset your password</h1>
        <a href="http://localhost:3000/reset-password/${user.id}/${token}">reset your password</a>
        `,
      });
    } catch (error) {
      console.error('Failed to send reset password email:', error);
    }
  }
}
