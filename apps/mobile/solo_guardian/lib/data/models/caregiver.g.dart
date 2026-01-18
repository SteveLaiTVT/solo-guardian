// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'caregiver.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ElderSummaryImpl _$$ElderSummaryImplFromJson(Map<String, dynamic> json) =>
    _$ElderSummaryImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      lastCheckIn: json['lastCheckIn'] as String?,
      todayStatus: $enumDecode(_$ElderTodayStatusEnumMap, json['todayStatus']),
      isAccepted: json['isAccepted'] as bool,
    );

Map<String, dynamic> _$$ElderSummaryImplToJson(_$ElderSummaryImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'lastCheckIn': instance.lastCheckIn,
      'todayStatus': _$ElderTodayStatusEnumMap[instance.todayStatus]!,
      'isAccepted': instance.isAccepted,
    };

const _$ElderTodayStatusEnumMap = {
  ElderTodayStatus.checkedIn: 'checked_in',
  ElderTodayStatus.pending: 'pending',
  ElderTodayStatus.overdue: 'overdue',
};

_$CaregiverSummaryImpl _$$CaregiverSummaryImplFromJson(
  Map<String, dynamic> json,
) => _$CaregiverSummaryImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  email: json['email'] as String,
  isAccepted: json['isAccepted'] as bool,
);

Map<String, dynamic> _$$CaregiverSummaryImplToJson(
  _$CaregiverSummaryImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'email': instance.email,
  'isAccepted': instance.isAccepted,
};

_$ElderCheckInSettingsImpl _$$ElderCheckInSettingsImplFromJson(
  Map<String, dynamic> json,
) => _$ElderCheckInSettingsImpl(
  deadlineTime: json['deadlineTime'] as String,
  reminderTime: json['reminderTime'] as String,
  timezone: json['timezone'] as String,
);

Map<String, dynamic> _$$ElderCheckInSettingsImplToJson(
  _$ElderCheckInSettingsImpl instance,
) => <String, dynamic>{
  'deadlineTime': instance.deadlineTime,
  'reminderTime': instance.reminderTime,
  'timezone': instance.timezone,
};

_$ElderContactSummaryImpl _$$ElderContactSummaryImplFromJson(
  Map<String, dynamic> json,
) => _$ElderContactSummaryImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  isVerified: json['isVerified'] as bool,
);

Map<String, dynamic> _$$ElderContactSummaryImplToJson(
  _$ElderContactSummaryImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'isVerified': instance.isVerified,
};

