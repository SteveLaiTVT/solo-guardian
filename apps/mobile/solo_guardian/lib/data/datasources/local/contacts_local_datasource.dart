/**
 * @file contacts_local_datasource.dart
 * @description Local datasource for emergency contacts using SQLite
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import 'package:sqflite/sqflite.dart';

import '../../../core/database/database_service.dart';
import '../../../core/database/models/local_models.dart';
import '../../../core/database/models/sync_enums.dart';
import '../../../core/database/converters/model_converters.dart';
import '../../models/contact.dart';

class ContactsLocalDatasource {
  Future<Database> get _db => DatabaseService.database;

  Future<void> saveContact(EmergencyContact contact) async {
    final db = await _db;
    final local = ContactConverter.toLocal(contact);

    await db.insert(
      'local_contacts',
      local.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> saveContacts(List<EmergencyContact> contacts) async {
    final db = await _db;

    final batch = db.batch();
    for (final contact in contacts) {
      final local = ContactConverter.toLocal(contact);
      batch.insert(
        'local_contacts',
        local.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<List<EmergencyContact>> getContacts(String userId) async {
    final db = await _db;
    final results = await db.query(
      'local_contacts',
      where: 'user_id = ? AND sync_status != ?',
      whereArgs: [userId, SyncStatus.pendingDelete.index],
      orderBy: 'priority ASC',
    );

    return results
        .map((map) => ContactConverter.fromLocal(LocalContact.fromMap(map)))
        .toList();
  }

  Future<EmergencyContact?> getContact(String id) async {
    final db = await _db;
    final results = await db.query(
      'local_contacts',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );

    if (results.isEmpty) return null;
    return ContactConverter.fromLocal(LocalContact.fromMap(results.first));
  }

  Future<LocalContact> createPendingContact({
    required String id,
    required String userId,
    required String name,
    required String email,
    String? phone,
    int? priority,
    NotificationChannel? preferredChannel,
  }) async {
    final db = await _db;
    final now = DateTime.now();

    final countResult = await db.rawQuery(
      'SELECT COUNT(*) as count FROM local_contacts WHERE user_id = ? AND sync_status != ?',
      [userId, SyncStatus.pendingDelete.index],
    );
    final contactCount = Sqflite.firstIntValue(countResult) ?? 0;

    final local = LocalContact(
      id: id,
      userId: userId,
      name: name,
      email: email,
      phone: phone,
      priority: priority ?? (contactCount + 1),
      isVerified: false,
      phoneVerified: false,
      preferredChannel: preferredChannel?.index ?? NotificationChannel.email.index,
      isActive: true,
      invitationStatus: InvitationStatus.none.index,
      createdAt: now.toIso8601String(),
      updatedAt: now.toIso8601String(),
      syncStatus: SyncStatus.pendingCreate,
      localCreatedAt: now,
    );

    await db.insert('local_contacts', local.toMap());
    return local;
  }

  Future<void> updatePendingContact({
    required String id,
    String? name,
    String? email,
    String? phone,
    int? priority,
    bool? isActive,
    NotificationChannel? preferredChannel,
  }) async {
    final db = await _db;
    final now = DateTime.now();

    final updates = <String, dynamic>{
      'updated_at': now.toIso8601String(),
      'local_updated_at': now.toIso8601String(),
    };

    if (name != null) updates['name'] = name;
    if (email != null) updates['email'] = email;
    if (phone != null) updates['phone'] = phone;
    if (priority != null) updates['priority'] = priority;
    if (isActive != null) updates['is_active'] = isActive ? 1 : 0;
    if (preferredChannel != null) updates['preferred_channel'] = preferredChannel.index;

    final results = await db.query(
      'local_contacts',
      where: 'id = ?',
      whereArgs: [id],
      limit: 1,
    );

    if (results.isNotEmpty) {
      final current = LocalContact.fromMap(results.first);
      if (current.syncStatus == SyncStatus.synced) {
        updates['sync_status'] = SyncStatus.pendingUpdate.index;
      }
    }

    await db.update(
      'local_contacts',
      updates,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> markForDeletion(String id) async {
    final db = await _db;

    await db.update(
      'local_contacts',
      {
        'sync_status': SyncStatus.pendingDelete.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> deleteContact(String id) async {
    final db = await _db;
    await db.delete('local_contacts', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> updateSyncStatus(String id, SyncStatus status) async {
    final db = await _db;

    await db.update(
      'local_contacts',
      {
        'sync_status': status.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<LocalContact>> getPendingContacts() async {
    final db = await _db;

    final results = await db.query(
      'local_contacts',
      where: 'sync_status IN (?, ?, ?)',
      whereArgs: [
        SyncStatus.pendingCreate.index,
        SyncStatus.pendingUpdate.index,
        SyncStatus.pendingDelete.index,
      ],
    );

    return results.map((map) => LocalContact.fromMap(map)).toList();
  }

  Future<void> markAsSynced(String localId, EmergencyContact serverContact) async {
    final db = await _db;

    await db.update(
      'local_contacts',
      {
        'id': serverContact.id,
        'is_verified': serverContact.isVerified ? 1 : 0,
        'phone_verified': serverContact.phoneVerified ? 1 : 0,
        'linked_user_id': serverContact.linkedUserId,
        'linked_user_name': serverContact.linkedUserName,
        'sync_status': SyncStatus.synced.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [localId],
    );
  }

  Future<void> replaceAllContacts(String userId, List<EmergencyContact> contacts) async {
    final db = await _db;

    final pendingResults = await db.query(
      'local_contacts',
      columns: ['id'],
      where: 'user_id = ? AND sync_status != ?',
      whereArgs: [userId, SyncStatus.synced.index],
    );
    final pendingIds = pendingResults.map((r) => r['id'] as String).toSet();

    await db.delete(
      'local_contacts',
      where: 'user_id = ? AND sync_status = ?',
      whereArgs: [userId, SyncStatus.synced.index],
    );

    final batch = db.batch();
    for (final contact in contacts) {
      if (!pendingIds.contains(contact.id)) {
        final local = ContactConverter.toLocal(contact);
        batch.insert('local_contacts', local.toMap());
      }
    }
    await batch.commit(noResult: true);
  }

  Future<void> clearUserData(String userId) async {
    final db = await _db;
    await db.delete('local_contacts', where: 'user_id = ?', whereArgs: [userId]);
  }
}
