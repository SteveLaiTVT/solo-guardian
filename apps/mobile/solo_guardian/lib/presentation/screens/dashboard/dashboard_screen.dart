import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/utils/date_utils.dart';
import '../../../core/utils/error_utils.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/auth_provider.dart';
import '../../providers/check_in_provider.dart';
import '../../providers/preferences_provider.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen>
    with SingleTickerProviderStateMixin {
  Timer? _countdownTimer;
  String _countdownText = '';
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.08).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(todayStatusProvider.notifier).loadStatus();
      ref.read(preferencesProvider.notifier).loadPreferences();
    });
    _startCountdownTimer();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  void _startCountdownTimer() {
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      _updateCountdown();
    });
  }

  void _updateCountdown() {
    final statusState = ref.read(todayStatusProvider);
    final status = statusState.status;
    if (status == null || status.hasCheckedIn) {
      setState(() => _countdownText = '');
      return;
    }

    final deadline = AppDateUtils.parseTimeString(status.deadlineTime);
    final duration = AppDateUtils.timeUntil(deadline);
    setState(() => _countdownText = AppDateUtils.formatCountdown(duration));
  }

  Future<void> _handleCheckIn() async {
    final l10n = AppLocalizations.of(context);
    try {
      await ref.read(todayStatusProvider.notifier).checkIn();
      if (mounted) {
        _showSuccessDialog(l10n);
      }
    } catch (e) {
      if (mounted) {
        final errorState = ref.read(todayStatusProvider);
        _showErrorSnackbar(l10n, errorState.errorI18nKey, errorState.error);
      }
    }
  }

  void _showSuccessDialog(AppLocalizations l10n) {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) => AlertDialog(
        icon: Icon(
          Icons.check_circle,
          size: 64,
          color: Colors.green.shade600,
        ),
        title: Text(l10n.checkInSuccessTitle),
        content: Text(l10n.checkInSuccessMessage),
        actions: [
          FilledButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n.ok),
          ),
        ],
      ),
    );
  }

  void _showErrorSnackbar(AppLocalizations l10n, String? i18nKey, String? error) {
    final message = ErrorUtils.getLocalizedMessage(l10n, i18nKey, error);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error_outline, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: Colors.red.shade700,
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: l10n.retry,
          textColor: Colors.white,
          onPressed: _handleCheckIn,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final user = ref.watch(currentUserProvider);
    final statusState = ref.watch(todayStatusProvider);
    final status = statusState.status;
    final prefsState = ref.watch(preferencesProvider);
    final reducedMotion = prefsState.preferences?.reducedMotion ?? false;

    if (reducedMotion && _pulseController.isAnimating) {
      _pulseController.stop();
    } else if (!reducedMotion && !_pulseController.isAnimating && status != null && !status.hasCheckedIn) {
      _pulseController.repeat(reverse: true);
    }

    final greeting = AppDateUtils.getGreeting();
    final greetingText = switch (greeting) {
      'morning' => l10n.greetingMorning,
      'afternoon' => l10n.greetingAfternoon,
      _ => l10n.greetingEvening,
    };

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            await ref.read(todayStatusProvider.notifier).loadStatus();
          },
          child: CustomScrollView(
            slivers: [
              // Header with greeting
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(24, 24, 24, 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        greetingText,
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (user != null)
                        Text(
                          user.name,
                          style: theme.textTheme.titleLarge?.copyWith(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              // Main content
              SliverFillRemaining(
                hasScrollBody: false,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    children: [
                      const Spacer(flex: 1),
                      if (statusState.isLoading)
                        _buildLoadingState(l10n, theme)
                      else if (statusState.error != null)
                        _buildErrorState(
                          l10n,
                          theme,
                          statusState.errorI18nKey,
                          statusState.error,
                        )
                      else if (status != null) ...[
                        _buildStatusCard(status, l10n, theme),
                        const SizedBox(height: 32),
                        _buildCheckInButton(status, statusState, l10n, theme, reducedMotion),
                        const SizedBox(height: 24),
                        _buildTipsCard(status, l10n, theme),
                      ] else
                        _buildErrorState(l10n, theme, null, null),
                      const Spacer(flex: 2),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoadingState(AppLocalizations l10n, ThemeData theme) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const CircularProgressIndicator(),
        const SizedBox(height: 16),
        Text(
          l10n.loading,
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildErrorState(
    AppLocalizations l10n,
    ThemeData theme,
    String? i18nKey,
    String? error,
  ) {
    final message = ErrorUtils.getLocalizedMessage(l10n, i18nKey, error);
    return Card(
      color: theme.colorScheme.errorContainer,
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.cloud_off,
              size: 56,
              color: theme.colorScheme.error,
            ),
            const SizedBox(height: 16),
            Text(
              l10n.errorTitleSystem,
              style: theme.textTheme.titleLarge?.copyWith(
                color: theme.colorScheme.onErrorContainer,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              message,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onErrorContainer.withValues(alpha: 0.8),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: () {
                ref.read(todayStatusProvider.notifier).loadStatus();
              },
              icon: const Icon(Icons.refresh),
              label: Text(l10n.retry),
              style: FilledButton.styleFrom(
                backgroundColor: theme.colorScheme.error,
                foregroundColor: theme.colorScheme.onError,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              l10n.errorTipCheckConnection,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onErrorContainer.withValues(alpha: 0.6),
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard(
    dynamic status,
    AppLocalizations l10n,
    ThemeData theme,
  ) {
    final hasCheckedIn = status.hasCheckedIn;
    final isOverdue = status.isOverdue;

    Color cardColor;
    Color textColor;
    Color accentColor;
    IconData icon;
    String title;
    String subtitle;
    String? timeInfo;

    if (hasCheckedIn) {
      cardColor = Colors.green.shade50;
      textColor = Colors.green.shade800;
      accentColor = Colors.green.shade600;
      icon = Icons.check_circle;
      title = l10n.statusSafe;
      final checkInTime = status.checkIn?.checkedInAt;
      subtitle = l10n.checkInSuccessSubtitle;
      timeInfo = checkInTime != null
          ? l10n.statusCheckedInAt(AppDateUtils.formatTime(DateTime.parse(checkInTime)))
          : null;
    } else if (isOverdue) {
      cardColor = Colors.red.shade50;
      textColor = Colors.red.shade800;
      accentColor = Colors.red.shade600;
      icon = Icons.warning_amber_rounded;
      title = l10n.statusOverdueTitle;
      subtitle = l10n.statusOverdueSubtitle;
      timeInfo = null;
    } else {
      cardColor = Colors.orange.shade50;
      textColor = Colors.orange.shade800;
      accentColor = Colors.orange.shade600;
      icon = Icons.schedule;
      title = _countdownText.isNotEmpty ? _countdownText : l10n.statusPending;
      subtitle = l10n.statusPendingSubtitle;
      timeInfo = l10n.statusDeadline(status.deadlineTime);
    }

    return Card(
      elevation: 2,
      color: cardColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: accentColor.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 32, color: accentColor),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: theme.textTheme.headlineSmall?.copyWith(
                          color: textColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: textColor.withValues(alpha: 0.8),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            if (timeInfo != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: accentColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  timeInfo,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: textColor,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCheckInButton(
    dynamic status,
    dynamic statusState,
    AppLocalizations l10n,
    ThemeData theme,
    bool reducedMotion,
  ) {
    final hasCheckedIn = status.hasCheckedIn;
    final isCheckingIn = statusState.isCheckingIn;
    final isOverdue = status.isOverdue;

    Color buttonColor;
    Color textColor;
    String buttonText;
    IconData buttonIcon;

    if (hasCheckedIn) {
      buttonColor = theme.colorScheme.surfaceContainerHighest;
      textColor = theme.colorScheme.onSurface.withValues(alpha: 0.5);
      buttonText = l10n.statusAlreadyCheckedIn;
      buttonIcon = Icons.check;
    } else if (isOverdue) {
      buttonColor = Colors.red.shade600;
      textColor = Colors.white;
      buttonText = l10n.checkInNow;
      buttonIcon = Icons.priority_high;
    } else {
      buttonColor = theme.colorScheme.primary;
      textColor = theme.colorScheme.onPrimary;
      buttonText = l10n.buttonCheckIn;
      buttonIcon = Icons.touch_app;
    }

    Widget button = SizedBox(
      width: 180,
      height: 180,
      child: ElevatedButton(
        onPressed: hasCheckedIn || isCheckingIn ? null : _handleCheckIn,
        style: ElevatedButton.styleFrom(
          shape: const CircleBorder(),
          backgroundColor: buttonColor,
          foregroundColor: textColor,
          elevation: hasCheckedIn ? 0 : 8,
          shadowColor: buttonColor.withValues(alpha: 0.4),
          disabledBackgroundColor: buttonColor,
          disabledForegroundColor: textColor,
        ),
        child: isCheckingIn
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(
                    width: 40,
                    height: 40,
                    child: CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 3,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    l10n.buttonCheckingIn,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(buttonIcon, size: 48),
                  const SizedBox(height: 8),
                  Text(
                    buttonText,
                    textAlign: TextAlign.center,
                    style: theme.textTheme.titleMedium?.copyWith(
                      color: textColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
      ),
    );

    // Add pulse animation for non-checked-in state
    if (!hasCheckedIn && !isCheckingIn && !reducedMotion) {
      return AnimatedBuilder(
        animation: _pulseAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _pulseAnimation.value,
            child: child,
          );
        },
        child: button,
      );
    }

    return button;
  }

  Widget _buildTipsCard(
    dynamic status,
    AppLocalizations l10n,
    ThemeData theme,
  ) {
    final hasCheckedIn = status.hasCheckedIn;
    final isOverdue = status.isOverdue;

    String tipTitle;
    String tipContent;
    IconData tipIcon;
    Color tipColor;

    if (hasCheckedIn) {
      tipTitle = l10n.tipCheckedInTitle;
      tipContent = l10n.tipCheckedInContent;
      tipIcon = Icons.lightbulb_outline;
      tipColor = Colors.green.shade600;
    } else if (isOverdue) {
      tipTitle = l10n.tipOverdueTitle;
      tipContent = l10n.tipOverdueContent;
      tipIcon = Icons.info_outline;
      tipColor = Colors.red.shade600;
    } else {
      tipTitle = l10n.tipPendingTitle;
      tipContent = l10n.tipPendingContent;
      tipIcon = Icons.lightbulb_outline;
      tipColor = theme.colorScheme.primary;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: tipColor.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: tipColor.withValues(alpha: 0.2),
        ),
      ),
      child: Row(
        children: [
          Icon(tipIcon, color: tipColor, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tipTitle,
                  style: theme.textTheme.titleSmall?.copyWith(
                    color: tipColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  tipContent,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: tipColor.withValues(alpha: 0.8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
