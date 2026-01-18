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
      return fallbackMessage ?? l10n.errorUnknown;
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
      _ => fallbackMessage ?? l10n.errorUnknown,
    };
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

    // Check if it's a string that looks like an i18nKey
    final errorStr = error.toString();
    if (errorStr.startsWith('error.')) {
      return getLocalizedMessage(l10n, errorStr, null);
    }

    // Check common error patterns
    if (errorStr.contains('SocketException') ||
        errorStr.contains('Connection refused') ||
        errorStr.contains('Network is unreachable')) {
      return l10n.errorNetworkFailed;
    }

    if (errorStr.contains('TimeoutException') ||
        errorStr.contains('Connection timed out')) {
      return l10n.errorNetworkFailed;
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
}
