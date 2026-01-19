import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:solo_guardian/core/errors/app_exception.dart';
import 'package:solo_guardian/core/utils/error_utils.dart';

void main() {
  group('ErrorUtils', () {
    group('extractError', () {
      test('extracts message and i18nKey from AppException', () {
        final exception = AppException(
          code: 'TEST_001',
          message: 'Test error',
          i18nKey: 'error.test',
        );

        final result = ErrorUtils.extractError(exception);

        expect(result.$1, 'Test error');
        expect(result.$2, 'error.test');
      });

      test('extracts AppException wrapped in DioException', () {
        final appException = AppException(
          code: 'TEST_002',
          message: 'Wrapped error',
          i18nKey: 'error.wrapped',
        );
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          error: appException,
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Wrapped error');
        expect(result.$2, 'error.wrapped');
      });

      test('returns rate limited error for 429 status', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          response: Response(
            requestOptions: RequestOptions(path: '/test'),
            statusCode: 429,
          ),
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Too many requests');
        expect(result.$2, 'error.system.rateLimited');
      });

      test('returns unavailable error for 503 status', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          response: Response(
            requestOptions: RequestOptions(path: '/test'),
            statusCode: 503,
          ),
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Service unavailable');
        expect(result.$2, 'error.system.unavailable');
      });

      test('returns internal error for 500 status', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          response: Response(
            requestOptions: RequestOptions(path: '/test'),
            statusCode: 500,
          ),
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Internal server error');
        expect(result.$2, 'error.system.internal');
      });

      test('returns internal error for 502 status', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          response: Response(
            requestOptions: RequestOptions(path: '/test'),
            statusCode: 502,
          ),
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Internal server error');
        expect(result.$2, 'error.system.internal');
      });

      test('returns unauthorized error for 401 status', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          response: Response(
            requestOptions: RequestOptions(path: '/test'),
            statusCode: 401,
          ),
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Unauthorized');
        expect(result.$2, 'error.auth.unauthorized');
      });

      test('returns network error for connection timeout', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          type: DioExceptionType.connectionTimeout,
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Network error');
        expect(result.$2, 'error.network.failed');
      });

      test('returns network error for receive timeout', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          type: DioExceptionType.receiveTimeout,
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Network error');
        expect(result.$2, 'error.network.failed');
      });

      test('returns network error for send timeout', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          type: DioExceptionType.sendTimeout,
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Network error');
        expect(result.$2, 'error.network.failed');
      });

      test('returns network error for connection error', () {
        final dioException = DioException(
          requestOptions: RequestOptions(path: '/test'),
          type: DioExceptionType.connectionError,
        );

        final result = ErrorUtils.extractError(dioException);

        expect(result.$1, 'Network error');
        expect(result.$2, 'error.network.failed');
      });

      test('returns toString with null i18nKey for unknown error', () {
        final error = Exception('Unknown error');

        final result = ErrorUtils.extractError(error);

        expect(result.$1, contains('Unknown error'));
        expect(result.$2, isNull);
      });
    });
  });
}
