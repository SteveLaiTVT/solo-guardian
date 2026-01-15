/**
 * @file Error Handler
 * @description Parse API errors into structured format
 * @task TASK-019
 * @design_state_version 1.6.1
 */

import {
  ApiErrorResponse,
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

// TODO(B): Implement parseApiError function
// - Handle network errors (no response from server)
// - Handle Axios errors with ApiErrorResponse
// - Handle unknown error formats
// - Return ParsedError structure

/**
 * Parse API error response into a structured format
 */
export function parseApiError(error: unknown): ParsedError {
  // TODO(B): Check for network error
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

  // TODO(B): Check for Axios error with response
  // - If error has response.data with ApiErrorResponse structure
  // - Extract error info and return ParsedError

  // Axios error with response
  if (isAxiosError(error) && error.response?.data) {
    const apiError = error.response.data as ApiErrorResponse;

    if (apiError.error) {
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
  }

  // TODO(B): Handle unknown error format
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

// TODO(B): Implement isAxiosError type guard
function isAxiosError(
  error: unknown,
): error is { response?: { data?: unknown } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
