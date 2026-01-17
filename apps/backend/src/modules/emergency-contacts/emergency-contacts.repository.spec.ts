import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyContactsRepository } from './emergency-contacts.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('EmergencyContactsRepository', () => {
  let repository: EmergencyContactsRepository;
  let prisma: jest.Mocked<PrismaService>;

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
    preferredChannel: 'email',
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
    const mockPrisma = {
      emergencyContact: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        aggregate: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmergencyContactsRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<EmergencyContactsRepository>(EmergencyContactsRepository);
    prisma = module.get(PrismaService);
  });

  describe('findAllByUserId', () => {
    it('should return contacts for user', async () => {
      (prisma.emergencyContact.findMany as jest.Mock).mockResolvedValue([mockContact]);

      const result = await repository.findAllByUserId('user-1');

      expect(prisma.emergencyContact.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', deletedAt: null },
        orderBy: { priority: 'asc' },
        include: { linkedUser: { select: { id: true, name: true } } },
      });
      expect(result).toEqual([mockContact]);
    });
  });

  describe('findById', () => {
    it('should return contact by id', async () => {
      (prisma.emergencyContact.findUnique as jest.Mock).mockResolvedValue(mockContact);

      const result = await repository.findById('contact-1');

      expect(prisma.emergencyContact.findUnique).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
      });
      expect(result).toEqual(mockContact);
    });
  });

  describe('findByEmail', () => {
    it('should return contact by email', async () => {
      (prisma.emergencyContact.findFirst as jest.Mock).mockResolvedValue(mockContact);

      const result = await repository.findByEmail('user-1', 'john@example.com');

      expect(prisma.emergencyContact.findFirst).toHaveBeenCalledWith({
        where: { userId: 'user-1', email: 'john@example.com', deletedAt: null },
      });
      expect(result).toEqual(mockContact);
    });
  });

  describe('countByUserId', () => {
    it('should return count of contacts', async () => {
      (prisma.emergencyContact.count as jest.Mock).mockResolvedValue(3);

      const result = await repository.countByUserId('user-1');

      expect(result).toBe(3);
    });
  });

  describe('create', () => {
    it('should create a new contact', async () => {
      (prisma.emergencyContact.create as jest.Mock).mockResolvedValue(mockContact);

      const result = await repository.create({
        userId: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        priority: 1,
      });

      expect(prisma.emergencyContact.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          priority: 1,
        },
      });
      expect(result).toEqual(mockContact);
    });
  });

  describe('update', () => {
    it('should update contact', async () => {
      const updated = { ...mockContact, name: 'Jane Doe' };
      (prisma.emergencyContact.update as jest.Mock).mockResolvedValue(updated);

      const result = await repository.update('contact-1', { name: 'Jane Doe' });

      expect(prisma.emergencyContact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: { name: 'Jane Doe' },
      });
      expect(result.name).toBe('Jane Doe');
    });
  });

  describe('softDelete', () => {
    it('should soft delete contact', async () => {
      const deleted = { ...mockContact, deletedAt: new Date() };
      (prisma.emergencyContact.update as jest.Mock).mockResolvedValue(deleted);

      const result = await repository.softDelete('contact-1');

      expect(prisma.emergencyContact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result.deletedAt).toBeDefined();
    });
  });

  describe('setVerificationToken', () => {
    it('should set verification token', async () => {
      const withToken = { ...mockContact, verificationToken: 'token-123' };
      (prisma.emergencyContact.update as jest.Mock).mockResolvedValue(withToken);

      const result = await repository.setVerificationToken('contact-1', 'token-123');

      expect(prisma.emergencyContact.update).toHaveBeenCalled();
      expect(result.verificationToken).toBe('token-123');
    });
  });

  describe('markVerified', () => {
    it('should mark contact as verified', async () => {
      const verified = { ...mockContact, isVerified: true, verificationToken: null };
      (prisma.emergencyContact.update as jest.Mock).mockResolvedValue(verified);

      const result = await repository.markVerified('contact-1');

      expect(prisma.emergencyContact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpiresAt: null,
        },
      });
      expect(result.isVerified).toBe(true);
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = { id: 'user-2', email: 'linked@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findUserByEmail('linked@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'linked@example.com' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('setInvitationToken', () => {
    it('should set invitation token and linked user', async () => {
      const withInvitation = {
        ...mockContact,
        linkedUserId: 'user-2',
        invitationToken: 'inv-token',
        invitationSentAt: new Date(),
      };
      (prisma.emergencyContact.update as jest.Mock).mockResolvedValue(withInvitation);

      const result = await repository.setInvitationToken('contact-1', 'user-2');

      expect(prisma.emergencyContact.update).toHaveBeenCalled();
      expect(result.linkedUserId).toBe('user-2');
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation', async () => {
      const accepted = {
        ...mockContact,
        invitationAcceptedAt: new Date(),
        invitationToken: null,
      };
      (prisma.emergencyContact.update as jest.Mock).mockResolvedValue(accepted);

      const result = await repository.acceptInvitation('contact-1');

      expect(prisma.emergencyContact.update).toHaveBeenCalledWith({
        where: { id: 'contact-1' },
        data: {
          invitationAcceptedAt: expect.any(Date),
          invitationToken: null,
        },
      });
      expect(result.invitationAcceptedAt).toBeDefined();
    });
  });
});
