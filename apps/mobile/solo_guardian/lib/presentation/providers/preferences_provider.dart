import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/errors/app_exception.dart';
import '../../data/models/preferences.dart';
import '../../theme/app_theme.dart';
import 'core_providers.dart';

class PreferencesState {
  final UserPreferences? preferences;
  final bool isLoading;
  final String? error;
  final String? errorI18nKey;

  const PreferencesState({
    this.preferences,
    this.isLoading = false,
    this.error,
    this.errorI18nKey,
  });

  PreferencesState copyWith({
    UserPreferences? preferences,
    bool? isLoading,
    String? error,
    String? errorI18nKey,
  }) {
    return PreferencesState(
      preferences: preferences ?? this.preferences,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      errorI18nKey: errorI18nKey,
    );
  }
}

class PreferencesNotifier extends StateNotifier<PreferencesState> {
  final Ref _ref;

  PreferencesNotifier(this._ref) : super(const PreferencesState());

  Future<void> loadPreferences() async {
    state = state.copyWith(isLoading: true, error: null, errorI18nKey: null);
    try {
      final prefsRepo = _ref.read(preferencesRepositoryProvider);
      final preferences = await prefsRepo.getPreferences();
      state = PreferencesState(preferences: preferences);
    } catch (e) {
      final (errorMsg, i18nKey) = _extractError(e);
      state = state.copyWith(isLoading: false, error: errorMsg, errorI18nKey: i18nKey);
    }
  }

  Future<void> updatePreferences({
    String? theme,
    String? language,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
  }) async {
    // Optimistic update - update UI immediately without loading state
    if (state.preferences != null) {
      final current = state.preferences!;

      // Parse theme if provided
      ThemeType? parsedTheme;
      if (theme != null) {
        parsedTheme = ThemeType.values.firstWhere(
          (t) => t.name == theme,
          orElse: () => current.theme,
        );
      }

      final optimisticPrefs = UserPreferences(
        id: current.id,
        userId: current.userId,
        preferFeaturesOn: current.preferFeaturesOn,
        theme: parsedTheme ?? current.theme,
        fontSize: fontSize ?? current.fontSize,
        highContrast: highContrast ?? current.highContrast,
        reducedMotion: reducedMotion ?? current.reducedMotion,
        warmColors: current.warmColors,
        hobbyCheckIn: current.hobbyCheckIn,
        familyAccess: current.familyAccess,
        optionalFeatures: current.optionalFeatures,
        onboardingCompleted: current.onboardingCompleted,
        createdAt: current.createdAt,
        updatedAt: current.updatedAt,
      );
      state = PreferencesState(preferences: optimisticPrefs);
    }

    try {
      final prefsRepo = _ref.read(preferencesRepositoryProvider);
      final preferences = await prefsRepo.updatePreferences(
        theme: theme,
        language: language,
        fontSize: fontSize,
        highContrast: highContrast,
        reducedMotion: reducedMotion,
      );
      // Update with server response
      state = PreferencesState(preferences: preferences);
    } catch (e) {
      final (errorMsg, i18nKey) = _extractError(e);
      // Keep the optimistic update but set error
      state = state.copyWith(error: errorMsg, errorI18nKey: i18nKey);
      rethrow;
    }
  }

  Future<void> toggleFeature(String featureName, bool enabled) async {
    try {
      final prefsRepo = _ref.read(preferencesRepositoryProvider);
      final preferences = await prefsRepo.toggleFeature(featureName, enabled);
      state = state.copyWith(preferences: preferences);
    } catch (e) {
      final (errorMsg, i18nKey) = _extractError(e);
      state = state.copyWith(error: errorMsg, errorI18nKey: i18nKey);
      rethrow;
    }
  }

  Future<void> completeOnboarding() async {
    try {
      final prefsRepo = _ref.read(preferencesRepositoryProvider);
      final preferences = await prefsRepo.completeOnboarding();
      state = state.copyWith(preferences: preferences);
    } catch (e) {
      final (errorMsg, i18nKey) = _extractError(e);
      state = state.copyWith(error: errorMsg, errorI18nKey: i18nKey);
      rethrow;
    }
  }

  void setPreferences(UserPreferences preferences) {
    state = state.copyWith(preferences: preferences);
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

final preferencesProvider =
    StateNotifierProvider<PreferencesNotifier, PreferencesState>((ref) {
  return PreferencesNotifier(ref);
});

final appThemeProvider = Provider<AppTheme>((ref) {
  final prefsState = ref.watch(preferencesProvider);
  final prefs = prefsState.preferences;

  if (prefs == null) {
    return const AppTheme();
  }

  return AppTheme(
    type: _mapThemeType(prefs.theme),
    highContrast: prefs.highContrast,
    reducedMotion: prefs.reducedMotion,
    fontSize: prefs.fontSize.toDouble(),
  );
});

AppThemeType _mapThemeType(ThemeType type) {
  switch (type) {
    case ThemeType.standard:
      return AppThemeType.standard;
    case ThemeType.warm:
      return AppThemeType.warm;
    case ThemeType.nature:
      return AppThemeType.nature;
    case ThemeType.ocean:
      return AppThemeType.ocean;
  }
}

final onboardingCompletedProvider = Provider<bool>((ref) {
  final prefsState = ref.watch(preferencesProvider);
  return prefsState.preferences?.onboardingCompleted ?? false;
});
