import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:solo_guardian/core/cache/check_in_cache_service.dart';
import 'package:solo_guardian/core/network/connectivity_service.dart';
import 'package:solo_guardian/data/datasources/check_in_datasource.dart';
import 'package:solo_guardian/data/models/check_in.dart';
import 'package:solo_guardian/data/repositories/check_in_repository_impl.dart';

class MockCheckInDatasource extends Mock implements CheckInDatasource {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockCheckInCacheService extends Mock implements CheckInCacheService {}

void main() {
  late CheckInRepositoryImpl repository;
  late MockCheckInDatasource mockDatasource;
  late MockConnectivityService mockConnectivity;
  late MockCheckInCacheService mockCacheService;
  late String? currentUserId;

  setUp(() {
    mockDatasource = MockCheckInDatasource();
    mockConnectivity = MockConnectivityService();
    mockCacheService = MockCheckInCacheService();
    currentUserId = 'test-user-id';

    repository = CheckInRepositoryImpl(
      datasource: mockDatasource,
      connectivity: mockConnectivity,
      cacheService: mockCacheService,
      getUserId: () => currentUserId,
    );
  });

  group('getTodayStatus', () {
    final testStatus = TodayStatus(
      hasCheckedIn: true,
      isOverdue: false,
      deadlineTime: '21:00',
      checkIn: CheckIn(
        id: 'check-in-1',
        userId: 'test-user-id',
        checkInDate: '2026-01-20',
        checkedInAt: '2026-01-20T10:30:00Z',
      ),
    );

    test('returns status from datasource and caches it', () async {
      when(() => mockDatasource.getTodayStatus())
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseTodayStatus(any()))
          .thenReturn(testStatus);
      when(() => mockCacheService.cacheTodayStatus(any(), any()))
          .thenAnswer((_) async {});

      final result = await repository.getTodayStatus();

      expect(result, testStatus);
      verify(() => mockCacheService.cacheTodayStatus('test-user-id', testStatus))
          .called(1);
    });

    test('returns cached status when network fails and offline', () async {
      when(() => mockDatasource.getTodayStatus())
          .thenThrow(Exception('Network error'));
      when(() => mockConnectivity.isOnline).thenReturn(false);
      when(() => mockCacheService.getCachedTodayStatus(any()))
          .thenAnswer((_) async => testStatus);

      final result = await repository.getTodayStatus();

      expect(result, testStatus);
      verify(() => mockCacheService.getCachedTodayStatus('test-user-id'))
          .called(1);
    });

    test('throws when network fails and no cache available', () async {
      when(() => mockDatasource.getTodayStatus())
          .thenThrow(Exception('Network error'));
      when(() => mockConnectivity.isOnline).thenReturn(false);
      when(() => mockCacheService.getCachedTodayStatus(any()))
          .thenAnswer((_) async => null);

      expect(
        () => repository.getTodayStatus(),
        throwsException,
      );
    });

    test('throws when network fails while online (not a connectivity issue)', () async {
      when(() => mockDatasource.getTodayStatus())
          .thenThrow(Exception('Server error'));
      when(() => mockConnectivity.isOnline).thenReturn(true);

      expect(
        () => repository.getTodayStatus(),
        throwsException,
      );
    });

    test('does not cache when user ID is null', () async {
      currentUserId = null;

      when(() => mockDatasource.getTodayStatus())
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseTodayStatus(any()))
          .thenReturn(testStatus);

      final result = await repository.getTodayStatus();

      expect(result, testStatus);
      verifyNever(() => mockCacheService.cacheTodayStatus(any(), any()));
    });
  });

  group('createCheckIn', () {
    final testCheckIn = CheckIn(
      id: 'check-in-1',
      userId: 'test-user-id',
      checkInDate: '2026-01-20',
      checkedInAt: '2026-01-20T10:30:00Z',
    );

    test('creates check-in and caches it', () async {
      when(() => mockDatasource.createCheckInRequest(note: any(named: 'note')))
          .thenReturn({'note': null});
      when(() => mockDatasource.createCheckIn(any()))
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseCheckIn(any()))
          .thenReturn(testCheckIn);
      when(() => mockCacheService.cacheCheckIn(any(), any()))
          .thenAnswer((_) async {});

      final result = await repository.createCheckIn();

      expect(result, testCheckIn);
      verify(() => mockCacheService.cacheCheckIn('test-user-id', testCheckIn))
          .called(1);
    });

    test('creates check-in with note', () async {
      when(() => mockDatasource.createCheckInRequest(note: 'Feeling great!'))
          .thenReturn({'note': 'Feeling great!'});
      when(() => mockDatasource.createCheckIn(any()))
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseCheckIn(any()))
          .thenReturn(testCheckIn);
      when(() => mockCacheService.cacheCheckIn(any(), any()))
          .thenAnswer((_) async {});

      await repository.createCheckIn(note: 'Feeling great!');

      verify(() => mockDatasource.createCheckInRequest(note: 'Feeling great!'))
          .called(1);
    });

    test('does not cache when user ID is null', () async {
      currentUserId = null;

      when(() => mockDatasource.createCheckInRequest(note: any(named: 'note')))
          .thenReturn({'note': null});
      when(() => mockDatasource.createCheckIn(any()))
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseCheckIn(any()))
          .thenReturn(testCheckIn);

      await repository.createCheckIn();

      verifyNever(() => mockCacheService.cacheCheckIn(any(), any()));
    });
  });

  group('getHistory', () {
    final testHistory = CheckInHistory(
      checkIns: [
        CheckIn(
          id: 'check-in-1',
          userId: 'test-user-id',
          checkInDate: '2026-01-20',
          checkedInAt: '2026-01-20T10:30:00Z',
        ),
      ],
      total: 1,
    );

    test('returns history from datasource', () async {
      when(() => mockDatasource.getHistory(any(), any()))
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseHistory(any()))
          .thenReturn(testHistory);

      final result = await repository.getHistory();

      expect(result, testHistory);
      verify(() => mockDatasource.getHistory(1, 30)).called(1);
    });

    test('uses custom page and pageSize', () async {
      when(() => mockDatasource.getHistory(any(), any()))
          .thenAnswer((_) async => {'data': {}});
      when(() => mockDatasource.parseHistory(any()))
          .thenReturn(testHistory);

      await repository.getHistory(page: 2, pageSize: 10);

      verify(() => mockDatasource.getHistory(2, 10)).called(1);
    });
  });
}
