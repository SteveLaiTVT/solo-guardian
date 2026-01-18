import '../../domain/repositories/settings_repository.dart';
import '../datasources/settings_datasource.dart';
import '../models/settings.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  final SettingsDatasource _datasource;

  SettingsRepositoryImpl({required SettingsDatasource datasource})
      : _datasource = datasource;

  @override
  Future<CheckInSettings> getSettings() async {
    final response = await _datasource.getSettings();
    return _datasource.parseSettings(response);
  }

  @override
  Future<CheckInSettings> updateSettings({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) async {
    final response = await _datasource.updateSettings(
      _datasource.updateSettingsRequest(
        deadlineTime: deadlineTime,
        reminderTime: reminderTime,
        reminderEnabled: reminderEnabled,
      ),
    );
    return _datasource.parseSettings(response);
  }
}
