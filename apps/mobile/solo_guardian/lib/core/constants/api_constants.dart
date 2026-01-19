import '../config/env_config.dart';

abstract class ApiConstants {
  /// Base URL from environment, defaults to localhost:3000
  static String get baseUrl => EnvConfig.apiBaseUrl;

  /// API version from environment, defaults to v1
  static String get apiVersion => EnvConfig.apiVersion;

  /// API prefix (e.g., /api/v1)
  static String get apiPrefix => EnvConfig.apiPrefix;

  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
