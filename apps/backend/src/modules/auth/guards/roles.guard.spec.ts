import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  function createMockContext(user?: { userId: string; role?: string }): ExecutionContext {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ user }),
      }),
    } as unknown as ExecutionContext;
  }

  describe('canActivate', () => {
    it('should allow access when no roles are required', () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);
      const context = createMockContext({ userId: 'user-1', role: 'user' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when roles array is empty', () => {
      reflector.getAllAndOverride.mockReturnValue([]);
      const context = createMockContext({ userId: 'user-1', role: 'user' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when no user in request', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin']);
      const context = createMockContext(undefined);

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should allow access when user has required role', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin']);
      const context = createMockContext({ userId: 'user-1', role: 'admin' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user does not have required role', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin']);
      const context = createMockContext({ userId: 'user-1', role: 'user' });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('should allow access when user has one of multiple required roles', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin', 'caregiver']);
      const context = createMockContext({ userId: 'user-1', role: 'caregiver' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should default to user role when role not specified', () => {
      reflector.getAllAndOverride.mockReturnValue(['user']);
      const context = createMockContext({ userId: 'user-1' });

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny when default role does not match required', () => {
      reflector.getAllAndOverride.mockReturnValue(['admin']);
      const context = createMockContext({ userId: 'user-1' });

      const result = guard.canActivate(context);

      expect(result).toBe(false);
    });
  });
});
