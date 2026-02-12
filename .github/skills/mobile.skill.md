# Mobile Development Skill

This skill provides expertise in Flutter mobile development for Solo Guardian.

## When to Use This Skill

Use this skill when working on:
- Flutter mobile app (`apps/mobile/solo_guardian`)
- State management with Riverpod
- API integration with Dio
- Offline-first architecture
- Code generation (Freezed, Retrofit)
- Mobile UI/UX
- Platform-specific features (Android/iOS)

## Technology Stack

- Flutter 3.x
- Riverpod (state management)
- Freezed (data classes)
- Dio (HTTP client)
- Retrofit (API client generation)
- flutter_secure_storage (secure token storage)
- shared_preferences (settings)
- Built-in l10n (en/zh/ja)

## Architecture Pattern

Clean Architecture with 3 layers:

```
presentation/          domain/              data/
├── screens/          ├── repositories/    ├── models/
├── widgets/          └── entities/        ├── datasources/
└── providers/                             └── repositories/
      ↓                      ↓                    ↓
    View              Business Logic         Data Access
```

## Project Structure

```
lib/
├── core/
│   ├── constants/      # API URLs, app constants
│   ├── errors/         # Custom exceptions
│   ├── network/        # Dio setup, interceptors
│   ├── storage/        # Secure storage, preferences
│   └── utils/          # Utilities, extensions
├── data/
│   ├── models/         # Freezed data models
│   ├── datasources/    # Remote/local data sources
│   └── repositories/   # Repository implementations
├── domain/
│   ├── entities/       # Business entities
│   └── repositories/   # Repository interfaces
├── l10n/               # Localization files
├── presentation/
│   ├── screens/        # App screens
│   ├── widgets/        # Reusable widgets
│   └── providers/      # Riverpod providers
├── theme/              # App themes
└── main.dart           # App entry point
```

## Data Model with Freezed

```dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String email,
    String? name,
    String? avatar,
    @Default(false) bool isVerified,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
```

## State Management with Riverpod

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'auth_provider.freezed.dart';

// State
@freezed
class AuthState with _$AuthState {
  const factory AuthState({
    User? user,
    @Default(false) bool isLoading,
    String? error,
  }) = _AuthState;
}

// Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._authRepository) : super(const AuthState());

  final AuthRepository _authRepository;

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    
    try {
      final user = await _authRepository.login(email, password);
      state = state.copyWith(user: user, isLoading: false);
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
    }
  }

  Future<void> logout() async {
    await _authRepository.logout();
    state = const AuthState();
  }
}

// Provider
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return AuthNotifier(authRepository);
});
```

## API Client with Retrofit

```dart
import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/user.dart';

part 'api_client.g.dart';

@RestApi(baseUrl: "https://api.example.com/api/v1")
abstract class ApiClient {
  factory ApiClient(Dio dio, {String baseUrl}) = _ApiClient;

  @POST("/auth/login")
  Future<ApiResponse<User>> login(@Body() Map<String, dynamic> body);

  @GET("/users/{id}")
  Future<ApiResponse<User>> getUser(@Path("id") String id);

  @POST("/check-in")
  Future<ApiResponse<CheckIn>> checkIn(@Body() Map<String, dynamic> body);
}

// API Response wrapper
class ApiResponse<T> {
  final bool success;
  final T? data;
  final ApiError? error;

  ApiResponse({required this.success, this.data, this.error});

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object?) fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] as bool,
      data: json['data'] != null ? fromJsonT(json['data']) : null,
      error: json['error'] != null ? ApiError.fromJson(json['error']) : null,
    );
  }
}
```

## Dio Setup with Interceptors

```dart
import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';

class DioProvider {
  static Dio createDio(SecureStorage secureStorage) {
    final dio = Dio(
      BaseOptions(
        baseUrl: ApiConstants.baseUrl,
        connectTimeout: const Duration(seconds: 30),
        receiveTimeout: const Duration(seconds: 30),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Auth interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await secureStorage.getAccessToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token refresh logic
            final refreshed = await _refreshToken(secureStorage, dio);
            if (refreshed) {
              // Retry request
              return handler.resolve(await _retry(error.requestOptions, dio));
            }
          }
          handler.next(error);
        },
      ),
    );

    // Logging interceptor (debug only)
    dio.interceptors.add(LogInterceptor(
      requestBody: true,
      responseBody: true,
    ));

    return dio;
  }

  static Future<bool> _refreshToken(SecureStorage storage, Dio dio) async {
    try {
      final refreshToken = await storage.getRefreshToken();
      if (refreshToken == null) return false;

      final response = await dio.post('/auth/refresh', data: {
        'refreshToken': refreshToken,
      });

      if (response.data['success']) {
        await storage.saveTokens(
          response.data['data']['accessToken'],
          response.data['data']['refreshToken'],
        );
        return true;
      }
    } catch (e) {
      // Handle refresh failure
    }
    return false;
  }

  static Future<Response> _retry(RequestOptions options, Dio dio) async {
    return dio.request(
      options.path,
      data: options.data,
      queryParameters: options.queryParameters,
      options: Options(
        method: options.method,
        headers: options.headers,
      ),
    );
  }
}
```

## Screen Template

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/check_in_provider.dart';
import '../widgets/check_in_button.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final checkInState = ref.watch(checkInProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.dashboard),
      ),
      body: checkInState.when(
        data: (data) => _buildContent(context, data),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Text('Error: $error'),
        ),
      ),
      floatingActionButton: CheckInButton(
        onPressed: () => ref.read(checkInProvider.notifier).checkIn(),
      ),
    );
  }

  Widget _buildContent(BuildContext context, CheckInData data) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Text(
          AppLocalizations.of(context)!.lastCheckIn,
          style: Theme.of(context).textTheme.titleMedium,
        ),
        const SizedBox(height: 8),
        Text(data.lastCheckIn?.toString() ?? 'Never'),
        // More content...
      ],
    );
  }
}
```

