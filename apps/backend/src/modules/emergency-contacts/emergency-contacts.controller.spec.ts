import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import {
  EmergencyContactsController,
  VerifyContactController,
  ContactLinkController,
} from './emergency-contacts.controller';
import { EmergencyContactsService } from './emergency-contacts.service';
import { ContactVerificationService } from './contact-verification.service';
import { PhoneVerificationService } from './phone-verification.service';
import { EmailService } from '../email/email.service';

describe('EmergencyContactsController', () => {
  let controller: EmergencyContactsController;
  let service: jest.Mocked<EmergencyContactsService>;
  let verificationService: jest.Mocked<ContactVerificationService>;
  let phoneVerificationService: jest.Mocked<PhoneVerificationService>;

  const mockContactResponse = {
    id: 'contact-1',
    userId: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    priority: 1,
    isVerified: false,
    isActive: true,
    phoneVerified: false,
    preferredChannel: 'email' as const,
    linkedUserId: null,
    linkedUserName: null,
    invitationStatus: 'none' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockContactsService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      reorder: jest.fn(),
      getLinkedContacts: jest.fn(),
      getPendingInvitations: jest.fn(),
    };

    const mockVerificationService = {
      sendVerification: jest.fn(),
      resendVerification: jest.fn(),
    };

    const mockPhoneVerificationService = {
      sendPhoneVerification: jest.fn(),
      verifyPhone: jest.fn(),
      resendPhoneVerification: jest.fn(),
    };

    const mockEmailService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyContactsController],
      providers: [
        { provide: EmergencyContactsService, useValue: mockContactsService },
        { provide: ContactVerificationService, useValue: mockVerificationService },
        { provide: PhoneVerificationService, useValue: mockPhoneVerificationService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    controller = module.get<EmergencyContactsController>(EmergencyContactsController);
    service = module.get(EmergencyContactsService);
    verificationService = module.get(ContactVerificationService);
    phoneVerificationService = module.get(PhoneVerificationService);
  });

  describe('findAll', () => {
    it('should return all contacts', async () => {
      service.findAll.mockResolvedValue([mockContactResponse]);

      const result = await controller.findAll('user-1');

      expect(service.findAll).toHaveBeenCalledWith('user-1');
      expect(result).toEqual([mockContactResponse]);
    });
  });

  describe('findOne', () => {
    it('should return contact by id', async () => {
      service.findOne.mockResolvedValue(mockContactResponse);

      const result = await controller.findOne('contact-1', 'user-1');

      expect(service.findOne).toHaveBeenCalledWith('contact-1', 'user-1');
      expect(result).toEqual(mockContactResponse);
    });
  });

  describe('create', () => {
    it('should create a new contact', async () => {
      service.create.mockResolvedValue({ contact: mockContactResponse, linkedUser: null });

      const result = await controller.create(
        { name: 'John Doe', email: 'john@example.com' },
        'user-1'
      );

      expect(service.create).toHaveBeenCalledWith('user-1', {
        name: 'John Doe',
        email: 'john@example.com',
      });
      expect(result).toEqual(mockContactResponse);
    });
  });

  describe('update', () => {
    it('should update contact', async () => {
      service.update.mockResolvedValue({ contact: mockContactResponse, linkedUser: null });

      const result = await controller.update('contact-1', { name: 'Jane Doe' }, 'user-1');

      expect(service.update).toHaveBeenCalledWith('contact-1', 'user-1', { name: 'Jane Doe' });
      expect(result).toEqual(mockContactResponse);
    });
  });

  describe('remove', () => {
    it('should remove contact', async () => {
      service.remove.mockResolvedValue(undefined);

      await controller.remove('contact-1', 'user-1');

      expect(service.remove).toHaveBeenCalledWith('contact-1', 'user-1');
    });
  });

  describe('reorder', () => {
    it('should reorder contacts', async () => {
      service.reorder.mockResolvedValue([mockContactResponse]);

      const result = await controller.reorder({ contactIds: ['contact-1'] }, 'user-1');

      expect(service.reorder).toHaveBeenCalledWith('user-1', ['contact-1']);
      expect(result).toEqual([mockContactResponse]);
    });
  });

  describe('sendVerification', () => {
    it('should send verification email', async () => {
      verificationService.sendVerification.mockResolvedValue(mockContactResponse);

      const result = await controller.sendVerification('contact-1', 'user-1');

      expect(verificationService.sendVerification).toHaveBeenCalledWith('contact-1', 'user-1');
      expect(result).toEqual(mockContactResponse);
    });
  });

  describe('sendPhoneVerification', () => {
    it('should send phone verification', async () => {
      phoneVerificationService.sendPhoneVerification.mockResolvedValue(mockContactResponse);

      const result = await controller.sendPhoneVerification('contact-1', 'user-1');

      expect(phoneVerificationService.sendPhoneVerification).toHaveBeenCalledWith(
        'contact-1',
        'user-1'
      );
      expect(result).toEqual(mockContactResponse);
    });
  });

  describe('verifyPhone', () => {
    it('should verify phone with OTP', async () => {
      const verifiedContact = { ...mockContactResponse, phoneVerified: true };
      phoneVerificationService.verifyPhone.mockResolvedValue(verifiedContact);

      const result = await controller.verifyPhone('contact-1', { otpCode: '123456' }, 'user-1');

      expect(phoneVerificationService.verifyPhone).toHaveBeenCalledWith(
        'contact-1',
        'user-1',
        '123456'
      );
      expect(result.phoneVerified).toBe(true);
    });
  });

  describe('getLinkedContacts', () => {
    it('should return linked contacts', async () => {
      const linkedContacts = [
        {
          id: 'contact-1',
          elderName: 'Elder',
          elderEmail: 'elder@example.com',
          contactName: 'Contact',
          relationshipSince: new Date(),
          hasActiveAlerts: false,
        },
      ];
      service.getLinkedContacts.mockResolvedValue(linkedContacts);

      const result = await controller.getLinkedContacts('user-1');

      expect(service.getLinkedContacts).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(linkedContacts);
    });
  });
});

