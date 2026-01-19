import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Environment configuration loaded from .env file
abstract class EnvConfig {
  /// API base URL (e.g., http://localhost:3000)
  static String get apiBaseUrl =>
      dotenv.env['API_BASE_URL'] ?? 'http://localhost:3000';

  /// API version (e.g., v1)
  static String get apiVersion => dotenv.env['API_VERSION'] ?? 'v1';

  /// Full API prefix
  static String get apiPrefix => '/api/$apiVersion';
}
