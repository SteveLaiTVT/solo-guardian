import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'l10n/app_localizations.dart';
import 'presentation/providers/preferences_provider.dart';
import 'presentation/widgets/language_switcher.dart';

class SoloGuardianApp extends ConsumerWidget {
  const SoloGuardianApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);
    final appTheme = ref.watch(appThemeProvider);
    final languageCode = ref.watch(languageProvider);

    return MaterialApp.router(
      title: 'Solo Guardian',
      debugShowCheckedModeBanner: false,
      theme: appTheme.themeData,
      locale: Locale(languageCode),
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      routerConfig: router,
    );
  }
}