describe('VerifyContactController', () => {
  let controller: VerifyContactController;
  let verificationService: jest.Mocked<ContactVerificationService>;

  beforeEach(async () => {
    const mockVerificationService = {
      verifyContact: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifyContactController],
      providers: [{ provide: ContactVerificationService, useValue: mockVerificationService }],
    }).compile();

    controller = module.get<VerifyContactController>(VerifyContactController);
    verificationService = module.get(ContactVerificationService);
  });

  describe('verify', () => {
    it('should verify contact with token', async () => {
      verificationService.verifyContact.mockResolvedValue({
        success: true,
        contactName: 'John',
        userName: 'Elder',
      });

      const result = await controller.verify('token-123');

      expect(verificationService.verifyContact).toHaveBeenCalledWith('token-123');
      expect(result.success).toBe(true);
    });

    it('should throw BadRequestException when token missing', async () => {
      await expect(controller.verify('')).rejects.toThrow(BadRequestException);
    });
  });
});

describe('ContactLinkController', () => {
  let controller: ContactLinkController;
  let service: jest.Mocked<EmergencyContactsService>;

  beforeEach(async () => {
    const mockService = {
      getInvitationDetails: jest.fn(),
      acceptInvitation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactLinkController],
      providers: [{ provide: EmergencyContactsService, useValue: mockService }],
    }).compile();

    controller = module.get<ContactLinkController>(ContactLinkController);
    service = module.get(EmergencyContactsService);
  });

  describe('getInvitationDetails', () => {
    it('should return invitation details', async () => {
      const details = {
        contactId: 'contact-1',
        elderName: 'Elder',
        elderEmail: 'elder@example.com',
        contactName: 'Contact',
      };
      service.getInvitationDetails.mockResolvedValue(details);

      const result = await controller.getInvitationDetails('token-123');

      expect(service.getInvitationDetails).toHaveBeenCalledWith('token-123');
      expect(result).toEqual(details);
    });

    it('should throw BadRequestException for invalid token', async () => {
      service.getInvitationDetails.mockResolvedValue(null);

      await expect(controller.getInvitationDetails('invalid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation', async () => {
      service.acceptInvitation.mockResolvedValue({ success: true, elderName: 'Elder' });

      const result = await controller.acceptInvitation('token-123', 'user-2');

      expect(service.acceptInvitation).toHaveBeenCalledWith('token-123', 'user-2');
      expect(result.success).toBe(true);
    });
  });
});
