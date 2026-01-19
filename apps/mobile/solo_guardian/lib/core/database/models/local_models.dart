/**
 * @file local_models.dart
 * @description Local database model classes for SQLite storage
 * @task TASK-102
 * @design_state_version 3.13.0
 */
import 'sync_enums.dart';

class LocalCheckIn {
  final String id;
  final String userId;
  final String checkInDate;
  final String checkedInAt;
  final String? note;
  final SyncStatus syncStatus;
  final DateTime localCreatedAt;
  final DateTime? localUpdatedAt;

  LocalCheckIn({
    required this.id,
    required this.userId,
    required this.checkInDate,
    required this.checkedInAt,
    this.note,
    required this.syncStatus,
    required this.localCreatedAt,
    this.localUpdatedAt,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'user_id': userId,
    'check_in_date': checkInDate,
    'checked_in_at': checkedInAt,
    'note': note,
    'sync_status': syncStatus.index,
    'local_created_at': localCreatedAt.toIso8601String(),
    'local_updated_at': localUpdatedAt?.toIso8601String(),
  };

  factory LocalCheckIn.fromMap(Map<String, dynamic> map) => LocalCheckIn(
    id: map['id'] as String,
    userId: map['user_id'] as String,
    checkInDate: map['check_in_date'] as String,
    checkedInAt: map['checked_in_at'] as String,
    note: map['note'] as String?,
    syncStatus: SyncStatus.values[map['sync_status'] as int],
    localCreatedAt: DateTime.parse(map['local_created_at'] as String),
    localUpdatedAt: map['local_updated_at'] != null
        ? DateTime.parse(map['local_updated_at'] as String)
        : null,
  );

  LocalCheckIn copyWith({
    String? id,
    String? userId,
    String? checkInDate,
    String? checkedInAt,
    String? note,
    SyncStatus? syncStatus,
    DateTime? localCreatedAt,
    DateTime? localUpdatedAt,
  }) => LocalCheckIn(
    id: id ?? this.id,
    userId: userId ?? this.userId,
    checkInDate: checkInDate ?? this.checkInDate,
    checkedInAt: checkedInAt ?? this.checkedInAt,
    note: note ?? this.note,
    syncStatus: syncStatus ?? this.syncStatus,
    localCreatedAt: localCreatedAt ?? this.localCreatedAt,
    localUpdatedAt: localUpdatedAt ?? this.localUpdatedAt,
  );
}

class LocalContact {
  final String id;
  final String userId;
  final String name;
  final String email;
  final String? phone;
  final int priority;
  final bool isVerified;
  final bool phoneVerified;
  final int preferredChannel;
  final bool isActive;
  final String? linkedUserId;
  final String? linkedUserName;
  final int invitationStatus;
  final String createdAt;
  final String updatedAt;
  final SyncStatus syncStatus;
  final DateTime localCreatedAt;
  final DateTime? localUpdatedAt;

  LocalContact({
    required this.id,
    required this.userId,
    required this.name,
    required this.email,
    this.phone,
    required this.priority,
    required this.isVerified,
    required this.phoneVerified,
    required this.preferredChannel,
    required this.isActive,
    this.linkedUserId,
    this.linkedUserName,
    required this.invitationStatus,
    required this.createdAt,
    required this.updatedAt,
    required this.syncStatus,
    required this.localCreatedAt,
    this.localUpdatedAt,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'user_id': userId,
    'name': name,
    'email': email,
    'phone': phone,
    'priority': priority,
    'is_verified': isVerified ? 1 : 0,
    'phone_verified': phoneVerified ? 1 : 0,
    'preferred_channel': preferredChannel,
    'is_active': isActive ? 1 : 0,
    'linked_user_id': linkedUserId,
    'linked_user_name': linkedUserName,
    'invitation_status': invitationStatus,
    'created_at': createdAt,
    'updated_at': updatedAt,
    'sync_status': syncStatus.index,
    'local_created_at': localCreatedAt.toIso8601String(),
    'local_updated_at': localUpdatedAt?.toIso8601String(),
  };

  factory LocalContact.fromMap(Map<String, dynamic> map) => LocalContact(
    id: map['id'] as String,
    userId: map['user_id'] as String,
    name: map['name'] as String,
    email: map['email'] as String,
    phone: map['phone'] as String?,
    priority: map['priority'] as int,
    isVerified: (map['is_verified'] as int) == 1,
    phoneVerified: (map['phone_verified'] as int) == 1,
    preferredChannel: map['preferred_channel'] as int,
    isActive: (map['is_active'] as int) == 1,
    linkedUserId: map['linked_user_id'] as String?,
    linkedUserName: map['linked_user_name'] as String?,
    invitationStatus: map['invitation_status'] as int,
    createdAt: map['created_at'] as String,
    updatedAt: map['updated_at'] as String,
    syncStatus: SyncStatus.values[map['sync_status'] as int],
    localCreatedAt: DateTime.parse(map['local_created_at'] as String),
    localUpdatedAt: map['local_updated_at'] != null
        ? DateTime.parse(map['local_updated_at'] as String)
        : null,
  );

  LocalContact copyWith({
    String? id,
    String? userId,
    String? name,
    String? email,
    String? phone,
    int? priority,
    bool? isVerified,
    bool? phoneVerified,
    int? preferredChannel,
    bool? isActive,
    String? linkedUserId,
    String? linkedUserName,
    int? invitationStatus,
    String? createdAt,
    String? updatedAt,
    SyncStatus? syncStatus,
    DateTime? localCreatedAt,
    DateTime? localUpdatedAt,
  }) => LocalContact(
    id: id ?? this.id,
    userId: userId ?? this.userId,
    name: name ?? this.name,
    email: email ?? this.email,
    phone: phone ?? this.phone,
    priority: priority ?? this.priority,
    isVerified: isVerified ?? this.isVerified,
    phoneVerified: phoneVerified ?? this.phoneVerified,
    preferredChannel: preferredChannel ?? this.preferredChannel,
    isActive: isActive ?? this.isActive,
    linkedUserId: linkedUserId ?? this.linkedUserId,
    linkedUserName: linkedUserName ?? this.linkedUserName,
    invitationStatus: invitationStatus ?? this.invitationStatus,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncStatus: syncStatus ?? this.syncStatus,
    localCreatedAt: localCreatedAt ?? this.localCreatedAt,
    localUpdatedAt: localUpdatedAt ?? this.localUpdatedAt,
  );
}

class LocalSettings {
  final String userId;
  final String deadlineTime;
  final String reminderTime;
  final bool reminderEnabled;
  final String timezone;
  final String createdAt;
  final String updatedAt;
  final SyncStatus syncStatus;
  final DateTime localCreatedAt;
  final DateTime? localUpdatedAt;

