/**
 * @file errors.ts
 * @description Shared error codes, categories, and types for Solo Guardian
 * @task TASK-017
 * @design_state_version 1.6.0
 */

/**
 * Error categories for classification
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION',
  AUTH = 'AUTH',
  BUSINESS = 'BUSINESS',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  RATE_LIMIT = 'RATE_LIMIT',
  SYSTEM = 'SYSTEM',
}

/**
 * Error code definition structure
 */
export interface ErrorCodeDefinition {
  code: string;
  category: ErrorCategory;
  httpStatus: number;
  i18nKey: string;
}

/**
 * All error codes with their definitions
 */
export const ErrorCodes = {
  // Auth errors (1xxx)
  AUTH_INVALID_CREDENTIALS: {
    code: 'AUTH_1001',
    category: ErrorCategory.AUTH,
    httpStatus: 401,
    i18nKey: 'error.auth.invalidCredentials',
  },
  AUTH_TOKEN_EXPIRED: {
    code: 'AUTH_1002',
    category: ErrorCategory.AUTH,
    httpStatus: 401,
    i18nKey: 'error.auth.tokenExpired',
  },
  AUTH_TOKEN_INVALID: {
    code: 'AUTH_1003',
    category: ErrorCategory.AUTH,
    httpStatus: 401,
    i18nKey: 'error.auth.tokenInvalid',
  },
  AUTH_UNAUTHORIZED: {
    code: 'AUTH_1004',
    category: ErrorCategory.AUTH,
    httpStatus: 403,
    i18nKey: 'error.auth.unauthorized',
  },

  // Validation errors (2xxx)
  VALIDATION_FAILED: {
    code: 'VAL_2001',
    category: ErrorCategory.VALIDATION,
    httpStatus: 400,
    i18nKey: 'error.validation.failed',
  },
  VALIDATION_EMAIL_INVALID: {
    code: 'VAL_2002',
    category: ErrorCategory.VALIDATION,
    httpStatus: 400,
    i18nKey: 'error.validation.emailInvalid',
  },
  VALIDATION_REQUIRED_FIELD: {
    code: 'VAL_2003',
    category: ErrorCategory.VALIDATION,
    httpStatus: 400,
    i18nKey: 'error.validation.requiredField',
  },

  // User errors (3xxx)
  USER_NOT_FOUND: {
    code: 'USER_3001',
    category: ErrorCategory.NOT_FOUND,
    httpStatus: 404,
    i18nKey: 'error.user.notFound',
  },
  USER_EMAIL_EXISTS: {
    code: 'USER_3002',
    category: ErrorCategory.CONFLICT,
    httpStatus: 409,
    i18nKey: 'error.user.emailExists',
  },

  // Contact errors (4xxx)
  CONTACT_NOT_FOUND: {
    code: 'CONTACT_4001',
    category: ErrorCategory.NOT_FOUND,
    httpStatus: 404,
    i18nKey: 'error.contact.notFound',
  },
  CONTACT_LIMIT_REACHED: {
    code: 'CONTACT_4002',
    category: ErrorCategory.BUSINESS,
    httpStatus: 400,
    i18nKey: 'error.contact.limitReached',
  },
  CONTACT_EMAIL_EXISTS: {
    code: 'CONTACT_4003',
    category: ErrorCategory.CONFLICT,
    httpStatus: 409,
    i18nKey: 'error.contact.emailExists',
  },

  // Check-in errors (5xxx)
  CHECKIN_ALREADY_TODAY: {
    code: 'CHECKIN_5001',
    category: ErrorCategory.BUSINESS,
    httpStatus: 400,
    i18nKey: 'error.checkin.alreadyToday',
  },
  CHECKIN_SETTINGS_NOT_FOUND: {
    code: 'CHECKIN_5002',
    category: ErrorCategory.NOT_FOUND,
    httpStatus: 404,
    i18nKey: 'error.checkin.settingsNotFound',
  },

  // Preferences errors (6xxx)
  PREFERENCES_NOT_FOUND: {
    code: 'PREF_6001',
    category: ErrorCategory.NOT_FOUND,
    httpStatus: 404,
    i18nKey: 'error.preferences.notFound',
  },
  PREFERENCES_INVALID_FEATURE: {
    code: 'PREF_6002',
    category: ErrorCategory.BUSINESS,
    httpStatus: 400,
    i18nKey: 'error.preferences.invalidFeature',
  },

  // System errors (9xxx)
  SYSTEM_INTERNAL_ERROR: {
    code: 'SYS_9001',
    category: ErrorCategory.SYSTEM,
    httpStatus: 500,
    i18nKey: 'error.system.internal',
  },
  SYSTEM_SERVICE_UNAVAILABLE: {
    code: 'SYS_9002',
    category: ErrorCategory.SYSTEM,
    httpStatus: 503,
    i18nKey: 'error.system.unavailable',
  },
  SYSTEM_RATE_LIMITED: {
    code: 'SYS_9003',
    category: ErrorCategory.RATE_LIMIT,
    httpStatus: 429,
    i18nKey: 'error.system.rateLimited',
  },
} as const;

/**
 * Type for error code keys (e.g., "AUTH_INVALID_CREDENTIALS")
 */
export type ErrorCodeKey = keyof typeof ErrorCodes;

/**
 * API error response structure returned by backend
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    category: ErrorCategory;
    message: string;
    i18nKey: string;
    details?: Record<string, unknown>;
    field?: string;
    timestamp: string;
  };
}

/**
 * API success response structure
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Union type for API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Check if an error category represents a user-caused error
 * User errors should show friendly messages, system errors should show generic messages
 */
export function isUserError(category: ErrorCategory): boolean {
  const userErrorCategories: ErrorCategory[] = [
    ErrorCategory.VALIDATION,
    ErrorCategory.AUTH,
    ErrorCategory.BUSINESS,
    ErrorCategory.CONFLICT,
  ];
  return userErrorCategories.includes(category);
}

/**
 * Get error code definition by key
 */
export function getErrorCode(key: ErrorCodeKey): ErrorCodeDefinition {
  return ErrorCodes[key];
}

/**
 * Check if a response is an error response
 */
export function isApiError(response: ApiResponse<unknown>): response is ApiErrorResponse {
  return response.success === false;
}
