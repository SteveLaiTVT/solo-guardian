/**
 * @file Global Exception Filter
 * @description Catches all exceptions and formats them consistently
 * @task TASK-018
 * @design_state_version 1.6.1
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  ErrorCodes,
  ErrorCategory,
  ApiErrorResponse,
} from '@solo-guardian/types';
import { BusinessException } from '../exceptions/business.exception';

// DONE(B): Implement GlobalExceptionFilter
// - Use @Catch() decorator to catch all exceptions
// - Implement ExceptionFilter interface
// - Handle three types of exceptions:
//   1. BusinessException - already formatted, just return
//   2. HttpException - map to appropriate error code
//   3. Unknown errors - return SYSTEM_INTERNAL_ERROR
// - Log all errors (error level for 500+, warn level for 4xx)
// - Include request method and URL in logs

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let errorResponse: ApiErrorResponse;
    let status: number;

    // DONE(B): Handle BusinessException
    // - Check if exception instanceof BusinessException
    // - Get status from exception.getStatus()
    // - Get response from exception.getResponse() as ApiErrorResponse

    // DONE(B): Handle HttpException (NestJS built-in)
    // - Check if exception instanceof HttpException
    // - Get status from exception.getStatus()
    // - Map to appropriate error code using getErrorDefByStatus helper
    // - Format response to match ApiErrorResponse

    // DONE(B): Handle unknown errors
    // - Set status to 500
    // - Return SYSTEM_INTERNAL_ERROR
    // - Log stack trace at error level

    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as ApiErrorResponse;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = this.formatHttpException(exception);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = this.formatUnknownError(exception);

      // Log system errors for debugging
      this.logger.error(
        `Unhandled exception: ${exception}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    // DONE(B): Log all errors with appropriate level
    // - status >= 500 -> error level
    // - status < 500 -> warn level
    // - Format: [METHOD] URL - STATUS - CODE

    const logLevel = status >= 500 ? 'error' : 'warn';
    this.logger[logLevel](
      `[${request.method}] ${request.url} - ${status} - ${errorResponse.error.code}`,
    );

    response.status(status).json(errorResponse);
  }

  // DONE(B): Implement formatHttpException helper
  // - Map HTTP status to error code
  // - Format response to match ApiErrorResponse
  private formatHttpException(exception: HttpException): ApiErrorResponse {
    const status = exception.getStatus();
    const response = exception.getResponse();
    const errorDef = this.getErrorDefByStatus(status);

    return {
      success: false,
      error: {
        code: errorDef.code,
        category: errorDef.category,
        message:
          typeof response === 'string'
            ? response
            : ((response as Record<string, unknown>).message as string),
        i18nKey: errorDef.i18nKey,
        details:
          typeof response === 'object'
            ? (response as Record<string, unknown>)
            : undefined,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // DONE(B): Implement formatUnknownError helper
  // - Return SYSTEM_INTERNAL_ERROR response
  // - Do NOT expose internal error details
  private formatUnknownError(_exception: unknown): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: ErrorCodes.SYSTEM_INTERNAL_ERROR.code,
        category: ErrorCategory.SYSTEM,
        message: 'An unexpected error occurred',
        i18nKey: ErrorCodes.SYSTEM_INTERNAL_ERROR.i18nKey,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // DONE(B): Implement getErrorDefByStatus helper
  // - Map HTTP status codes to error definitions
  private getErrorDefByStatus(
    status: number,
  ): (typeof ErrorCodes)[keyof typeof ErrorCodes] {
    switch (status) {
      case 400:
        return ErrorCodes.VALIDATION_FAILED;
      case 401:
        return ErrorCodes.AUTH_TOKEN_INVALID;
      case 403:
        return ErrorCodes.AUTH_UNAUTHORIZED;
      case 404:
        return ErrorCodes.USER_NOT_FOUND;
      case 409:
        return ErrorCodes.USER_EMAIL_EXISTS;
      case 429:
        return ErrorCodes.SYSTEM_RATE_LIMITED;
      default:
        return ErrorCodes.SYSTEM_INTERNAL_ERROR;
    }
  }
}
