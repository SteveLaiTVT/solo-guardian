import 'package:freezed_annotation/freezed_annotation.dart';

part 'preferences.freezed.dart';
part 'preferences.g.dart';

enum ThemeType {
  @JsonValue('standard')
  standard,
  @JsonValue('warm')
  warm,
  @JsonValue('nature')
  nature,
  @JsonValue('ocean')
  ocean,
}

@freezed
class UserPreferences with _$UserPreferences {
  const factory UserPreferences({
    required String id,
    required String userId,
    required bool preferFeaturesOn,
    required ThemeType theme,
    required int fontSize,
    required bool highContrast,
    required bool reducedMotion,
    required bool warmColors,
    required bool hobbyCheckIn,
    required bool familyAccess,
    required Map<String, bool> optionalFeatures,
    required bool onboardingCompleted,
    required String createdAt,
    required String updatedAt,
  }) = _UserPreferences;

  factory UserPreferences.fromJson(Map<String, dynamic> json) =>
      _$UserPreferencesFromJson(json);
}

@freezed
class UpdatePreferencesRequest with _$UpdatePreferencesRequest {
  const factory UpdatePreferencesRequest({
    bool? preferFeaturesOn,
    ThemeType? theme,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
    bool? warmColors,
    bool? hobbyCheckIn,
    bool? familyAccess,
  }) = _UpdatePreferencesRequest;

  factory UpdatePreferencesRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdatePreferencesRequestFromJson(json);
}

@freezed
class UpdateProfileRequest with _$UpdateProfileRequest {
  const factory UpdateProfileRequest({
    String? name,
    int? birthYear,
  }) = _UpdateProfileRequest;

  factory UpdateProfileRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateProfileRequestFromJson(json);
}

@freezed
class ToggleFeatureRequest with _$ToggleFeatureRequest {
  const factory ToggleFeatureRequest({
    required bool enabled,
  }) = _ToggleFeatureRequest;

  factory ToggleFeatureRequest.fromJson(Map<String, dynamic> json) =>
      _$ToggleFeatureRequestFromJson(json);
}
