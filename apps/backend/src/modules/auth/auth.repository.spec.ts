import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AuthRepository } from './auth.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { createMockUser, resetUserIdCounter } from '../../test/factories';

describe('AuthRepository', () => {
  let repository: AuthRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    resetUserIdCounter();

    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      refreshToken: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<AuthRepository>(AuthRepository);
    prisma = module.get(PrismaService);
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockUser = createMockUser({ email: 'test@example.com' });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should normalize email to lowercase', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await repository.findByEmail('TEST@EXAMPLE.COM');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id without password', async () => {
      const mockUser = createMockUser();
      const { passwordHash: _, ...userWithoutPassword } = mockUser;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userWithoutPassword);

      const result = await repository.findById(mockUser.id);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          phone: true,
          avatar: true,
          birthYear: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(userWithoutPassword);
    });

    it('should return null when user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUser = createMockUser({
        email: 'new@example.com',
        name: 'New User',
      });
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await repository.createUser({
        email: 'new@example.com',
        passwordHash: 'hashedpassword',
        name: 'New User',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          passwordHash: 'hashedpassword',
          name: 'New User',
          username: null,
          phone: null,
        },
      });
      expect(result).toEqual(mockUser);
      expect(result.passwordHash).toBeDefined();
    });

    it('should normalize email to lowercase', async () => {
      const mockUser = createMockUser({ email: 'new@example.com' });
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      await repository.createUser({
        email: 'NEW@EXAMPLE.COM',
        passwordHash: 'hashedpassword',
        name: 'New User',
      });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'new@example.com',
          passwordHash: 'hashedpassword',
          name: 'New User',
          username: null,
          phone: null,
        },
      });
    });
  });

  describe('saveRefreshToken', () => {
    it('should save a refresh token', async () => {
      const tokenData = {
        userId: 'user-1',
        tokenHash: 'tokenhash123',
        expiresAt: new Date('2025-01-08'),
      };
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({
        id: 'token-1',
        ...tokenData,
      });

      await repository.saveRefreshToken(tokenData);

      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: tokenData,
      });
    });
  });

  describe('findValidRefreshToken', () => {
    it('should find a valid refresh token with user', async () => {
      const mockUser = createMockUser();
      const { passwordHash: _, ...userWithoutPassword } = mockUser;
      const tokenHash = 'validtokenhash';
      const futureDate = new Date(Date.now() + 86400000);

      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        tokenHash,
        userId: mockUser.id,
        expiresAt: futureDate,
        createdAt: new Date(),
        user: userWithoutPassword,
      });

      const result = await repository.findValidRefreshToken(tokenHash);

      expect(result).toBeDefined();
      expect(result?.user).toEqual(userWithoutPassword);
    });

    it('should return null for expired token', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue({
        id: 'token-1',
        tokenHash: 'expiredtoken',
        expiresAt: pastDate,
        user: createMockUser(),
      });

      const result = await repository.findValidRefreshToken('expiredtoken');

      expect(result).toBeNull();
    });

    it('should return null when token not found', async () => {
      (prisma.refreshToken.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findValidRefreshToken('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete refresh token by hash', async () => {
      (prisma.refreshToken.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });

      await repository.deleteRefreshToken('tokenhash123');

      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { tokenHash: 'tokenhash123' },
      });
    });
  });

  describe('consumeRefreshToken', () => {
    it('should atomically consume a valid refresh token', async () => {
      const mockUser = createMockUser();
      const { passwordHash: _, ...userWithoutPassword } = mockUser;
      const futureDate = new Date(Date.now() + 86400000);

      (prisma.refreshToken.delete as jest.Mock).mockResolvedValue({
        id: 'token-1',
        tokenHash: 'validtoken',
        userId: mockUser.id,
        expiresAt: futureDate,
        createdAt: new Date(),
        user: userWithoutPassword,
      });

      const result = await repository.consumeRefreshToken('validtoken');

      expect(prisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { tokenHash: 'validtoken' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              username: true,
              phone: true,
              role: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      expect(result).toBeDefined();
    });

    it('should return null for expired token after consumption', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      (prisma.refreshToken.delete as jest.Mock).mockResolvedValue({
        id: 'token-1',
        tokenHash: 'expiredtoken',
        expiresAt: pastDate,
        user: createMockUser(),
      });

      const result = await repository.consumeRefreshToken('expiredtoken');

      expect(result).toBeNull();
    });

    it('should return null when token not found (P2025 error)', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '5.0.0' }
      );
      (prisma.refreshToken.delete as jest.Mock).mockRejectedValue(prismaError);

      const result = await repository.consumeRefreshToken('nonexistent');

      expect(result).toBeNull();
    });

    it('should rethrow non-P2025 errors', async () => {
      const dbError = new Error('Database connection failed');
      (prisma.refreshToken.delete as jest.Mock).mockRejectedValue(dbError);

      await expect(repository.consumeRefreshToken('token')).rejects.toThrow(
        'Database connection failed'
      );
    });
  });
});
