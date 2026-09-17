import { MailerService } from '@nestjs-modules/mailer';
import type { Mock } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service.js';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let sendMail: Mock;

  beforeEach(async () => {
    sendMail = vi.fn().mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: MailerService, useValue: { sendMail } },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sends the email confirmation mail with the otp', async () => {
    await service.sendEmailConfirmationMail({ email: 'user@example.com', otp: '123456' });

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        template: 'email-confirmation',
        context: expect.objectContaining({ email: 'user@example.com', otp: '123456' }),
      }),
    );
  });

  it('sends the password reset mail with the otp', async () => {
    await service.sendPasswordResetMail({ email: 'user@example.com', otp: '654321' });

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'user@example.com',
        template: 'password-reset',
        context: expect.objectContaining({ email: 'user@example.com', otp: '654321' }),
      }),
    );
  });
});
