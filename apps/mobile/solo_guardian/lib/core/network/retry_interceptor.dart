import 'dart:async';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class RetryInterceptor extends Interceptor {
  final Dio dio;
  final int maxRetries;
  final Duration baseDelay;

  RetryInterceptor({
    required this.dio,
    this.maxRetries = 3,
    this.baseDelay = const Duration(milliseconds: 500),
  });

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final statusCode = err.response?.statusCode;

    // Only retry on 429 (rate limit) or 503 (service unavailable)
    if (statusCode != 429 && statusCode != 503) {
      return handler.next(err);
    }

    final retryCount = err.requestOptions.extra['retryCount'] ?? 0;

    if (retryCount >= maxRetries) {
      debugPrint('RetryInterceptor: Max retries ($maxRetries) reached for ${err.requestOptions.path}');
      return handler.next(err);
    }

    // Calculate delay with exponential backoff
    final delay = baseDelay * (1 << retryCount);

    // Check for Retry-After header
    final retryAfterHeader = err.response?.headers.value('retry-after');
    final retryAfterDelay = retryAfterHeader != null
        ? Duration(seconds: int.tryParse(retryAfterHeader) ?? delay.inSeconds)
        : delay;

    debugPrint('RetryInterceptor: 429 received for ${err.requestOptions.path}, '
        'retry ${retryCount + 1}/$maxRetries after ${retryAfterDelay.inMilliseconds}ms');

    await Future<void>.delayed(retryAfterDelay);

    // Clone request with incremented retry count
    final options = Options(
      method: err.requestOptions.method,
      headers: err.requestOptions.headers,
      extra: {
        ...err.requestOptions.extra,
        'retryCount': retryCount + 1,
      },
    );

    try {
      final response = await dio.request<dynamic>(
        err.requestOptions.path,
        data: err.requestOptions.data,
        queryParameters: err.requestOptions.queryParameters,
        options: options,
      );
      return handler.resolve(response);
    } on DioException catch (e) {
      return handler.next(e);
    }
  }
}
