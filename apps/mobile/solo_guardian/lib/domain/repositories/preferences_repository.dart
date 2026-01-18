import '../../data/models/preferences.dart';
import '../../data/models/user.dart';

abstract class PreferencesRepository {
  Future<UserPreferences> getPreferences();
  Future<UserPreferences> updatePreferences({
    String? theme,
    String? language,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
  });
  Future<UserPreferences> toggleFeature(String featureName, bool enabled);
  Future<UserPreferences> completeOnboarding();
  Future<User> getProfile();
  Future<User> updateProfile({String? name, int? birthYear});
  Future<User> uploadAvatar(String filePath);
}
