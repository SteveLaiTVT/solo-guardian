/**
 * @file offline_first_check_in_repository.dart
 * @description Offline-first repository for check-ins with local-first reads and sync queue
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import '../../core/database/models/sync_enums.dart';
import '../../core/database/converters/model_converters.dart';
import '../../domain/repositories/check_in_repository.dart';
import '../datasources/check_in_datasource.dart';
import '../datasources/local/local_datasources.dart';
import '../models/check_in.dart';

class OfflineFirstCheckInRepository implements CheckInRepository {
  final CheckInDatasource _remoteDatasource;
  final CheckInLocalDatasource _localDatasource;
  final PendingOperationsLocalDatasource _pendingOpsDatasource;
  final String Function() _getUserId;
  final bool Function() _isOnline;

  OfflineFirstCheckInRepository({
    required CheckInDatasource remoteDatasource,
    required CheckInLocalDatasource localDatasource,
    required PendingOperationsLocalDatasource pendingOpsDatasource,
    required String Function() getUserId,
    required bool Function() isOnline,
  })  : _remoteDatasource = remoteDatasource,
        _localDatasource = localDatasource,
        _pendingOpsDatasource = pendingOpsDatasource,
        _getUserId = getUserId,
        _isOnline = isOnline;

  @override
  Future<CheckIn> createCheckIn({String? note}) async {
    final userId = _getUserId();
    final tempId = 'temp_${DateTime.now().millisecondsSinceEpoch}';

    final localCheckIn = await _localDatasource.createPendingCheckIn(
      id: tempId,
      userId: userId,
      note: note,
    );

    final checkIn = CheckInConverter.fromLocal(localCheckIn);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.createCheckIn(
          _remoteDatasource.createCheckInRequest(note: note),
        );
        final serverCheckIn = _remoteDatasource.parseCheckIn(response);

        await _localDatasource.markAsSynced(tempId, serverCheckIn, userId);

        return serverCheckIn;
      } catch (e) {
        await _queueCheckInOperation(
          localId: tempId,
          operationType: OperationType.create,
          data: {'note': note},
        );
        return checkIn;
      }
    } else {
      await _queueCheckInOperation(
        localId: tempId,
        operationType: OperationType.create,
        data: {'note': note},
      );
      return checkIn;
    }
  }

  @override
  Future<TodayStatus> getTodayStatus() async {
    final userId = _getUserId();

    final localCheckIn = await _localDatasource.getTodayCheckIn(userId);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.getTodayStatus();
        final serverStatus = _remoteDatasource.parseTodayStatus(response);

        if (serverStatus.checkIn != null) {
          await _localDatasource.saveCheckIn(serverStatus.checkIn!, userId);
        }

        return serverStatus;
      } catch (e) {
        if (localCheckIn != null) {
          return TodayStatus(
            hasCheckedIn: true,
            checkIn: localCheckIn,
            deadlineTime: '10:00',
            isOverdue: false,
          );
        }
        rethrow;
      }
    } else {
      return TodayStatus(
        hasCheckedIn: localCheckIn != null,
        checkIn: localCheckIn,
        deadlineTime: '10:00',
        isOverdue: false,
      );
    }
  }

  @override
  Future<CheckInHistory> getHistory({int page = 1, int pageSize = 30}) async {
    final userId = _getUserId();

    final localCheckIns = await _localDatasource.getHistory(
      userId,
      page: page,
      pageSize: pageSize,
    );
    final localTotal = await _localDatasource.getHistoryCount(userId);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.getHistory(page, pageSize);
        final serverHistory = _remoteDatasource.parseHistory(response);

        await _localDatasource.saveCheckIns(serverHistory.checkIns, userId);

        return serverHistory;
      } catch (e) {
        return CheckInHistory(
          checkIns: localCheckIns,
          total: localTotal,
          page: page,
          pageSize: pageSize,
        );
      }
    } else {
      return CheckInHistory(
        checkIns: localCheckIns,
        total: localTotal,
        page: page,
        pageSize: pageSize,
      );
    }
  }

  Future<void> _queueCheckInOperation({
    required String localId,
    required OperationType operationType,
    required Map<String, dynamic> data,
  }) async {
    final operation = PendingOperationHelper.createCheckInOperation(
      checkInId: localId,
      operationType: operationType,
      data: data,
    );

    await _pendingOpsDatasource.addOperation(operation);
  }

  Future<void> syncPendingCheckIns() async {
    if (!_isOnline()) return;

    final pendingCheckIns = await _localDatasource.getPendingCheckIns();
    final userId = _getUserId();

    for (final local in pendingCheckIns) {
      if (local.syncStatus == SyncStatus.pendingCreate) {
        try {
          final response = await _remoteDatasource.createCheckIn(
            _remoteDatasource.createCheckInRequest(note: local.note),
          );
          final serverCheckIn = _remoteDatasource.parseCheckIn(response);

          await _localDatasource.markAsSynced(local.id, serverCheckIn, userId);

          final operations = await _pendingOpsDatasource.getOperationsByEntity(
            EntityType.checkIn,
            local.id,
          );
          for (final op in operations) {
            await _pendingOpsDatasource.markAsCompleted(op.id);
          }
        } catch (e) {
          await _localDatasource.updateSyncStatus(
            local.id,
            SyncStatus.failed,
          );
        }
      }
    }
  }

  Future<void> clearLocalData() async {
    final userId = _getUserId();
    await _localDatasource.clearUserData(userId);
  }
}
