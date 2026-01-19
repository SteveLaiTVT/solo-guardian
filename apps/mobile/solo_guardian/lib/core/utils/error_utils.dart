import 'package:dio/dio.dart';
import '../../l10n/app_localizations.dart';
import '../errors/app_exception.dart';

/// Utility class for mapping error codes to localized friendly messages
class ErrorUtils {
  /// Get a user-friendly error message from an i18nKey
  /// Falls back to the raw message if no translation is found
  static String getLocalizedMessage(
    AppLocalizations l10n,
    String? i18nKey,
    String? fallbackMessage,
  ) {
    if (i18nKey == null) {
      // Try to detect error type from fallback message
      return _parseRawErrorMessage(l10n, fallbackMessage);
    }

    // Map i18nKey to localized message
    // i18nKey format: "error.category.code" e.g., "error.auth.invalidCredentials"
    return switch (i18nKey) {
      // Auth errors
      'error.auth.invalidCredentials' => l10n.errorAuthInvalidCredentials,
      'error.auth.tokenExpired' => l10n.errorAuthTokenExpired,
      'error.auth.tokenInvalid' => l10n.errorAuthTokenInvalid,
      'error.auth.unauthorized' => l10n.errorAuthUnauthorized,

      // Validation errors
      'error.validation.failed' => l10n.errorValidationFailed,
      'error.validation.emailInvalid' => l10n.errorValidationEmailInvalid,
      'error.validation.requiredField' => l10n.errorValidationRequiredField,

      // User errors
      'error.user.notFound' => l10n.errorUserNotFound,
      'error.user.emailExists' => l10n.errorUserEmailExists,

      // Contact errors
      'error.contact.notFound' => l10n.errorContactNotFound,
      'error.contact.limitReached' => l10n.errorContactLimitReached,
      'error.contact.emailExists' => l10n.errorContactEmailExists,

      // Check-in errors
      'error.checkin.alreadyToday' => l10n.errorCheckinAlreadyToday,
      'error.checkin.settingsNotFound' => l10n.errorCheckinSettingsNotFound,

      // Preferences errors
      'error.preferences.notFound' => l10n.errorPreferencesNotFound,
      'error.preferences.invalidFeature' => l10n.errorPreferencesInvalidFeature,

      // Network errors
      'error.network' || 'error.network.failed' => l10n.errorNetworkFailed,

      // System errors
      'error.system.internal' => l10n.errorSystemInternal,
      'error.system.unavailable' => l10n.errorSystemUnavailable,
      'error.system.rateLimited' => l10n.errorSystemRateLimited,

      // Timeout
      'error.timeout' => l10n.errorNetworkFailed,

      // Unknown/default
      _ => _parseRawErrorMessage(l10n, fallbackMessage),
    };
  }

  /// Parse raw error message string to return friendly message
  static String _parseRawErrorMessage(AppLocalizations l10n, String? message) {
    if (message == null || message.isEmpty) {
      return l10n.errorUnknown;
    }

    // Check for HTTP status codes and common error patterns
    if (message.contains('429') || message.contains('Too Many Requests') || message.contains('ThrottlerException')) {
      return l10n.errorSystemRateLimited;
    }
    if (message.contains('503') || message.contains('Service Unavailable')) {
      return l10n.errorSystemUnavailable;
    }
    if (message.contains('500') || message.contains('Internal Server Error')) {
      return l10n.errorSystemInternal;
    }
    if (message.contains('401') || message.contains('Unauthorized')) {
      return l10n.errorAuthUnauthorized;
    }
    if (message.contains('SocketException') ||
        message.contains('Connection refused') ||
        message.contains('Network is unreachable') ||
        message.contains('ConnectionError')) {
      return l10n.errorNetworkFailed;
    }
    if (message.contains('TimeoutException') ||
        message.contains('Connection timed out') ||
        message.contains('connectionTimeout') ||
        message.contains('receiveTimeout')) {
      return l10n.errorNetworkFailed;
    }
    if (message.contains('DioException')) {
      return l10n.errorNetworkFailed;
    }

    return l10n.errorUnknown;
  }

  /// Get a user-friendly error message from an AppException
  static String getExceptionMessage(AppLocalizations l10n, AppException e) {
    return getLocalizedMessage(l10n, e.i18nKey, e.message);
  }

  /// Get a user-friendly error message from any exception
  static String getErrorMessage(AppLocalizations l10n, dynamic error) {
    if (error is AppException) {
      return getExceptionMessage(l10n, error);
    }

    // Handle DioException with status codes
    if (error is DioException) {
      final statusCode = error.response?.statusCode;
      if (statusCode == 429) {
        return l10n.errorSystemRateLimited;
      }
      if (statusCode == 503) {
        return l10n.errorSystemUnavailable;
      }
      if (statusCode == 500 || statusCode == 502) {
        return l10n.errorSystemInternal;
      }
      if (error.type == DioExceptionType.connectionTimeout ||
          error.type == DioExceptionType.receiveTimeout ||
          error.type == DioExceptionType.sendTimeout) {
        return l10n.errorNetworkFailed;
      }
      if (error.type == DioExceptionType.connectionError) {
        return l10n.errorNetworkFailed;
      }
      // Check for AppException wrapped in DioException
      if (error.error is AppException) {
        return getExceptionMessage(l10n, error.error as AppException);
      }
    }

    // Check if it's a string that looks like an i18nKey
    final errorStr = error.toString();
    if (errorStr.startsWith('error.')) {
      return getLocalizedMessage(l10n, errorStr, null);
    }

    // Check common error patterns in string
    if (errorStr.contains('SocketException') ||
        errorStr.contains('Connection refused') ||
        errorStr.contains('Network is unreachable')) {
      return l10n.errorNetworkFailed;
    }

    if (errorStr.contains('TimeoutException') ||
        errorStr.contains('Connection timed out')) {
      return l10n.errorNetworkFailed;
    }

    if (errorStr.contains('429') || errorStr.contains('Too Many Requests')) {
      return l10n.errorSystemRateLimited;
    }

    return l10n.errorUnknown;
  }

  /// Get the error title based on whether it's a user error or system error
  static String getErrorTitle(AppLocalizations l10n, dynamic error) {
    if (error is AppException && error.isUserError) {
      return l10n.errorTitleUser;
    }
    return l10n.errorTitleSystem;
  }

  /// Extract error message and i18nKey from any exception
  /// Returns (message, i18nKey) tuple for use in provider state
  static (String, String?) extractError(dynamic e) {
    if (e is AppException) {
      return (e.message, e.i18nKey);
    }
    if (e is DioException) {
      // Check for wrapped AppException
      if (e.error is AppException) {
        final appEx = e.error as AppException;
        return (appEx.message, appEx.i18nKey);
      }
      // Handle HTTP status codes
      final statusCode = e.response?.statusCode;
      if (statusCode == 429) {
        return ('Too many requests', 'error.system.rateLimited');
      }
      if (statusCode == 503) {
        return ('Service unavailable', 'error.system.unavailable');
      }
      if (statusCode == 500 || statusCode == 502) {
        return ('Internal server error', 'error.system.internal');
      }
      if (statusCode == 401) {
        return ('Unauthorized', 'error.auth.unauthorized');
      }
      // Handle connection errors
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.sendTimeout ||
          e.type == DioExceptionType.connectionError) {
        return ('Network error', 'error.network.failed');
      }
    }
    return (e.toString(), null);
  }
}
