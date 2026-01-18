import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/preferences.dart';
import '../../l10n/app_localizations.dart';
import '../providers/preferences_provider.dart';
import '../providers/settings_provider.dart';

/// Deadline Time Setting Widget - only rebuilds when deadlineTime changes
class DeadlineTimeSetting extends ConsumerWidget {
  final Future<void> Function(String, String, Future<void> Function(String)) showTimePickerDialog;

  const DeadlineTimeSetting({
    super.key,
    required this.showTimePickerDialog,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Only listen to deadlineTime - won't rebuild when other settings change
    final deadlineTime = ref.watch(
      settingsProvider.select((state) => state.settings?.deadlineTime),
    );

    if (deadlineTime == null) return const SizedBox.shrink();

    return ListTile(
      leading: Icon(Icons.access_time, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsDeadline, style: theme.textTheme.titleMedium),
      subtitle: Text(l10n.settingsDeadlineDesc, style: theme.textTheme.bodyMedium),
      trailing: TextButton(
        onPressed: () => showTimePickerDialog(
          l10n.settingsDeadline,
          deadlineTime,
          (time) async {
            await ref.read(settingsProvider.notifier).updateSettings(
                  deadlineTime: time,
                );
          },
        ),
        child: Text(
          deadlineTime,
          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600),
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}

/// Reminder Enabled Setting Widget - only rebuilds when reminderEnabled changes
class ReminderEnabledSetting extends ConsumerWidget {
  const ReminderEnabledSetting({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Only listen to reminderEnabled
    final reminderEnabled = ref.watch(
      settingsProvider.select((state) => state.settings?.reminderEnabled),
    );

    if (reminderEnabled == null) return const SizedBox.shrink();

    return SwitchListTile(
      secondary: Icon(Icons.notifications, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsReminderEnabled, style: theme.textTheme.titleMedium),
      subtitle: Text(l10n.settingsReminderEnabledDesc, style: theme.textTheme.bodyMedium),
      value: reminderEnabled,
      onChanged: (value) async {
        await ref.read(settingsProvider.notifier).updateSettings(
              reminderEnabled: value,
            );
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}

/// Reminder Time Setting Widget - only rebuilds when reminderTime or reminderEnabled changes
class ReminderTimeSetting extends ConsumerWidget {
  final Future<void> Function(String, String, Future<void> Function(String)) showTimePickerDialog;

  const ReminderTimeSetting({
    super.key,
    required this.showTimePickerDialog,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Listen to both reminderEnabled and reminderTime
    final settings = ref.watch(
      settingsProvider.select((state) => state.settings),
    );

    if (settings == null || !settings.reminderEnabled) {
      return const SizedBox.shrink();
    }

    return ListTile(
      leading: Icon(Icons.alarm, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsReminderTime, style: theme.textTheme.titleMedium),
      trailing: TextButton(
        onPressed: () => showTimePickerDialog(
          l10n.settingsReminderTime,
          settings.reminderTime,
          (time) async {
            await ref.read(settingsProvider.notifier).updateSettings(
                  reminderTime: time,
                );
          },
        ),
        child: Text(
          settings.reminderTime,
          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w600),
        ),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}

/// Theme Setting Widget - only rebuilds when theme changes
class ThemeSetting extends ConsumerWidget {
  const ThemeSetting({super.key});

  String _getThemeName(ThemeType type, AppLocalizations l10n) {
    switch (type) {
      case ThemeType.standard:
        return l10n.onboardingThemeStandard;
      case ThemeType.warm:
        return l10n.onboardingThemeWarm;
      case ThemeType.nature:
        return l10n.onboardingThemeNature;
      case ThemeType.ocean:
        return l10n.onboardingThemeOcean;
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Only listen to theme
    final currentTheme = ref.watch(
      preferencesProvider.select((state) => state.preferences?.theme),
    );

    if (currentTheme == null) return const SizedBox.shrink();

    return ListTile(
      leading: Icon(Icons.color_lens, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsTheme, style: theme.textTheme.titleMedium),
      trailing: DropdownButton<ThemeType>(
        value: currentTheme,
        items: ThemeType.values.map((type) {
          return DropdownMenuItem(
            value: type,
            child: Text(_getThemeName(type, l10n), style: theme.textTheme.bodyLarge),
          );
        }).toList(),
        onChanged: (value) async {
          if (value != null) {
            await ref.read(preferencesProvider.notifier).updatePreferences(
                  theme: value.name,
                );
          }
        },
        underline: const SizedBox.shrink(),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}

/// Font Size Setting Widget - only rebuilds when fontSize changes
class FontSizeSetting extends ConsumerWidget {
  const FontSizeSetting({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Only listen to fontSize
    final fontSize = ref.watch(
      preferencesProvider.select((state) => state.preferences?.fontSize),
    );

    if (fontSize == null) return const SizedBox.shrink();

    return ListTile(
      leading: Icon(Icons.text_fields, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsFontSize, style: theme.textTheme.titleMedium),
      subtitle: Slider(
        value: fontSize.toDouble(),
        min: 14,
        max: 24,
        divisions: 5,
        label: '$fontSize',
        onChanged: (value) async {
          await ref.read(preferencesProvider.notifier).updatePreferences(
                fontSize: value.round(),
              );
        },
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}

/// High Contrast Setting Widget - only rebuilds when highContrast changes
class HighContrastSetting extends ConsumerWidget {
  const HighContrastSetting({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Only listen to highContrast
    final highContrast = ref.watch(
      preferencesProvider.select((state) => state.preferences?.highContrast),
    );

    if (highContrast == null) return const SizedBox.shrink();

    return SwitchListTile(
      secondary: Icon(Icons.contrast, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsHighContrast, style: theme.textTheme.titleMedium),
      subtitle: Text(l10n.settingsHighContrastDesc, style: theme.textTheme.bodyMedium),
      value: highContrast,
      onChanged: (value) async {
        await ref.read(preferencesProvider.notifier).updatePreferences(
              highContrast: value,
            );
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}

/// Reduced Motion Setting Widget - only rebuilds when reducedMotion changes
class ReducedMotionSetting extends ConsumerWidget {
  const ReducedMotionSetting({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    // Only listen to reducedMotion
    final reducedMotion = ref.watch(
      preferencesProvider.select((state) => state.preferences?.reducedMotion),
    );

    if (reducedMotion == null) return const SizedBox.shrink();

    return SwitchListTile(
      secondary: Icon(Icons.animation, size: 28, color: theme.colorScheme.primary),
      title: Text(l10n.settingsReducedMotion, style: theme.textTheme.titleMedium),
      subtitle: Text(l10n.settingsReducedMotionDesc, style: theme.textTheme.bodyMedium),
      value: reducedMotion,
      onChanged: (value) async {
        await ref.read(preferencesProvider.notifier).updatePreferences(
              reducedMotion: value,
            );
      },
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
    );
  }
}
