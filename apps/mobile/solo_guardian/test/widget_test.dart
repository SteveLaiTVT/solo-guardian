import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:solo_guardian/app.dart';

void main() {
  testWidgets('App builds without error', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(
        child: SoloGuardianApp(),
      ),
    );

    // Verify app builds and shows some UI
    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
