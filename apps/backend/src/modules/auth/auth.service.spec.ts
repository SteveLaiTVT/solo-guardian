import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { AnalyticsService } from '../analytics';
import { createMockUser, resetUserIdCounter } from '../../test/factories';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedpassword'),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let analyticsService: jest.Mocked<AnalyticsService>;

  beforeEach(async () => {
    resetUserIdCounter();

    const mockAuthRepository = {
      findByEmail: jest.fn(),
      findByIdentifier: jest.fn(),
      checkDuplicates: jest.fn(),
      createUser: jest.fn(),
      saveRefreshToken: jest.fn(),
      consumeRefreshToken: jest.fn(),
      deleteRefreshToken: jest.fn(),
    };

    const mockJwtService = {
      signAsync: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn(),
    };

    const mockAnalyticsService = {
      trackRegister: jest.fn(),
      trackLogin: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: AnalyticsService, useValue: mockAnalyticsService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    analyticsService = module.get(AnalyticsService);

    configService.get.mockImplementation((key: string) => {
      if (key === 'JWT_ACCESS_SECRET') return 'test-access-secret-32-chars-long';
      if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret-32-chars-long';
      return undefined;
    });

    jwtService.signAsync.mockResolvedValue('mock-token');
  });

  describe('onModuleInit', () => {
    it('should validate JWT secrets successfully', () => {
      expect(() => service.onModuleInit()).not.toThrow();
    });

    it('should throw error when JWT_ACCESS_SECRET is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return undefined;
        if (key === 'JWT_REFRESH_SECRET') return 'test-refresh-secret';
        return undefined;
      });

      expect(() => service.onModuleInit()).toThrow('JWT_ACCESS_SECRET is not configured');
    });

    it('should throw error when JWT_REFRESH_SECRET is missing', () => {
      configService.get.mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'test-access-secret';
        if (key === 'JWT_REFRESH_SECRET') return undefined;
        return undefined;
      });

      expect(() => service.onModuleInit()).toThrow('JWT_REFRESH_SECRET is not configured');
    });
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should register a new user successfully', async () => {
      const mockUser = createMockUser({
        email: registerDto.email,
        name: registerDto.name,
      });

      authRepository.checkDuplicates.mockResolvedValue({
        hasDuplicateEmail: false,
        hasDuplicateUsername: false,
        hasDuplicatePhone: false,
      });
      authRepository.createUser.mockResolvedValue(mockUser);
      authRepository.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.register(registerDto);

      expect(authRepository.checkDuplicates).toHaveBeenCalled();
      expect(authRepository.createUser).toHaveBeenCalled();
      expect(authRepository.saveRefreshToken).toHaveBeenCalled();
      expect(analyticsService.trackRegister).toHaveBeenCalledWith(mockUser.id);
      expect(result.user.email).toBe(registerDto.email);
      expect(result.tokens).toBeDefined();
    });

    it('should throw ConflictException when email already exists', async () => {
      authRepository.checkDuplicates.mockResolvedValue({
        hasDuplicateEmail: true,
        hasDuplicateUsername: false,
        hasDuplicatePhone: false,
      });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(authRepository.createUser).not.toHaveBeenCalled();
    });

    it('should handle race condition with unique constraint error', async () => {
      authRepository.checkDuplicates.mockResolvedValue({
        hasDuplicateEmail: false,
        hasDuplicateUsername: false,
        hasDuplicatePhone: false,
      });
      authRepository.createUser.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint', {
          code: 'P2002',
          clientVersion: '5.0.0',
        })
      );

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });

    it('should rethrow non-unique constraint errors', async () => {
      authRepository.checkDuplicates.mockResolvedValue({
        hasDuplicateEmail: false,
        hasDuplicateUsername: false,
        hasDuplicatePhone: false,
      });
      authRepository.createUser.mockRejectedValue(new Error('Database error'));

      await expect(service.register(registerDto)).rejects.toThrow('Database error');
    });
  });

  describe('login', () => {
    const loginDto = {
      identifier: 'test@example.com',
      password: 'password123',
    };

    it('should login user successfully', async () => {
      const mockUser = createMockUser({ email: loginDto.identifier });
      authRepository.findByIdentifier.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      authRepository.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.login(loginDto);

      expect(authRepository.findByIdentifier).toHaveBeenCalledWith(loginDto.identifier);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.passwordHash);
      expect(analyticsService.trackLogin).toHaveBeenCalledWith(mockUser.id);
      expect(result.user.email).toBe(loginDto.identifier);
      expect(result.tokens).toBeDefined();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      authRepository.findByIdentifier.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = createMockUser({ email: loginDto.identifier });
      authRepository.findByIdentifier.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens successfully', async () => {
      const mockUser = createMockUser();
      const { passwordHash: _, ...userWithoutPassword } = mockUser;
      const mockToken = {
        id: 'token-1',
        tokenHash: 'hash',
        userId: mockUser.id,
        expiresAt: new Date(Date.now() + 86400000),
        createdAt: new Date(),
        user: userWithoutPassword,
      };

      authRepository.consumeRefreshToken.mockResolvedValue(mockToken);
      authRepository.saveRefreshToken.mockResolvedValue(undefined);

      const result = await service.refreshTokens('old-refresh-token');

      expect(authRepository.consumeRefreshToken).toHaveBeenCalled();
      expect(authRepository.saveRefreshToken).toHaveBeenCalled();
      expect(result.user.id).toBe(mockUser.id);
      expect(result.tokens).toBeDefined();
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      authRepository.consumeRefreshToken.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('logout', () => {
    it('should delete refresh token on logout', async () => {
      authRepository.deleteRefreshToken.mockResolvedValue(undefined);

      await service.logout('refresh-token');

      expect(authRepository.deleteRefreshToken).toHaveBeenCalled();
    });
  });
});
