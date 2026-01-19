/**
 * @file offline_providers.dart
 * @description Riverpod providers for offline-first functionality
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/connectivity_service.dart';
import '../../core/sync/sync_manager.dart';
import '../../data/datasources/local/local_datasources.dart';
import '../../data/repositories/offline_first_check_in_repository.dart';
import '../../data/repositories/offline_first_contacts_repository.dart';
import '../../data/repositories/offline_first_settings_repository.dart';
import '../../domain/repositories/check_in_repository.dart';
import '../../domain/repositories/contacts_repository.dart';
import '../../domain/repositories/settings_repository.dart';
import 'core_providers.dart';
import 'auth_provider.dart';

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  final service = ConnectivityService();
  ref.onDispose(() => service.dispose());
  return service;
});

final checkInLocalDatasourceProvider = Provider<CheckInLocalDatasource>((ref) {
  return CheckInLocalDatasource();
});

final contactsLocalDatasourceProvider = Provider<ContactsLocalDatasource>((ref) {
  return ContactsLocalDatasource();
});

final settingsLocalDatasourceProvider = Provider<SettingsLocalDatasource>((ref) {
  return SettingsLocalDatasource();
});

final pendingOperationsLocalDatasourceProvider =
    Provider<PendingOperationsLocalDatasource>((ref) {
  return PendingOperationsLocalDatasource();
});

final syncManagerProvider = Provider<SyncManager>((ref) {
  final connectivity = ref.watch(connectivityServiceProvider);
  final pendingOps = ref.watch(pendingOperationsLocalDatasourceProvider);

  final manager = SyncManager(
    connectivityService: connectivity,
    pendingOpsDatasource: pendingOps,
  );

  manager.initialize();

  ref.onDispose(() => manager.dispose());

  return manager;
});

final offlineFirstCheckInRepositoryProvider = Provider<CheckInRepository>((ref) {
  final remoteDatasource = ref.watch(checkInDatasourceProvider);
  final localDatasource = ref.watch(checkInLocalDatasourceProvider);
  final pendingOps = ref.watch(pendingOperationsLocalDatasourceProvider);
  final connectivity = ref.watch(connectivityServiceProvider);
  final authState = ref.watch(authProvider);

  return OfflineFirstCheckInRepository(
    remoteDatasource: remoteDatasource,
    localDatasource: localDatasource,
    pendingOpsDatasource: pendingOps,
    getUserId: () => authState.user?.id ?? '',
    isOnline: () => connectivity.isOnline,
  );
});

final offlineFirstContactsRepositoryProvider = Provider<ContactsRepository>((ref) {
  final remoteDatasource = ref.watch(contactsDatasourceProvider);
  final localDatasource = ref.watch(contactsLocalDatasourceProvider);
  final pendingOps = ref.watch(pendingOperationsLocalDatasourceProvider);
  final connectivity = ref.watch(connectivityServiceProvider);
  final authState = ref.watch(authProvider);

  return OfflineFirstContactsRepository(
    remoteDatasource: remoteDatasource,
    localDatasource: localDatasource,
    pendingOpsDatasource: pendingOps,
    getUserId: () => authState.user?.id ?? '',
    isOnline: () => connectivity.isOnline,
  );
});

final offlineFirstSettingsRepositoryProvider = Provider<SettingsRepository>((ref) {
  final remoteDatasource = ref.watch(settingsDatasourceProvider);
  final localDatasource = ref.watch(settingsLocalDatasourceProvider);
  final pendingOps = ref.watch(pendingOperationsLocalDatasourceProvider);
  final connectivity = ref.watch(connectivityServiceProvider);
  final authState = ref.watch(authProvider);

  return OfflineFirstSettingsRepository(
    remoteDatasource: remoteDatasource,
    localDatasource: localDatasource,
    pendingOpsDatasource: pendingOps,
    getUserId: () => authState.user?.id ?? '',
    isOnline: () => connectivity.isOnline,
  );
});

final isOnlineProvider = Provider<bool>((ref) {
  final connectivity = ref.watch(connectivityServiceProvider);
  return connectivity.isOnline;
});

final pendingSyncCountProvider = StreamProvider<int>((ref) {
  final syncManager = ref.watch(syncManagerProvider);
  return syncManager.pendingCountStream;
});

final syncStateProvider = StreamProvider<SyncState>((ref) {
  final syncManager = ref.watch(syncManagerProvider);
  return syncManager.stateStream;
});
