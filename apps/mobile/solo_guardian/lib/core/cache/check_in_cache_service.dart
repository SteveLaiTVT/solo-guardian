import 'package:flutter/foundation.dart';
import 'package:sqflite/sqflite.dart' show ConflictAlgorithm;
import '../database/database_service.dart';
import '../../data/models/check_in.dart';

class CheckInCacheService {
  static final CheckInCacheService _instance = CheckInCacheService._internal();
  factory CheckInCacheService() => _instance;
  CheckInCacheService._internal();

  Future<void> cacheTodayStatus(String userId, TodayStatus status) async {
    try {
      final db = await DatabaseService.database;
      final now = DateTime.now().toIso8601String();

      // Store today status in a special cache table
      await db.insert(
        'cached_today_status',
        {
          'user_id': userId,
          'has_checked_in': status.hasCheckedIn ? 1 : 0,
          'is_overdue': status.isOverdue ? 1 : 0,
          'deadline_time': status.deadlineTime,
          'check_in_id': status.checkIn?.id,
          'check_in_date': status.checkIn?.checkInDate,
          'checked_in_at': status.checkIn?.checkedInAt,
          'check_in_note': status.checkIn?.note,
          'cached_at': now,
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
      debugPrint('CheckInCacheService: Cached today status for user $userId');
    } catch (e) {
      debugPrint('CheckInCacheService: Error caching today status: $e');
    }
  }

  Future<TodayStatus?> getCachedTodayStatus(String userId) async {
    try {
      final db = await DatabaseService.database;
      final results = await db.query(
        'cached_today_status',
        where: 'user_id = ?',
        whereArgs: [userId],
      );

      if (results.isEmpty) {
        debugPrint('CheckInCacheService: No cached status for user $userId');
        return null;
      }

      final row = results.first;
      final cachedAt = DateTime.parse(row['cached_at'] as String);
      final now = DateTime.now();

      // Cache is valid for 1 hour
      if (now.difference(cachedAt).inHours > 1) {
        debugPrint('CheckInCacheService: Cache expired for user $userId');
        return null;
      }

      CheckIn? checkIn;
      if (row['check_in_id'] != null) {
        checkIn = CheckIn(
          id: row['check_in_id'] as String,
          userId: userId,
          checkInDate: row['check_in_date'] as String,
          checkedInAt: row['checked_in_at'] as String,
          note: row['check_in_note'] as String?,
        );
      }

      debugPrint('CheckInCacheService: Retrieved cached status for user $userId');
      return TodayStatus(
        hasCheckedIn: row['has_checked_in'] == 1,
        isOverdue: row['is_overdue'] == 1,
        deadlineTime: row['deadline_time'] as String,
        checkIn: checkIn,
      );
    } catch (e) {
      debugPrint('CheckInCacheService: Error getting cached status: $e');
      return null;
    }
  }

  Future<void> cacheCheckIn(String userId, CheckIn checkIn) async {
    try {
      final db = await DatabaseService.database;
      final now = DateTime.now().toIso8601String();

      await db.insert(
        'local_check_ins',
        {
          'id': checkIn.id,
          'user_id': userId,
          'check_in_date': checkIn.checkInDate,
          'checked_in_at': checkIn.checkedInAt,
          'note': checkIn.note,
          'sync_status': 1, // synced from server
          'local_created_at': now,
        },
        conflictAlgorithm: ConflictAlgorithm.replace,
      );
      debugPrint('CheckInCacheService: Cached check-in ${checkIn.id}');
    } catch (e) {
      debugPrint('CheckInCacheService: Error caching check-in: $e');
    }
  }

  Future<void> clearCache(String userId) async {
    try {
      final db = await DatabaseService.database;
      await db.delete('cached_today_status', where: 'user_id = ?', whereArgs: [userId]);
      debugPrint('CheckInCacheService: Cleared cache for user $userId');
    } catch (e) {
      debugPrint('CheckInCacheService: Error clearing cache: $e');
    }
  }

  static Future<void> ensureTableExists() async {
    try {
      final db = await DatabaseService.database;
      await db.execute('''
        CREATE TABLE IF NOT EXISTS cached_today_status (
          user_id TEXT PRIMARY KEY,
          has_checked_in INTEGER NOT NULL,
          is_overdue INTEGER NOT NULL,
          deadline_time TEXT NOT NULL,
          check_in_id TEXT,
          check_in_date TEXT,
          checked_in_at TEXT,
          check_in_note TEXT,
          cached_at TEXT NOT NULL
        )
      ''');
      debugPrint('CheckInCacheService: Ensured cache table exists');
    } catch (e) {
      debugPrint('CheckInCacheService: Error creating cache table: $e');
    }
  }
}
