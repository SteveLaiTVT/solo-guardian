import 'error_codes.dart' as error_codes;
import 'error_codes.dart' show ErrorCategory;

class AppException implements Exception {
  final String code;
  final ErrorCategory category;
  final String message;
  final String i18nKey;
  final Map<String, dynamic>? details;
  final String? field;

  const AppException({
    required this.code,
    required this.category,
    required this.message,
    required this.i18nKey,
    this.details,
    this.field,
  });

  factory AppException.fromApiError(Map<String, dynamic> error) {
    return AppException(
      code: error['code'] as String? ?? 'UNKNOWN',
      category: _parseCategory(error['category'] as String?),
      message: error['message'] as String? ?? 'An error occurred',
      i18nKey: error['i18nKey'] as String? ?? 'error.unknown',
      details: error['details'] as Map<String, dynamic>?,
      field: error['field'] as String?,
    );
  }

  factory AppException.network({String? message}) {
    return AppException(
      code: 'NETWORK_ERROR',
      category: ErrorCategory.system,
      message: message ?? 'Network error. Please check your connection.',
      i18nKey: 'error.network',
    );
  }

  factory AppException.timeout() {
    return const AppException(
      code: 'TIMEOUT',
      category: ErrorCategory.system,
      message: 'Request timed out. Please try again.',
      i18nKey: 'error.timeout',
    );
  }

  factory AppException.unknown({String? message}) {
    return AppException(
      code: 'UNKNOWN',
      category: ErrorCategory.system,
      message: message ?? 'An unexpected error occurred.',
      i18nKey: 'error.unknown',
    );
  }

  static ErrorCategory _parseCategory(String? category) {
    switch (category) {
      case 'VALIDATION':
        return ErrorCategory.validation;
      case 'AUTH':
        return ErrorCategory.auth;
      case 'BUSINESS':
        return ErrorCategory.business;
      case 'NOT_FOUND':
        return ErrorCategory.notFound;
      case 'CONFLICT':
        return ErrorCategory.conflict;
      case 'RATE_LIMIT':
        return ErrorCategory.rateLimit;
      case 'SYSTEM':
      default:
        return ErrorCategory.system;
    }
  }

  bool get isUserError => error_codes.isUserError(category);

  @override
  String toString() => 'AppException: [$code] $message';
}
