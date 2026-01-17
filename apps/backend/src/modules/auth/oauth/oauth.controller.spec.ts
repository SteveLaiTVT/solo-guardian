import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { OAuthProvider } from './oauth.types';

describe('OAuthController', () => {
  let controller: OAuthController;
  let oauthService: jest.Mocked<OAuthService>;

  beforeEach(async () => {
    const mockOAuthService = {
      getEnabledProviders: jest.fn(),
      isProviderEnabled: jest.fn(),
      getAuthorizationUrl: jest.fn(),
      authenticate: jest.fn(),
      linkAccount: jest.fn(),
      unlinkAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuthController],
      providers: [{ provide: OAuthService, useValue: mockOAuthService }],
    }).compile();

    controller = module.get<OAuthController>(OAuthController);
    oauthService = module.get(OAuthService);
  });

  function createMockResponse(): jest.Mocked<Response> {
    return {
      redirect: jest.fn(),
    } as unknown as jest.Mocked<Response>;
  }

  describe('getEnabledProviders', () => {
    it('should return list of enabled providers', () => {
      oauthService.getEnabledProviders.mockReturnValue([OAuthProvider.GOOGLE]);

      const result = controller.getEnabledProviders();

      expect(result).toEqual({ providers: [OAuthProvider.GOOGLE] });
    });
  });

  describe('initiateOAuth', () => {
    it('should redirect to OAuth provider', () => {
      const res = createMockResponse();
      oauthService.isProviderEnabled.mockReturnValue(true);
      oauthService.getAuthorizationUrl.mockReturnValue('https://google.com/auth');

      controller.initiateOAuth('google', {}, res);

      expect(res.redirect).toHaveBeenCalledWith('https://google.com/auth');
    });

    it('should throw BadRequestException for disabled provider', () => {
      const res = createMockResponse();
      oauthService.isProviderEnabled.mockReturnValue(false);

      expect(() => controller.initiateOAuth('google', {}, res)).toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException for unknown provider', () => {
      const res = createMockResponse();

      expect(() => controller.initiateOAuth('unknown', {}, res)).toThrow(
        BadRequestException
      );
    });
  });

  describe('handleCallback', () => {
    it('should authenticate and redirect on success', async () => {
      const res = createMockResponse();
      oauthService.authenticate.mockResolvedValue({
        profile: { providerId: 'g-1', email: 'test@example.com', name: 'Test', provider: OAuthProvider.GOOGLE },
        oauthTokens: { accessToken: 'oauth-token' },
        isNewUser: false,
        user: { id: 'user-1', email: 'test@example.com', name: 'Test', createdAt: new Date() },
        tokens: { accessToken: 'app-token', refreshToken: 'refresh', expiresIn: 900 },
      });

      await controller.handleCallback('google', { code: 'auth-code' }, res);

      expect(oauthService.authenticate).toHaveBeenCalledWith(OAuthProvider.GOOGLE, {
        code: 'auth-code',
        state: undefined,
      });
      expect(res.redirect).toHaveBeenCalled();
    });

    it('should redirect with error when OAuth returns error', async () => {
      const res = createMockResponse();

      await controller.handleCallback('google', { error: 'access_denied' }, res);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringContaining('error=access_denied')
      );
    });

    it('should throw when no code provided', async () => {
      const res = createMockResponse();

      await expect(controller.handleCallback('google', {}, res)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('handleCallbackPost', () => {
    it('should handle POST callback for Apple Sign In', async () => {
      const res = createMockResponse();
      oauthService.authenticate.mockResolvedValue({
        profile: { providerId: 'a-1', email: 'test@example.com', name: 'Test', provider: OAuthProvider.APPLE },
        oauthTokens: { accessToken: 'oauth-token' },
        isNewUser: true,
        user: { id: 'user-1', email: 'test@example.com', name: 'Test', createdAt: new Date() },
        tokens: { accessToken: 'app-token', refreshToken: 'refresh', expiresIn: 900 },
      });

      await controller.handleCallbackPost('apple', { code: 'auth-code' }, res);

      expect(oauthService.authenticate).toHaveBeenCalledWith(OAuthProvider.APPLE, {
        code: 'auth-code',
        state: undefined,
      });
    });
  });

  describe('linkAccount', () => {
    it('should link OAuth account to current user', async () => {
      oauthService.linkAccount.mockResolvedValue({
        success: true,
        profile: { providerId: 'g-1', email: 'test@example.com', name: 'Test', provider: OAuthProvider.GOOGLE },
      });

      const result = await controller.linkAccount(
        'google',
        { code: 'auth-code' },
        { userId: 'user-1' }
      );

      expect(result).toEqual({ success: true, provider: OAuthProvider.GOOGLE });
    });
  });

  describe('unlinkAccount', () => {
    it('should unlink OAuth account', async () => {
      oauthService.unlinkAccount.mockResolvedValue(true);

      const result = await controller.unlinkAccount('google', { userId: 'user-1' });

      expect(result).toEqual({ success: true });
    });
  });
});
