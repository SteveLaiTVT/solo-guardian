abstract class ApiConstants {
  static const String baseUrl = 'http://192.168.1.105:3000';
  static const String apiVersion = 'v1';
  static const String apiPrefix = '/api/$apiVersion';

  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);

  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
