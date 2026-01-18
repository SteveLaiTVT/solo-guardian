import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshDto, LogoutDto, AuthResult } from './dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthResult: AuthResult = {
    user: {
      id: 'user-1',
      email: 'test@example.com',
      username: null,
      phone: null,
      avatar: null,
      name: 'Test User',
      role: 'user',
      createdAt: new Date('2025-01-01'),
    },
    tokens: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 900,
    },
  };

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };
      authService.register.mockResolvedValue(mockAuthResult);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const dto: LoginDto = {
        identifier: 'test@example.com',
        password: 'password123',
      };
      authService.login.mockResolvedValue(mockAuthResult);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const dto: RefreshDto = {
        refreshToken: 'old-refresh-token',
      };
      authService.refreshTokens.mockResolvedValue(mockAuthResult);

      const result = await controller.refresh(dto);

      expect(authService.refreshTokens).toHaveBeenCalledWith(dto.refreshToken);
      expect(result).toEqual(mockAuthResult);
    });
  });

  describe('logout', () => {
    it('should logout user', async () => {
      const dto: LogoutDto = {
        refreshToken: 'refresh-token',
      };
      authService.logout.mockResolvedValue(undefined);

      await controller.logout(dto);

      expect(authService.logout).toHaveBeenCalledWith(dto.refreshToken);
    });
  });
});
