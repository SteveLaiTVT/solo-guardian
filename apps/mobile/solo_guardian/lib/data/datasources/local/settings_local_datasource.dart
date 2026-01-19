/**
 * @file settings_local_datasource.dart
 * @description Local datasource for check-in settings using SQLite
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import 'package:sqflite/sqflite.dart';

import '../../../core/database/database_service.dart';
import '../../../core/database/models/local_models.dart';
import '../../../core/database/models/sync_enums.dart';
import '../../../core/database/converters/model_converters.dart';
import '../../models/settings.dart';

class SettingsLocalDatasource {
  Future<Database> get _db => DatabaseService.database;

  Future<void> saveSettings(CheckInSettings settings) async {
    final db = await _db;
    final local = SettingsConverter.toLocal(settings);

    await db.insert(
      'local_settings',
      local.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<CheckInSettings?> getSettings(String userId) async {
    final db = await _db;
    final results = await db.query(
      'local_settings',
      where: 'user_id = ?',
      whereArgs: [userId],
      limit: 1,
    );

    if (results.isEmpty) return null;
    return SettingsConverter.fromLocal(LocalSettings.fromMap(results.first));
  }

  Future<void> updatePendingSettings({
    required String userId,
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) async {
    final db = await _db;
    final now = DateTime.now();

    final results = await db.query(
      'local_settings',
      where: 'user_id = ?',
      whereArgs: [userId],
      limit: 1,
    );

    if (results.isEmpty) {
      final local = LocalSettings(
        userId: userId,
        deadlineTime: deadlineTime ?? '10:00',
        reminderTime: reminderTime ?? '09:00',
        reminderEnabled: reminderEnabled ?? true,
        timezone: now.timeZoneName,
        createdAt: now.toIso8601String(),
        updatedAt: now.toIso8601String(),
        syncStatus: SyncStatus.pendingUpdate,
        localCreatedAt: now,
      );
      await db.insert('local_settings', local.toMap());
    } else {
      final current = LocalSettings.fromMap(results.first);

      final updates = <String, dynamic>{
        'updated_at': now.toIso8601String(),
        'local_updated_at': now.toIso8601String(),
      };

      if (deadlineTime != null) updates['deadline_time'] = deadlineTime;
      if (reminderTime != null) updates['reminder_time'] = reminderTime;
      if (reminderEnabled != null) updates['reminder_enabled'] = reminderEnabled ? 1 : 0;

      if (current.syncStatus == SyncStatus.synced) {
        updates['sync_status'] = SyncStatus.pendingUpdate.index;
      }

      await db.update(
        'local_settings',
        updates,
        where: 'user_id = ?',
        whereArgs: [userId],
      );
    }
  }

  Future<void> updateSyncStatus(String userId, SyncStatus status) async {
    final db = await _db;

    await db.update(
      'local_settings',
      {
        'sync_status': status.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'user_id = ?',
      whereArgs: [userId],
    );
  }

  Future<LocalSettings?> getPendingSettings(String userId) async {
    final db = await _db;

    final results = await db.query(
      'local_settings',
      where: 'user_id = ? AND sync_status = ?',
      whereArgs: [userId, SyncStatus.pendingUpdate.index],
      limit: 1,
    );

    if (results.isEmpty) return null;
    return LocalSettings.fromMap(results.first);
  }

  Future<void> markAsSynced(String userId, CheckInSettings serverSettings) async {
    final db = await _db;

    await db.update(
      'local_settings',
      {
        'deadline_time': serverSettings.deadlineTime,
        'reminder_time': serverSettings.reminderTime,
        'reminder_enabled': serverSettings.reminderEnabled ? 1 : 0,
        'timezone': serverSettings.timezone,
        'updated_at': serverSettings.updatedAt,
        'sync_status': SyncStatus.synced.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'user_id = ?',
      whereArgs: [userId],
    );
  }

  Future<void> clearUserData(String userId) async {
    final db = await _db;
    await db.delete('local_settings', where: 'user_id = ?', whereArgs: [userId]);
  }
}
