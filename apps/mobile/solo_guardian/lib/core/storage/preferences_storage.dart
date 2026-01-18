import 'package:shared_preferences/shared_preferences.dart';
import '../constants/storage_keys.dart';

class PreferencesStorage {
  final SharedPreferences _prefs;

  PreferencesStorage(this._prefs);

  static Future<PreferencesStorage> init() async {
    final prefs = await SharedPreferences.getInstance();
    return PreferencesStorage(prefs);
  }

  String? getLocale() {
    return _prefs.getString(StorageKeys.locale);
  }

  Future<bool> setLocale(String locale) {
    return _prefs.setString(StorageKeys.locale, locale);
  }

  bool getOnboardingCompleted() {
    return _prefs.getBool(StorageKeys.onboardingCompleted) ?? false;
  }

  Future<bool> setOnboardingCompleted(bool completed) {
    return _prefs.setBool(StorageKeys.onboardingCompleted, completed);
  }

  String getThemeMode() {
    return _prefs.getString(StorageKeys.themeMode) ?? 'system';
  }

  Future<bool> setThemeMode(String mode) {
    return _prefs.setString(StorageKeys.themeMode, mode);
  }

  Future<bool> clear() {
    return _prefs.clear();
  }
}
