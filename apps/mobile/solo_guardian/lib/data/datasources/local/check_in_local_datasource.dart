/**
 * @file check_in_local_datasource.dart
 * @description Local datasource for check-in data using SQLite
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import 'package:sqflite/sqflite.dart';

import '../../../core/database/database_service.dart';
import '../../../core/database/models/local_models.dart';
import '../../../core/database/models/sync_enums.dart';
import '../../../core/database/converters/model_converters.dart';
import '../../models/check_in.dart';

class CheckInLocalDatasource {
  Future<Database> get _db => DatabaseService.database;

  Future<void> saveCheckIn(CheckIn checkIn, String userId) async {
    final db = await _db;
    final local = CheckInConverter.toLocal(checkIn, userId);

    await db.insert(
      'local_check_ins',
      local.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> saveCheckIns(List<CheckIn> checkIns, String userId) async {
    final db = await _db;

    final batch = db.batch();
    for (final checkIn in checkIns) {
      final local = CheckInConverter.toLocal(checkIn, userId);
      batch.insert(
        'local_check_ins',
        local.toMap(),
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
    }
    await batch.commit(noResult: true);
  }

  Future<CheckIn?> getCheckInByDate(String userId, String date) async {
    final db = await _db;
    final results = await db.query(
      'local_check_ins',
      where: 'user_id = ? AND check_in_date = ?',
      whereArgs: [userId, date],
      limit: 1,
    );

    if (results.isEmpty) return null;
    return CheckInConverter.fromLocal(LocalCheckIn.fromMap(results.first));
  }

  Future<CheckIn?> getTodayCheckIn(String userId) async {
    final today = DateTime.now().toIso8601String().split('T')[0];
    return getCheckInByDate(userId, today);
  }

  Future<List<CheckIn>> getHistory(
    String userId, {
    int page = 1,
    int pageSize = 30,
  }) async {
    final db = await _db;
    final offset = (page - 1) * pageSize;

    final results = await db.query(
      'local_check_ins',
      where: 'user_id = ?',
      whereArgs: [userId],
      orderBy: 'check_in_date DESC',
      limit: pageSize,
      offset: offset,
    );

    return results
        .map((map) => CheckInConverter.fromLocal(LocalCheckIn.fromMap(map)))
        .toList();
  }

  Future<int> getHistoryCount(String userId) async {
    final db = await _db;
    final result = await db.rawQuery(
      'SELECT COUNT(*) as count FROM local_check_ins WHERE user_id = ?',
      [userId],
    );
    return Sqflite.firstIntValue(result) ?? 0;
  }

  Future<LocalCheckIn> createPendingCheckIn({
    required String id,
    required String userId,
    String? note,
  }) async {
    final db = await _db;
    final now = DateTime.now();
    final today = now.toIso8601String().split('T')[0];

    final local = CheckInConverter.createPending(
      id: id,
      userId: userId,
      checkInDate: today,
      checkedInAt: now.toIso8601String(),
      note: note,
    );

    await db.insert('local_check_ins', local.toMap());
    return local;
  }

  Future<void> updateSyncStatus(String id, SyncStatus status) async {
    final db = await _db;

    await db.update(
      'local_check_ins',
      {
        'sync_status': status.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<LocalCheckIn>> getPendingCheckIns() async {
    final db = await _db;

    final results = await db.query(
      'local_check_ins',
      where: 'sync_status IN (?, ?)',
      whereArgs: [SyncStatus.pendingCreate.index, SyncStatus.pendingUpdate.index],
    );

    return results.map((map) => LocalCheckIn.fromMap(map)).toList();
  }

  Future<void> markAsSynced(
    String localId,
    CheckIn serverCheckIn,
    String userId,
  ) async {
    final db = await _db;

    await db.update(
      'local_check_ins',
      {
        'id': serverCheckIn.id,
        'checked_in_at': serverCheckIn.checkedInAt,
        'sync_status': SyncStatus.synced.index,
        'local_updated_at': DateTime.now().toIso8601String(),
      },
      where: 'id = ?',
      whereArgs: [localId],
    );
  }

  Future<void> clearUserData(String userId) async {
    final db = await _db;
    await db.delete(
      'local_check_ins',
      where: 'user_id = ?',
      whereArgs: [userId],
    );
  }
}
