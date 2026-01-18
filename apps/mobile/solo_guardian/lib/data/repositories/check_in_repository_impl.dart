import '../../domain/repositories/check_in_repository.dart';
import '../datasources/check_in_datasource.dart';
import '../models/check_in.dart';

class CheckInRepositoryImpl implements CheckInRepository {
  final CheckInDatasource _datasource;

  CheckInRepositoryImpl({required CheckInDatasource datasource})
      : _datasource = datasource;

  @override
  Future<CheckIn> createCheckIn({String? note}) async {
    final response = await _datasource.createCheckIn(
      _datasource.createCheckInRequest(note: note),
    );
    return _datasource.parseCheckIn(response);
  }

  @override
  Future<TodayStatus> getTodayStatus() async {
    final response = await _datasource.getTodayStatus();
    return _datasource.parseTodayStatus(response);
  }

  @override
  Future<CheckInHistory> getHistory({int page = 1, int pageSize = 30}) async {
    final response = await _datasource.getHistory(page, pageSize);
    return _datasource.parseHistory(response);
  }
}
