import { Test, TestingModule } from '@nestjs/testing';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';

describe('TemplatesController', () => {
  let controller: TemplatesController;
  let service: jest.Mocked<TemplatesService>;

  const mockEmailTemplateResponse = {
    id: 'template-1',
    code: 'alert_notification',
    language: 'en',
    subject: 'Alert: {{userName}} missed check-in',
    htmlContent: '<p>Test</p>',
    textContent: 'Test',
    theme: 'standard',
    variables: ['userName'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSmsTemplateResponse = {
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
    const mockService = {
      getAllEmailTemplates: jest.fn(),
      getEmailTemplateById: jest.fn(),
      createEmailTemplate: jest.fn(),
      updateEmailTemplate: jest.fn(),
      deleteEmailTemplate: jest.fn(),
      getAllSmsTemplates: jest.fn(),
      getSmsTemplateById: jest.fn(),
      createSmsTemplate: jest.fn(),
      updateSmsTemplate: jest.fn(),
      deleteSmsTemplate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        { provide: TemplatesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
    service = module.get(TemplatesService);
  });

  describe('Email Templates', () => {
    describe('getAllEmailTemplates', () => {
      it('should return all email templates', async () => {
        service.getAllEmailTemplates.mockResolvedValue([mockEmailTemplateResponse]);

        const result = await controller.getAllEmailTemplates();

        expect(service.getAllEmailTemplates).toHaveBeenCalled();
        expect(result).toEqual({ success: true, data: [mockEmailTemplateResponse] });
      });
    });

    describe('getEmailTemplateById', () => {
      it('should return email template by id', async () => {
        service.getEmailTemplateById.mockResolvedValue(mockEmailTemplateResponse);

        const result = await controller.getEmailTemplateById('template-1');

        expect(service.getEmailTemplateById).toHaveBeenCalledWith('template-1');
        expect(result).toEqual({ success: true, data: mockEmailTemplateResponse });
      });
    });

    describe('createEmailTemplate', () => {
      it('should create email template', async () => {
        service.createEmailTemplate.mockResolvedValue(mockEmailTemplateResponse);

        const result = await controller.createEmailTemplate({
          code: 'alert_notification',
          language: 'en',
          subject: 'Test Subject',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
        });

        expect(service.createEmailTemplate).toHaveBeenCalledWith({
          code: 'alert_notification',
          language: 'en',
          subject: 'Test Subject',
          htmlContent: '<p>Test</p>',
          textContent: 'Test',
        });
        expect(result).toEqual({ success: true, data: mockEmailTemplateResponse });
      });
    });

    describe('updateEmailTemplate', () => {
      it('should update email template', async () => {
        const updatedTemplate = { ...mockEmailTemplateResponse, subject: 'Updated Subject' };
        service.updateEmailTemplate.mockResolvedValue(updatedTemplate);

        const result = await controller.updateEmailTemplate('template-1', {
          subject: 'Updated Subject',
        });

        expect(service.updateEmailTemplate).toHaveBeenCalledWith('template-1', {
          subject: 'Updated Subject',
        });
        expect(result).toEqual({ success: true, data: updatedTemplate });
      });
    });

    describe('deleteEmailTemplate', () => {
      it('should delete email template', async () => {
        service.deleteEmailTemplate.mockResolvedValue(undefined);

        await controller.deleteEmailTemplate('template-1');

        expect(service.deleteEmailTemplate).toHaveBeenCalledWith('template-1');
      });
    });
  });

  describe('SMS Templates', () => {
    describe('getAllSmsTemplates', () => {
      it('should return all SMS templates', async () => {
        service.getAllSmsTemplates.mockResolvedValue([mockSmsTemplateResponse]);

        const result = await controller.getAllSmsTemplates();

        expect(service.getAllSmsTemplates).toHaveBeenCalled();
        expect(result).toEqual({ success: true, data: [mockSmsTemplateResponse] });
      });
    });

    describe('getSmsTemplateById', () => {
      it('should return SMS template by id', async () => {
        service.getSmsTemplateById.mockResolvedValue(mockSmsTemplateResponse);

        const result = await controller.getSmsTemplateById('sms-template-1');

        expect(service.getSmsTemplateById).toHaveBeenCalledWith('sms-template-1');
        expect(result).toEqual({ success: true, data: mockSmsTemplateResponse });
      });
    });

    describe('createSmsTemplate', () => {
      it('should create SMS template', async () => {
        service.createSmsTemplate.mockResolvedValue(mockSmsTemplateResponse);

        const result = await controller.createSmsTemplate({
          code: 'alert_notification',
          language: 'en',
          content: 'Test SMS content',
        });

        expect(service.createSmsTemplate).toHaveBeenCalledWith({
          code: 'alert_notification',
          language: 'en',
          content: 'Test SMS content',
        });
        expect(result).toEqual({ success: true, data: mockSmsTemplateResponse });
      });
    });

    describe('updateSmsTemplate', () => {
      it('should update SMS template', async () => {
        const updatedTemplate = { ...mockSmsTemplateResponse, content: 'Updated content' };
        service.updateSmsTemplate.mockResolvedValue(updatedTemplate);

        const result = await controller.updateSmsTemplate('sms-template-1', {
          content: 'Updated content',
        });

        expect(service.updateSmsTemplate).toHaveBeenCalledWith('sms-template-1', {
          content: 'Updated content',
        });
        expect(result).toEqual({ success: true, data: updatedTemplate });
      });
    });

    describe('deleteSmsTemplate', () => {
      it('should delete SMS template', async () => {
        service.deleteSmsTemplate.mockResolvedValue(undefined);

        await controller.deleteSmsTemplate('sms-template-1');

        expect(service.deleteSmsTemplate).toHaveBeenCalledWith('sms-template-1');
      });
    });
  });
});