## Widget Template

```dart
import 'package:flutter/material.dart';

class CheckInButton extends StatelessWidget {
  const CheckInButton({
    super.key,
    required this.onPressed,
    this.isLoading = false,
  });

  final VoidCallback onPressed;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: isLoading ? null : onPressed,
      icon: isLoading
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : const Icon(Icons.check),
      label: Text(AppLocalizations.of(context)!.checkIn),
    );
  }
}
```

## Secure Storage

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static const _accessTokenKey = 'access_token';
  static const _refreshTokenKey = 'refresh_token';

  Future<void> saveTokens(String accessToken, String refreshToken) async {
    await _storage.write(key: _accessTokenKey, value: accessToken);
    await _storage.write(key: _refreshTokenKey, value: refreshToken);
  }

  Future<String?> getAccessToken() async {
    return _storage.read(key: _accessTokenKey);
  }

  Future<String?> getRefreshToken() async {
    return _storage.read(key: _refreshTokenKey);
  }

  Future<void> clearTokens() async {
    await _storage.delete(key: _accessTokenKey);
    await _storage.delete(key: _refreshTokenKey);
  }
}
```

## Error Handling

```dart
class AppException implements Exception {
  final String message;
  final String? code;
  final int? statusCode;

  AppException({
    required this.message,
    this.code,
    this.statusCode,
  });

  factory AppException.fromDioError(DioException error) {
    if (error.response?.data != null) {
      final data = error.response!.data;
      return AppException(
        message: data['error']['message'] ?? 'Unknown error',
        code: data['error']['code'],
        statusCode: error.response!.statusCode,
      );
    }
    
    return AppException(
      message: error.message ?? 'Network error',
      statusCode: error.response?.statusCode,
    );
  }

  @override
  String toString() => message;
}
```

## Localization

```dart
// l10n/app_en.arb
{
  "appTitle": "Solo Guardian",
  "login": "Log In",
  "checkIn": "Check In",
  "dashboard": "Dashboard",
  "lastCheckIn": "Last Check-in"
}

// l10n/app_zh.arb
{
  "appTitle": "独居守护",
  "login": "登录",
  "checkIn": "签到",
  "dashboard": "仪表盘",
  "lastCheckIn": "上次签到"
}

// Usage
Text(AppLocalizations.of(context)!.appTitle)
```

## Common Commands

```bash
cd apps/mobile/solo_guardian

# Install dependencies
flutter pub get

# Code generation (Freezed, Retrofit)
dart run build_runner build --delete-conflicting-outputs

# Run app
flutter run                     # Debug mode
flutter run --release           # Release mode
flutter run -d chrome           # Web

# Build
flutter build apk               # Android APK
flutter build appbundle         # Android App Bundle
flutter build ios               # iOS (macOS only)

# Test
flutter test                    # Unit tests
flutter test --coverage         # With coverage

# Analyze
dart analyze                    # Static analysis
dart format .                   # Format code
```

## Code Style

- Use `final` for immutable variables
- Prefer `const` constructors
- Every function has return type
- Single function < 50 lines
- Single file < 300 lines
- Use Freezed for data classes
- Use `snake_case` for file names
- Use `camelCase` for variables
- Use `PascalCase` for classes

## Offline-First Strategy

1. **Cache API responses**
   ```dart
   final cacheOptions = CacheOptions(
     store: MemCacheStore(),
     maxStaleAge: const Duration(days: 7),
   );
   ```

2. **Queue offline actions**
   - Save mutations locally
   - Sync when connection restored

3. **Local database**
   - Use Hive or SQLite for persistence
   - Sync with backend

## Platform-Specific Code

```dart
import 'dart:io' show Platform;

if (Platform.isAndroid) {
  // Android-specific code
} else if (Platform.isIOS) {
  // iOS-specific code
}
```

## Performance Optimization

1. **Lazy loading**
   - Use `ListView.builder` for long lists
   - Load data on demand

2. **Image caching**
   ```dart
   CachedNetworkImage(
     imageUrl: imageUrl,
     placeholder: (context, url) => CircularProgressIndicator(),
     errorWidget: (context, url, error) => Icon(Icons.error),
   )
   ```

3. **Reduce rebuilds**
   - Use `const` constructors
   - Use `select` with Riverpod

## Testing

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

void main() {
  group('AuthNotifier', () {
    late AuthNotifier authNotifier;
    late MockAuthRepository mockAuthRepository;

    setUp(() {
      mockAuthRepository = MockAuthRepository();
      authNotifier = AuthNotifier(mockAuthRepository);
    });

    test('login success updates state', () async {
      final user = User(id: '1', email: 'test@example.com');
      when(mockAuthRepository.login(any, any))
          .thenAnswer((_) async => user);

      await authNotifier.login('test@example.com', 'password');

      expect(authNotifier.state.user, equals(user));
      expect(authNotifier.state.isLoading, false);
      expect(authNotifier.state.error, null);
    });
  });
}
```

## Related Files

- `apps/mobile/solo_guardian/lib/` - Mobile app source
- `packages/types/` - Shared types (TypeScript → Dart conversion)
- `AGENTS.md` - Full architecture guide
