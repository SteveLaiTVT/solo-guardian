// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contact.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$EmergencyContactImpl _$$EmergencyContactImplFromJson(
  Map<String, dynamic> json,
) => _$EmergencyContactImpl(
  id: json['id'] as String,
  userId: json['userId'] as String,
  name: json['name'] as String,
  email: json['email'] as String,
  phone: json['phone'] as String?,
  priority: (json['priority'] as num).toInt(),
  isVerified: json['isVerified'] as bool,
  phoneVerified: json['phoneVerified'] as bool,
  preferredChannel: $enumDecode(
    _$NotificationChannelEnumMap,
    json['preferredChannel'],
  ),
  isActive: json['isActive'] as bool,
  linkedUserId: json['linkedUserId'] as String?,
  linkedUserName: json['linkedUserName'] as String?,
  invitationStatus: $enumDecode(
    _$InvitationStatusEnumMap,
    json['invitationStatus'],
  ),
  createdAt: json['createdAt'] as String,
  updatedAt: json['updatedAt'] as String,
);

Map<String, dynamic> _$$EmergencyContactImplToJson(
  _$EmergencyContactImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'userId': instance.userId,
  'name': instance.name,
  'email': instance.email,
  'phone': instance.phone,
  'priority': instance.priority,
  'isVerified': instance.isVerified,
  'phoneVerified': instance.phoneVerified,
  'preferredChannel': _$NotificationChannelEnumMap[instance.preferredChannel]!,
  'isActive': instance.isActive,
  'linkedUserId': instance.linkedUserId,
  'linkedUserName': instance.linkedUserName,
  'invitationStatus': _$InvitationStatusEnumMap[instance.invitationStatus]!,
  'createdAt': instance.createdAt,
  'updatedAt': instance.updatedAt,
};

const _$NotificationChannelEnumMap = {
  NotificationChannel.email: 'email',
  NotificationChannel.sms: 'sms',
};

const _$InvitationStatusEnumMap = {
  InvitationStatus.none: 'none',
  InvitationStatus.pending: 'pending',
  InvitationStatus.accepted: 'accepted',
};

_$CreateContactRequestImpl _$$CreateContactRequestImplFromJson(
  Map<String, dynamic> json,
) => _$CreateContactRequestImpl(
  name: json['name'] as String,
  email: json['email'] as String,
  phone: json['phone'] as String?,
  priority: (json['priority'] as num?)?.toInt(),
  preferredChannel: $enumDecodeNullable(
    _$NotificationChannelEnumMap,
    json['preferredChannel'],
  ),
);

Map<String, dynamic> _$$CreateContactRequestImplToJson(
  _$CreateContactRequestImpl instance,
) => <String, dynamic>{
  'name': instance.name,
  'email': instance.email,
  'phone': instance.phone,
  'priority': instance.priority,
  'preferredChannel': _$NotificationChannelEnumMap[instance.preferredChannel],
};

_$UpdateContactRequestImpl _$$UpdateContactRequestImplFromJson(
  Map<String, dynamic> json,
) => _$UpdateContactRequestImpl(
  name: json['name'] as String?,
  email: json['email'] as String?,
  phone: json['phone'] as String?,
  priority: (json['priority'] as num?)?.toInt(),
  isActive: json['isActive'] as bool?,
  preferredChannel: $enumDecodeNullable(
    _$NotificationChannelEnumMap,
    json['preferredChannel'],
  ),
);

Map<String, dynamic> _$$UpdateContactRequestImplToJson(
  _$UpdateContactRequestImpl instance,
) => <String, dynamic>{
  'name': instance.name,
  'email': instance.email,
  'phone': instance.phone,
  'priority': instance.priority,
  'isActive': instance.isActive,
  'preferredChannel': _$NotificationChannelEnumMap[instance.preferredChannel],
};

