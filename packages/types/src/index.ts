/**
 * @file index.ts
 * @description Main export file for @solo-guardian/types package
 * @task TASK-017
 * @design_state_version 1.6.0
 */

export {
  ErrorCategory,
  ErrorCodes,
  isUserError,
  getErrorCode,
  isApiError,
} from './errors.js';

export type {
  ErrorCodeDefinition,
  ErrorCodeKey,
  ApiErrorResponse,
  ApiSuccessResponse,
  ApiResponse,
} from './errors.js';
