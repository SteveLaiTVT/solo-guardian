import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../presentation/providers/auth_provider.dart';
import '../../presentation/providers/preferences_provider.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/caregiver/caregiver_screen.dart';
import '../../presentation/screens/contacts/contacts_screen.dart';
import '../../presentation/screens/contacts/linked_contacts_screen.dart';
import '../../presentation/screens/dashboard/dashboard_screen.dart';
import '../../presentation/screens/history/history_screen.dart';
import '../../presentation/screens/onboarding/onboarding_screen.dart';
import '../../presentation/screens/public/accept_contact_link_screen.dart';
import '../../presentation/screens/public/accept_invitation_screen.dart';
import '../../presentation/screens/public/verify_contact_screen.dart';
import '../../presentation/screens/settings/settings_screen.dart';
import '../../presentation/widgets/main_scaffold.dart';

abstract class AppRoutes {
  static const String login = '/login';
  static const String register = '/register';
  static const String onboarding = '/onboarding';
  static const String dashboard = '/';
  static const String history = '/history';
  static const String contacts = '/contacts';
  static const String linkedContacts = '/contacts/linked';
  static const String caregiver = '/caregiver';
  static const String settings = '/settings';
  static const String verifyContact = '/verify-contact';
  static const String acceptInvitation = '/accept-invitation';
  static const String acceptContactLink = '/accept-contact-link';
}

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

// Listenable that notifies when auth or prefs change
class _RouterRefreshNotifier extends ChangeNotifier {
  _RouterRefreshNotifier(Ref ref) {
    ref.listen(authProvider, (_, __) => notifyListeners());
    ref.listen(preferencesProvider, (_, __) => notifyListeners());
  }
}

final appRouterProvider = Provider<GoRouter>((ref) {
  final refreshNotifier = _RouterRefreshNotifier(ref);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: AppRoutes.login,
    debugLogDiagnostics: true,
    refreshListenable: refreshNotifier,
    redirect: (context, state) {
      final authState = ref.read(authProvider);
      final prefsState = ref.read(preferencesProvider);

      final isLoggedIn = authState.status == AuthStatus.authenticated;
      final isInitial = authState.status == AuthStatus.initial;
      final isLoading = authState.status == AuthStatus.loading;
      final prefsLoading = prefsState.isLoading;
      final onboardingCompleted =
          prefsState.preferences?.onboardingCompleted ?? false;

      debugPrint('Router redirect: location=${state.matchedLocation}, authStatus=${authState.status}, prefsLoading=$prefsLoading');

      final isAuthRoute = state.matchedLocation == AppRoutes.login ||
          state.matchedLocation == AppRoutes.register;

      final isPublicRoute = [
        AppRoutes.login,
        AppRoutes.register,
        AppRoutes.verifyContact,
        AppRoutes.acceptInvitation,
        AppRoutes.acceptContactLink,
      ].any((route) => state.matchedLocation.startsWith(route));

      // During initial auth check or loading, stay on current route
      if (isInitial || isLoading) {
        debugPrint('Router redirect: auth in progress, staying on current route');
        return null;
      }

      // If not logged in and trying to access protected route, go to login
      if (!isLoggedIn && !isPublicRoute) {
        return AppRoutes.login;
      }

      // If logged in but preferences still loading, stay on current route
      if (isLoggedIn && prefsLoading) {
        debugPrint('Router redirect: preferences loading, staying on current route');
        return null;
      }

      // If logged in but onboarding not completed, go to onboarding
      if (isLoggedIn && !onboardingCompleted) {
        if (state.matchedLocation != AppRoutes.onboarding) {
          return AppRoutes.onboarding;
        }
      }

      // If logged in with onboarding completed and on auth/onboarding route, go to dashboard
      if (isLoggedIn &&
          onboardingCompleted &&
          (isAuthRoute || state.matchedLocation == AppRoutes.onboarding)) {
        return AppRoutes.dashboard;
      }

      return null;
    },
    routes: [
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.register,
        name: 'register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: AppRoutes.onboarding,
        name: 'onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: AppRoutes.verifyContact,
        name: 'verifyContact',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return VerifyContactScreen(token: token);
        },
      ),
      GoRoute(
        path: AppRoutes.acceptInvitation,
        name: 'acceptInvitation',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return AcceptInvitationScreen(token: token);
        },
      ),
      GoRoute(
        path: AppRoutes.acceptContactLink,
        name: 'acceptContactLink',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return AcceptContactLinkScreen(token: token);
        },
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainScaffold(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.dashboard,
            name: 'dashboard',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const DashboardScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.history,
            name: 'history',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const HistoryScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.contacts,
            name: 'contacts',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const ContactsScreen(),
            ),
            routes: [
              GoRoute(
                path: 'linked',
                name: 'linkedContacts',
                builder: (context, state) => const LinkedContactsScreen(),
              ),
            ],
          ),
          GoRoute(
            path: AppRoutes.caregiver,
            name: 'caregiver',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const CaregiverScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.settings,
            name: 'settings',
            pageBuilder: (context, state) => NoTransitionPage(
              child: const SettingsScreen(),
            ),
          ),
        ],
      ),
    ],
  );
});
