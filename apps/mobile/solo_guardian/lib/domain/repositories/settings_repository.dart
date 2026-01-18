import '../../data/models/settings.dart';

abstract class SettingsRepository {
  Future<CheckInSettings> getSettings();
  Future<CheckInSettings> updateSettings({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  });
}
