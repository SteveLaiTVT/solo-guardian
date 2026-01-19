/**
 * @file offline_errors.dart
 * @description Offline-specific error types and user-friendly messages
 * @task TASK-106
 * @design_state_version 3.13.0
 */
import 'error_codes.dart';
import 'app_exception.dart';

class OfflineException extends AppException {
  const OfflineException({
    required String message,
    required String i18nKey,
  }) : super(
          code: 'OFFLINE',
          category: ErrorCategory.system,
          message: message,
          i18nKey: i18nKey,
        );

  factory OfflineException.noConnection() {
    return const OfflineException(
      message: 'No internet connection. Your changes are saved locally.',
      i18nKey: 'error.offline.noConnection',
    );
  }

  factory OfflineException.syncFailed() {
    return const OfflineException(
      message: 'Some changes couldn\'t sync. Tap to retry.',
      i18nKey: 'error.offline.syncFailed',
    );
  }

  factory OfflineException.operationRequiresOnline(String operation) {
    return OfflineException(
      message: '$operation requires an internet connection.',
      i18nKey: 'error.offline.requiresOnline',
    );
  }
}

class SyncException extends AppException {
  final int failedCount;
  final int totalCount;

  const SyncException({
    required String message,
    required String i18nKey,
    this.failedCount = 0,
    this.totalCount = 0,
  }) : super(
          code: 'SYNC_ERROR',
          category: ErrorCategory.system,
          message: message,
          i18nKey: i18nKey,
        );

  factory SyncException.partialFailure(int failedCount, int totalCount) {
    return SyncException(
      message: '$failedCount of $totalCount changes failed to sync.',
      i18nKey: 'error.sync.partialFailure',
      failedCount: failedCount,
      totalCount: totalCount,
    );
  }
}

class FriendlyErrorMessages {
  static String getNetworkErrorMessage() {
    return 'No internet connection. Your changes are saved locally and will sync when you\'re back online.';
  }

  static String getSyncPendingMessage(int count) {
    if (count == 1) {
      return '1 change waiting to sync.';
    }
    return '$count changes waiting to sync.';
  }

  static String getSyncFailedMessage(int count) {
    if (count == 1) {
      return '1 change couldn\'t sync. Tap to retry.';
    }
    return '$count changes couldn\'t sync. Tap to retry.';
  }

  static String getOfflineModeMessage() {
    return 'You\'re offline. Some features may be limited.';
  }

  static String getSyncingMessage() {
    return 'Syncing your changes...';
  }

  static String getSyncCompleteMessage() {
    return 'All changes synced.';
  }

  static String getServerErrorMessage() {
    return 'Something went wrong. Please try again later.';
  }

  static String getUserFriendlyMessage(AppException exception) {
    if (exception is OfflineException) {
      return exception.message;
    }

    switch (exception.code) {
      case 'NETWORK_ERROR':
        return getNetworkErrorMessage();
      case 'TIMEOUT':
        return 'The request took too long. Please try again.';
      case 'AUTH_1001':
        return 'Your session has expired. Please log in again.';
      case 'AUTH_1002':
        return 'Invalid email or password. Please try again.';
      case 'VAL_2001':
        return 'Please check your input and try again.';
      default:
        if (exception.isUserError) {
          return exception.message;
        }
        return getServerErrorMessage();
    }
  }
}
