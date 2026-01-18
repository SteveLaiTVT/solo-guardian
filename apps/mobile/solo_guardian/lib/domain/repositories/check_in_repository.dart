import '../../data/models/check_in.dart';

abstract class CheckInRepository {
  Future<CheckIn> createCheckIn({String? note});
  Future<TodayStatus> getTodayStatus();
  Future<CheckInHistory> getHistory({int page = 1, int pageSize = 30});
}
