/**
 * @file oauth-code.store.ts
 * @description In-memory store for OAuth authorization codes with TTL
 * @task TASK-095
 * @design_state_version 3.12.0
 */
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

interface OAuthCodeData {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  expiresAt: number;
}

const CODE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

@Injectable()
export class OAuthCodeStore {
  private readonly logger = new Logger(OAuthCodeStore.name);
  private readonly store = new Map<string, OAuthCodeData>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupJob();
  }

  /**
   * Generate a new authorization code and store token data
   */
  storeTokens(
    accessToken: string,
    refreshToken: string,
    isNewUser: boolean,
  ): string {
    const code = this.generateCode();
    const expiresAt = Date.now() + CODE_TTL_MS;

    this.store.set(code, {
      accessToken,
      refreshToken,
      isNewUser,
      expiresAt,
    });

    this.logger.debug(`Stored OAuth code, expires in ${CODE_TTL_MS / 1000}s`);
    return code;
  }

  /**
   * Retrieve and delete token data for a code (single-use)
   */
  exchangeCode(
    code: string,
  ): { accessToken: string; refreshToken: string; isNewUser: boolean } | null {
    const data = this.store.get(code);

    if (!data) {
      this.logger.warn('OAuth code not found or already used');
      return null;
    }

    if (Date.now() > data.expiresAt) {
      this.store.delete(code);
      this.logger.warn('OAuth code expired');
      return null;
    }

    this.store.delete(code);
    this.logger.debug('OAuth code exchanged successfully');

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      isNewUser: data.isNewUser,
    };
  }

  /**
   * Generate a cryptographically secure authorization code
   */
  private generateCode(): string {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Start periodic cleanup of expired codes
   */
  private startCleanupJob(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredCodes();
    }, CLEANUP_INTERVAL_MS);
  }

  /**
   * Remove expired codes from store
   */
  private cleanupExpiredCodes(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [code, data] of this.store.entries()) {
      if (now > data.expiresAt) {
        this.store.delete(code);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.debug(`Cleaned up ${cleaned} expired OAuth codes`);
    }
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.store.clear();
  }
}
