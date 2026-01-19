/**
 * @file sync_manager.dart
 * @description Manages sync queue processing for offline-first operations
 * @task TASK-104
 * @design_state_version 3.13.0
 */
import 'dart:async';

import 'package:flutter/foundation.dart';

import '../database/models/local_models.dart';
import '../network/connectivity_service.dart';
import '../../data/datasources/local/local_datasources.dart';
import '../../data/repositories/offline_first_check_in_repository.dart';
import '../../data/repositories/offline_first_contacts_repository.dart';
import '../../data/repositories/offline_first_settings_repository.dart';

enum SyncState {
  idle,
  syncing,
  error,
}

class SyncManager {
  final ConnectivityService _connectivityService;
  final PendingOperationsLocalDatasource _pendingOpsDatasource;
  OfflineFirstCheckInRepository? _checkInRepository;
  OfflineFirstContactsRepository? _contactsRepository;
  OfflineFirstSettingsRepository? _settingsRepository;

  static const int maxRetries = 5;
  static const List<int> backoffDelays = [1, 2, 4, 8, 16];

  final StreamController<SyncState> _stateController =
      StreamController<SyncState>.broadcast();
  final StreamController<int> _pendingCountController =
      StreamController<int>.broadcast();

  SyncState _currentState = SyncState.idle;
  bool _isSyncing = false;
  Timer? _retryTimer;

  SyncManager({
    required ConnectivityService connectivityService,
    required PendingOperationsLocalDatasource pendingOpsDatasource,
  })  : _connectivityService = connectivityService,
        _pendingOpsDatasource = pendingOpsDatasource;

  SyncState get currentState => _currentState;
  Stream<SyncState> get stateStream => _stateController.stream;
  Stream<int> get pendingCountStream => _pendingCountController.stream;

  void setRepositories({
    OfflineFirstCheckInRepository? checkInRepository,
    OfflineFirstContactsRepository? contactsRepository,
    OfflineFirstSettingsRepository? settingsRepository,
  }) {
    _checkInRepository = checkInRepository;
    _contactsRepository = contactsRepository;
    _settingsRepository = settingsRepository;
  }

  void initialize() {
    _connectivityService.addOnConnectedCallback(_onConnected);
    _updatePendingCount();
  }

  void _onConnected() {
    debugPrint('SyncManager: Network connected, starting sync');
    syncAll();
  }

  Future<void> syncAll() async {
    if (_isSyncing) {
      debugPrint('SyncManager: Already syncing, skipping');
      return;
    }

    if (!_connectivityService.isOnline) {
      debugPrint('SyncManager: Offline, skipping sync');
      return;
    }

    _isSyncing = true;
    _setState(SyncState.syncing);

    try {
      await _syncCheckIns();
      await _syncContacts();
      await _syncSettings();
      await _processRemainingOperations();

      await _pendingOpsDatasource.deleteCompletedOperations();
      await _updatePendingCount();

      _setState(SyncState.idle);
    } catch (e) {
      debugPrint('SyncManager: Sync error: $e');
      _setState(SyncState.error);
      _scheduleRetry();
    } finally {
      _isSyncing = false;
    }
  }

  Future<void> _syncCheckIns() async {
    if (_checkInRepository != null) {
      try {
        await _checkInRepository!.syncPendingCheckIns();
      } catch (e) {
        debugPrint('SyncManager: Check-in sync error: $e');
      }
    }
  }

  Future<void> _syncContacts() async {
    if (_contactsRepository != null) {
      try {
        await _contactsRepository!.syncPendingContacts();
      } catch (e) {
        debugPrint('SyncManager: Contacts sync error: $e');
      }
    }
  }

  Future<void> _syncSettings() async {
    if (_settingsRepository != null) {
      try {
        await _settingsRepository!.syncPendingSettings();
      } catch (e) {
        debugPrint('SyncManager: Settings sync error: $e');
      }
    }
  }

  Future<void> _processRemainingOperations() async {
    final operations = await _pendingOpsDatasource.getPendingOperations();

    for (final operation in operations) {
      if (operation.retryCount >= maxRetries) {
        await _pendingOpsDatasource.markAsFailed(
          operation.id,
          'Max retries exceeded',
        );
        continue;
      }

      try {
        await _pendingOpsDatasource.markAsInProgress(operation.id);
        await _processOperation(operation);
        await _pendingOpsDatasource.markAsCompleted(operation.id);
      } catch (e) {
        await _pendingOpsDatasource.incrementRetryCount(operation.id);
        await _pendingOpsDatasource.markAsFailed(operation.id, e.toString());
      }
    }
  }

  Future<void> _processOperation(PendingOperation operation) async {
    debugPrint('SyncManager: Processing operation ${operation.id}');
  }

  void _scheduleRetry() {
    _retryTimer?.cancel();

    final failedOps = _pendingOpsDatasource.getFailedOperations();
    failedOps.then((operations) {
      if (operations.isEmpty) return;

      final minRetry = operations
          .map((op) => op.retryCount)
          .reduce((a, b) => a < b ? a : b);

      final delayIndex = minRetry < backoffDelays.length
          ? minRetry
          : backoffDelays.length - 1;
      final delay = Duration(seconds: backoffDelays[delayIndex]);

      debugPrint('SyncManager: Scheduling retry in ${delay.inSeconds}s');

      _retryTimer = Timer(delay, () {
        if (_connectivityService.isOnline) {
          _retryFailedOperations();
        }
      });
    });
  }

  Future<void> _retryFailedOperations() async {
    final failedOps = await _pendingOpsDatasource.getFailedOperations();

    for (final op in failedOps) {
      if (op.retryCount < maxRetries) {
        await _pendingOpsDatasource.resetToPending(op.id);
      }
    }

    await syncAll();
  }

  Future<void> retryAllFailed() async {
    final failedOps = await _pendingOpsDatasource.getFailedOperations();

    for (final op in failedOps) {
      await _pendingOpsDatasource.resetToPending(op.id);
    }

    await syncAll();
  }

  Future<int> getPendingCount() async {
    return await _pendingOpsDatasource.getPendingCount();
  }

  Future<void> _updatePendingCount() async {
    final count = await getPendingCount();
    _pendingCountController.add(count);
  }

  void _setState(SyncState state) {
    _currentState = state;
    _stateController.add(state);
  }

  void dispose() {
    _retryTimer?.cancel();
    _connectivityService.removeOnConnectedCallback(_onConnected);
    _stateController.close();
    _pendingCountController.close();
  }
}
