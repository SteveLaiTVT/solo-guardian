import '../../core/storage/secure_storage.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_datasource.dart';
import '../models/auth.dart';
import '../models/user.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthDatasource _datasource;
  final SecureStorageService _storage;

  AuthRepositoryImpl({
    required AuthDatasource datasource,
    required SecureStorageService storage,
  })  : _datasource = datasource,
        _storage = storage;

  @override
  Future<AuthResult> login(String identifier, String password) async {
    final response = await _datasource.login(
      _datasource.loginRequest(identifier, password),
    );
    final result = _datasource.parseAuthResult(response);
    await _saveAuthResult(result);
    return result;
  }

  @override
  Future<AuthResult> register({
    required String password,
    String? name,
    String? email,
    String? username,
    String? phone,
  }) async {
    final response = await _datasource.register(
      _datasource.registerRequest(
        password: password,
        name: name,
        email: email,
        username: username,
        phone: phone,
      ),
    );
    final result = _datasource.parseAuthResult(response);
    await _saveAuthResult(result);
    return result;
  }

  @override
  Future<AuthResult> refresh(String refreshToken) async {
    final response = await _datasource.refresh(
      _datasource.refreshRequest(refreshToken),
    );
    final result = _datasource.parseAuthResult(response);
    await _saveAuthResult(result);
    return result;
  }

  @override
  Future<void> logout() async {
    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken != null) {
      try {
        await _datasource.logout(_datasource.refreshRequest(refreshToken));
      } catch (_) {
        // Ignore logout errors
      }
    }
    await _storage.clearAll();
  }

  @override
  Future<User?> getCurrentUser() async {
    final userJson = await _storage.getUser();
    if (userJson == null) return null;
    return User.fromJson(userJson);
  }

  @override
  Future<bool> isLoggedIn() async {
    final accessToken = await _storage.getAccessToken();
    return accessToken != null;
  }

  Future<void> _saveAuthResult(AuthResult result) async {
    await _storage.setTokens(
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    );
    await _storage.setUser(result.user.toJson());
  }

  Future<void> updateStoredUser(User user) async {
    await _storage.setUser(user.toJson());
  }
}

extension UserToJson on User {
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'username': username,
      'phone': phone,
      'avatar': avatar,
      'name': name,
      'birthYear': birthYear,
      'createdAt': createdAt,
    };
  }
}
