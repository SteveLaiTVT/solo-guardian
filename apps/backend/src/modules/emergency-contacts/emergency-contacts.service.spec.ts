import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EmergencyContactsService } from './emergency-contacts.service';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { AlertService } from '../alerts';

describe('EmergencyContactsService', () => {
  let service: EmergencyContactsService;
  let repository: jest.Mocked<EmergencyContactsRepository>;
  let alertService: jest.Mocked<AlertService>;

  const mockContact = {
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
    linkedUser: null,
    invitationToken: null,
    invitationSentAt: null,
    invitationAcceptedAt: null,
    verificationToken: null,
    verificationTokenExpiresAt: null,
    phoneOtp: null,
    phoneOtpExpiresAt: null,
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      findAllByUserId: jest.fn(),
      findById: jest.fn(),
      findByIdWithLinkedUser: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
      updatePriorities: jest.fn(),
      findUserByEmail: jest.fn(),
      setInvitationToken: jest.fn(),
      findByInvitationToken: jest.fn(),
      acceptInvitation: jest.fn(),
      findContactsWhereUserIsLinked: jest.fn(),
      findPendingInvitationsForUser: jest.fn(),
      clearInvitation: jest.fn(),
    };

    const mockAlertService = {
      hasActiveAlerts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyContactsService,
        { provide: EmergencyContactsRepository, useValue: mockRepository },
        { provide: AlertService, useValue: mockAlertService },
      ],
    }).compile();

    service = module.get<EmergencyContactsService>(EmergencyContactsService);
    repository = module.get(EmergencyContactsRepository);
    alertService = module.get(AlertService);
  });

  describe('findAll', () => {
    it('should return all contacts for user', async () => {
      repository.findAllByUserId.mockResolvedValue([mockContact]);

      const result = await service.findAll('user-1');

      expect(repository.findAllByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('contact-1');
    });
  });

  describe('findOne', () => {
    it('should return contact when found', async () => {
      repository.findByIdWithLinkedUser.mockResolvedValue(mockContact);

      const result = await service.findOne('contact-1', 'user-1');

      expect(result.id).toBe('contact-1');
    });

    it('should throw NotFoundException when contact not found', async () => {
      repository.findByIdWithLinkedUser.mockResolvedValue(null);

      await expect(service.findOne('contact-1', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when contact belongs to another user', async () => {
      repository.findByIdWithLinkedUser.mockResolvedValue({ ...mockContact, userId: 'other-user' });

      await expect(service.findOne('contact-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new contact', async () => {
      repository.findAllByUserId.mockResolvedValue([]);
      repository.findByEmail.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockContact);
      repository.findUserByEmail.mockResolvedValue(null);
      repository.findByIdWithLinkedUser.mockResolvedValue(mockContact);

      const result = await service.create('user-1', {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
      });

      expect(repository.create).toHaveBeenCalled();
      expect(result.contact.id).toBe('contact-1');
    });

    it('should throw BadRequestException when max contacts reached', async () => {
      repository.findAllByUserId.mockResolvedValue([
        mockContact,
        { ...mockContact, id: 'c2' },
        { ...mockContact, id: 'c3' },
        { ...mockContact, id: 'c4' },
        { ...mockContact, id: 'c5' },
      ]);

      await expect(
        service.create('user-1', { name: 'New', email: 'new@example.com' })
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when email already exists', async () => {
      repository.findAllByUserId.mockResolvedValue([]);
      repository.findByEmail.mockResolvedValue(mockContact);

      await expect(
        service.create('user-1', { name: 'John', email: 'john@example.com' })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update contact', async () => {
      repository.findById.mockResolvedValue(mockContact);
      repository.update.mockResolvedValue({ ...mockContact, name: 'Jane Doe' });
      repository.findByIdWithLinkedUser.mockResolvedValue({ ...mockContact, name: 'Jane Doe' });

      const result = await service.update('contact-1', 'user-1', { name: 'Jane Doe' });

      expect(repository.update).toHaveBeenCalled();
      expect(result.contact.name).toBe('Jane Doe');
    });

    it('should throw NotFoundException when contact not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.update('contact-1', 'user-1', { name: 'Jane' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should soft delete contact', async () => {
      repository.findById.mockResolvedValue(mockContact);
      repository.softDelete.mockResolvedValue({ ...mockContact, deletedAt: new Date() });

      await service.remove('contact-1', 'user-1');

      expect(repository.softDelete).toHaveBeenCalledWith('contact-1');
    });

    it('should throw NotFoundException when contact not found', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.remove('contact-1', 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reorder', () => {
    it('should reorder contacts', async () => {
      repository.findAllByUserId.mockResolvedValue([mockContact, { ...mockContact, id: 'c2' }]);
      repository.updatePriorities.mockResolvedValue([
        { ...mockContact, priority: 1 },
        { ...mockContact, id: 'c2', priority: 2 },
      ]);

      const result = await service.reorder('user-1', ['contact-1', 'c2']);

      expect(repository.updatePriorities).toHaveBeenCalled();
      expect(result).toHaveLength(2);
    });

    it('should throw BadRequestException for invalid contact id', async () => {
      repository.findAllByUserId.mockResolvedValue([mockContact]);

      await expect(service.reorder('user-1', ['invalid-id'])).rejects.toThrow(BadRequestException);
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation successfully', async () => {
      const contactWithInvitation = {
        ...mockContact,
        linkedUserId: 'user-2',
        invitationToken: 'token-123',
        user: { id: 'user-1', name: 'Elder', email: 'elder@example.com' },
      };
      repository.findByInvitationToken.mockResolvedValue(contactWithInvitation);
      repository.acceptInvitation.mockResolvedValue({ ...mockContact, invitationAcceptedAt: new Date() });

      const result = await service.acceptInvitation('token-123', 'user-2');

      expect(repository.acceptInvitation).toHaveBeenCalledWith('contact-1');
      expect(result.success).toBe(true);
      expect(result.elderName).toBe('Elder');
    });

    it('should throw NotFoundException for invalid token', async () => {
      repository.findByInvitationToken.mockResolvedValue(null);

      await expect(service.acceptInvitation('invalid-token', 'user-2')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException when invitation is not for user', async () => {
      const contactWithInvitation = {
        ...mockContact,
        linkedUserId: 'other-user',
        user: { id: 'user-1', name: 'Elder', email: 'elder@example.com' },
      };
      repository.findByInvitationToken.mockResolvedValue(contactWithInvitation);

      await expect(service.acceptInvitation('token-123', 'user-2')).rejects.toThrow(
        ForbiddenException
      );
    });
  });

  describe('getLinkedContacts', () => {
    it('should return linked contacts with alert status', async () => {
      const linkedContact = {
        ...mockContact,
        invitationAcceptedAt: new Date(),
        user: { id: 'elder-1', name: 'Elder', email: 'elder@example.com' },
      };
      repository.findContactsWhereUserIsLinked.mockResolvedValue([linkedContact]);
      alertService.hasActiveAlerts.mockResolvedValue(false);

      const result = await service.getLinkedContacts('user-2');

      expect(result).toHaveLength(1);
      expect(result[0].elderName).toBe('Elder');
      expect(result[0].hasActiveAlerts).toBe(false);
    });
  });
});
