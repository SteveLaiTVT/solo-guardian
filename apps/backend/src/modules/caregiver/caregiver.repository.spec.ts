import { Test, TestingModule } from '@nestjs/testing';
import { CaregiverRepository } from './caregiver.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('CaregiverRepository', () => {
  let repository: CaregiverRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockRelation = {
    id: 'relation-1',
    caregiverId: 'caregiver-1',
    elderId: 'elder-1',
    isAccepted: false,
    relationshipType: 'caregiver',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
  };

  const mockInvitation = {
    id: 'invitation-1',
    token: 'test-token',
    inviterId: 'inviter-1',
    relationshipType: 'caregiver',
    targetEmail: 'target@example.com',
    targetPhone: null,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    acceptedAt: null,
    inviter: { id: 'inviter-1', name: 'Inviter', email: 'inviter@example.com' },
  };

  beforeEach(async () => {
    const mockPrisma = {
      caregiverRelation: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      caregiverInvitation: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      caregiverNote: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      checkIn: {
        upsert: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaregiverRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<CaregiverRepository>(CaregiverRepository);
    prisma = module.get(PrismaService);
  });

  describe('findRelation', () => {
    it('should find relation by caregiver and elder ids', async () => {
      (prisma.caregiverRelation.findUnique as jest.Mock).mockResolvedValue(mockRelation);

      const result = await repository.findRelation('caregiver-1', 'elder-1');

      expect(prisma.caregiverRelation.findUnique).toHaveBeenCalledWith({
        where: {
          caregiverId_elderId: {
            caregiverId: 'caregiver-1',
            elderId: 'elder-1',
          },
        },
      });
      expect(result).toEqual(mockRelation);
    });

    it('should return null when relation not found', async () => {
      (prisma.caregiverRelation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findRelation('caregiver-1', 'elder-1');

      expect(result).toBeNull();
    });
  });

  describe('createRelation', () => {
    it('should create a new relation', async () => {
      (prisma.caregiverRelation.create as jest.Mock).mockResolvedValue(mockRelation);

      const result = await repository.createRelation('caregiver-1', 'elder-1');

      expect(prisma.caregiverRelation.create).toHaveBeenCalledWith({
        data: {
          caregiverId: 'caregiver-1',
          elderId: 'elder-1',
          isAccepted: false,
        },
      });
      expect(result).toEqual(mockRelation);
    });
  });

  describe('acceptRelation', () => {
    it('should update relation to accepted', async () => {
      await repository.acceptRelation('caregiver-1', 'elder-1');

      expect(prisma.caregiverRelation.update).toHaveBeenCalledWith({
        where: {
          caregiverId_elderId: {
            caregiverId: 'caregiver-1',
            elderId: 'elder-1',
          },
        },
        data: { isAccepted: true },
      });
    });
  });

  describe('deleteRelation', () => {
    it('should delete relation', async () => {
      await repository.deleteRelation('caregiver-1', 'elder-1');

      expect(prisma.caregiverRelation.delete).toHaveBeenCalledWith({
        where: {
          caregiverId_elderId: {
            caregiverId: 'caregiver-1',
            elderId: 'elder-1',
          },
        },
      });
    });
  });

  describe('getEldersByCaregiver', () => {
    it('should return elders with relation info', async () => {
      const mockRelations = [
        {
          isAccepted: true,
          elder: {
            id: 'elder-1',
            name: 'Elder',
            email: 'elder@example.com',
            checkIns: [{ checkInDate: '2025-01-15' }],
            checkInSettings: { deadlineTime: '09:00', reminderTime: '08:00', timezone: 'UTC' },
            alerts: [],
            emergencyContacts: [],
          },
        },
      ];
      (prisma.caregiverRelation.findMany as jest.Mock).mockResolvedValue(mockRelations);

      const result = await repository.getEldersByCaregiver('caregiver-1');

      expect(prisma.caregiverRelation.findMany).toHaveBeenCalledWith({
        where: { caregiverId: 'caregiver-1' },
        include: expect.any(Object),
      });
      expect(result).toHaveLength(1);
      expect(result[0].isAccepted).toBe(true);
    });
  });

  describe('getCaregivers', () => {
    it('should return caregivers for elder', async () => {
      const mockRelations = [
        {
          isAccepted: true,
          caregiver: { id: 'caregiver-1', name: 'Caregiver', email: 'caregiver@example.com' },
        },
      ];
      (prisma.caregiverRelation.findMany as jest.Mock).mockResolvedValue(mockRelations);

      const result = await repository.getCaregivers('elder-1');

      expect(prisma.caregiverRelation.findMany).toHaveBeenCalledWith({
        where: { elderId: 'elder-1' },
        include: expect.any(Object),
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getElderDetail', () => {
    it('should return elder detail with relations', async () => {
      const mockRelationWithElder = {
        elder: {
          id: 'elder-1',
          name: 'Elder',
          email: 'elder@example.com',
          checkIns: [],
          checkInSettings: null,
          alerts: [],
          emergencyContacts: [],
        },
      };
      (prisma.caregiverRelation.findUnique as jest.Mock).mockResolvedValue(mockRelationWithElder);

      const result = await repository.getElderDetail('caregiver-1', 'elder-1');

      expect(result).toEqual(mockRelationWithElder.elder);
    });

    it('should return null when relation not found', async () => {
      (prisma.caregiverRelation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.getElderDetail('caregiver-1', 'elder-1');

      expect(result).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findUserByEmail('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: { id: true, name: true, email: true },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createInvitation', () => {
    it('should create invitation with token', async () => {
      (prisma.caregiverInvitation.create as jest.Mock).mockResolvedValue({
        ...mockInvitation,
        inviter: { name: 'Inviter' },
      });

      const result = await repository.createInvitation({
        inviterId: 'inviter-1',
        relationshipType: 'caregiver',
        targetEmail: 'target@example.com',
      });

      expect(prisma.caregiverInvitation.create).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('expiresAt');
    });
  });

  describe('findInvitationByToken', () => {
    it('should find invitation by token', async () => {
      (prisma.caregiverInvitation.findUnique as jest.Mock).mockResolvedValue(mockInvitation);

      const result = await repository.findInvitationByToken('test-token');

      expect(prisma.caregiverInvitation.findUnique).toHaveBeenCalledWith({
        where: { token: 'test-token' },
        include: { inviter: { select: { id: true, name: true, email: true } } },
      });
      expect(result).toBeDefined();
    });

    it('should return null when invitation not found', async () => {
      (prisma.caregiverInvitation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findInvitationByToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation and create relation', async () => {
      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          caregiverInvitation: { update: jest.fn() },
          caregiverRelation: { findUnique: jest.fn().mockResolvedValue(null), create: jest.fn() },
        };
        await callback(tx);
      });

      await repository.acceptInvitation('invitation-1', 'acceptor-1', 'inviter-1', 'caregiver');

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('createNote', () => {
    it('should create a note', async () => {
      const mockNote = {
        id: 'note-1',
        content: 'Test note',
        noteDate: '2025-01-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.caregiverNote.create as jest.Mock).mockResolvedValue(mockNote);

      const result = await repository.createNote({
        relationId: 'relation-1',
        content: 'Test note',
        noteDate: '2025-01-15',
      });

      expect(prisma.caregiverNote.create).toHaveBeenCalledWith({
        data: {
          relationId: 'relation-1',
          content: 'Test note',
          noteDate: '2025-01-15',
        },
      });
      expect(result).toEqual(mockNote);
    });
  });

  describe('getNotes', () => {
    it('should return notes for relation', async () => {
      const mockNotes = [
        { id: 'note-1', content: 'Note 1', noteDate: '2025-01-15', createdAt: new Date(), updatedAt: new Date() },
      ];
      (prisma.caregiverNote.findMany as jest.Mock).mockResolvedValue(mockNotes);

      const result = await repository.getNotes('relation-1');

      expect(prisma.caregiverNote.findMany).toHaveBeenCalledWith({
        where: { relationId: 'relation-1' },
        orderBy: { noteDate: 'desc' },
        take: 30,
      });
      expect(result).toEqual(mockNotes);
    });
  });

  describe('getRelationByUsers', () => {
    it('should return relation with type', async () => {
      (prisma.caregiverRelation.findUnique as jest.Mock).mockResolvedValue({
        id: 'relation-1',
        relationshipType: 'caretaker',
      });

      const result = await repository.getRelationByUsers('caregiver-1', 'elder-1');

      expect(result).toEqual({ id: 'relation-1', relationshipType: 'caretaker' });
    });

    it('should return null when not found', async () => {
      (prisma.caregiverRelation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.getRelationByUsers('caregiver-1', 'elder-1');

      expect(result).toBeNull();
    });
  });

  describe('createCaretakerCheckIn', () => {
    it('should upsert check-in on behalf', async () => {
      const mockCheckIn = {
        id: 'checkin-1',
        checkInDate: '2025-01-15',
        checkedInAt: new Date(),
        note: 'Checked by caretaker',
      };
      (prisma.checkIn.upsert as jest.Mock).mockResolvedValue(mockCheckIn);

      const result = await repository.createCaretakerCheckIn({
        userId: 'elder-1',
        checkInDate: '2025-01-15',
        note: 'Checked by caretaker',
        caretakerId: 'caretaker-1',
      });

      expect(prisma.checkIn.upsert).toHaveBeenCalled();
      expect(result).toEqual(mockCheckIn);
    });
  });
});