_$ReorderContactsRequestImpl _$$ReorderContactsRequestImplFromJson(
  Map<String, dynamic> json,
) => _$ReorderContactsRequestImpl(
  contactIds: (json['contactIds'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
);

Map<String, dynamic> _$$ReorderContactsRequestImplToJson(
  _$ReorderContactsRequestImpl instance,
) => <String, dynamic>{'contactIds': instance.contactIds};

_$LinkedContactImpl _$$LinkedContactImplFromJson(Map<String, dynamic> json) =>
    _$LinkedContactImpl(
      id: json['id'] as String,
      elderName: json['elderName'] as String,
      elderEmail: json['elderEmail'] as String,
      contactName: json['contactName'] as String,
      relationshipSince: json['relationshipSince'] as String,
      hasActiveAlerts: json['hasActiveAlerts'] as bool,
    );

Map<String, dynamic> _$$LinkedContactImplToJson(_$LinkedContactImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'elderName': instance.elderName,
      'elderEmail': instance.elderEmail,
      'contactName': instance.contactName,
      'relationshipSince': instance.relationshipSince,
      'hasActiveAlerts': instance.hasActiveAlerts,
    };

_$PendingContactInvitationImpl _$$PendingContactInvitationImplFromJson(
  Map<String, dynamic> json,
) => _$PendingContactInvitationImpl(
  id: json['id'] as String,
  elderName: json['elderName'] as String,
  elderEmail: json['elderEmail'] as String,
  contactName: json['contactName'] as String,
  invitedAt: json['invitedAt'] as String,
);

Map<String, dynamic> _$$PendingContactInvitationImplToJson(
  _$PendingContactInvitationImpl instance,
) => <String, dynamic>{
  'id': instance.id,
  'elderName': instance.elderName,
  'elderEmail': instance.elderEmail,
  'contactName': instance.contactName,
  'invitedAt': instance.invitedAt,
};

_$ContactLinkInvitationDetailsImpl _$$ContactLinkInvitationDetailsImplFromJson(
  Map<String, dynamic> json,
) => _$ContactLinkInvitationDetailsImpl(
  contactId: json['contactId'] as String,
  elderName: json['elderName'] as String,
  elderEmail: json['elderEmail'] as String,
  contactName: json['contactName'] as String,
);

Map<String, dynamic> _$$ContactLinkInvitationDetailsImplToJson(
  _$ContactLinkInvitationDetailsImpl instance,
) => <String, dynamic>{
  'contactId': instance.contactId,
  'elderName': instance.elderName,
  'elderEmail': instance.elderEmail,
  'contactName': instance.contactName,
};

_$AcceptContactLinkResultImpl _$$AcceptContactLinkResultImplFromJson(
  Map<String, dynamic> json,
) => _$AcceptContactLinkResultImpl(
  success: json['success'] as bool,
  elderName: json['elderName'] as String,
);

Map<String, dynamic> _$$AcceptContactLinkResultImplToJson(
  _$AcceptContactLinkResultImpl instance,
) => <String, dynamic>{
  'success': instance.success,
  'elderName': instance.elderName,
};

_$VerifyContactResultImpl _$$VerifyContactResultImplFromJson(
  Map<String, dynamic> json,
) => _$VerifyContactResultImpl(
  success: json['success'] as bool,
  contactName: json['contactName'] as String,
  userName: json['userName'] as String,
);

Map<String, dynamic> _$$VerifyContactResultImplToJson(
  _$VerifyContactResultImpl instance,
) => <String, dynamic>{
  'success': instance.success,
  'contactName': instance.contactName,
  'userName': instance.userName,
};

_$SendPhoneVerificationResultImpl _$$SendPhoneVerificationResultImplFromJson(
  Map<String, dynamic> json,
) => _$SendPhoneVerificationResultImpl(
  message: json['message'] as String,
  expiresAt: json['expiresAt'] as String,
);

Map<String, dynamic> _$$SendPhoneVerificationResultImplToJson(
  _$SendPhoneVerificationResultImpl instance,
) => <String, dynamic>{
  'message': instance.message,
  'expiresAt': instance.expiresAt,
};

_$VerifyPhoneRequestImpl _$$VerifyPhoneRequestImplFromJson(
  Map<String, dynamic> json,
) => _$VerifyPhoneRequestImpl(otp: json['otp'] as String);

Map<String, dynamic> _$$VerifyPhoneRequestImplToJson(
  _$VerifyPhoneRequestImpl instance,
) => <String, dynamic>{'otp': instance.otp};

_$VerifyPhoneResultImpl _$$VerifyPhoneResultImplFromJson(
  Map<String, dynamic> json,
) => _$VerifyPhoneResultImpl(
  success: json['success'] as bool,
  message: json['message'] as String,
);

Map<String, dynamic> _$$VerifyPhoneResultImplToJson(
  _$VerifyPhoneResultImpl instance,
) => <String, dynamic>{
  'success': instance.success,
  'message': instance.message,
};
