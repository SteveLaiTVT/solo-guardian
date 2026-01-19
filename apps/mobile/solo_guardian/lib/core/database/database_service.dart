/**
 * @file database_service.dart
 * @description SQLite database service for offline-first data persistence
 * @task TASK-102
 * @design_state_version 3.13.0
 */
import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DatabaseService {
  static Database? _database;
  static const String _databaseName = 'solo_guardian.db';
  static const int _databaseVersion = 1;

  static Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDatabase();
    return _database!;
  }

  static Future<Database> _initDatabase() async {
    final databasesPath = await getDatabasesPath();
    final path = join(databasesPath, _databaseName);

    return await openDatabase(
      path,
      version: _databaseVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  static Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE local_check_ins (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        check_in_date TEXT NOT NULL,
        checked_in_at TEXT NOT NULL,
        note TEXT,
        sync_status INTEGER NOT NULL DEFAULT 0,
        local_created_at TEXT NOT NULL,
        local_updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE INDEX idx_check_ins_user_id ON local_check_ins(user_id)
    ''');

    await db.execute('''
      CREATE INDEX idx_check_ins_date ON local_check_ins(check_in_date)
    ''');

    await db.execute('''
      CREATE TABLE local_contacts (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        priority INTEGER NOT NULL,
        is_verified INTEGER NOT NULL DEFAULT 0,
        phone_verified INTEGER NOT NULL DEFAULT 0,
        preferred_channel INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        linked_user_id TEXT,
        linked_user_name TEXT,
        invitation_status INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        sync_status INTEGER NOT NULL DEFAULT 0,
        local_created_at TEXT NOT NULL,
        local_updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE INDEX idx_contacts_user_id ON local_contacts(user_id)
    ''');

    await db.execute('''
      CREATE TABLE local_settings (
        user_id TEXT PRIMARY KEY,
        deadline_time TEXT NOT NULL,
        reminder_time TEXT NOT NULL,
        reminder_enabled INTEGER NOT NULL DEFAULT 1,
        timezone TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        sync_status INTEGER NOT NULL DEFAULT 0,
        local_created_at TEXT NOT NULL,
        local_updated_at TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE pending_operations (
        id TEXT PRIMARY KEY,
        operation_type INTEGER NOT NULL,
        entity_type INTEGER NOT NULL,
        entity_id TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        retry_count INTEGER NOT NULL DEFAULT 0,
        status INTEGER NOT NULL DEFAULT 0,
        error_message TEXT,
        last_attempt_at TEXT
      )
    ''');

    await db.execute('''
      CREATE INDEX idx_pending_ops_status ON pending_operations(status)
    ''');
  }

  static Future<void> _onUpgrade(
    Database db,
    int oldVersion,
    int newVersion,
  ) async {
  }

  static Future<void> close() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
  }

  static Future<void> clearAll() async {
    final db = await database;
    await db.delete('local_check_ins');
    await db.delete('local_contacts');
    await db.delete('local_settings');
    await db.delete('pending_operations');
  }

  static Future<void> clearUserData(String userId) async {
    final db = await database;
    await db.delete('local_check_ins', where: 'user_id = ?', whereArgs: [userId]);
    await db.delete('local_contacts', where: 'user_id = ?', whereArgs: [userId]);
    await db.delete('local_settings', where: 'user_id = ?', whereArgs: [userId]);
  }
}
