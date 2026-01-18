import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/preferences.dart';
import '../models/user.dart';

part 'preferences_datasource.g.dart';

@RestApi()
abstract class PreferencesDatasource {
  factory PreferencesDatasource(Dio dio, {String baseUrl}) = _PreferencesDatasource;

  @GET('/api/v1/preferences')
  Future<dynamic> getPreferences();

  @PATCH('/api/v1/preferences')
  Future<dynamic> updatePreferences(@Body() Map<String, dynamic> request);

  @PATCH('/api/v1/preferences/features/{featureName}')
  Future<dynamic> toggleFeature(
    @Path('featureName') String featureName,
    @Body() Map<String, dynamic> request,
  );

  @POST('/api/v1/preferences/onboarding/complete')
  Future<dynamic> completeOnboarding();

  @GET('/api/v1/preferences/profile')
  Future<dynamic> getProfile();

  @PATCH('/api/v1/preferences/profile')
  Future<dynamic> updateProfile(@Body() Map<String, dynamic> request);
}

extension PreferencesDatasourceExtension on PreferencesDatasource {
  UserPreferences parsePreferences(dynamic response) {
    final map = response as Map<String, dynamic>;
    return UserPreferences.fromJson(map);
  }

  User parseProfile(dynamic response) {
    final map = response as Map<String, dynamic>;
    return User.fromJson(map);
  }

  Map<String, dynamic> updatePreferencesRequest({
    String? theme,
    String? language,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
  }) {
    return {
      if (theme != null) 'theme': theme,
      if (language != null) 'language': language,
      if (fontSize != null) 'fontSize': fontSize,
      if (highContrast != null) 'highContrast': highContrast,
      if (reducedMotion != null) 'reducedMotion': reducedMotion,
    };
  }

  Map<String, dynamic> toggleFeatureRequest(bool enabled) {
    return {'enabled': enabled};
  }

  Map<String, dynamic> updateProfileRequest({String? name, int? birthYear}) {
    return {
      if (name != null) 'name': name,
      if (birthYear != null) 'birthYear': birthYear,
    };
  }
}
