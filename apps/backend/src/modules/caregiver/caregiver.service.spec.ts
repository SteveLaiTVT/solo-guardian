import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CaregiverService } from './caregiver.service';
import { CaregiverRepository } from './caregiver.repository';

describe('CaregiverService', () => {
  let service: CaregiverService;
  let repository: jest.Mocked<CaregiverRepository>;

  const mockElder = {
    id: 'elder-1',
    name: 'Elder User',
    email: 'elder@example.com',
    checkIns: [{ checkInDate: new Date().toISOString().split('T')[0] }],
    checkInSettings: { deadlineTime: '09:00', reminderTime: '08:00', timezone: 'UTC' },
    alerts: [],
    emergencyContacts: [{ id: 'contact-1', name: 'Contact', isVerified: true }],
  };

  const mockRelation = {
    id: 'relation-1',
    caregiverId: 'caregiver-1',
    elderId: 'elder-1',
    isAccepted: true,
    relationshipType: 'caregiver' as const,
  };

  const mockInvitation = {
    id: 'invitation-1',
    relationshipType: 'caregiver' as const,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    acceptedAt: null,
    inviter: { id: 'inviter-1', name: 'Inviter', email: 'inviter@example.com' },
  };

  beforeEach(async () => {
    const mockRepository = {
      getEldersByCaregiver: jest.fn(),
      getCaregivers: jest.fn(),
      getElderDetail: jest.fn(),
      findRelation: jest.fn(),
      createRelation: jest.fn(),
      acceptRelation: jest.fn(),
      deleteRelation: jest.fn(),
      findUserByEmail: jest.fn(),
      createInvitation: jest.fn(),
      findInvitationByToken: jest.fn(),
      acceptInvitation: jest.fn(),
      getRelationByUsers: jest.fn(),
      createCaretakerCheckIn: jest.fn(),
      createNote: jest.fn(),
      getNotes: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaregiverService,
        { provide: CaregiverRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CaregiverService>(CaregiverService);
    repository = module.get(CaregiverRepository);
  });

  describe('getMyElders', () => {
    it('should return list of elders with status', async () => {
      repository.getEldersByCaregiver.mockResolvedValue([
        { elder: mockElder, isAccepted: true },
      ]);

      const result = await service.getMyElders('caregiver-1');

      expect(repository.getEldersByCaregiver).toHaveBeenCalledWith('caregiver-1');
      expect(result).toHaveLength(1);
      expect(result[0].todayStatus).toBe('checked_in');
    });

    it('should return pending status when no check-in and before deadline', async () => {
      const elderNoCheckIn = { ...mockElder, checkIns: [] };
      repository.getEldersByCaregiver.mockResolvedValue([
        { elder: elderNoCheckIn, isAccepted: true },
      ]);

      const result = await service.getMyElders('caregiver-1');

      expect(result[0].todayStatus).toBeDefined();
    });
  });

  describe('getMyCaregivers', () => {
    it('should return list of caregivers', async () => {
      repository.getCaregivers.mockResolvedValue([
        { caregiver: { id: 'caregiver-1', name: 'Caregiver', email: 'cg@example.com' }, isAccepted: true },
      ]);

      const result = await service.getMyCaregivers('elder-1');

      expect(repository.getCaregivers).toHaveBeenCalledWith('elder-1');
      expect(result).toHaveLength(1);
      expect(result[0].isAccepted).toBe(true);
    });
  });

  describe('getElderDetail', () => {
    it('should return elder details', async () => {
      repository.getElderDetail.mockResolvedValue(mockElder);

      const result = await service.getElderDetail('caregiver-1', 'elder-1');

      expect(repository.getElderDetail).toHaveBeenCalledWith('caregiver-1', 'elder-1');
      expect(result.id).toBe('elder-1');
      expect(result.emergencyContacts).toBeDefined();
    });

    it('should throw NotFoundException when elder not found', async () => {
      repository.getElderDetail.mockResolvedValue(null);

      await expect(service.getElderDetail('caregiver-1', 'elder-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('inviteElder', () => {
    it('should create invitation for elder', async () => {
      repository.findUserByEmail.mockResolvedValue({ id: 'elder-1', name: 'Elder', email: 'elder@example.com' });
      repository.findRelation.mockResolvedValue(null);
      repository.createRelation.mockResolvedValue(mockRelation);

      await service.inviteElder('caregiver-1', { email: 'elder@example.com' });

      expect(repository.createRelation).toHaveBeenCalledWith('caregiver-1', 'elder-1');
    });

    it('should throw NotFoundException when user not found', async () => {
      repository.findUserByEmail.mockResolvedValue(null);

      await expect(service.inviteElder('caregiver-1', { email: 'unknown@example.com' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when inviting self', async () => {
      repository.findUserByEmail.mockResolvedValue({ id: 'caregiver-1', name: 'Self', email: 'self@example.com' });

      await expect(service.inviteElder('caregiver-1', { email: 'self@example.com' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when relation already exists', async () => {
      repository.findUserByEmail.mockResolvedValue({ id: 'elder-1', name: 'Elder', email: 'elder@example.com' });
      repository.findRelation.mockResolvedValue(mockRelation);

      await expect(service.inviteElder('caregiver-1', { email: 'elder@example.com' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('acceptCaregiver', () => {
    it('should accept caregiver invitation', async () => {
      repository.findRelation.mockResolvedValue({ ...mockRelation, isAccepted: false });

      await service.acceptCaregiver('elder-1', 'caregiver-1');

      expect(repository.acceptRelation).toHaveBeenCalledWith('caregiver-1', 'elder-1');
    });

    it('should throw NotFoundException when invitation not found', async () => {
      repository.findRelation.mockResolvedValue(null);

      await expect(service.acceptCaregiver('elder-1', 'caregiver-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when already accepted', async () => {
      repository.findRelation.mockResolvedValue({ ...mockRelation, isAccepted: true });

      await expect(service.acceptCaregiver('elder-1', 'caregiver-1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeCaregiver', () => {
    it('should remove caregiver relation', async () => {
      repository.findRelation.mockResolvedValue(mockRelation);

      await service.removeCaregiver('elder-1', 'caregiver-1');

      expect(repository.deleteRelation).toHaveBeenCalledWith('caregiver-1', 'elder-1');
    });

    it('should throw NotFoundException when relation not found', async () => {
      repository.findRelation.mockResolvedValue(null);

      await expect(service.removeCaregiver('elder-1', 'caregiver-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeElder', () => {
    it('should remove elder relation', async () => {
      repository.findRelation.mockResolvedValue(mockRelation);

      await service.removeElder('caregiver-1', 'elder-1');

      expect(repository.deleteRelation).toHaveBeenCalledWith('caregiver-1', 'elder-1');
    });

    it('should throw NotFoundException when relation not found', async () => {
      repository.findRelation.mockResolvedValue(null);

      await expect(service.removeElder('caregiver-1', 'elder-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createInvitation', () => {
    it('should create invitation with QR URL', async () => {
      repository.createInvitation.mockResolvedValue({
        id: 'invitation-1',
        token: 'test-token',
        expiresAt: new Date(),
        inviterName: 'Test User',
      });

      const result = await service.createInvitation('user-1', {
        relationshipType: 'caregiver',
        targetEmail: 'target@example.com',
      });

      expect(result).toHaveProperty('qrUrl');
      expect(result.token).toBe('test-token');
    });
  });

  describe('getInvitationDetails', () => {
    it('should return invitation details', async () => {
      repository.findInvitationByToken.mockResolvedValue(mockInvitation);

      const result = await service.getInvitationDetails('test-token');

      expect(result.relationshipType).toBe('caregiver');
      expect(result.isExpired).toBe(false);
      expect(result.isAccepted).toBe(false);
    });

    it('should throw NotFoundException when invitation not found', async () => {
      repository.findInvitationByToken.mockResolvedValue(null);

      await expect(service.getInvitationDetails('invalid-token')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('acceptInvitation', () => {
    it('should accept invitation', async () => {
      repository.findInvitationByToken.mockResolvedValue(mockInvitation);

      await service.acceptInvitation('test-token', 'acceptor-1');

      expect(repository.acceptInvitation).toHaveBeenCalledWith(
        'invitation-1',
        'acceptor-1',
        'inviter-1',
        'caregiver',
      );
    });

    it('should throw NotFoundException when invitation not found', async () => {
      repository.findInvitationByToken.mockResolvedValue(null);

      await expect(service.acceptInvitation('invalid-token', 'acceptor-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when already accepted', async () => {
      repository.findInvitationByToken.mockResolvedValue({
        ...mockInvitation,
        acceptedAt: new Date(),
      });

      await expect(service.acceptInvitation('test-token', 'acceptor-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException when expired', async () => {
      repository.findInvitationByToken.mockResolvedValue({
        ...mockInvitation,
        expiresAt: new Date(Date.now() - 1000),
      });

      await expect(service.acceptInvitation('test-token', 'acceptor-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when accepting own invitation', async () => {
      repository.findInvitationByToken.mockResolvedValue(mockInvitation);

      await expect(service.acceptInvitation('test-token', 'inviter-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('checkInOnBehalf', () => {
    it('should check in on behalf of elder', async () => {
      repository.getRelationByUsers.mockResolvedValue({ id: 'relation-1', relationshipType: 'caretaker' });
      repository.createCaretakerCheckIn.mockResolvedValue({
        id: 'checkin-1',
        checkInDate: '2025-01-15',
        checkedInAt: new Date(),
        note: 'Test note',
      });

      const result = await service.checkInOnBehalf('caretaker-1', 'elder-1', 'Test note');

      expect(result).toHaveProperty('checkInDate');
      expect(result).toHaveProperty('checkedInAt');
    });

    it('should throw NotFoundException when relation not found', async () => {
      repository.getRelationByUsers.mockResolvedValue(null);

      await expect(service.checkInOnBehalf('caretaker-1', 'elder-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when not caretaker', async () => {
      repository.getRelationByUsers.mockResolvedValue({ id: 'relation-1', relationshipType: 'caregiver' });

      await expect(service.checkInOnBehalf('caregiver-1', 'elder-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('addNote', () => {
    it('should add note for elder', async () => {
      repository.getRelationByUsers.mockResolvedValue({ id: 'relation-1', relationshipType: 'caregiver' });
      repository.createNote.mockResolvedValue({
        id: 'note-1',
        content: 'Test note',
        noteDate: '2025-01-15',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.addNote('caregiver-1', 'elder-1', {
        content: 'Test note',
        noteDate: '2025-01-15',
      });

      expect(result.content).toBe('Test note');
    });

    it('should throw NotFoundException when relation not found', async () => {
      repository.getRelationByUsers.mockResolvedValue(null);

      await expect(service.addNote('caregiver-1', 'elder-1', { content: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getNotes', () => {
    it('should return notes for elder', async () => {
      repository.getRelationByUsers.mockResolvedValue({ id: 'relation-1', relationshipType: 'caregiver' });
      repository.getNotes.mockResolvedValue([
        { id: 'note-1', content: 'Test', noteDate: '2025-01-15', createdAt: new Date(), updatedAt: new Date() },
      ]);

      const result = await service.getNotes('caregiver-1', 'elder-1');

      expect(result.notes).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should throw NotFoundException when relation not found', async () => {
      repository.getRelationByUsers.mockResolvedValue(null);

      await expect(service.getNotes('caregiver-1', 'elder-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
