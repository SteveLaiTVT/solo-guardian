import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesRepository } from './templates.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('TemplatesRepository', () => {
  let repository: TemplatesRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockEmailTemplate = {
    id: 'template-1',
    code: 'alert_notification',
    language: 'en',
    subject: 'Alert: {{userName}} missed check-in',
    htmlContent: '<p>Dear {{contactName}}, {{userName}} missed check-in.</p>',
    textContent: 'Dear {{contactName}}, {{userName}} missed check-in.',
    theme: 'standard',
    variables: ['userName', 'contactName'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSmsTemplate = {
    id: 'sms-template-1',
    code: 'alert_notification',
    language: 'en',
    content: 'Alert: {{userName}} missed check-in. Contact: {{phone}}',
    variables: ['userName', 'phone'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      emailTemplate: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      smsTemplate: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<TemplatesRepository>(TemplatesRepository);
    prisma = module.get(PrismaService);
  });

  describe('Email Templates', () => {
    describe('findAllEmailTemplates', () => {
      it('should return all email templates ordered by code and language', async () => {
        (prisma.emailTemplate.findMany as jest.Mock).mockResolvedValue([mockEmailTemplate]);

        const result = await repository.findAllEmailTemplates();

        expect(prisma.emailTemplate.findMany).toHaveBeenCalledWith({
          orderBy: [{ code: 'asc' }, { language: 'asc' }],
        });
        expect(result).toEqual([mockEmailTemplate]);
      });
    });

    describe('findEmailTemplateById', () => {
      it('should return email template by id', async () => {
        (prisma.emailTemplate.findUnique as jest.Mock).mockResolvedValue(mockEmailTemplate);

        const result = await repository.findEmailTemplateById('template-1');

        expect(prisma.emailTemplate.findUnique).toHaveBeenCalledWith({
          where: { id: 'template-1' },
        });
        expect(result).toEqual(mockEmailTemplate);
      });

      it('should return null when not found', async () => {
        (prisma.emailTemplate.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await repository.findEmailTemplateById('unknown');

        expect(result).toBeNull();
      });
    });

    describe('findEmailTemplateByCodeAndLanguage', () => {
      it('should find template by code and language', async () => {
        (prisma.emailTemplate.findUnique as jest.Mock).mockResolvedValue(mockEmailTemplate);

        const result = await repository.findEmailTemplateByCodeAndLanguage('alert_notification', 'en');

        expect(prisma.emailTemplate.findUnique).toHaveBeenCalledWith({
          where: { code_language: { code: 'alert_notification', language: 'en' } },
        });
        expect(result).toEqual(mockEmailTemplate);
      });
    });

    describe('findActiveEmailTemplate', () => {
      it('should find active template by code and language', async () => {
        (prisma.emailTemplate.findUnique as jest.Mock).mockResolvedValue(mockEmailTemplate);

        const result = await repository.findActiveEmailTemplate('alert_notification', 'en');

        expect(result).toEqual(mockEmailTemplate);
      });

      it('should fallback to English when language template not found', async () => {
        (prisma.emailTemplate.findUnique as jest.Mock)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(mockEmailTemplate);

        const result = await repository.findActiveEmailTemplate('alert_notification', 'ja');

        expect(prisma.emailTemplate.findUnique).toHaveBeenCalledTimes(2);
        expect(result).toEqual(mockEmailTemplate);
      });

      it('should not fallback when language is already en', async () => {
        (prisma.emailTemplate.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await repository.findActiveEmailTemplate('alert_notification', 'en');

        expect(prisma.emailTemplate.findUnique).toHaveBeenCalledTimes(1);
        expect(result).toBeNull();
      });
    });

    describe('createEmailTemplate', () => {
      it('should create email template with default values', async () => {
        (prisma.emailTemplate.create as jest.Mock).mockResolvedValue(mockEmailTemplate);

        const result = await repository.createEmailTemplate({
          code: 'alert_notification',
          language: 'en',
          subject: 'Test Subject',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
        });

        expect(prisma.emailTemplate.create).toHaveBeenCalledWith({
          data: {
            code: 'alert_notification',
            language: 'en',
            subject: 'Test Subject',
            htmlContent: '<p>Test</p>',
            textContent: 'Test',
            theme: 'standard',
            variables: [],
          },
        });
        expect(result).toEqual(mockEmailTemplate);
      });

      it('should create email template with custom theme and variables', async () => {
        (prisma.emailTemplate.create as jest.Mock).mockResolvedValue(mockEmailTemplate);

        await repository.createEmailTemplate({
          code: 'alert_notification',
          language: 'en',
          subject: 'Test',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
          theme: 'urgent',
          variables: ['userName'],
        });

        expect(prisma.emailTemplate.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            theme: 'urgent',
            variables: ['userName'],
          }),
        });
      });
    });

    describe('updateEmailTemplate', () => {
      it('should update email template', async () => {
        (prisma.emailTemplate.update as jest.Mock).mockResolvedValue(mockEmailTemplate);

        const result = await repository.updateEmailTemplate('template-1', {
          subject: 'Updated Subject',
          isActive: false,
        });

        expect(prisma.emailTemplate.update).toHaveBeenCalledWith({
          where: { id: 'template-1' },
          data: { subject: 'Updated Subject', isActive: false },
        });
        expect(result).toEqual(mockEmailTemplate);
      });
    });

    describe('deleteEmailTemplate', () => {
      it('should delete email template', async () => {
        await repository.deleteEmailTemplate('template-1');

        expect(prisma.emailTemplate.delete).toHaveBeenCalledWith({
          where: { id: 'template-1' },
        });
      });
    });
  });

  describe('SMS Templates', () => {
    describe('findAllSmsTemplates', () => {
      it('should return all SMS templates ordered by code and language', async () => {
        (prisma.smsTemplate.findMany as jest.Mock).mockResolvedValue([mockSmsTemplate]);

        const result = await repository.findAllSmsTemplates();

        expect(prisma.smsTemplate.findMany).toHaveBeenCalledWith({
          orderBy: [{ code: 'asc' }, { language: 'asc' }],
        });
        expect(result).toEqual([mockSmsTemplate]);
      });
    });

    describe('findSmsTemplateById', () => {
      it('should return SMS template by id', async () => {
        (prisma.smsTemplate.findUnique as jest.Mock).mockResolvedValue(mockSmsTemplate);

        const result = await repository.findSmsTemplateById('sms-template-1');

        expect(result).toEqual(mockSmsTemplate);
      });
    });

    describe('findSmsTemplateByCodeAndLanguage', () => {
      it('should find SMS template by code and language', async () => {
        (prisma.smsTemplate.findUnique as jest.Mock).mockResolvedValue(mockSmsTemplate);

        const result = await repository.findSmsTemplateByCodeAndLanguage('alert_notification', 'en');

        expect(prisma.smsTemplate.findUnique).toHaveBeenCalledWith({
          where: { code_language: { code: 'alert_notification', language: 'en' } },
        });
        expect(result).toEqual(mockSmsTemplate);
      });
    });

    describe('findActiveSmsTemplate', () => {
      it('should find active SMS template', async () => {
        (prisma.smsTemplate.findUnique as jest.Mock).mockResolvedValue(mockSmsTemplate);

        const result = await repository.findActiveSmsTemplate('alert_notification', 'en');

        expect(result).toEqual(mockSmsTemplate);
      });

      it('should fallback to English when language template not found', async () => {
        (prisma.smsTemplate.findUnique as jest.Mock)
          .mockResolvedValueOnce(null)
          .mockResolvedValueOnce(mockSmsTemplate);

        const result = await repository.findActiveSmsTemplate('alert_notification', 'zh');

        expect(prisma.smsTemplate.findUnique).toHaveBeenCalledTimes(2);
        expect(result).toEqual(mockSmsTemplate);
      });
    });

    describe('createSmsTemplate', () => {
      it('should create SMS template', async () => {
        (prisma.smsTemplate.create as jest.Mock).mockResolvedValue(mockSmsTemplate);

        const result = await repository.createSmsTemplate({
          code: 'alert_notification',
          language: 'en',
          content: 'Test SMS content',
          variables: ['userName'],
        });

        expect(prisma.smsTemplate.create).toHaveBeenCalledWith({
          data: {
            code: 'alert_notification',
            language: 'en',
            content: 'Test SMS content',
            variables: ['userName'],
          },
        });
        expect(result).toEqual(mockSmsTemplate);
      });

      it('should use empty array for variables when not provided', async () => {
        (prisma.smsTemplate.create as jest.Mock).mockResolvedValue(mockSmsTemplate);

        await repository.createSmsTemplate({
          code: 'test',
          language: 'en',
          content: 'Test',
        });

        expect(prisma.smsTemplate.create).toHaveBeenCalledWith({
          data: expect.objectContaining({
            variables: [],
          }),
        });
      });
    });

    describe('updateSmsTemplate', () => {
      it('should update SMS template', async () => {
        (prisma.smsTemplate.update as jest.Mock).mockResolvedValue(mockSmsTemplate);

        const result = await repository.updateSmsTemplate('sms-template-1', {
          content: 'Updated content',
          isActive: false,
        });

        expect(prisma.smsTemplate.update).toHaveBeenCalledWith({
          where: { id: 'sms-template-1' },
          data: { content: 'Updated content', isActive: false },
        });
        expect(result).toEqual(mockSmsTemplate);
      });
    });

    describe('deleteSmsTemplate', () => {
      it('should delete SMS template', async () => {
        await repository.deleteSmsTemplate('sms-template-1');

        expect(prisma.smsTemplate.delete).toHaveBeenCalledWith({
          where: { id: 'sms-template-1' },
        });
      });
    });
  });
});
