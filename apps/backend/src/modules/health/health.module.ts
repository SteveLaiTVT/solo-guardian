/**
 * @file health.module.ts
 * @description Health check module for monitoring and E2E tests
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
