import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/errors/app_exception.dart';
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
    state = state.copyWith(isLoading: true, error: null, errorI18nKey: null);
    try {
      final settingsRepo = _ref.read(settingsRepositoryProvider);
      final settings = await settingsRepo.getSettings();
      state = SettingsState(settings: settings);
    } catch (e) {
      final (errorMsg, i18nKey) = _extractError(e);
      state = state.copyWith(isLoading: false, error: errorMsg, errorI18nKey: i18nKey);
    }
  }

  Future<void> updateSettings({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) async {
    state = state.copyWith(isLoading: true, error: null, errorI18nKey: null);
    try {
      final settingsRepo = _ref.read(settingsRepositoryProvider);
      final settings = await settingsRepo.updateSettings(
        deadlineTime: deadlineTime,
        reminderTime: reminderTime,
        reminderEnabled: reminderEnabled,
      );
      state = SettingsState(settings: settings);
    } catch (e) {
      final (errorMsg, i18nKey) = _extractError(e);
      state = state.copyWith(isLoading: false, error: errorMsg, errorI18nKey: i18nKey);
      rethrow;
    }
  }

  (String, String?) _extractError(dynamic e) {
    if (e is AppException) {
      return (e.message, e.i18nKey);
    }
    if (e is DioException && e.error is AppException) {
      final appEx = e.error as AppException;
      return (appEx.message, appEx.i18nKey);
    }
    return (e.toString(), null);
  }
}

final settingsProvider =
    StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier(ref);
});