  LocalSettings({
    required this.userId,
    required this.deadlineTime,
    required this.reminderTime,
    required this.reminderEnabled,
    required this.timezone,
    required this.createdAt,
    required this.updatedAt,
    required this.syncStatus,
    required this.localCreatedAt,
    this.localUpdatedAt,
  });

  Map<String, dynamic> toMap() => {
    'user_id': userId,
    'deadline_time': deadlineTime,
    'reminder_time': reminderTime,
    'reminder_enabled': reminderEnabled ? 1 : 0,
    'timezone': timezone,
    'created_at': createdAt,
    'updated_at': updatedAt,
    'sync_status': syncStatus.index,
    'local_created_at': localCreatedAt.toIso8601String(),
    'local_updated_at': localUpdatedAt?.toIso8601String(),
  };

  factory LocalSettings.fromMap(Map<String, dynamic> map) => LocalSettings(
    userId: map['user_id'] as String,
    deadlineTime: map['deadline_time'] as String,
    reminderTime: map['reminder_time'] as String,
    reminderEnabled: (map['reminder_enabled'] as int) == 1,
    timezone: map['timezone'] as String,
    createdAt: map['created_at'] as String,
    updatedAt: map['updated_at'] as String,
    syncStatus: SyncStatus.values[map['sync_status'] as int],
    localCreatedAt: DateTime.parse(map['local_created_at'] as String),
    localUpdatedAt: map['local_updated_at'] != null
        ? DateTime.parse(map['local_updated_at'] as String)
        : null,
  );

  LocalSettings copyWith({
    String? userId,
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
    String? timezone,
    String? createdAt,
    String? updatedAt,
    SyncStatus? syncStatus,
    DateTime? localCreatedAt,
    DateTime? localUpdatedAt,
  }) => LocalSettings(
    userId: userId ?? this.userId,
    deadlineTime: deadlineTime ?? this.deadlineTime,
    reminderTime: reminderTime ?? this.reminderTime,
    reminderEnabled: reminderEnabled ?? this.reminderEnabled,
    timezone: timezone ?? this.timezone,
    createdAt: createdAt ?? this.createdAt,
    updatedAt: updatedAt ?? this.updatedAt,
    syncStatus: syncStatus ?? this.syncStatus,
    localCreatedAt: localCreatedAt ?? this.localCreatedAt,
    localUpdatedAt: localUpdatedAt ?? this.localUpdatedAt,
  );
}

class PendingOperation {
  final String id;
  final OperationType operationType;
  final EntityType entityType;
  final String entityId;
  final String payload;
  final DateTime createdAt;
  final int retryCount;
  final OperationStatus status;
  final String? errorMessage;
  final DateTime? lastAttemptAt;

  PendingOperation({
    required this.id,
    required this.operationType,
    required this.entityType,
    required this.entityId,
    required this.payload,
    required this.createdAt,
    required this.retryCount,
    required this.status,
    this.errorMessage,
    this.lastAttemptAt,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'operation_type': operationType.index,
    'entity_type': entityType.index,
    'entity_id': entityId,
    'payload': payload,
    'created_at': createdAt.toIso8601String(),
    'retry_count': retryCount,
    'status': status.index,
    'error_message': errorMessage,
    'last_attempt_at': lastAttemptAt?.toIso8601String(),
  };

  factory PendingOperation.fromMap(Map<String, dynamic> map) => PendingOperation(
    id: map['id'] as String,
    operationType: OperationType.values[map['operation_type'] as int],
    entityType: EntityType.values[map['entity_type'] as int],
    entityId: map['entity_id'] as String,
    payload: map['payload'] as String,
    createdAt: DateTime.parse(map['created_at'] as String),
    retryCount: map['retry_count'] as int,
    status: OperationStatus.values[map['status'] as int],
    errorMessage: map['error_message'] as String?,
    lastAttemptAt: map['last_attempt_at'] != null
        ? DateTime.parse(map['last_attempt_at'] as String)
        : null,
  );

  PendingOperation copyWith({
    String? id,
    OperationType? operationType,
    EntityType? entityType,
    String? entityId,
    String? payload,
    DateTime? createdAt,
    int? retryCount,
    OperationStatus? status,
    String? errorMessage,
    DateTime? lastAttemptAt,
  }) => PendingOperation(
    id: id ?? this.id,
    operationType: operationType ?? this.operationType,
    entityType: entityType ?? this.entityType,
    entityId: entityId ?? this.entityId,
    payload: payload ?? this.payload,
    createdAt: createdAt ?? this.createdAt,
    retryCount: retryCount ?? this.retryCount,
    status: status ?? this.status,
    errorMessage: errorMessage ?? this.errorMessage,
    lastAttemptAt: lastAttemptAt ?? this.lastAttemptAt,
  );
}
