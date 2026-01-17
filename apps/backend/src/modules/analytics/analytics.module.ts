/**
 * @file analytics.module.ts
 * @description Analytics module for event tracking
 * @task TASK-053
 * @design_state_version 3.8.0
 */
import { Module, Global } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ConsoleAnalyticsProvider } from './console-analytics.provider';
import { ANALYTICS_PROVIDER } from './analytics.interface';

@Global()
@Module({
  providers: [
    {
      provide: ANALYTICS_PROVIDER,
      useClass: ConsoleAnalyticsProvider,
    },
    AnalyticsService,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
