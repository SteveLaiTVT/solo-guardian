import 'package:flutter/foundation.dart';
import '../../core/cache/check_in_cache_service.dart';
import '../../core/network/connectivity_service.dart';
import '../../domain/repositories/check_in_repository.dart';
import '../datasources/check_in_datasource.dart';
import '../models/check_in.dart';

class CheckInRepositoryImpl implements CheckInRepository {
  final CheckInDatasource _datasource;
  final ConnectivityService _connectivity;
  final CheckInCacheService _cacheService;
  final String? Function() _getUserId;

  CheckInRepositoryImpl({
    required CheckInDatasource datasource,
    ConnectivityService? connectivity,
    CheckInCacheService? cacheService,
    String? Function()? getUserId,
  })  : _datasource = datasource,
        _connectivity = connectivity ?? ConnectivityService(),
        _cacheService = cacheService ?? CheckInCacheService(),
        _getUserId = getUserId ?? (() => null);

  @override
  Future<CheckIn> createCheckIn({String? note}) async {
    final response = await _datasource.createCheckIn(
      _datasource.createCheckInRequest(note: note),
    );
    final checkIn = _datasource.parseCheckIn(response);

    // Cache the check-in
    final userId = _getUserId();
    if (userId != null) {
      await _cacheService.cacheCheckIn(userId, checkIn);
    }

    return checkIn;
  }

  @override
  Future<TodayStatus> getTodayStatus() async {
    final userId = _getUserId();

    // Try to get from network first
    try {
      final response = await _datasource.getTodayStatus();
      final status = _datasource.parseTodayStatus(response);

      // Cache the result if we have a user ID
      if (userId != null) {
        await _cacheService.cacheTodayStatus(userId, status);
      }

      return status;
    } catch (e) {
      debugPrint('CheckInRepository: Network error, checking cache: $e');

      // If offline or network error, try to get from cache
      if (!_connectivity.isOnline || e.toString().contains('SocketException')) {
        if (userId != null) {
          final cachedStatus = await _cacheService.getCachedTodayStatus(userId);
          if (cachedStatus != null) {
            debugPrint('CheckInRepository: Returning cached status');
            return cachedStatus;
          }
        }
      }

      // Re-throw if we can't get cached data
      rethrow;
    }
  }

  @override
  Future<CheckInHistory> getHistory({int page = 1, int pageSize = 30}) async {
    final response = await _datasource.getHistory(page, pageSize);
    return _datasource.parseHistory(response);
  }
}
