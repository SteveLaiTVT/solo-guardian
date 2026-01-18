import 'package:freezed_annotation/freezed_annotation.dart';

part 'settings.freezed.dart';
part 'settings.g.dart';

@freezed
class CheckInSettings with _$CheckInSettings {
  const factory CheckInSettings({
    required String userId,
    required String deadlineTime,
    required String reminderTime,
    required bool reminderEnabled,
    required String timezone,
    required String createdAt,
    required String updatedAt,
  }) = _CheckInSettings;

  factory CheckInSettings.fromJson(Map<String, dynamic> json) =>
      _$CheckInSettingsFromJson(json);
}

@freezed
class UpdateSettingsRequest with _$UpdateSettingsRequest {
  const factory UpdateSettingsRequest({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) = _UpdateSettingsRequest;

  factory UpdateSettingsRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateSettingsRequestFromJson(json);
}
