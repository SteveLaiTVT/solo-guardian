import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:solo_guardian/core/network/connectivity_service.dart';
import 'package:solo_guardian/l10n/app_localizations.dart';
import 'package:solo_guardian/presentation/widgets/offline_banner.dart';

void main() {
  group('OfflineBanner', () {
    Widget createTestWidget({bool isOnline = true}) {
      return ProviderScope(
        overrides: [
          isOnlineProvider.overrideWith((ref) => isOnline),
        ],
        child: MaterialApp(
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          locale: const Locale('en'),
          home: const Scaffold(
            body: OfflineBanner(),
          ),
        ),
      );
    }

    testWidgets('shows nothing when online', (tester) async {
      await tester.pumpWidget(createTestWidget(isOnline: true));
      await tester.pumpAndSettle();

      // Should find SizedBox.shrink (empty widget)
      expect(find.byType(SizedBox), findsOneWidget);
      expect(find.byIcon(Icons.cloud_off), findsNothing);
    });

    testWidgets('shows banner when offline', (tester) async {
      await tester.pumpWidget(createTestWidget(isOnline: false));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.cloud_off), findsOneWidget);
    });

    testWidgets('shows retry button when offline', (tester) async {
      await tester.pumpWidget(createTestWidget(isOnline: false));
      await tester.pumpAndSettle();

      expect(find.text('Retry'), findsOneWidget);
    });

    testWidgets('banner has orange background when offline', (tester) async {
      await tester.pumpWidget(createTestWidget(isOnline: false));
      await tester.pumpAndSettle();

      final material = tester.widget<Material>(
        find.ancestor(
          of: find.byIcon(Icons.cloud_off),
          matching: find.byType(Material),
        ).first,
      );

      expect(material.color, Colors.orange.shade700);
    });
  });

  group('OfflineWrapper', () {
    testWidgets('wraps child with offline banner', (tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            isOnlineProvider.overrideWith((ref) => true),
          ],
          child: MaterialApp(
            localizationsDelegates: AppLocalizations.localizationsDelegates,
            supportedLocales: AppLocalizations.supportedLocales,
            locale: const Locale('en'),
            home: const OfflineWrapper(
              child: Text('Child Content'),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Child Content'), findsOneWidget);
    });
  });

  group('isOnlineProvider', () {
    test('returns true when status is online', () {
      final container = ProviderContainer(
        overrides: [
          connectivityStatusProvider.overrideWith((ref) => Stream.value(ConnectivityStatus.online)),
        ],
      );

      // Initial value before stream emits
      expect(container.read(isOnlineProvider), isTrue);
    });
  });
}
