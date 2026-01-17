import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesService } from './user-preferences.service';
import { UserPreferencesRepository } from './user-preferences.repository';
import { BusinessException } from '../../common/exceptions';

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;
  let repository: jest.Mocked<UserPreferencesRepository>;

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
    const mockRepository = {
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferencesService,
        { provide: UserPreferencesRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UserPreferencesService>(UserPreferencesService);
    repository = module.get(UserPreferencesRepository);
  });

  describe('getOrCreate', () => {
    it('should return existing preferences', async () => {
      repository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await service.getOrCreate('user-1');

      expect(repository.findByUserId).toHaveBeenCalledWith('user-1');
      expect(result.userId).toBe('user-1');
    });

    it('should create preferences if not exists', async () => {
      repository.findByUserId.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPreferences);

      const result = await service.getOrCreate('user-1');

      expect(repository.create).toHaveBeenCalledWith('user-1');
      expect(result.userId).toBe('user-1');
    });
  });

  describe('update', () => {
    it('should update preferences', async () => {
      repository.findByUserId.mockResolvedValue(mockPreferences);
      const updated = { ...mockPreferences, fontSize: 18 };
      repository.update.mockResolvedValue(updated);

      const result = await service.update('user-1', { fontSize: 18 });

      expect(repository.update).toHaveBeenCalledWith('user-1', expect.objectContaining({
        fontSize: 18,
      }));
      expect(result.fontSize).toBe(18);
    });

    it('should create preferences if not exists then update', async () => {
      repository.findByUserId.mockResolvedValue(null);
      repository.create.mockResolvedValue(mockPreferences);
      repository.update.mockResolvedValue({ ...mockPreferences, highContrast: true });

      const result = await service.update('user-1', { highContrast: true });

      expect(repository.create).toHaveBeenCalled();
      expect(repository.update).toHaveBeenCalled();
    });
  });

  describe('updateOptionalFeature', () => {
    it('should update optional feature', async () => {
      repository.findByUserId.mockResolvedValue(mockPreferences);
      const updated = { ...mockPreferences, optionalFeatures: { darkMode: true } };
      repository.update.mockResolvedValue(updated);

      const result = await service.updateOptionalFeature('user-1', 'darkMode', true);

      expect(repository.update).toHaveBeenCalledWith('user-1', {
        optionalFeatures: { darkMode: true },
      });
    });

    it('should throw for invalid feature name', async () => {
      await expect(service.updateOptionalFeature('user-1', '', true)).rejects.toThrow(
        BusinessException
      );
    });

    it('should throw for too long feature name', async () => {
      const longName = 'a'.repeat(51);
      await expect(service.updateOptionalFeature('user-1', longName, true)).rejects.toThrow(
        BusinessException
      );
    });
  });

  describe('completeOnboarding', () => {
    it('should mark onboarding as completed', async () => {
      repository.findByUserId.mockResolvedValue(mockPreferences);
      const updated = { ...mockPreferences, onboardingCompleted: true };
      repository.update.mockResolvedValue(updated);

      const result = await service.completeOnboarding('user-1');

      expect(repository.update).toHaveBeenCalledWith('user-1', { onboardingCompleted: true });
      expect(result.onboardingCompleted).toBe(true);
    });
  });
});
