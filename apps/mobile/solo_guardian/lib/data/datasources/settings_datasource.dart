import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/settings.dart';

part 'settings_datasource.g.dart';

@RestApi()
abstract class SettingsDatasource {
  factory SettingsDatasource(Dio dio, {String baseUrl}) = _SettingsDatasource;

  @GET('/api/v1/check-in-settings')
  Future<dynamic> getSettings();

  @PUT('/api/v1/check-in-settings')
  Future<dynamic> updateSettings(@Body() Map<String, dynamic> request);
}

extension SettingsDatasourceExtension on SettingsDatasource {
  CheckInSettings parseSettings(dynamic response) {
    final map = response as Map<String, dynamic>;
    return CheckInSettings.fromJson(map);
  }

  Map<String, dynamic> updateSettingsRequest({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  }) {
    return {
      if (deadlineTime != null) 'deadlineTime': deadlineTime,
      if (reminderTime != null) 'reminderTime': reminderTime,
      if (reminderEnabled != null) 'reminderEnabled': reminderEnabled,
    };
  }
}
