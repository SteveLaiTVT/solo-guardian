import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/check_in.dart';

part 'check_in_datasource.g.dart';

@RestApi()
abstract class CheckInDatasource {
  factory CheckInDatasource(Dio dio, {String baseUrl}) = _CheckInDatasource;

  @POST('/api/v1/check-ins')
  Future<dynamic> createCheckIn(@Body() Map<String, dynamic> request);

  @GET('/api/v1/check-ins/today')
  Future<dynamic> getTodayStatus();

  @GET('/api/v1/check-ins')
  Future<dynamic> getHistory(
    @Query('page') int page,
    @Query('pageSize') int pageSize,
  );
}

extension CheckInDatasourceExtension on CheckInDatasource {
  CheckIn parseCheckIn(dynamic response) {
    final map = response as Map<String, dynamic>;
    return CheckIn.fromJson(map);
  }

  TodayStatus parseTodayStatus(dynamic response) {
    final map = response as Map<String, dynamic>;
    return TodayStatus.fromJson(map);
  }

  CheckInHistory parseHistory(dynamic response) {
    final map = response as Map<String, dynamic>;
    return CheckInHistory.fromJson(map);
  }

  Map<String, dynamic> createCheckInRequest({String? note}) {
    return {if (note != null) 'note': note};
  }
}
