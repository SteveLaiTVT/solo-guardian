import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app.dart';
import 'core/cache/check_in_cache_service.dart';
import 'core/network/connectivity_service.dart';

void main() {
  runZonedGuarded(() async {
    WidgetsFlutterBinding.ensureInitialized();

    // Load environment variables
    await dotenv.load(fileName: '.env').catchError((_) {
      debugPrint('Warning: .env file not found, using default values');
    });

    // Initialize connectivity service
    await ConnectivityService().initialize();
    debugPrint('Connectivity service initialized');

    // Ensure cache tables exist
    await CheckInCacheService.ensureTableExists();
    debugPrint('Cache tables initialized');

    FlutterError.onError = (details) {
      FlutterError.presentError(details);
      debugPrint('FlutterError: ${details.exception}');
      debugPrint('Stack: ${details.stack}');
    };

    runApp(
      const ProviderScope(
        child: SoloGuardianApp(),
      ),
    );
  }, (error, stack) {
    debugPrint('Uncaught error: $error');
    debugPrint('Stack trace: $stack');
  });
}
