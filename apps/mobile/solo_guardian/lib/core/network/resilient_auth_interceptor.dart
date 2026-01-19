/**
 * @file resilient_auth_interceptor.dart
 * @description Auth interceptor with offline resilience and retry queue
 * @task TASK-107
 * @design_state_version 3.13.0
 */
import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import '../storage/secure_storage.dart';
import 'connectivity_service.dart';

typedef AuthStateCallback = void Function(AuthRefreshState state);

enum AuthRefreshState {
  refreshing,
  refreshSuccess,
  refreshFailedNetwork,
  refreshFailedExpired,
}

class ResilientAuthInterceptor extends QueuedInterceptor {
  final Dio _dio;
  final SecureStorageService _storage;
  final ConnectivityService _connectivityService;
  final AuthStateCallback? _onAuthStateChanged;

  bool _isRefreshing = false;
  final List<_RequestRetry> _pendingRequests = [];
  final List<_OfflineRequest> _offlineQueue = [];

  static const int maxOfflineQueueSize = 50;
  static const Duration offlineRetryDelay = Duration(seconds: 5);

  ResilientAuthInterceptor({
    required Dio dio,
    required SecureStorageService storage,
    required ConnectivityService connectivityService,
    AuthStateCallback? onAuthStateChanged,
  })  : _dio = dio,
        _storage = storage,
        _connectivityService = connectivityService,
        _onAuthStateChanged = onAuthStateChanged {
    _connectivityService.addOnConnectedCallback(_processOfflineQueue);
  }

  @override
  Future<void> onRequest(
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

    options.extra['_retryCount'] = options.extra['_retryCount'] ?? 0;

    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (_isNetworkError(err)) {
      return _handleNetworkError(err, handler);
    }

    if (err.response?.statusCode != 401) {
      return handler.next(err);
    }

    if (_shouldSkipAuth(err.requestOptions.path)) {
      return handler.next(err);
    }

    if (_isRefreshing) {
      final completer = Completer<Response>();
      _pendingRequests.add(
        _RequestRetry(options: err.requestOptions, completer: completer),
      );

      try {
        final response = await completer.future;
        return handler.resolve(response);
      } catch (e) {
        return handler.next(err);
      }
    }

    _isRefreshing = true;
    _onAuthStateChanged?.call(AuthRefreshState.refreshing);

    try {
      final refreshToken = await _storage.getRefreshToken();
      if (refreshToken == null) {
        _onAuthStateChanged?.call(AuthRefreshState.refreshFailedExpired);
        _clearAuthAndRejectPending();
        return handler.next(err);
      }

      final response = await _refreshTokens(refreshToken);

      if (response.statusCode == 200) {
        final data = response.data as Map<String, dynamic>;
        final tokensSource = data['data'] ?? data;
        if (tokensSource is Map<String, dynamic>) {
          final tokens = tokensSource['tokens'] as Map<String, dynamic>?;

          if (tokens != null) {
            await _storage.setTokens(
              accessToken: tokens['accessToken'] as String,
              refreshToken: tokens['refreshToken'] as String,
            );

            _onAuthStateChanged?.call(AuthRefreshState.refreshSuccess);

            final retryResponse = await _retryRequest(err.requestOptions);
            _resolvePendingRequests();
            return handler.resolve(retryResponse);
          }
        }
      }

      _onAuthStateChanged?.call(AuthRefreshState.refreshFailedExpired);
      _clearAuthAndRejectPending();
      return handler.next(err);
    } on DioException catch (e) {
      if (_isNetworkError(e)) {
        _onAuthStateChanged?.call(AuthRefreshState.refreshFailedNetwork);
        _queueForOfflineRetry(err.requestOptions);

        for (final retry in _pendingRequests) {
          _queueForOfflineRetry(retry.options);
        }
        _pendingRequests.clear();

        return handler.reject(
          DioException(
            requestOptions: err.requestOptions,
            error: 'Token refresh failed - offline. Request queued for retry.',
            type: DioExceptionType.connectionError,
          ),
        );
      }

      _onAuthStateChanged?.call(AuthRefreshState.refreshFailedExpired);
      _clearAuthAndRejectPending();
      return handler.next(err);
    } finally {
      _isRefreshing = false;
    }
  }

  bool _isNetworkError(DioException err) {
    return err.type == DioExceptionType.connectionError ||
        err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.sendTimeout ||
        err.type == DioExceptionType.receiveTimeout ||
        (err.error?.toString().contains('SocketException') ?? false);
  }

  void _handleNetworkError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) {
    final retryCount = err.requestOptions.extra['_retryCount'] as int? ?? 0;

    if (retryCount < 1 && !_connectivityService.isOnline) {
      _queueForOfflineRetry(err.requestOptions);
      handler.reject(
        DioException(
          requestOptions: err.requestOptions,
          error: 'Request queued for offline retry',
          type: DioExceptionType.connectionError,
        ),
      );
    } else {
      handler.next(err);
    }
  }

  void _queueForOfflineRetry(RequestOptions options) {
    if (_offlineQueue.length >= maxOfflineQueueSize) {
      _offlineQueue.removeAt(0);
    }

    _offlineQueue.add(_OfflineRequest(
      options: options,
      queuedAt: DateTime.now(),
    ));

    debugPrint(
      'ResilientAuthInterceptor: Queued request for offline retry. '
      'Queue size: ${_offlineQueue.length}',
    );
  }

  Future<void> _processOfflineQueue() async {
    if (_offlineQueue.isEmpty) return;

    debugPrint(
      'ResilientAuthInterceptor: Processing ${_offlineQueue.length} '
      'offline requests',
    );

    await Future.delayed(offlineRetryDelay);

    if (!_connectivityService.isOnline) return;

    final requests = List<_OfflineRequest>.from(_offlineQueue);
    _offlineQueue.clear();

    for (final request in requests) {
      try {
        request.options.extra['_retryCount'] =
            (request.options.extra['_retryCount'] as int? ?? 0) + 1;

        final accessToken = await _storage.getAccessToken();
        if (accessToken != null && !_shouldSkipAuth(request.options.path)) {
          request.options.headers['Authorization'] = 'Bearer $accessToken';
        }

        await _dio.fetch(request.options);
        debugPrint(
          'ResilientAuthInterceptor: Successfully retried '
          '${request.options.path}',
        );
      } catch (e) {
        debugPrint(
          'ResilientAuthInterceptor: Retry failed for '
          '${request.options.path}: $e',
        );
      }
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
      options: Options(headers: {'Authorization': null}),
    );
  }

  Future<Response> _retryRequest(RequestOptions options) async {
    final accessToken = await _storage.getAccessToken();
    options.headers['Authorization'] = 'Bearer $accessToken';
    return _dio.fetch(options);
  }

  Future<void> _resolvePendingRequests() async {
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

  Future<void> _clearAuthAndRejectPending() async {
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

  int get offlineQueueSize => _offlineQueue.length;

  void clearOfflineQueue() {
    _offlineQueue.clear();
  }

  void dispose() {
    _connectivityService.removeOnConnectedCallback(_processOfflineQueue);
    _pendingRequests.clear();
    _offlineQueue.clear();
  }
}

class _RequestRetry {
  final RequestOptions options;
  final Completer<Response> completer;

  _RequestRetry({required this.options, required this.completer});
}

class _OfflineRequest {
  final RequestOptions options;
  final DateTime queuedAt;

  _OfflineRequest({required this.options, required this.queuedAt});
}
