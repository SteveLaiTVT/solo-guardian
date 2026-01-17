/**
 * @file analytics.service.ts
 * @description Analytics service facade for event tracking
 * @task TASK-053
 * @design_state_version 3.8.0
 */
import { Injectable, Inject } from '@nestjs/common';
import {
  AnalyticsProvider,
  AnalyticsEventName,
  AnalyticsEventProperties,
  ANALYTICS_PROVIDER,
} from './analytics.interface';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(ANALYTICS_PROVIDER)
    private readonly provider: AnalyticsProvider,
  ) {}

  async trackEvent(
    eventName: AnalyticsEventName,
    properties?: AnalyticsEventProperties,
  ): Promise<void> {
    try {
      await this.provider.trackEvent(eventName, properties);
    } catch {
      // Analytics should never break the app
    }
  }

  async identifyUser(userId: string, traits?: Record<string, unknown>): Promise<void> {
    try {
      await this.provider.identifyUser(userId, traits);
    } catch {
      // Analytics should never break the app
    }
  }

  async flush(): Promise<void> {
    try {
      await this.provider.flush();
    } catch {
      // Analytics should never break the app
    }
  }

  async trackLogin(userId: string): Promise<void> {
    await this.trackEvent('user.login', { userId });
  }

  async trackLogout(userId: string): Promise<void> {
    await this.trackEvent('user.logout', { userId });
  }

  async trackRegister(userId: string): Promise<void> {
    await this.trackEvent('user.register', { userId });
  }

  async trackCheckIn(userId: string, date: string): Promise<void> {
    await this.trackEvent('checkin.completed', { userId, date });
  }

  async trackMissedCheckIn(userId: string, date: string): Promise<void> {
    await this.trackEvent('checkin.missed', { userId, date });
  }

  async trackSettingsUpdated(userId: string, settingType: string): Promise<void> {
    await this.trackEvent('settings.updated', { userId, settingType });
  }

  async trackContactAdded(userId: string, contactId: string): Promise<void> {
    await this.trackEvent('contact.added', { userId, contactId });
  }

  async trackContactRemoved(userId: string, contactId: string): Promise<void> {
    await this.trackEvent('contact.removed', { userId, contactId });
  }

  async trackContactVerified(userId: string, contactId: string): Promise<void> {
    await this.trackEvent('contact.verified', { userId, contactId });
  }

  async trackAlertTriggered(userId: string, alertId: string): Promise<void> {
    await this.trackEvent('alert.triggered', { userId, alertId });
  }

  async trackAlertResolved(userId: string, alertId: string): Promise<void> {
    await this.trackEvent('alert.resolved', { userId, alertId });
  }

  async trackCaregiverInvited(caregiverId: string, elderId: string): Promise<void> {
    await this.trackEvent('caregiver.invited', { userId: caregiverId, elderId });
  }

  async trackCaregiverAccepted(elderId: string, caregiverId: string): Promise<void> {
    await this.trackEvent('caregiver.accepted', { userId: elderId, caregiverId });
  }

  async trackCaregiverRemoved(userId: string, relationId: string): Promise<void> {
    await this.trackEvent('caregiver.removed', { userId, relationId });
  }
}
