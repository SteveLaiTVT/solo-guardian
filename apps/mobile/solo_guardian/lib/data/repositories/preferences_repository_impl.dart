import 'package:dio/dio.dart';
import '../../domain/repositories/preferences_repository.dart';
import '../datasources/preferences_datasource.dart';
import '../models/preferences.dart';
import '../models/user.dart';

class PreferencesRepositoryImpl implements PreferencesRepository {
  final PreferencesDatasource _datasource;
  final Dio _dio;

  PreferencesRepositoryImpl({
    required PreferencesDatasource datasource,
    required Dio dio,
  })  : _datasource = datasource,
        _dio = dio;

  @override
  Future<UserPreferences> getPreferences() async {
    final response = await _datasource.getPreferences();
    return _datasource.parsePreferences(response);
  }

  @override
  Future<UserPreferences> updatePreferences({
    String? theme,
    String? language,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
  }) async {
    final response = await _datasource.updatePreferences(
      _datasource.updatePreferencesRequest(
        theme: theme,
        language: language,
        fontSize: fontSize,
        highContrast: highContrast,
        reducedMotion: reducedMotion,
      ),
    );
    return _datasource.parsePreferences(response);
  }

  @override
  Future<UserPreferences> toggleFeature(String featureName, bool enabled) async {
    final response = await _datasource.toggleFeature(
      featureName,
      _datasource.toggleFeatureRequest(enabled),
    );
    return _datasource.parsePreferences(response);
  }

  @override
  Future<UserPreferences> completeOnboarding() async {
    final response = await _datasource.completeOnboarding();
    return _datasource.parsePreferences(response);
  }

  @override
  Future<User> getProfile() async {
    final response = await _datasource.getProfile();
    return _datasource.parseProfile(response);
  }

  @override
  Future<User> updateProfile({String? name, int? birthYear}) async {
    final response = await _datasource.updateProfile(
      _datasource.updateProfileRequest(name: name, birthYear: birthYear),
    );
    return _datasource.parseProfile(response);
  }

  @override
  Future<User> uploadAvatar(String filePath) async {
    final formData = FormData.fromMap({
      'avatar': await MultipartFile.fromFile(
        filePath,
        filename: filePath.split('/').last,
      ),
    });

    final response = await _dio.post(
      '/api/v1/preferences/profile/avatar',
      data: formData,
    );

    return User.fromJson(response.data as Map<String, dynamic>);
  }
}
