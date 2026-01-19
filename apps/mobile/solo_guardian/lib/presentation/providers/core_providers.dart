import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/cache/check_in_cache_service.dart';
import '../../core/constants/api_constants.dart';
import '../../core/network/auth_interceptor.dart';
import '../../core/network/connectivity_service.dart';
import '../../core/storage/preferences_storage.dart';
import '../../core/storage/secure_storage.dart';
import '../../data/datasources/auth_datasource.dart';
import '../../data/datasources/caregiver_datasource.dart';
import '../../data/datasources/check_in_datasource.dart';
import '../../data/datasources/contacts_datasource.dart';
import '../../data/datasources/preferences_datasource.dart';
import '../../data/datasources/settings_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/caregiver_repository_impl.dart';
import '../../data/repositories/check_in_repository_impl.dart';
import '../../data/repositories/contacts_repository_impl.dart';
import '../../data/repositories/preferences_repository_impl.dart';
import '../../data/repositories/settings_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/caregiver_repository.dart';
import '../../domain/repositories/check_in_repository.dart';
import '../../domain/repositories/contacts_repository.dart';
import '../../domain/repositories/preferences_repository.dart';
import '../../domain/repositories/settings_repository.dart';
import 'auth_provider.dart';

final secureStorageProvider = Provider<SecureStorageService>((ref) {
  return SecureStorageService();
});

final preferencesStorageProvider = FutureProvider<PreferencesStorage>((ref) async {
  return PreferencesStorage.init();
});

final dioProvider = Provider<Dio>((ref) {
  final storage = ref.watch(secureStorageProvider);
  final dio = Dio(
    BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: ApiConstants.connectTimeout,
      receiveTimeout: ApiConstants.receiveTimeout,
      headers: ApiConstants.defaultHeaders,
    ),
  );
  dio.interceptors.addAll([
    AuthInterceptor(dio: dio, storage: storage),
    LogInterceptor(requestBody: true, responseBody: true, error: true),
  ]);
  return dio;
});

final authDatasourceProvider = Provider<AuthDatasource>((ref) {
  final dio = ref.watch(dioProvider);
  return AuthDatasource(dio);
});

final checkInDatasourceProvider = Provider<CheckInDatasource>((ref) {
  final dio = ref.watch(dioProvider);
  return CheckInDatasource(dio);
});

final settingsDatasourceProvider = Provider<SettingsDatasource>((ref) {
  final dio = ref.watch(dioProvider);
  return SettingsDatasource(dio);
});

final contactsDatasourceProvider = Provider<ContactsDatasource>((ref) {
  final dio = ref.watch(dioProvider);
  return ContactsDatasource(dio);
});

final preferencesDatasourceProvider = Provider<PreferencesDatasource>((ref) {
  final dio = ref.watch(dioProvider);
  return PreferencesDatasource(dio);
});

final caregiverDatasourceProvider = Provider<CaregiverDatasource>((ref) {
  final dio = ref.watch(dioProvider);
  return CaregiverDatasource(dio);
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final datasource = ref.watch(authDatasourceProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthRepositoryImpl(datasource: datasource, storage: storage);
});

final connectivityServiceProvider = Provider<ConnectivityService>((ref) {
  return ConnectivityService();
});

final checkInCacheServiceProvider = Provider<CheckInCacheService>((ref) {
  return CheckInCacheService();
});

final checkInRepositoryProvider = Provider<CheckInRepository>((ref) {
  final datasource = ref.watch(checkInDatasourceProvider);
  final connectivity = ref.watch(connectivityServiceProvider);
  final cacheService = ref.watch(checkInCacheServiceProvider);

  return CheckInRepositoryImpl(
    datasource: datasource,
    connectivity: connectivity,
    cacheService: cacheService,
    getUserId: () => ref.read(currentUserProvider)?.id,
  );
});

final settingsRepositoryProvider = Provider<SettingsRepository>((ref) {
  final datasource = ref.watch(settingsDatasourceProvider);
  return SettingsRepositoryImpl(datasource: datasource);
});

final contactsRepositoryProvider = Provider<ContactsRepository>((ref) {
  final datasource = ref.watch(contactsDatasourceProvider);
  return ContactsRepositoryImpl(datasource: datasource);
});

final preferencesRepositoryProvider = Provider<PreferencesRepository>((ref) {
  final datasource = ref.watch(preferencesDatasourceProvider);
  final dio = ref.watch(dioProvider);
  return PreferencesRepositoryImpl(datasource: datasource, dio: dio);
});

final caregiverRepositoryProvider = Provider<CaregiverRepository>((ref) {
  final datasource = ref.watch(caregiverDatasourceProvider);
  return CaregiverRepositoryImpl(datasource: datasource);
});
