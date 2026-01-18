import 'package:freezed_annotation/freezed_annotation.dart';

part 'caregiver.freezed.dart';
part 'caregiver.g.dart';

enum RelationshipType {
  @JsonValue('caregiver')
  caregiver,
  @JsonValue('family')
  family,
  @JsonValue('caretaker')
  caretaker,
}

enum ElderTodayStatus {
  @JsonValue('checked_in')
  checkedIn,
  @JsonValue('pending')
  pending,
  @JsonValue('overdue')
  overdue,
}

@freezed
class ElderSummary with _$ElderSummary {
  const factory ElderSummary({
    required String id,
    required String name,
    required String email,
    String? lastCheckIn,
    required ElderTodayStatus todayStatus,
    required bool isAccepted,
  }) = _ElderSummary;

  factory ElderSummary.fromJson(Map<String, dynamic> json) =>
      _$ElderSummaryFromJson(json);
}

@freezed
class CaregiverSummary with _$CaregiverSummary {
  const factory CaregiverSummary({
    required String id,
    required String name,
    required String email,
    required bool isAccepted,
  }) = _CaregiverSummary;

  factory CaregiverSummary.fromJson(Map<String, dynamic> json) =>
      _$CaregiverSummaryFromJson(json);
}

@freezed
class ElderCheckInSettings with _$ElderCheckInSettings {
  const factory ElderCheckInSettings({
    required String deadlineTime,
    required String reminderTime,
    required String timezone,
  }) = _ElderCheckInSettings;

  factory ElderCheckInSettings.fromJson(Map<String, dynamic> json) =>
      _$ElderCheckInSettingsFromJson(json);
}

@freezed
class ElderContactSummary with _$ElderContactSummary {
  const factory ElderContactSummary({
    required String id,
    required String name,
    required bool isVerified,
  }) = _ElderContactSummary;

  factory ElderContactSummary.fromJson(Map<String, dynamic> json) =>
      _$ElderContactSummaryFromJson(json);
}

@freezed
class ElderDetail with _$ElderDetail {
  const factory ElderDetail({
    required String id,
    required String name,
    required String email,
    String? lastCheckIn,
    required ElderTodayStatus todayStatus,
    required bool isAccepted,
    ElderCheckInSettings? checkInSettings,
    required int pendingAlerts,
    required List<ElderContactSummary> emergencyContacts,
  }) = _ElderDetail;

  factory ElderDetail.fromJson(Map<String, dynamic> json) =>
      _$ElderDetailFromJson(json);
}

@freezed
class CreateInvitationRequest with _$CreateInvitationRequest {
  const factory CreateInvitationRequest({
    required RelationshipType relationshipType,
    String? targetEmail,
    String? targetPhone,
  }) = _CreateInvitationRequest;

  factory CreateInvitationRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateInvitationRequestFromJson(json);
}

@freezed
class InvitationResponse with _$InvitationResponse {
  const factory InvitationResponse({
    required String id,
    required String token,
    required RelationshipType relationshipType,
    String? targetEmail,
    String? targetPhone,
    required String expiresAt,
    required String inviterName,
    required String qrUrl,
  }) = _InvitationResponse;

  factory InvitationResponse.fromJson(Map<String, dynamic> json) =>
      _$InvitationResponseFromJson(json);
}

@freezed
class InvitationInviter with _$InvitationInviter {
  const factory InvitationInviter({
    required String id,
    required String name,
    required String email,
  }) = _InvitationInviter;

  factory InvitationInviter.fromJson(Map<String, dynamic> json) =>
      _$InvitationInviterFromJson(json);
}

@freezed
class InvitationDetails with _$InvitationDetails {
  const factory InvitationDetails({
    required String id,
    required RelationshipType relationshipType,
    required InvitationInviter inviter,
    required String expiresAt,
    required bool isExpired,
    required bool isAccepted,
  }) = _InvitationDetails;

  factory InvitationDetails.fromJson(Map<String, dynamic> json) =>
      _$InvitationDetailsFromJson(json);
}

@freezed
class CaregiverNote with _$CaregiverNote {
  const factory CaregiverNote({
    required String id,
    required String content,
    required String noteDate,
    required String createdAt,
    required String updatedAt,
  }) = _CaregiverNote;

  factory CaregiverNote.fromJson(Map<String, dynamic> json) =>
      _$CaregiverNoteFromJson(json);
}

@freezed
class CreateNoteRequest with _$CreateNoteRequest {
  const factory CreateNoteRequest({
    required String content,
    String? noteDate,
  }) = _CreateNoteRequest;

  factory CreateNoteRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateNoteRequestFromJson(json);
}

@freezed
class CaretakerCheckInRequest with _$CaretakerCheckInRequest {
  const factory CaretakerCheckInRequest({
    String? note,
  }) = _CaretakerCheckInRequest;

  factory CaretakerCheckInRequest.fromJson(Map<String, dynamic> json) =>
      _$CaretakerCheckInRequestFromJson(json);
}

@freezed
class CaretakerCheckInResponse with _$CaretakerCheckInResponse {
  const factory CaretakerCheckInResponse({
    required String checkInDate,
    required String checkedInAt,
  }) = _CaretakerCheckInResponse;

  factory CaretakerCheckInResponse.fromJson(Map<String, dynamic> json) =>
      _$CaretakerCheckInResponseFromJson(json);
}
