import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/error_utils.dart';
import '../../data/models/settings.dart';
import 'core_providers.dart';

class SettingsState {
  final CheckInSettings? settings;
  final bool isLoading;
  final String? error;
  final String? errorI18nKey;

  const SettingsState({
    this.settings,
    this.isLoading = false,
    this.error,
    this.errorI18nKey,
  });

  SettingsState copyWith({
    CheckInSettings? settings,
    bool? isLoading,
    String? error,
    String? errorI18nKey,
  }) {
    return SettingsState(
      settings: settings ?? this.settings,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      errorI18nKey: errorI18nKey,
    );
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  final Ref _ref;

  SettingsNotifier(this._ref) : super(const SettingsState());

  Future<void> loadSettings() async {
    debugPrint('SettingsNotifier: Starting loadSettings...');
    state = state.copyWith(isLoading: true, error: null, errorI18nKey: null);
    try {
      final settingsRepo = _ref.read(settingsRepositoryProvider);
      debugPrint('SettingsNotifier: Calling getSettings...');
      final settings = await settingsRepo.getSettings();
      debugPrint('SettingsNotifier: Got settings: ${settings.deadlineTime}');
      state = SettingsState(settings: settings, isLoading: false);
    } catch (e, stack) {
      debugPrint('SettingsNotifier: Error loading settings: $e');
      debugPrint('SettingsNotifier: Stack: $stack');
      final (errorMsg, i18nKey) = ErrorUtils.extractError(e);
      state = state.copyWith(isLoading: false, error: errorMsg, errorI18nKey: i18nKey);
    }
    debugPrint('SettingsNotifier: loadSettings complete, isLoading=${state.isLoading}');
  }

  Future<void> updateSettings({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) async {
    // Optimistic update - update UI immediately without loading state
    if (state.settings != null) {
      final currentSettings = state.settings!;
      final optimisticSettings = CheckInSettings(
        userId: currentSettings.userId,
        deadlineTime: deadlineTime ?? currentSettings.deadlineTime,
        reminderTime: reminderTime ?? currentSettings.reminderTime,
        reminderEnabled: reminderEnabled ?? currentSettings.reminderEnabled,
        timezone: currentSettings.timezone,
        createdAt: currentSettings.createdAt,
        updatedAt: currentSettings.updatedAt,
      );
      state = SettingsState(settings: optimisticSettings);
    }

    try {
      final settingsRepo = _ref.read(settingsRepositoryProvider);
      final settings = await settingsRepo.updateSettings(
        deadlineTime: deadlineTime,
        reminderTime: reminderTime,
        reminderEnabled: reminderEnabled,
      );
      // Update with server response
      state = SettingsState(settings: settings);
    } catch (e) {
      final (errorMsg, i18nKey) = ErrorUtils.extractError(e);
      // Keep the optimistic update but set error
      state = state.copyWith(error: errorMsg, errorI18nKey: i18nKey);
      rethrow;
    }
  }
}

final settingsProvider =
    StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier(ref);
});
