import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/storage_keys.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage;

  SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ??
            const FlutterSecureStorage(
              // Use encryptedSharedPreferences only on supported Android versions
              aOptions: AndroidOptions(
                encryptedSharedPreferences: true,
                resetOnError: true, // Reset storage if encryption fails
              ),
              iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
            );

  Future<String?> getAccessToken() async {
    try {
      return await _storage.read(key: StorageKeys.accessToken);
    } catch (e) {
      debugPrint('SecureStorage: Error reading access token: $e');
      return null;
    }
  }

  Future<void> setAccessToken(String token) async {
    await _storage.write(key: StorageKeys.accessToken, value: token);
  }

  Future<String?> getRefreshToken() async {
    return _storage.read(key: StorageKeys.refreshToken);
  }

  Future<void> setRefreshToken(String token) async {
    await _storage.write(key: StorageKeys.refreshToken, value: token);
  }

  Future<void> setTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    await Future.wait([
      setAccessToken(accessToken),
      setRefreshToken(refreshToken),
    ]);
  }

  Future<void> clearTokens() async {
    await Future.wait([
      _storage.delete(key: StorageKeys.accessToken),
      _storage.delete(key: StorageKeys.refreshToken),
    ]);
  }

  Future<Map<String, dynamic>?> getUser() async {
    final userJson = await _storage.read(key: StorageKeys.user);
    if (userJson == null) return null;
    return json.decode(userJson) as Map<String, dynamic>;
  }

  Future<void> setUser(Map<String, dynamic> user) async {
    await _storage.write(key: StorageKeys.user, value: json.encode(user));
  }

  Future<void> clearUser() async {
    await _storage.delete(key: StorageKeys.user);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}
