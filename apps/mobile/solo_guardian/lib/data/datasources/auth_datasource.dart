import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/auth.dart';

part 'auth_datasource.g.dart';

@RestApi()
abstract class AuthDatasource {
  factory AuthDatasource(Dio dio, {String baseUrl}) = _AuthDatasource;

  @POST('/api/v1/auth/login')
  Future<dynamic> login(@Body() Map<String, dynamic> request);

  @POST('/api/v1/auth/register')
  Future<dynamic> register(@Body() Map<String, dynamic> request);

  @POST('/api/v1/auth/refresh')
  Future<dynamic> refresh(@Body() Map<String, dynamic> request);

  @POST('/api/v1/auth/logout')
  Future<void> logout(@Body() Map<String, dynamic> request);
}

extension AuthDatasourceExtension on AuthDatasource {
  AuthResult parseAuthResult(dynamic response) {
    final map = response as Map<String, dynamic>;
    if (map['success'] == true && map['data'] is Map<String, dynamic>) {
      return AuthResult.fromJson(map['data'] as Map<String, dynamic>);
    }
    return AuthResult.fromJson(map);
  }

  Map<String, dynamic> loginRequest(String identifier, String password) {
    return {'identifier': identifier, 'password': password};
  }

  Map<String, dynamic> registerRequest({
    required String password,
    String? name,
    String? email,
    String? username,
    String? phone,
  }) {
    return {
      'password': password,
      if (name != null) 'name': name,
      if (email != null) 'email': email,
      if (username != null) 'username': username,
      if (phone != null) 'phone': phone,
    };
  }

  Map<String, dynamic> refreshRequest(String refreshToken) {
    return {'refreshToken': refreshToken};
  }
}
