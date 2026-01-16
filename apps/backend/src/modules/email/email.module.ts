// ============================================================
// Email Module - Email sending infrastructure
// @task TASK-025
// @design_state_version 1.8.0
// ============================================================

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

/**
 * Email Module - Provides email sending capabilities
 *
 * TODO(B): Complete module setup
 * Requirements:
 * - Provide EmailService
 * - Export EmailService for use by other modules
 *
 * Acceptance:
 * - Module loads without errors
 * - EmailService can be injected in other modules
 */
@Module({
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
