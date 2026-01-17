import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesRepository } from './user-preferences.repository';
import { PrismaService } from '../../prisma/prisma.service';

describe('UserPreferencesRepository', () => {
  let repository: UserPreferencesRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockPreferences = {
    id: 'pref-1',
    userId: 'user-1',
    preferFeaturesOn: true,
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    warmColors: false,
    hobbyCheckIn: false,
    familyAccess: false,
    optionalFeatures: {},
    onboardingCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      userPreferences: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        upsert: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferencesRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<UserPreferencesRepository>(UserPreferencesRepository);
    prisma = module.get(PrismaService);
  });

  describe('findByUserId', () => {
    it('should return preferences for user', async () => {
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(mockPreferences);

      const result = await repository.findByUserId('user-1');

      expect(prisma.userPreferences.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(result).toEqual(mockPreferences);
    });

    it('should return null when not found', async () => {
      (prisma.userPreferences.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByUserId('unknown-user');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new preferences with defaults', async () => {
      (prisma.userPreferences.create as jest.Mock).mockResolvedValue(mockPreferences);

      const result = await repository.create('user-1');

      expect(prisma.userPreferences.create).toHaveBeenCalledWith({
        data: { userId: 'user-1' },
      });
      expect(result).toEqual(mockPreferences);
    });
  });

  describe('update', () => {
    it('should update preferences', async () => {
      const updated = { ...mockPreferences, fontSize: 18 };
      (prisma.userPreferences.update as jest.Mock).mockResolvedValue(updated);

      const result = await repository.update('user-1', { fontSize: 18 });

      expect(prisma.userPreferences.update).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        data: { fontSize: 18 },
      });
      expect(result.fontSize).toBe(18);
    });

    it('should update multiple fields', async () => {
      const updated = { ...mockPreferences, highContrast: true, reducedMotion: true };
      (prisma.userPreferences.update as jest.Mock).mockResolvedValue(updated);

      const result = await repository.update('user-1', {
        highContrast: true,
        reducedMotion: true,
      });

      expect(result.highContrast).toBe(true);
      expect(result.reducedMotion).toBe(true);
    });
  });

  describe('upsert', () => {
    it('should create preferences if not exists', async () => {
      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue(mockPreferences);

      const result = await repository.upsert('user-1', { fontSize: 18 });

      expect(prisma.userPreferences.upsert).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        update: { fontSize: 18 },
        create: { userId: 'user-1', fontSize: 18 },
      });
      expect(result).toEqual(mockPreferences);
    });

    it('should update preferences if exists', async () => {
      const updated = { ...mockPreferences, highContrast: true };
      (prisma.userPreferences.upsert as jest.Mock).mockResolvedValue(updated);

      const result = await repository.upsert('user-1', { highContrast: true });

      expect(result.highContrast).toBe(true);
    });
  });
});
