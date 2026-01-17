import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('test-secret-32-characters-long'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return user object from JWT payload', () => {
      const payload = { sub: 'user-123', role: 'admin' as const };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        role: 'admin',
      });
    });

    it('should default role to user when not specified', () => {
      const payload = { sub: 'user-123' };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        role: 'user',
      });
    });

    it('should handle caregiver role', () => {
      const payload = { sub: 'user-123', role: 'caregiver' as const };

      const result = strategy.validate(payload);

      expect(result).toEqual({
        userId: 'user-123',
        role: 'caregiver',
      });
    });
  });
});