_$ElderDetailImpl _$$ElderDetailImplFromJson(Map<String, dynamic> json) =>
    _$ElderDetailImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      lastCheckIn: json['lastCheckIn'] as String?,
      todayStatus: $enumDecode(_$ElderTodayStatusEnumMap, json['todayStatus']),
      isAccepted: json['isAccepted'] as bool,
      checkInSettings: json['checkInSettings'] == null
          ? null
          : ElderCheckInSettings.fromJson(
              json['checkInSettings'] as Map<String, dynamic>,
            ),
      pendingAlerts: (json['pendingAlerts'] as num).toInt(),
      emergencyContacts: (json['emergencyContacts'] as List<dynamic>)
          .map((e) => ElderContactSummary.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$$ElderDetailImplToJson(_$ElderDetailImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'email': instance.email,
      'lastCheckIn': instance.lastCheckIn,
      'todayStatus': _$ElderTodayStatusEnumMap[instance.todayStatus]!,
      'isAccepted': instance.isAccepted,
      'checkInSettings': instance.checkInSettings,
      'pendingAlerts': instance.pendingAlerts,
      'emergencyContacts': instance.emergencyContacts,
    };

_$CreateInvitationRequestImpl _$$CreateInvitationRequestImplFromJson(
  Map<String, dynamic> json,
) => _$CreateInvitationRequestImpl(
  relationshipType: $enumDecode(
    _$RelationshipTypeEnumMap,
    json['relationshipType'],
  ),
  targetEmail: json['targetEmail'] as String?,
  targetPhone: json['targetPhone'] as String?,
);

Map<String, dynamic> _$$CreateInvitationRequestImplToJson(
  _$CreateInvitationRequestImpl instance,
) => <String, dynamic>{
  'relationshipType': _$RelationshipTypeEnumMap[instance.relationshipType]!,
  'targetEmail': instance.targetEmail,
  'targetPhone': instance.targetPhone,
};

const _$RelationshipTypeEnumMap = {
  RelationshipType.caregiver: 'caregiver',
  RelationshipType.family: 'family',
  RelationshipType.caretaker: 'caretaker',
};

_$InvitationResponseImpl _$$InvitationResponseImplFromJson(
  Map<String, dynamic> json,
) => _$InvitationResponseImpl(
  id: json['id'] as String,
  token: json['token'] as String,
  relationshipType: $enumDecode(
    _$RelationshipTypeEnumMap,
    json['relationshipType'],
  ),
  targetEmail: json['targetEmail'] as String?,
  targetPhone: json['targetPhone'] as String?,
  expiresAt: json['expiresAt'] as String,
  inviterName: json['inviterName'] as String,
  qrUrl: json['qrUrl'] as String,
);

Map<String, dynamic> _$$InvitationResponseImplToJson(
  _$InvitationResponseImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'token': instance.token,
  'relationshipType': _$RelationshipTypeEnumMap[instance.relationshipType]!,
  'targetEmail': instance.targetEmail,
  'targetPhone': instance.targetPhone,
  'expiresAt': instance.expiresAt,
  'inviterName': instance.inviterName,
  'qrUrl': instance.qrUrl,
};

_$InvitationInviterImpl _$$InvitationInviterImplFromJson(
  Map<String, dynamic> json,
) => _$InvitationInviterImpl(
  id: json['id'] as String,
  name: json['name'] as String,
  email: json['email'] as String,
);

Map<String, dynamic> _$$InvitationInviterImplToJson(
  _$InvitationInviterImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'email': instance.email,
};

_$InvitationDetailsImpl _$$InvitationDetailsImplFromJson(
  Map<String, dynamic> json,
) => _$InvitationDetailsImpl(
  id: json['id'] as String,
  relationshipType: $enumDecode(
    _$RelationshipTypeEnumMap,
    json['relationshipType'],
  ),
  inviter: InvitationInviter.fromJson(json['inviter'] as Map<String, dynamic>),
  expiresAt: json['expiresAt'] as String,
  isExpired: json['isExpired'] as bool,
  isAccepted: json['isAccepted'] as bool,
);

Map<String, dynamic> _$$InvitationDetailsImplToJson(
  _$InvitationDetailsImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'relationshipType': _$RelationshipTypeEnumMap[instance.relationshipType]!,
  'inviter': instance.inviter,
  'expiresAt': instance.expiresAt,
  'isExpired': instance.isExpired,
  'isAccepted': instance.isAccepted,
};

_$CaregiverNoteImpl _$$CaregiverNoteImplFromJson(Map<String, dynamic> json) =>
    _$CaregiverNoteImpl(
      id: json['id'] as String,
      content: json['content'] as String,
      noteDate: json['noteDate'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$$CaregiverNoteImplToJson(_$CaregiverNoteImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'content': instance.content,
      'noteDate': instance.noteDate,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };

_$CreateNoteRequestImpl _$$CreateNoteRequestImplFromJson(
  Map<String, dynamic> json,
) => _$CreateNoteRequestImpl(
  content: json['content'] as String,
  noteDate: json['noteDate'] as String?,
);

Map<String, dynamic> _$$CreateNoteRequestImplToJson(
  _$CreateNoteRequestImpl instance,
) => <String, dynamic>{
  'content': instance.content,
  'noteDate': instance.noteDate,
};

_$CaretakerCheckInRequestImpl _$$CaretakerCheckInRequestImplFromJson(
  Map<String, dynamic> json,
) => _$CaretakerCheckInRequestImpl(note: json['note'] as String?);

Map<String, dynamic> _$$CaretakerCheckInRequestImplToJson(
  _$CaretakerCheckInRequestImpl instance,
) => <String, dynamic>{'note': instance.note};

_$CaretakerCheckInResponseImpl _$$CaretakerCheckInResponseImplFromJson(
  Map<String, dynamic> json,
) => _$CaretakerCheckInResponseImpl(
  checkInDate: json['checkInDate'] as String,
  checkedInAt: json['checkedInAt'] as String,
);

Map<String, dynamic> _$$CaretakerCheckInResponseImplToJson(
  _$CaretakerCheckInResponseImpl instance,
) => <String, dynamic>{
  'checkInDate': instance.checkInDate,
  'checkedInAt': instance.checkedInAt,
};
