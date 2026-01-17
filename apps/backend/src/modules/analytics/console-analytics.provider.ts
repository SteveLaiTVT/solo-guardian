/**
 * @file console-analytics.provider.ts
 * @description Console-based analytics provider for development/logging
 * @task TASK-053
 * @design_state_version 3.8.0
 */
import { Injectable, Logger } from '@nestjs/common';
import {
  AnalyticsProvider,
  AnalyticsEventName,
  AnalyticsEventProperties,
} from './analytics.interface';

@Injectable()
export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  private readonly logger = new Logger('Analytics');

  async trackEvent(
    eventName: AnalyticsEventName,
    properties?: AnalyticsEventProperties,
  ): Promise<void> {
    const propsStr = properties ? JSON.stringify(properties) : '{}';
    this.logger.log(`[EVENT] ${eventName} ${propsStr}`);
  }

  async identifyUser(userId: string, traits?: Record<string, unknown>): Promise<void> {
    const traitsStr = traits ? JSON.stringify(traits) : '{}';
    this.logger.log(`[IDENTIFY] userId=${userId} traits=${traitsStr}`);
  }

  async flush(): Promise<void> {
    this.logger.log('[FLUSH] Analytics buffer flushed');
  }
}
