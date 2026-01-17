import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesRepository } from './templates.repository';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let repository: jest.Mocked<TemplatesRepository>;

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
    content: 'Alert: {{userName}} missed check-in.',
    variables: ['userName'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      findAllEmailTemplates: jest.fn(),
      findEmailTemplateById: jest.fn(),
      findEmailTemplateByCodeAndLanguage: jest.fn(),
      findActiveEmailTemplate: jest.fn(),
      createEmailTemplate: jest.fn(),
      updateEmailTemplate: jest.fn(),
      deleteEmailTemplate: jest.fn(),
      findAllSmsTemplates: jest.fn(),
      findSmsTemplateById: jest.fn(),
      findSmsTemplateByCodeAndLanguage: jest.fn(),
      findActiveSmsTemplate: jest.fn(),
      createSmsTemplate: jest.fn(),
      updateSmsTemplate: jest.fn(),
      deleteSmsTemplate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        { provide: TemplatesRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TemplatesService>(TemplatesService);
    repository = module.get(TemplatesRepository);
  });

  describe('Email Templates', () => {
    describe('getAllEmailTemplates', () => {
      it('should return all email templates', async () => {
        repository.findAllEmailTemplates.mockResolvedValue([mockEmailTemplate]);

        const result = await service.getAllEmailTemplates();

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('template-1');
      });
    });

    describe('getEmailTemplateById', () => {
      it('should return email template by id', async () => {
        repository.findEmailTemplateById.mockResolvedValue(mockEmailTemplate);

        const result = await service.getEmailTemplateById('template-1');

        expect(result.id).toBe('template-1');
        expect(result.code).toBe('alert_notification');
      });

      it('should throw NotFoundException when template not found', async () => {
        repository.findEmailTemplateById.mockResolvedValue(null);

        await expect(service.getEmailTemplateById('unknown')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('createEmailTemplate', () => {
      it('should create email template', async () => {
        repository.findEmailTemplateByCodeAndLanguage.mockResolvedValue(null);
        repository.createEmailTemplate.mockResolvedValue(mockEmailTemplate);

        const result = await service.createEmailTemplate({
          code: 'alert_notification',
          language: 'en',
          subject: 'Test Subject',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
        });

        expect(repository.createEmailTemplate).toHaveBeenCalled();
        expect(result.code).toBe('alert_notification');
      });

      it('should throw ConflictException when template already exists', async () => {
        repository.findEmailTemplateByCodeAndLanguage.mockResolvedValue(mockEmailTemplate);

        await expect(
          service.createEmailTemplate({
            code: 'alert_notification',
            language: 'en',
            subject: 'Test',
            htmlContent: '<p>Test</p>',
            textContent: 'Test',
          }),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('updateEmailTemplate', () => {
      it('should update email template', async () => {
        repository.findEmailTemplateById.mockResolvedValue(mockEmailTemplate);
        repository.updateEmailTemplate.mockResolvedValue({
          ...mockEmailTemplate,
          subject: 'Updated Subject',
        });

        const result = await service.updateEmailTemplate('template-1', {
          subject: 'Updated Subject',
        });

        expect(result.subject).toBe('Updated Subject');
      });

      it('should throw NotFoundException when template not found', async () => {
        repository.findEmailTemplateById.mockResolvedValue(null);

        await expect(
          service.updateEmailTemplate('unknown', { subject: 'Test' }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteEmailTemplate', () => {
      it('should delete email template', async () => {
        repository.findEmailTemplateById.mockResolvedValue(mockEmailTemplate);

        await service.deleteEmailTemplate('template-1');

        expect(repository.deleteEmailTemplate).toHaveBeenCalledWith('template-1');
      });

      it('should throw NotFoundException when template not found', async () => {
        repository.findEmailTemplateById.mockResolvedValue(null);

        await expect(service.deleteEmailTemplate('unknown')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('renderEmail', () => {
      it('should render email with variables', async () => {
        repository.findActiveEmailTemplate.mockResolvedValue(mockEmailTemplate);

        const result = await service.renderEmail('alert_notification', 'en', {
          userName: 'John',
          contactName: 'Jane',
        });

        expect(result).toBeDefined();
        expect(result?.subject).toBe('Alert: John missed check-in');
        expect(result?.html).toContain('Dear Jane');
        expect(result?.text).toContain('Dear Jane');
      });

      it('should return null when template not found', async () => {
        repository.findActiveEmailTemplate.mockResolvedValue(null);

        const result = await service.renderEmail('unknown', 'en', {});

        expect(result).toBeNull();
      });

      it('should keep unmatched variables as-is', async () => {
        repository.findActiveEmailTemplate.mockResolvedValue(mockEmailTemplate);

        const result = await service.renderEmail('alert_notification', 'en', {
          userName: 'John',
        });

        expect(result?.html).toContain('{{contactName}}');
      });
    });
  });

  describe('SMS Templates', () => {
    describe('getAllSmsTemplates', () => {
      it('should return all SMS templates', async () => {
        repository.findAllSmsTemplates.mockResolvedValue([mockSmsTemplate]);

        const result = await service.getAllSmsTemplates();

        expect(result).toHaveLength(1);
        expect(result[0].code).toBe('alert_notification');
      });
    });

    describe('getSmsTemplateById', () => {
      it('should return SMS template by id', async () => {
        repository.findSmsTemplateById.mockResolvedValue(mockSmsTemplate);

        const result = await service.getSmsTemplateById('sms-template-1');

        expect(result.id).toBe('sms-template-1');
      });

      it('should throw NotFoundException when template not found', async () => {
        repository.findSmsTemplateById.mockResolvedValue(null);

        await expect(service.getSmsTemplateById('unknown')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('createSmsTemplate', () => {
      it('should create SMS template', async () => {
        repository.findSmsTemplateByCodeAndLanguage.mockResolvedValue(null);
        repository.createSmsTemplate.mockResolvedValue(mockSmsTemplate);

        const result = await service.createSmsTemplate({
          code: 'alert_notification',
          language: 'en',
          content: 'Test SMS',
        });

        expect(repository.createSmsTemplate).toHaveBeenCalled();
        expect(result.code).toBe('alert_notification');
      });

      it('should throw ConflictException when template already exists', async () => {
        repository.findSmsTemplateByCodeAndLanguage.mockResolvedValue(mockSmsTemplate);

        await expect(
          service.createSmsTemplate({
            code: 'alert_notification',
            language: 'en',
            content: 'Test',
          }),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('updateSmsTemplate', () => {
      it('should update SMS template', async () => {
        repository.findSmsTemplateById.mockResolvedValue(mockSmsTemplate);
        repository.updateSmsTemplate.mockResolvedValue({
          ...mockSmsTemplate,
          content: 'Updated content',
        });

        const result = await service.updateSmsTemplate('sms-template-1', {
          content: 'Updated content',
        });

        expect(result.content).toBe('Updated content');
      });

      it('should throw NotFoundException when template not found', async () => {
        repository.findSmsTemplateById.mockResolvedValue(null);

        await expect(
          service.updateSmsTemplate('unknown', { content: 'Test' }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteSmsTemplate', () => {
      it('should delete SMS template', async () => {
        repository.findSmsTemplateById.mockResolvedValue(mockSmsTemplate);

        await service.deleteSmsTemplate('sms-template-1');

        expect(repository.deleteSmsTemplate).toHaveBeenCalledWith('sms-template-1');
      });

      it('should throw NotFoundException when template not found', async () => {
        repository.findSmsTemplateById.mockResolvedValue(null);

        await expect(service.deleteSmsTemplate('unknown')).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe('renderSms', () => {
      it('should render SMS with variables', async () => {
        repository.findActiveSmsTemplate.mockResolvedValue(mockSmsTemplate);

        const result = await service.renderSms('alert_notification', 'en', {
          userName: 'John',
        });

        expect(result).toBe('Alert: John missed check-in.');
      });

      it('should return null when template not found', async () => {
        repository.findActiveSmsTemplate.mockResolvedValue(null);

        const result = await service.renderSms('unknown', 'en', {});

        expect(result).toBeNull();
      });
    });
  });
});
