import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { TemplatesService } from '../templates';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    verify: jest.fn().mockResolvedValue(true),
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
  }),
}));

describe('EmailService', () => {
  let service: EmailService;
  let templatesService: jest.Mocked<TemplatesService>;

  beforeEach(async () => {
    const mockTemplatesService = {
      renderEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: TemplatesService, useValue: mockTemplatesService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    templatesService = module.get(TemplatesService);

    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test';
    process.env.SMTP_PASS = 'test';
  });

  describe('onModuleInit', () => {
    it('should initialize transporter', async () => {
      await service.onModuleInit();
      // Service should initialize without throwing
    });
  });

  describe('sendAlertEmail', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should send alert email successfully with DB template', async () => {
      templatesService.renderEmail.mockResolvedValue({
        subject: 'Alert Subject',
        html: '<html>Alert</html>',
        text: 'Alert text',
      });

      const result = await service.sendAlertEmail(
        'test@example.com',
        'John',
        'User',
        '2025-01-15',
        new Date().toISOString(),
        'en'
      );

      expect(templatesService.renderEmail).toHaveBeenCalledWith(
        'alert',
        'en',
        expect.any(Object)
      );
      expect(result).toBe(true);
    });

    it('should use fallback template when DB template not found', async () => {
      templatesService.renderEmail.mockResolvedValue(null);

      const result = await service.sendAlertEmail(
        'test@example.com',
        'John',
        'User',
        '2025-01-15',
        new Date().toISOString(),
        'en'
      );

      expect(result).toBe(true);
    });
  });

  describe('sendReminderEmail', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should send reminder email', async () => {
      templatesService.renderEmail.mockResolvedValue(null);

      const result = await service.sendReminderEmail(
        'test@example.com',
        'User',
        '10:00',
        'Asia/Shanghai',
        'en'
      );

      expect(result).toBe(true);
    });
  });

  describe('sendVerificationEmail', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should send verification email', async () => {
      templatesService.renderEmail.mockResolvedValue(null);

      const result = await service.sendVerificationEmail(
        'test@example.com',
        'John',
        'User',
        'token-123',
        'en'
      );

      expect(result).toBe(true);
    });
  });

  describe('sendContactLinkInvitationEmail', () => {
    beforeEach(async () => {
      await service.onModuleInit();
    });

    it('should send contact link invitation email', async () => {
      templatesService.renderEmail.mockResolvedValue(null);

      const result = await service.sendContactLinkInvitationEmail(
        'contact@example.com',
        'Contact Name',
        'Elder Name',
        'invitation-token',
        'en'
      );

      expect(result).toBe(true);
    });
  });
});
