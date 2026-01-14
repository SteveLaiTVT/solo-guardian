import { Injectable } from '@nestjs/common';
// TODO(B): Import PrismaService from '@/prisma/prisma.service'

/**
 * Repository for authentication-related database operations
 *
 * This layer handles all direct database access via Prisma.
 * Service layer should NEVER call Prisma directly.
 */
@Injectable()
export class AuthRepository {
  constructor(
    // TODO(B): Inject PrismaService
    // private readonly prisma: PrismaService,
  ) {}

  /**
   * Find user by email
   *
   * TODO(B): Implement this method
   * Requirements:
   * - Query user table by email
   * - Return full user record or null if not found
   *
   * Acceptance:
   * - Returns User | null
   * - Email lookup is case-insensitive
   *
   * Constraints:
   * - Use Prisma findUnique
   * - Include password hash in result (needed for login verification)
   */
  async findByEmail(email: string): Promise<unknown> {
    // TODO(B): Implement - return user or null
    throw new Error('Not implemented - TODO(B)');
  }

  /**
   * Find user by ID
   *
   * TODO(B): Implement this method
   * Requirements:
   * - Query user table by ID
   * - Return user without password hash
   *
   * Acceptance:
   * - Returns User | null
   * - Password hash is NOT included in result
   */
  async findById(id: string): Promise<unknown> {
    // TODO(B): Implement - return user without password
    throw new Error('Not implemented - TODO(B)');
  }

  /**
   * Create a new user
   *
   * TODO(B): Implement this method
   * Requirements:
   * - Insert user record with email, hashed password, and name
   * - Return the created user (without password hash)
   *
   * Acceptance:
   * - User record created in database
   * - Returns created user object
   *
   * Constraints:
   * - Password must already be hashed before calling this method
   * - Use Prisma create
   */
  async createUser(data: {
    email: string;
    passwordHash: string;
    name: string;
  }): Promise<unknown> {
    // TODO(B): Implement - create and return user
    throw new Error('Not implemented - TODO(B)');
  }

  /**
   * Store refresh token for user
   *
   * TODO(B): Implement this method
   * Requirements:
   * - Store hashed refresh token associated with user
   * - Include expiration timestamp
   * - Support multiple tokens per user (different devices)
   *
   * Acceptance:
   * - Token stored in database
   * - Can be retrieved later for validation
   */
  async saveRefreshToken(data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
  }): Promise<void> {
    // TODO(B): Implement - store refresh token
    throw new Error('Not implemented - TODO(B)');
  }

  /**
   * Find and validate refresh token
   *
   * TODO(B): Implement this method
   * Requirements:
   * - Find token by hash
   * - Check if expired
   * - Return associated user if valid
   *
   * Acceptance:
   * - Returns user if token valid and not expired
   * - Returns null if token invalid or expired
   */
  async findValidRefreshToken(tokenHash: string): Promise<unknown> {
    // TODO(B): Implement - find and validate token
    throw new Error('Not implemented - TODO(B)');
  }

  /**
   * Delete refresh token (for logout)
   *
   * TODO(B): Implement this method
   * Requirements:
   * - Remove specific refresh token
   *
   * Acceptance:
   * - Token removed from database
   */
  async deleteRefreshToken(tokenHash: string): Promise<void> {
    // TODO(B): Implement - delete token
    throw new Error('Not implemented - TODO(B)');
  }
}
