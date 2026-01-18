import 'package:dio/dio.dart';
import '../errors/app_exception.dart';

/// Interceptor that converts DioException to AppException
class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    final appException = _handleError(err);
    handler.reject(
      DioException(
        requestOptions: err.requestOptions,
        response: err.response,
        type: err.type,
        error: appException,
        message: appException.message,
      ),
    );
  }

  AppException _handleError(DioException e) {
    switch (e.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return AppException.timeout();
      case DioExceptionType.connectionError:
        return AppException.network();
      case DioExceptionType.badResponse:
        final response = e.response;
        if (response != null && response.data is Map<String, dynamic>) {
          final data = response.data as Map<String, dynamic>;
          if (data['error'] != null && data['error'] is Map<String, dynamic>) {
            return AppException.fromApiError(
              data['error'] as Map<String, dynamic>,
            );
          }
        }
        return AppException.unknown(message: e.message);
      default:
        return AppException.unknown(message: e.message);
    }
  }
}
