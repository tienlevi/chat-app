import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async verifyEmail(email: string, name: string, verifyUrl: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify email',
      template: 'verify-email',
      context: { name, verifyUrl },
    });
  }
}
