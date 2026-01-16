/**
 * @file queue.constants.ts
 * @description Queue Constants - Queue names and job types
 * @task TASK-024
 * @design_state_version 1.8.0
 */

/**
 * Queue Names
 * DONE(B): Defined queue name constants - TASK-024
 */
export const QUEUE_NAMES = {
  NOTIFICATION: 'notifications',
} as const;

/**
 * Job Types for Notification Queue
 * DONE(B): Defined job type constants - TASK-024
 */
export const NOTIFICATION_JOB_TYPES = {
  SEND_EMAIL: 'send-email',
  SEND_SMS: 'send-sms',
} as const;

/**
 * DONE(B): Defined SendEmailJobData interface - TASK-024
 * Data for email notification jobs
 */
export interface SendEmailJobData {
  notificationId: string;
  alertId: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  userName: string;
  alertDate: string;
  triggeredAt: string;
}

/**
 * DONE(B): Defined SendSmsJobData interface - TASK-024
 * Data for SMS notification jobs (future use)
 */
export interface SendSmsJobData {
  notificationId: string;
  alertId: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  userName: string;
  alertDate: string;
  triggeredAt: string;
}
