import { Test, TestingModule } from '@nestjs/testing';
import { SmsService } from './sms.service';

jest.mock('twilio', () => {
  const mockMessages = {
    create: jest.fn().mockResolvedValue({ sid: 'test-sid' }),
  };
  return jest.fn().mockReturnValue({
    messages: mockMessages,
  });
});

describe('SmsService', () => {
  let service: SmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsService],
    }).compile();

    service = module.get<SmsService>(SmsService);
  });

  describe('onModuleInit', () => {
    it('should warn when credentials not configured', async () => {
      delete process.env.TWILIO_ACCOUNT_SID;
      delete process.env.TWILIO_AUTH_TOKEN;
      delete process.env.TWILIO_PHONE_NUMBER;

      await service.onModuleInit();
      // Should not throw, just log warning
    });

    it('should initialize client when credentials are configured', async () => {
      process.env.TWILIO_ACCOUNT_SID = 'test-sid';
      process.env.TWILIO_AUTH_TOKEN = 'test-token';
      process.env.TWILIO_PHONE_NUMBER = '+15551234567';

      await service.onModuleInit();
      // Should initialize successfully
    });
  });

  describe('validatePhoneNumber', () => {
    it('should return true for valid E.164 format', () => {
      expect(service.validatePhoneNumber('+15551234567')).toBe(true);
      expect(service.validatePhoneNumber('+8612345678901')).toBe(true);
    });

    it('should return false for invalid formats', () => {
      expect(service.validatePhoneNumber('5551234567')).toBe(false);
      expect(service.validatePhoneNumber('555-123-4567')).toBe(false);
      expect(service.validatePhoneNumber('+0123456789')).toBe(false);
    });
  });

  describe('sendAlertSms', () => {
    beforeEach(async () => {
      process.env.TWILIO_ACCOUNT_SID = 'test-sid';
      process.env.TWILIO_AUTH_TOKEN = 'test-token';
      process.env.TWILIO_PHONE_NUMBER = '+15551234567';
      await service.onModuleInit();
    });

    it('should send alert SMS successfully', async () => {
      const result = await service.sendAlertSms(
        '+15559876543',
        'Contact',
        'User',
        '2025-01-15',
        new Date().toISOString()
      );

      expect(result).toBe(true);
    });

    it('should return false for invalid phone number', async () => {
      const result = await service.sendAlertSms(
        'invalid',
        'Contact',
        'User',
        '2025-01-15',
        new Date().toISOString()
      );

      expect(result).toBe(false);
    });
  });

  describe('sendVerificationSms', () => {
    beforeEach(async () => {
      process.env.TWILIO_ACCOUNT_SID = 'test-sid';
      process.env.TWILIO_AUTH_TOKEN = 'test-token';
      process.env.TWILIO_PHONE_NUMBER = '+15551234567';
      await service.onModuleInit();
    });

    it('should send verification SMS successfully', async () => {
      const result = await service.sendVerificationSms('+15559876543', '123456');

      expect(result).toBe(true);
    });
  });
});
