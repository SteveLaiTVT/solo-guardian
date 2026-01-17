import { User, UserStatus, UserRole } from '@prisma/client';

let userIdCounter = 1;

export function createMockUser(overrides: Partial<User> = {}): User {
  const id = `user-${userIdCounter++}`;
  return {
    id,
    email: `test${userIdCounter}@example.com`,
    passwordHash: '$2a$12$hashedpassword',
    name: 'Test User',
    role: 'user' as UserRole,
    status: 'active' as UserStatus,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

export function createMockUserWithoutPassword(overrides: Partial<Omit<User, 'passwordHash'>> = {}): Omit<User, 'passwordHash'> {
  const user = createMockUser(overrides);
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function resetUserIdCounter(): void {
  userIdCounter = 1;
}
