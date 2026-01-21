/**
 * @file Error Handler
 * @description Parse API errors into structured format
 * @task TASK-019
 * @design_state_version 1.6.1
 */

import {
  type ApiErrorResponse,
  ErrorCategory,
  isUserError,
} from '@solo-guardian/types';

/**
 * Parsed error structure for frontend consumption
 */
export interface ParsedError {
  code: string;
  category: ErrorCategory;
  i18nKey: string;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
  isUserError: boolean;
  isNetworkError: boolean;
}

// DONE(B): Implement parseApiError function
// - Handle network errors (no response from server)
// - Handle Axios errors with ApiErrorResponse
// - Handle unknown error formats
// - Return ParsedError structure

/**
 * Parse API error response into a structured format
 */
export function parseApiError(error: unknown): ParsedError {
  // DONE(B): Check for network error
  // - If error is Error and doesn't have 'response' property
  // - Return network error ParsedError

  // Check for network error (no response from server)
  if (error instanceof Error && !('response' in error)) {
    return {
      code: 'NETWORK_ERROR',
      category: ErrorCategory.SYSTEM,
      i18nKey: 'error.network.failed',
      message: 'Network connection failed',
      isUserError: false,
      isNetworkError: true,
    };
  }

  // DONE(B): Check for Axios error with response
  // - If error has response.data with ApiErrorResponse structure
  // - Extract error info and return ParsedError

  // Axios error with response
  if (isAxiosError(error) && error.response) {
    const apiError = error.response.data as ApiErrorResponse;

    // Handle structured API error response
    if (apiError?.error) {
      return {
        code: apiError.error.code,
        category: apiError.error.category,
        i18nKey: apiError.error.i18nKey,
        message: apiError.error.message,
        field: apiError.error.field,
        details: apiError.error.details,
        isUserError: isUserError(apiError.error.category),
        isNetworkError: false,
      };
    }

    // Handle HTTP status codes without structured error response
    const status = error.response.status;
    if (status !== undefined) {
      const statusError = parseHttpStatus(status);
      if (statusError) {
        return statusError;
      }
    }
  }

  // DONE(B): Handle unknown error format
  // - Return generic system error ParsedError

  // Unknown error format
  return {
    code: 'UNKNOWN_ERROR',
    category: ErrorCategory.SYSTEM,
    i18nKey: 'error.system.unknown',
    message: 'An unexpected error occurred',
    isUserError: false,
    isNetworkError: false,
  };
}

// DONE(B): Implement isAxiosError type guard
function isAxiosError(
  error: unknown,
): error is { response?: { data?: unknown; status?: number } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

/**
 * Parse HTTP status codes into user-friendly errors
 */
function parseHttpStatus(status: number): ParsedError | null {
  switch (status) {
    case 400:
      return {
        code: 'BAD_REQUEST',
        category: ErrorCategory.VALIDATION,
        i18nKey: 'error.validation.failed',
        message: 'Invalid request',
        isUserError: true,
        isNetworkError: false,
      };
    case 401:
      return {
        code: 'UNAUTHORIZED',
        category: ErrorCategory.AUTH,
        i18nKey: 'error.auth.unauthorized',
        message: 'Authentication required',
        isUserError: true,
        isNetworkError: false,
      };
    case 403:
      return {
        code: 'FORBIDDEN',
        category: ErrorCategory.AUTH,
        i18nKey: 'error.auth.unauthorized',
        message: 'Access denied',
        isUserError: true,
        isNetworkError: false,
      };
    case 404:
      return {
        code: 'NOT_FOUND',
        category: ErrorCategory.NOT_FOUND,
        i18nKey: 'error.user.notFound',
        message: 'Resource not found',
        isUserError: true,
        isNetworkError: false,
      };
    case 429:
      return {
        code: 'RATE_LIMITED',
        category: ErrorCategory.SYSTEM,
        i18nKey: 'error.system.rateLimited',
        message: 'Too many requests',
        isUserError: false,
        isNetworkError: false,
      };
    case 500:
      return {
        code: 'INTERNAL_ERROR',
        category: ErrorCategory.SYSTEM,
        i18nKey: 'error.system.internal',
        message: 'Internal server error',
        isUserError: false,
        isNetworkError: false,
      };
    case 502:
    case 503:
    case 504:
      return {
        code: 'SERVICE_UNAVAILABLE',
        category: ErrorCategory.SYSTEM,
        i18nKey: 'error.system.unavailable',
        message: 'Service unavailable',
        isUserError: false,
        isNetworkError: false,
      };
    default:
      return null;
  }
}
