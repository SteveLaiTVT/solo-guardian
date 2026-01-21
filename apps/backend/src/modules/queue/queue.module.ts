/**
 * @file queue.module.ts
 * @description Queue Module - Bull queue infrastructure with Redis
 * @task TASK-024
 * @design_state_version 1.8.0
 */

import { Module } from '@nestjs/common';
// DONE(B): Import BullModule from @nestjs/bull - TASK-024
import { BullModule } from '@nestjs/bull';

/**
 * Parse Redis URL into connection config
 * @param redisUrl - Redis connection URL
 * @returns Object with host, port, and optional password
 */
function parseRedisUrl(redisUrl: string): { host: string; port: number; password?: string; username?: string } {
  const url = new URL(redisUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port, 10) || 6379,
    ...(url.password && { password: url.password }),
    ...(url.username && url.username !== 'default' && { username: url.username }),
  };
}

// DONE(B): Implemented QueueModule - TASK-024
@Module({
  imports: [
    // DONE(B): Configure BullModule.forRoot() with Redis and default job options
    BullModule.forRoot({
      redis: parseRedisUrl(process.env.REDIS_URL || 'redis://localhost:6379'),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false, // Keep failed jobs for debugging
      },
    }),
  ],
  exports: [
    // DONE(B): Export BullModule
    BullModule,
  ],
})
export class QueueModule {}
