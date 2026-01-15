/**
 * @file Business Exception
 * @description Custom exception for business logic errors with i18n support
 * @task TASK-018
 * @design_state_version 1.6.1
 */

import { HttpException } from '@nestjs/common';
import {
  ErrorCodes,
  ErrorCodeKey,
  ErrorCategory,
} from '@solo-guardian/types';

// TODO(B): Define options interface for BusinessException constructor
// interface BusinessExceptionOptions {
//   details?: Record<string, unknown>;
//   field?: string;
//   message?: string;
// }

// TODO(B): Implement BusinessException class
// - Extend HttpException
// - Accept errorCodeKey: ErrorCodeKey as first parameter
// - Accept optional options: BusinessExceptionOptions
// - Store errorCode, category, i18nKey, details, field as class properties
// - Format response body to match ApiErrorResponse interface
// - Call super() with formatted response and httpStatus from ErrorCodes

export class BusinessException extends HttpException {
  public readonly errorCode: string;
  public readonly category: ErrorCategory;
  public readonly i18nKey: string;
  public readonly details?: Record<string, unknown>;
  public readonly field?: string;

  constructor(
    errorCodeKey: ErrorCodeKey,
    options?: {
      details?: Record<string, unknown>;
      field?: string;
      message?: string;
    },
  ) {
    // TODO(B): Get error definition from ErrorCodes using errorCodeKey
    // TODO(B): Build response body matching ApiErrorResponse format:
    // {
    //   success: false,
    //   error: {
    //     code: errorDef.code,
    //     category: errorDef.category,
    //     message: options?.message ?? errorCodeKey,
    //     i18nKey: errorDef.i18nKey,
    //     details: options?.details,
    //     field: options?.field,
    //     timestamp: new Date().toISOString(),
    //   },
    // }
    // TODO(B): Call super(responseBody, errorDef.httpStatus)
    // TODO(B): Assign class properties

    // Placeholder implementation - replace with actual
    const errorDef = ErrorCodes[errorCodeKey];
    const message = options?.message ?? errorCodeKey;

    super(
      {
        success: false,
        error: {
          code: errorDef.code,
          category: errorDef.category,
          message,
          i18nKey: errorDef.i18nKey,
          details: options?.details,
          field: options?.field,
          timestamp: new Date().toISOString(),
        },
      },
      errorDef.httpStatus,
    );

    this.errorCode = errorDef.code;
    this.category = errorDef.category;
    this.i18nKey = errorDef.i18nKey;
    this.details = options?.details;
    this.field = options?.field;
  }
}
