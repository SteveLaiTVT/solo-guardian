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
 * Parse Redis URL into host and port
 * @param redisUrl - Redis connection URL
 * @returns Object with host and port
 */
function parseRedisUrl(redisUrl: string): { host: string; port: number } {
  const url = new URL(redisUrl);
  return {
    host: url.hostname,
    port: parseInt(url.port, 10) || 6379,
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
