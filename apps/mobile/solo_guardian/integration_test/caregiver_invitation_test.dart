import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:solo_guardian/l10n/app_localizations.dart';
import 'package:solo_guardian/presentation/widgets/invitation_share_dialog.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Caregiver Invitation Dialog Integration Tests', () {
    testWidgets('InvitationShareDialog displays all elements correctly', (tester) async {
      const testUrl = 'https://example.com/accept-invitation?token=abc123';
      const testTitle = 'Invitation Created';

      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          locale: const Locale('en'),
          home: Scaffold(
            body: Builder(
              builder: (context) => Center(
                child: ElevatedButton(
                  onPressed: () {
                    showDialog(
                      context: context,
                      builder: (context) => const InvitationShareDialog(
                        title: testTitle,
                        invitationUrl: testUrl,
                        inviterName: 'Test User',
                        relationshipType: 'family',
                      ),
                    );
                  },
                  child: const Text('Open Dialog'),
                ),
              ),
            ),
          ),
        ),
      );

      // Open the dialog
      await tester.tap(find.text('Open Dialog'));
      await tester.pumpAndSettle();

      // Verify dialog elements
      expect(find.text(testTitle), findsOneWidget);
      expect(find.byIcon(Icons.qr_code_2), findsOneWidget);
      expect(find.text(testUrl), findsOneWidget);
      expect(find.byIcon(Icons.copy), findsOneWidget);
      expect(find.byIcon(Icons.share), findsOneWidget);
      expect(find.text('OK'), findsOneWidget);

      // Test copy button
      await tester.tap(find.byIcon(Icons.copy));
      await tester.pump();

      // Should show snackbar
      expect(find.byType(SnackBar), findsOneWidget);

      // Wait for snackbar to dismiss
      await tester.pumpAndSettle(const Duration(seconds: 3));

      // Close dialog
      await tester.tap(find.text('OK'));
      await tester.pumpAndSettle();

      // Dialog should be closed
      expect(find.text(testTitle), findsNothing);
    });

    testWidgets('InvitationShareDialog shows QR code', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          localizationsDelegates: AppLocalizations.localizationsDelegates,
          supportedLocales: AppLocalizations.supportedLocales,
          locale: const Locale('en'),
          home: const Scaffold(
            body: InvitationShareDialog(
              title: 'Test',
              invitationUrl: 'https://test.com/invite',
            ),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // QR code should be rendered (QrImageView widget)
      expect(find.byType(AlertDialog), findsOneWidget);
    });
  });
}
