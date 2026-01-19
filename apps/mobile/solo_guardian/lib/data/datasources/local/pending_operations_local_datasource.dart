/**
 * @file pending_operations_local_datasource.dart
 * @description Local datasource for pending sync operations using SQLite
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import 'package:sqflite/sqflite.dart';

import '../../../core/database/database_service.dart';
import '../../../core/database/models/local_models.dart';
import '../../../core/database/models/sync_enums.dart';

class PendingOperationsLocalDatasource {
  Future<Database> get _db => DatabaseService.database;

  Future<void> addOperation(PendingOperation operation) async {
    final db = await _db;
    await db.insert('pending_operations', operation.toMap());
  }

  Future<List<PendingOperation>> getPendingOperations() async {
    final db = await _db;

    final results = await db.query(
      'pending_operations',
      where: 'status = ?',
      whereArgs: [OperationStatus.pending.index],
      orderBy: 'created_at ASC',
    );

    return results.map((map) => PendingOperation.fromMap(map)).toList();
  }

  Future<List<PendingOperation>> getFailedOperations() async {
    final db = await _db;

    final results = await db.query(
      'pending_operations',
      where: 'status = ?',
      whereArgs: [OperationStatus.failed.index],
    );

    return results.map((map) => PendingOperation.fromMap(map)).toList();
  }

  Future<List<PendingOperation>> getOperationsByEntity(
    EntityType entityType,
    String entityId,
  ) async {
    final db = await _db;

    final results = await db.query(
      'pending_operations',
      where: 'entity_type = ? AND entity_id = ?',
      whereArgs: [entityType.index, entityId],
    );

    return results.map((map) => PendingOperation.fromMap(map)).toList();
  }

  Future<void> updateOperationStatus(
    String id,
    OperationStatus status, {
    String? errorMessage,
  }) async {
    final db = await _db;

    final updates = <String, dynamic>{
      'status': status.index,
      'last_attempt_at': DateTime.now().toIso8601String(),
    };

    if (errorMessage != null) {
      updates['error_message'] = errorMessage;
    }

    await db.update(
      'pending_operations',
      updates,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<void> incrementRetryCount(String id) async {
    final db = await _db;

    await db.rawUpdate(
      'UPDATE pending_operations SET retry_count = retry_count + 1, last_attempt_at = ? WHERE id = ?',
      [DateTime.now().toIso8601String(), id],
    );
  }

  Future<void> markAsInProgress(String id) async {
    await updateOperationStatus(id, OperationStatus.inProgress);
  }

  Future<void> markAsCompleted(String id) async {
    await updateOperationStatus(id, OperationStatus.completed);
  }

  Future<void> markAsFailed(String id, String errorMessage) async {
    await updateOperationStatus(id, OperationStatus.failed, errorMessage: errorMessage);
  }

  Future<void> resetToPending(String id) async {
    await updateOperationStatus(id, OperationStatus.pending);
  }

  Future<void> deleteOperation(String id) async {
    final db = await _db;
    await db.delete('pending_operations', where: 'id = ?', whereArgs: [id]);
  }

  Future<void> deleteCompletedOperations() async {
    final db = await _db;
    await db.delete(
      'pending_operations',
      where: 'status = ?',
      whereArgs: [OperationStatus.completed.index],
    );
  }

  Future<int> getPendingCount() async {
    final db = await _db;

    final result = await db.rawQuery(
      'SELECT COUNT(*) as count FROM pending_operations WHERE status IN (?, ?)',
      [OperationStatus.pending.index, OperationStatus.failed.index],
    );

    return Sqflite.firstIntValue(result) ?? 0;
  }

  Future<void> clearAll() async {
    final db = await _db;
    await db.delete('pending_operations');
  }
}
