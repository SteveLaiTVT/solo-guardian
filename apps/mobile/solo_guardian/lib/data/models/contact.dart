import 'package:freezed_annotation/freezed_annotation.dart';

part 'contact.freezed.dart';
part 'contact.g.dart';

enum NotificationChannel {
  @JsonValue('email')
  email,
  @JsonValue('sms')
  sms,
}

enum InvitationStatus {
  @JsonValue('none')
  none,
  @JsonValue('pending')
  pending,
  @JsonValue('accepted')
  accepted,
}

@freezed
class EmergencyContact with _$EmergencyContact {
  const factory EmergencyContact({
    required String id,
    required String userId,
    required String name,
    required String email,
    String? phone,
    required int priority,
    required bool isVerified,
    required bool phoneVerified,
    required NotificationChannel preferredChannel,
    required bool isActive,
    String? linkedUserId,
    String? linkedUserName,
    required InvitationStatus invitationStatus,
    required String createdAt,
    required String updatedAt,
  }) = _EmergencyContact;

  factory EmergencyContact.fromJson(Map<String, dynamic> json) =>
      _$EmergencyContactFromJson(json);
}

@freezed
class CreateContactRequest with _$CreateContactRequest {
  const factory CreateContactRequest({
    required String name,
    required String email,
    String? phone,
    int? priority,
    NotificationChannel? preferredChannel,
  }) = _CreateContactRequest;

  factory CreateContactRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateContactRequestFromJson(json);
}

@freezed
class UpdateContactRequest with _$UpdateContactRequest {
  const factory UpdateContactRequest({
    String? name,
    String? email,
    String? phone,
    int? priority,
    bool? isActive,
    NotificationChannel? preferredChannel,
  }) = _UpdateContactRequest;

  factory UpdateContactRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateContactRequestFromJson(json);
}

@freezed
class ReorderContactsRequest with _$ReorderContactsRequest {
  const factory ReorderContactsRequest({
    required List<String> contactIds,
  }) = _ReorderContactsRequest;

  factory ReorderContactsRequest.fromJson(Map<String, dynamic> json) =>
      _$ReorderContactsRequestFromJson(json);
}

@freezed
class LinkedContact with _$LinkedContact {
  const factory LinkedContact({
    required String id,
    required String elderName,
    required String elderEmail,
    required String contactName,
    required String relationshipSince,
    required bool hasActiveAlerts,
  }) = _LinkedContact;

  factory LinkedContact.fromJson(Map<String, dynamic> json) =>
      _$LinkedContactFromJson(json);
}

@freezed
class PendingContactInvitation with _$PendingContactInvitation {
  const factory PendingContactInvitation({
    required String id,
    required String elderName,
    required String elderEmail,
    required String contactName,
    required String invitedAt,
  }) = _PendingContactInvitation;

  factory PendingContactInvitation.fromJson(Map<String, dynamic> json) =>
      _$PendingContactInvitationFromJson(json);
}

@freezed
class ContactLinkInvitationDetails with _$ContactLinkInvitationDetails {
  const factory ContactLinkInvitationDetails({
    required String contactId,
    required String elderName,
    required String elderEmail,
    required String contactName,
  }) = _ContactLinkInvitationDetails;

  factory ContactLinkInvitationDetails.fromJson(Map<String, dynamic> json) =>
      _$ContactLinkInvitationDetailsFromJson(json);
}

@freezed
class AcceptContactLinkResult with _$AcceptContactLinkResult {
  const factory AcceptContactLinkResult({
    required bool success,
    required String elderName,
  }) = _AcceptContactLinkResult;

  factory AcceptContactLinkResult.fromJson(Map<String, dynamic> json) =>
      _$AcceptContactLinkResultFromJson(json);
}

@freezed
class VerifyContactResult with _$VerifyContactResult {
  const factory VerifyContactResult({
    required bool success,
    required String contactName,
    required String userName,
  }) = _VerifyContactResult;

  factory VerifyContactResult.fromJson(Map<String, dynamic> json) =>
      _$VerifyContactResultFromJson(json);
}

@freezed
class SendPhoneVerificationResult with _$SendPhoneVerificationResult {
  const factory SendPhoneVerificationResult({
    required String message,
    required String expiresAt,
  }) = _SendPhoneVerificationResult;

  factory SendPhoneVerificationResult.fromJson(Map<String, dynamic> json) =>
      _$SendPhoneVerificationResultFromJson(json);
}

@freezed
class VerifyPhoneRequest with _$VerifyPhoneRequest {
  const factory VerifyPhoneRequest({
    required String otp,
  }) = _VerifyPhoneRequest;

  factory VerifyPhoneRequest.fromJson(Map<String, dynamic> json) =>
      _$VerifyPhoneRequestFromJson(json);
}

@freezed
class VerifyPhoneResult with _$VerifyPhoneResult {
  const factory VerifyPhoneResult({
    required bool success,
    required String message,
  }) = _VerifyPhoneResult;

  factory VerifyPhoneResult.fromJson(Map<String, dynamic> json) =>
      _$VerifyPhoneResultFromJson(json);
}
