import 'package:freezed_annotation/freezed_annotation.dart';

part 'api_response.freezed.dart';
part 'api_response.g.dart';

@freezed
class ApiError with _$ApiError {
  const factory ApiError({
    required String code,
    required String category,
    required String message,
    required String i18nKey,
    Map<String, dynamic>? details,
    String? field,
    required String timestamp,
  }) = _ApiError;

  factory ApiError.fromJson(Map<String, dynamic> json) =>
      _$ApiErrorFromJson(json);
}

@Freezed(genericArgumentFactories: true)
class ApiResponse<T> with _$ApiResponse<T> {
  const factory ApiResponse.success({
    required T data,
    Map<String, dynamic>? meta,
  }) = ApiSuccessResponse<T>;

  const factory ApiResponse.error({
    required ApiError error,
  }) = ApiErrorResponse<T>;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) {
    if (json['success'] == true) {
      return ApiResponse.success(
        data: fromJsonT(json['data']),
        meta: json['meta'] as Map<String, dynamic>?,
      );
    } else {
      return ApiResponse.error(
        error: ApiError.fromJson(json['error'] as Map<String, dynamic>),
      );
    }
  }
}
