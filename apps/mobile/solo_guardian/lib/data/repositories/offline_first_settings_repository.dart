/**
 * @file offline_first_settings_repository.dart
 * @description Offline-first repository for check-in settings
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import '../../core/database/models/sync_enums.dart';
import '../../core/database/converters/model_converters.dart';
import '../../domain/repositories/settings_repository.dart';
import '../datasources/settings_datasource.dart';
import '../datasources/local/local_datasources.dart';
import '../models/settings.dart';

class OfflineFirstSettingsRepository implements SettingsRepository {
  final SettingsDatasource _remoteDatasource;
  final SettingsLocalDatasource _localDatasource;
  final PendingOperationsLocalDatasource _pendingOpsDatasource;
  final String Function() _getUserId;
  final bool Function() _isOnline;

  OfflineFirstSettingsRepository({
    required SettingsDatasource remoteDatasource,
    required SettingsLocalDatasource localDatasource,
    required PendingOperationsLocalDatasource pendingOpsDatasource,
    required String Function() getUserId,
    required bool Function() isOnline,
  })  : _remoteDatasource = remoteDatasource,
        _localDatasource = localDatasource,
        _pendingOpsDatasource = pendingOpsDatasource,
        _getUserId = getUserId,
        _isOnline = isOnline;

  @override
  Future<CheckInSettings> getSettings() async {
    final userId = _getUserId();

    final localSettings = await _localDatasource.getSettings(userId);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.getSettings();
        final serverSettings = _remoteDatasource.parseSettings(response);

        await _localDatasource.saveSettings(serverSettings);

        return serverSettings;
      } catch (e) {
        if (localSettings != null) {
          return localSettings;
        }
        rethrow;
      }
    } else {
      if (localSettings != null) {
        return localSettings;
      }

      return CheckInSettings(
        userId: userId,
        deadlineTime: '10:00',
        reminderTime: '09:00',
        reminderEnabled: true,
        timezone: DateTime.now().timeZoneName,
        createdAt: DateTime.now().toIso8601String(),
        updatedAt: DateTime.now().toIso8601String(),
      );
    }
  }

  @override
  Future<CheckInSettings> updateSettings({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) async {
    final userId = _getUserId();

    await _localDatasource.updatePendingSettings(
      userId: userId,
      deadlineTime: deadlineTime,
      reminderTime: reminderTime,
      reminderEnabled: reminderEnabled,
    );

    final localSettings = await _localDatasource.getSettings(userId);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.updateSettings(
          _remoteDatasource.updateSettingsRequest(
            deadlineTime: deadlineTime,
            reminderTime: reminderTime,
            reminderEnabled: reminderEnabled,
          ),
        );
        final serverSettings = _remoteDatasource.parseSettings(response);

        await _localDatasource.markAsSynced(userId, serverSettings);

        return serverSettings;
      } catch (e) {
        await _queueSettingsOperation(
          userId: userId,
          data: {
            'deadlineTime': deadlineTime,
            'reminderTime': reminderTime,
            'reminderEnabled': reminderEnabled,
          },
        );
        return localSettings!;
      }
    } else {
      await _queueSettingsOperation(
        userId: userId,
        data: {
          'deadlineTime': deadlineTime,
          'reminderTime': reminderTime,
          'reminderEnabled': reminderEnabled,
        },
      );
      return localSettings!;
    }
  }

  Future<void> _queueSettingsOperation({
    required String userId,
    required Map<String, dynamic> data,
  }) async {
    final operation = PendingOperationHelper.createSettingsOperation(
      userId: userId,
      data: data,
    );

    await _pendingOpsDatasource.addOperation(operation);
  }

  Future<void> syncPendingSettings() async {
    if (!_isOnline()) return;

    final userId = _getUserId();
    final pendingSettings = await _localDatasource.getPendingSettings(userId);

    if (pendingSettings != null) {
      try {
        final response = await _remoteDatasource.updateSettings(
          _remoteDatasource.updateSettingsRequest(
            deadlineTime: pendingSettings.deadlineTime,
            reminderTime: pendingSettings.reminderTime,
            reminderEnabled: pendingSettings.reminderEnabled,
          ),
        );
        final serverSettings = _remoteDatasource.parseSettings(response);

        await _localDatasource.markAsSynced(userId, serverSettings);

        final operations = await _pendingOpsDatasource.getOperationsByEntity(
          EntityType.settings,
          userId,
        );
        for (final op in operations) {
          await _pendingOpsDatasource.markAsCompleted(op.id);
        }
      } catch (e) {
        await _localDatasource.updateSyncStatus(
          userId,
          SyncStatus.failed,
        );
      }
    }
  }

  Future<void> clearLocalData() async {
    final userId = _getUserId();
    await _localDatasource.clearUserData(userId);
  }
}
