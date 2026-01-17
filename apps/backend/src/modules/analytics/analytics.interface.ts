/**
 * @file analytics.interface.ts
 * @description Analytics provider interface for event tracking
 * @task TASK-053
 * @design_state_version 3.8.0
 */

export type AnalyticsEventName =
  | 'user.login'
  | 'user.logout'
  | 'user.register'
  | 'checkin.completed'
  | 'checkin.missed'
  | 'settings.updated'
  | 'contact.added'
  | 'contact.removed'
  | 'contact.verified'
  | 'alert.triggered'
  | 'alert.resolved'
  | 'caregiver.invited'
  | 'caregiver.accepted'
  | 'caregiver.removed';

export interface AnalyticsEventProperties {
  userId?: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsProvider {
  trackEvent(
    eventName: AnalyticsEventName,
    properties?: AnalyticsEventProperties,
  ): Promise<void>;

  identifyUser(userId: string, traits?: Record<string, unknown>): Promise<void>;

  flush(): Promise<void>;
}

export const ANALYTICS_PROVIDER = 'ANALYTICS_PROVIDER';
