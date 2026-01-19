import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { OAuthService } from './oauth.service';
import { AuthRepository } from '../auth.repository';
import { GoogleOAuthProvider } from './google-oauth.provider';
import { AppleOAuthProvider } from './apple-oauth.provider';
import { OAuthProvider } from './oauth.types';
import { createMockUser, resetUserIdCounter } from '../../../test/factories';

describe('OAuthService', () => {
  let service: OAuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let googleProvider: jest.Mocked<GoogleOAuthProvider>;
  let appleProvider: jest.Mocked<AppleOAuthProvider>;

  beforeEach(async () => {
    resetUserIdCounter();

    const mockAuthRepository = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      saveRefreshToken: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-token'),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('secret'),
    };

    const mockGoogleProvider = {
      isEnabled: jest.fn(),
      getAuthorizationUrl: jest.fn(),
      authenticate: jest.fn(),
    };

    const mockAppleProvider = {
      isEnabled: jest.fn(),
      getAuthorizationUrl: jest.fn(),
      authenticate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: GoogleOAuthProvider, useValue: mockGoogleProvider },
        { provide: AppleOAuthProvider, useValue: mockAppleProvider },
      ],
    }).compile();

    service = module.get<OAuthService>(OAuthService);
    authRepository = module.get(AuthRepository);
    jwtService = module.get(JwtService);
    googleProvider = module.get(GoogleOAuthProvider);
    appleProvider = module.get(AppleOAuthProvider);
  });

  describe('getEnabledProviders', () => {
    it('should return empty array when no providers enabled', () => {
      googleProvider.isEnabled.mockReturnValue(false);
      appleProvider.isEnabled.mockReturnValue(false);

      const result = service.getEnabledProviders();

      expect(result).toEqual([]);
    });

    it('should return google when google is enabled', () => {
      googleProvider.isEnabled.mockReturnValue(true);
      appleProvider.isEnabled.mockReturnValue(false);

      const result = service.getEnabledProviders();

      expect(result).toEqual([OAuthProvider.GOOGLE]);
    });

    it('should return both providers when both enabled', () => {
      googleProvider.isEnabled.mockReturnValue(true);
      appleProvider.isEnabled.mockReturnValue(true);

      const result = service.getEnabledProviders();

      expect(result).toEqual([OAuthProvider.GOOGLE, OAuthProvider.APPLE]);
    });
  });

  describe('isProviderEnabled', () => {
    it('should return true when provider is enabled', () => {
      googleProvider.isEnabled.mockReturnValue(true);
      appleProvider.isEnabled.mockReturnValue(false);

      expect(service.isProviderEnabled(OAuthProvider.GOOGLE)).toBe(true);
      expect(service.isProviderEnabled(OAuthProvider.APPLE)).toBe(false);
    });
  });

  describe('getAuthorizationUrl', () => {
    it('should return authorization URL for google', () => {
      googleProvider.isEnabled.mockReturnValue(true);
      googleProvider.getAuthorizationUrl.mockReturnValue('https://google.com/auth');

      const result = service.getAuthorizationUrl(OAuthProvider.GOOGLE, 'state123');

      expect(googleProvider.getAuthorizationUrl).toHaveBeenCalledWith('state123');
      expect(result).toBe('https://google.com/auth');
    });

    it('should throw when provider not enabled', () => {
      googleProvider.isEnabled.mockReturnValue(false);

      expect(() => service.getAuthorizationUrl(OAuthProvider.GOOGLE)).toThrow(
        UnauthorizedException
      );
    });
  });

  describe('authenticate', () => {
    const mockProfile = {
      providerId: 'google-123',
      email: 'test@example.com',
      name: 'Test User',
      provider: OAuthProvider.GOOGLE,
    };

    const callbackData = { code: 'auth-code', state: 'state123' };

    it('should authenticate existing user', async () => {
      googleProvider.isEnabled.mockReturnValue(true);
      googleProvider.authenticate.mockResolvedValue({
        profile: mockProfile,
        tokens: { accessToken: 'oauth-access', refreshToken: 'oauth-refresh' },
      });

      const existingUser = createMockUser({ email: mockProfile.email });
      authRepository.findByEmail.mockResolvedValue(existingUser);
      authRepository.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.authenticate(OAuthProvider.GOOGLE, callbackData);

      expect(result.isNewUser).toBe(false);
      expect(result.user.email).toBe(mockProfile.email);
      expect(result.tokens).toBeDefined();
    });

    it('should create new user when not exists', async () => {
      googleProvider.isEnabled.mockReturnValue(true);
      googleProvider.authenticate.mockResolvedValue({
        profile: mockProfile,
        tokens: { accessToken: 'oauth-access' },
      });

      authRepository.findByEmail.mockResolvedValue(null);
      const newUser = createMockUser({ email: mockProfile.email, name: mockProfile.name });
      authRepository.createUser.mockResolvedValue(newUser);
      authRepository.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.authenticate(OAuthProvider.GOOGLE, callbackData);

      expect(authRepository.createUser).toHaveBeenCalled();
      expect(result.isNewUser).toBe(true);
    });

    it('should throw when provider not enabled', async () => {
      googleProvider.isEnabled.mockReturnValue(false);

      await expect(
        service.authenticate(OAuthProvider.GOOGLE, callbackData)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw when profile has no email', async () => {
      googleProvider.isEnabled.mockReturnValue(true);
      googleProvider.authenticate.mockResolvedValue({
        profile: { ...mockProfile, email: null },
        tokens: { accessToken: 'token' },
      });

      await expect(
        service.authenticate(OAuthProvider.GOOGLE, callbackData)
      ).rejects.toThrow('OAuth provider did not return an email address');
    });
  });

  describe('linkAccount', () => {
    it('should link OAuth account to user', async () => {
      googleProvider.isEnabled.mockReturnValue(true);
      googleProvider.authenticate.mockResolvedValue({
        profile: { providerId: 'google-123', email: 'test@example.com', name: 'Test', provider: OAuthProvider.GOOGLE },
        tokens: { accessToken: 'token' },
      });

      const result = await service.linkAccount('user-1', OAuthProvider.GOOGLE, { code: 'code' });

      expect(result.success).toBe(true);
      expect(result.profile.email).toBe('test@example.com');
    });
  });

  describe('unlinkAccount', () => {
    it('should unlink OAuth account', async () => {
      const result = await service.unlinkAccount('user-1', OAuthProvider.GOOGLE);

      expect(result).toBe(true);
    });
  });
});
