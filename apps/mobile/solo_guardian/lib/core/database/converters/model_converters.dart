/**
 * @file model_converters.dart
 * @description Converters between local SQLite models and API models
 * @task TASK-102
 * @design_state_version 3.13.0
 */
import 'dart:convert';

import '../models/local_models.dart';
import '../models/sync_enums.dart';
import '../../../data/models/check_in.dart';
import '../../../data/models/contact.dart';
import '../../../data/models/settings.dart';

class CheckInConverter {
  static LocalCheckIn toLocal(CheckIn checkIn, String userId) {
    return LocalCheckIn(
      id: checkIn.id,
      userId: userId,
      checkInDate: checkIn.checkInDate,
      checkedInAt: checkIn.checkedInAt,
      note: checkIn.note,
      syncStatus: SyncStatus.synced,
      localCreatedAt: DateTime.now(),
    );
  }

  static CheckIn fromLocal(LocalCheckIn local) {
    return CheckIn(
      id: local.id,
      userId: local.userId,
      checkInDate: local.checkInDate,
      checkedInAt: local.checkedInAt,
      note: local.note,
    );
  }

  static LocalCheckIn createPending({
    required String id,
    required String userId,
    required String checkInDate,
    required String checkedInAt,
    String? note,
  }) {
    return LocalCheckIn(
      id: id,
      userId: userId,
      checkInDate: checkInDate,
      checkedInAt: checkedInAt,
      note: note,
      syncStatus: SyncStatus.pendingCreate,
      localCreatedAt: DateTime.now(),
    );
  }
}

class ContactConverter {
  static LocalContact toLocal(EmergencyContact contact) {
    return LocalContact(
      id: contact.id,
      userId: contact.userId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      priority: contact.priority,
      isVerified: contact.isVerified,
      phoneVerified: contact.phoneVerified,
      preferredChannel: contact.preferredChannel.index,
      isActive: contact.isActive,
      linkedUserId: contact.linkedUserId,
      linkedUserName: contact.linkedUserName,
      invitationStatus: contact.invitationStatus.index,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      syncStatus: SyncStatus.synced,
      localCreatedAt: DateTime.now(),
    );
  }

  static EmergencyContact fromLocal(LocalContact local) {
    return EmergencyContact(
      id: local.id,
      userId: local.userId,
      name: local.name,
      email: local.email,
      phone: local.phone,
      priority: local.priority,
      isVerified: local.isVerified,
      phoneVerified: local.phoneVerified,
      preferredChannel: NotificationChannel.values[local.preferredChannel],
      isActive: local.isActive,
      linkedUserId: local.linkedUserId,
      linkedUserName: local.linkedUserName,
      invitationStatus: InvitationStatus.values[local.invitationStatus],
      createdAt: local.createdAt,
      updatedAt: local.updatedAt,
    );
  }
}

class SettingsConverter {
  static LocalSettings toLocal(CheckInSettings settings) {
    return LocalSettings(
      userId: settings.userId,
      deadlineTime: settings.deadlineTime,
      reminderTime: settings.reminderTime,
      reminderEnabled: settings.reminderEnabled,
      timezone: settings.timezone,
      createdAt: settings.createdAt,
      updatedAt: settings.updatedAt,
      syncStatus: SyncStatus.synced,
      localCreatedAt: DateTime.now(),
    );
  }

  static CheckInSettings fromLocal(LocalSettings local) {
    return CheckInSettings(
      userId: local.userId,
      deadlineTime: local.deadlineTime,
      reminderTime: local.reminderTime,
      reminderEnabled: local.reminderEnabled,
      timezone: local.timezone,
      createdAt: local.createdAt,
      updatedAt: local.updatedAt,
    );
  }
}

class PendingOperationHelper {
  static PendingOperation createCheckInOperation({
    required String checkInId,
    required OperationType operationType,
    required Map<String, dynamic> data,
  }) {
    return PendingOperation(
      id: '${DateTime.now().millisecondsSinceEpoch}_checkin_$checkInId',
      operationType: operationType,
      entityType: EntityType.checkIn,
      entityId: checkInId,
      payload: jsonEncode(data),
      createdAt: DateTime.now(),
      retryCount: 0,
      status: OperationStatus.pending,
    );
  }

  static PendingOperation createContactOperation({
    required String contactId,
    required OperationType operationType,
    required Map<String, dynamic> data,
  }) {
    return PendingOperation(
      id: '${DateTime.now().millisecondsSinceEpoch}_contact_$contactId',
      operationType: operationType,
      entityType: EntityType.contact,
      entityId: contactId,
      payload: jsonEncode(data),
      createdAt: DateTime.now(),
      retryCount: 0,
      status: OperationStatus.pending,
    );
  }

  static PendingOperation createSettingsOperation({
    required String userId,
    required Map<String, dynamic> data,
  }) {
    return PendingOperation(
      id: '${DateTime.now().millisecondsSinceEpoch}_settings_$userId',
      operationType: OperationType.update,
      entityType: EntityType.settings,
      entityId: userId,
      payload: jsonEncode(data),
      createdAt: DateTime.now(),
      retryCount: 0,
      status: OperationStatus.pending,
    );
  }

  static Map<String, dynamic> decodePayload(PendingOperation op) {
    return jsonDecode(op.payload) as Map<String, dynamic>;
  }
}
