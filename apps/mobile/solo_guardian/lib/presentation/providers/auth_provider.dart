import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/user.dart';
import 'core_providers.dart';
import 'preferences_provider.dart';

enum AuthStatus { initial, authenticated, unauthenticated, loading }

class AuthState {
  final AuthStatus status;
  final User? user;
  final String? error;

  const AuthState({this.status = AuthStatus.initial, this.user, this.error});

  AuthState copyWith({AuthStatus? status, User? user, String? error}) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      error: error,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(const AuthState()) {
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    debugPrint('AuthProvider: Starting auth check...');
    state = state.copyWith(status: AuthStatus.loading);
    try {
      debugPrint('AuthProvider: Getting auth repository...');
      final authRepo = _ref.read(authRepositoryProvider);
      debugPrint('AuthProvider: Checking isLoggedIn...');
      final isLoggedIn = await authRepo.isLoggedIn().timeout(
        const Duration(seconds: 5),
        onTimeout: () {
          debugPrint('AuthProvider: isLoggedIn timeout!');
          return false;
        },
      );
      debugPrint('AuthProvider: isLoggedIn = $isLoggedIn');
      if (isLoggedIn) {
        debugPrint('AuthProvider: Getting current user...');
        final user = await authRepo.getCurrentUser();
        debugPrint('AuthProvider: Got user: ${user?.name}');
        state = AuthState(status: AuthStatus.authenticated, user: user);
        // Load preferences after successful auth
        _ref.read(preferencesProvider.notifier).loadPreferences();
      } else {
        debugPrint('AuthProvider: Not logged in, setting unauthenticated');
        state = const AuthState(status: AuthStatus.unauthenticated);
      }
    } catch (e, stack) {
      debugPrint('AuthProvider: Error during auth check: $e');
      debugPrint('AuthProvider: Stack: $stack');
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
    debugPrint('AuthProvider: Auth check complete, status = ${state.status}');
  }

  Future<void> login(String identifier, String password) async {
    // Don't set loading status here - it triggers router redirects
    // The login screen handles its own loading state
    state = state.copyWith(error: null);
    try {
      final authRepo = _ref.read(authRepositoryProvider);
      final result = await authRepo.login(identifier, password);
      state = AuthState(status: AuthStatus.authenticated, user: result.user);
      try {
        final refreshed = await authRepo.refresh(result.tokens.refreshToken);
        state = AuthState(
          status: AuthStatus.authenticated,
          user: refreshed.user,
        );
      } catch (_) {
        // Ignore refresh errors during login
      }
      // Load preferences after successful login
      _ref.read(preferencesProvider.notifier).loadPreferences();
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        error: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> register({
    required String name,
    required String password,
    String? username,
    String? email,
    String? phone,
  }) async {
    // Don't set loading status here - it triggers router redirects
    // The register screen handles its own loading state
    state = state.copyWith(error: null);
    try {
      final authRepo = _ref.read(authRepositoryProvider);
      final result = await authRepo.register(
        password: password,
        name: name,
        username: username,
        email: email,
        phone: phone,
      );
      state = AuthState(status: AuthStatus.authenticated, user: result.user);
      try {
        final refreshed = await authRepo.refresh(result.tokens.refreshToken);
        state = AuthState(
          status: AuthStatus.authenticated,
          user: refreshed.user,
        );
      } catch (_) {
        // Ignore refresh errors during registration
      }
      // Load preferences after successful registration
      _ref.read(preferencesProvider.notifier).loadPreferences();
    } catch (e) {
      state = state.copyWith(
        status: AuthStatus.unauthenticated,
        error: e.toString(),
      );
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      final authRepo = _ref.read(authRepositoryProvider);
      await authRepo.logout();
    } finally {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  void updateUser(User user) {
    state = state.copyWith(user: user);
  }

  Future<void> uploadAvatar(String filePath) async {
    try {
      final prefsRepo = _ref.read(preferencesRepositoryProvider);
      final updatedUser = await prefsRepo.uploadAvatar(filePath);
      state = state.copyWith(user: updatedUser);
      // Save updated user to storage so avatar persists across app restarts
      final authRepo = _ref.read(authRepositoryProvider);
      await authRepo.updateStoredUser(updatedUser);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

final isAuthenticatedProvider = Provider<bool>((ref) {
  return ref.watch(authProvider).status == AuthStatus.authenticated;
});

final currentUserProvider = Provider<User?>((ref) {
  return ref.watch(authProvider).user;
});
