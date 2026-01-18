// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'preferences.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserPreferencesImpl _$$UserPreferencesImplFromJson(
  Map<String, dynamic> json,
) => _$UserPreferencesImpl(
  id: json['id'] as String,
  userId: json['userId'] as String,
  preferFeaturesOn: json['preferFeaturesOn'] as bool,
  theme: $enumDecode(_$ThemeTypeEnumMap, json['theme']),
  fontSize: (json['fontSize'] as num).toInt(),
  highContrast: json['highContrast'] as bool,
  reducedMotion: json['reducedMotion'] as bool,
  warmColors: json['warmColors'] as bool,
  hobbyCheckIn: json['hobbyCheckIn'] as bool,
  familyAccess: json['familyAccess'] as bool,
  optionalFeatures: Map<String, bool>.from(json['optionalFeatures'] as Map),
  onboardingCompleted: json['onboardingCompleted'] as bool,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$$UserPreferencesImplToJson(
  _$UserPreferencesImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'preferFeaturesOn': instance.preferFeaturesOn,
  'theme': _$ThemeTypeEnumMap[instance.theme]!,
  'fontSize': instance.fontSize,
  'highContrast': instance.highContrast,
  'reducedMotion': instance.reducedMotion,
  'warmColors': instance.warmColors,
  'hobbyCheckIn': instance.hobbyCheckIn,
  'familyAccess': instance.familyAccess,
  'optionalFeatures': instance.optionalFeatures,
  'onboardingCompleted': instance.onboardingCompleted,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};

const _$ThemeTypeEnumMap = {
  ThemeType.standard: 'standard',
  ThemeType.warm: 'warm',
  ThemeType.nature: 'nature',
  ThemeType.ocean: 'ocean',
};

_$UpdatePreferencesRequestImpl _$$UpdatePreferencesRequestImplFromJson(
  Map<String, dynamic> json,
) => _$UpdatePreferencesRequestImpl(
  preferFeaturesOn: json['preferFeaturesOn'] as bool?,
  theme: $enumDecodeNullable(_$ThemeTypeEnumMap, json['theme']),
  fontSize: (json['fontSize'] as num?)?.toInt(),
  highContrast: json['highContrast'] as bool?,
  reducedMotion: json['reducedMotion'] as bool?,
  warmColors: json['warmColors'] as bool?,
  hobbyCheckIn: json['hobbyCheckIn'] as bool?,
  familyAccess: json['familyAccess'] as bool?,
);

Map<String, dynamic> _$$UpdatePreferencesRequestImplToJson(
  _$UpdatePreferencesRequestImpl instance,
) => <String, dynamic>{
  'preferFeaturesOn': instance.preferFeaturesOn,
  'theme': _$ThemeTypeEnumMap[instance.theme],
  'fontSize': instance.fontSize,
  'highContrast': instance.highContrast,
  'reducedMotion': instance.reducedMotion,
  'warmColors': instance.warmColors,
  'hobbyCheckIn': instance.hobbyCheckIn,
  'familyAccess': instance.familyAccess,
};

_$UpdateProfileRequestImpl _$$UpdateProfileRequestImplFromJson(
  Map<String, dynamic> json,
) => _$UpdateProfileRequestImpl(
  name: json['name'] as String?,
  birthYear: (json['birthYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$$UpdateProfileRequestImplToJson(
  _$UpdateProfileRequestImpl instance,
) => <String, dynamic>{'name': instance.name, 'birthYear': instance.birthYear};

_$ToggleFeatureRequestImpl _$$ToggleFeatureRequestImplFromJson(
  Map<String, dynamic> json,
) => _$ToggleFeatureRequestImpl(enabled: json['enabled'] as bool);

Map<String, dynamic> _$$ToggleFeatureRequestImplToJson(
  _$ToggleFeatureRequestImpl instance,
) => <String, dynamic>{'enabled': instance.enabled};
