// ============================================================
// Queue Constants - Queue names and job types
// @task TASK-024
// @design_state_version 1.8.0
// ============================================================

/**
 * Queue Names
 *
 * TODO(B): Define queue name constants
 * Requirements:
 * - NOTIFICATION_QUEUE: 'notifications' - for notification jobs
 *
 * Usage:
 * - Use these constants when registering queues in modules
 * - Use these constants when adding jobs to queues
 */
export const QUEUE_NAMES = {
  // TODO(B): Add NOTIFICATION queue name
  NOTIFICATION: 'notifications',
} as const;

/**
 * Job Types for Notification Queue
 *
 * TODO(B): Define job type constants
 * Requirements:
 * - SEND_EMAIL: 'send-email' - job type for sending email notifications
 * - SEND_SMS: 'send-sms' - job type for SMS (future)
 */
export const NOTIFICATION_JOB_TYPES = {
  // TODO(B): Add job type constants
  SEND_EMAIL: 'send-email',
  SEND_SMS: 'send-sms',
} as const;

/**
 * Job Data Types
 *
 * TODO(B): Define TypeScript interfaces for job data
 */

// TODO(B): Define SendEmailJobData interface
// Requirements:
// - notificationId: string - FK to Notification record
// - alertId: string - FK to Alert record
// - contactId: string - FK to EmergencyContact
// - contactName: string - Contact's name
// - contactEmail: string - Contact's email address
// - userName: string - User's name (who missed check-in)
// - alertDate: string - Date of missed check-in (YYYY-MM-DD)
// - triggeredAt: string - ISO timestamp when alert triggered
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

// TODO(B): Define SendSmsJobData interface (for future use)
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
