// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'settings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CheckInSettingsImpl _$$CheckInSettingsImplFromJson(
  Map<String, dynamic> json,
) => _$CheckInSettingsImpl(
  userId: json['userId'] as String,
  deadlineTime: json['deadlineTime'] as String,
  reminderTime: json['reminderTime'] as String,
  reminderEnabled: json['reminderEnabled'] as bool,
  timezone: json['timezone'] as String,
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$$CheckInSettingsImplToJson(
  _$CheckInSettingsImpl instance,
) => <String, dynamic>{
  'userId': instance.userId,
  'deadlineTime': instance.deadlineTime,
  'reminderTime': instance.reminderTime,
  'reminderEnabled': instance.reminderEnabled,
  'timezone': instance.timezone,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};

_$UpdateSettingsRequestImpl _$$UpdateSettingsRequestImplFromJson(
  Map<String, dynamic> json,
) => _$UpdateSettingsRequestImpl(
  deadlineTime: json['deadlineTime'] as String?,
  reminderTime: json['reminderTime'] as String?,
  reminderEnabled: json['reminderEnabled'] as bool?,
);

Map<String, dynamic> _$$UpdateSettingsRequestImplToJson(
  _$UpdateSettingsRequestImpl instance,
) => <String, dynamic>{
  'deadlineTime': instance.deadlineTime,
  'reminderTime': instance.reminderTime,
  'reminderEnabled': instance.reminderEnabled,
};
