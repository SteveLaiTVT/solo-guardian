import 'dart:async';
import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';

class AuthInterceptor extends Interceptor {
  final Dio _dio;
  final SecureStorageService _storage;
  bool _isRefreshing = false;
  final List<_RequestRetry> _pendingRequests = [];

  AuthInterceptor({
    required Dio dio,
    required SecureStorageService storage,
  })  : _dio = dio,
        _storage = storage;

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (_shouldSkipAuth(options.path)) {
      return handler.next(options);
    }

    final accessToken = await _storage.getAccessToken();
    if (accessToken != null) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode != 401) {
      return handler.next(err);
    }

    if (_shouldSkipAuth(err.requestOptions.path)) {
      return handler.next(err);
    }

    if (_isRefreshing) {
      final completer = Completer<Response>();
      _pendingRequests.add(_RequestRetry(
        options: err.requestOptions,
        completer: completer,
      ));

      try {
        final response = await completer.future;
        return handler.resolve(response);
      } catch (e) {
        return handler.next(err);
      }
    }

    _isRefreshing = true;

    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null) {
        _clearAuthAndRejectPending();
        return handler.next(err);
      }

      final response = await _refreshTokens(refreshToken);

      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        final tokens = data['tokens'] as Map<String, dynamic>?;

        if (tokens != null) {
          await _storage.setTokens(
            accessToken: tokens['accessToken'] as String,
            refreshToken: tokens['refreshToken'] as String,
          );

          final retryResponse = await _retryRequest(err.requestOptions);
          _resolvePendingRequests();
          return handler.resolve(retryResponse);
        }
      }

      _clearAuthAndRejectPending();
      return handler.next(err);
    } catch (e) {
      _clearAuthAndRejectPending();
      return handler.next(err);
    } finally {
      _isRefreshing = false;
    }
  }

  bool _shouldSkipAuth(String path) {
    const skipPaths = [
      '/api/v1/auth/login',
      '/api/v1/auth/register',
      '/api/v1/auth/refresh',
      '/api/v1/verify-contact',
    ];
    return skipPaths.any((p) => path.contains(p));
  }

  Future<Response> _refreshTokens(String refreshToken) async {
    return _dio.post(
      '/api/v1/auth/refresh',
      data: {'refreshToken': refreshToken},
      options: Options(
        headers: {'Authorization': null},
      ),
    );
  }

  Future<Response> _retryRequest(RequestOptions options) async {
    final accessToken = await _storage.getAccessToken();
    options.headers['Authorization'] = 'Bearer $accessToken';
    return _dio.fetch(options);
  }

  void _resolvePendingRequests() async {
    for (final retry in _pendingRequests) {
      try {
        final response = await _retryRequest(retry.options);
        retry.completer.complete(response);
      } catch (e) {
        retry.completer.completeError(e);
      }
    }
    _pendingRequests.clear();
  }

  void _clearAuthAndRejectPending() async {
    await _storage.clearTokens();
    for (final retry in _pendingRequests) {
      retry.completer.completeError(
        DioException(
          requestOptions: retry.options,
          error: 'Session expired',
        ),
      );
    }
    _pendingRequests.clear();
  }
}

class _RequestRetry {
  final RequestOptions options;
  final Completer<Response> completer;

  _RequestRetry({
    required this.options,
    required this.completer,
  });
}
