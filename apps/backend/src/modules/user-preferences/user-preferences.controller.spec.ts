import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesController } from './user-preferences.controller';
import { UserPreferencesService } from './user-preferences.service';

describe('UserPreferencesController', () => {
  let controller: UserPreferencesController;
  let service: jest.Mocked<UserPreferencesService>;

  const mockPreferencesResponse = {
    id: 'pref-1',
    userId: 'user-1',
    preferFeaturesOn: true,
    theme: 'standard',
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
    const mockService = {
      getOrCreate: jest.fn(),
      update: jest.fn(),
      updateOptionalFeature: jest.fn(),
      completeOnboarding: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesController],
      providers: [
        { provide: UserPreferencesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UserPreferencesController>(UserPreferencesController);
    service = module.get(UserPreferencesService);
  });

  describe('getPreferences', () => {
    it('should return user preferences', async () => {
      service.getOrCreate.mockResolvedValue(mockPreferencesResponse);

      const result = await controller.getPreferences('user-1');

      expect(service.getOrCreate).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockPreferencesResponse);
    });

    it('should create preferences if not exists', async () => {
      service.getOrCreate.mockResolvedValue(mockPreferencesResponse);

      const result = await controller.getPreferences('new-user');

      expect(service.getOrCreate).toHaveBeenCalledWith('new-user');
      expect(result).toBeDefined();
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences', async () => {
      const updated = { ...mockPreferencesResponse, fontSize: 18 };
      service.update.mockResolvedValue(updated);

      const result = await controller.updatePreferences('user-1', { fontSize: 18 });

      expect(service.update).toHaveBeenCalledWith('user-1', { fontSize: 18 });
      expect(result.fontSize).toBe(18);
    });

    it('should update multiple preferences', async () => {
      const updated = {
        ...mockPreferencesResponse,
        highContrast: true,
        reducedMotion: true,
      };
      service.update.mockResolvedValue(updated);

      const result = await controller.updatePreferences('user-1', {
        highContrast: true,
        reducedMotion: true,
      });

      expect(result.highContrast).toBe(true);
      expect(result.reducedMotion).toBe(true);
    });
  });

  describe('toggleFeature', () => {
    it('should enable optional feature', async () => {
      const updated = {
        ...mockPreferencesResponse,
        optionalFeatures: { darkMode: true },
      };
      service.updateOptionalFeature.mockResolvedValue(updated);

      const result = await controller.toggleFeature('user-1', 'darkMode', true);

      expect(service.updateOptionalFeature).toHaveBeenCalledWith('user-1', 'darkMode', true);
      expect(result.optionalFeatures).toEqual({ darkMode: true });
    });

    it('should disable optional feature', async () => {
      const updated = {
        ...mockPreferencesResponse,
        optionalFeatures: { darkMode: false },
      };
      service.updateOptionalFeature.mockResolvedValue(updated);

      const result = await controller.toggleFeature('user-1', 'darkMode', false);

      expect(service.updateOptionalFeature).toHaveBeenCalledWith('user-1', 'darkMode', false);
      expect(result.optionalFeatures).toEqual({ darkMode: false });
    });
  });

  describe('completeOnboarding', () => {
    it('should mark onboarding as completed', async () => {
      const updated = { ...mockPreferencesResponse, onboardingCompleted: true };
      service.completeOnboarding.mockResolvedValue(updated);

      const result = await controller.completeOnboarding('user-1');

      expect(service.completeOnboarding).toHaveBeenCalledWith('user-1');
      expect(result.onboardingCompleted).toBe(true);
    });
  });
});
