import '../../data/models/auth.dart';
import '../../data/models/user.dart';

abstract class AuthRepository {
  Future<AuthResult> login(String identifier, String password);
  Future<AuthResult> register({
    required String password,
    String? name,
    String? email,
    String? username,
    String? phone,
  });
  Future<AuthResult> refresh(String refreshToken);
  Future<void> logout();
  Future<User?> getCurrentUser();
  Future<bool> isLoggedIn();
  Future<void> updateStoredUser(User user);
}
