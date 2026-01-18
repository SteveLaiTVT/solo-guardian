import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/utils/error_utils.dart';
import '../../../data/models/preferences.dart';
import '../../../l10n/app_localizations.dart';
import '../../../theme/app_theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/core_providers.dart';
import '../../providers/preferences_provider.dart';
import '../../providers/settings_provider.dart';
import '../../widgets/language_switcher.dart';
import '../../widgets/profile_edit_dialog.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool _isUploadingAvatar = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(settingsProvider.notifier).loadSettings();
      ref.read(preferencesProvider.notifier).loadPreferences();
    });
  }

  Future<void> _handleLogout() async {
    final l10n = AppLocalizations.of(context);
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(l10n.settingsLogoutTitle, style: const TextStyle(fontSize: 20)),
        content: Text(l10n.settingsLogoutConfirm, style: const TextStyle(fontSize: 18)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(l10n.cancel, style: const TextStyle(fontSize: 18)),
          ),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
            onPressed: () => Navigator.pop(context, true),
            child: Text(l10n.settingsLogout, style: const TextStyle(fontSize: 18)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      await ref.read(authProvider.notifier).logout();
    }
  }

  Future<void> _pickAndUploadAvatar() async {
    final l10n = AppLocalizations.of(context);
    final picker = ImagePicker();

    final source = await showModalBottomSheet<ImageSource>(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.photo_camera, size: 32),
                title: Text(
                  l10n.settingsAvatarCamera,
                  style: const TextStyle(fontSize: 18),
                ),
                onTap: () => Navigator.pop(context, ImageSource.camera),
                contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              ),
              ListTile(
                leading: const Icon(Icons.photo_library, size: 32),
                title: Text(
                  l10n.settingsAvatarGallery,
                  style: const TextStyle(fontSize: 18),
                ),
                onTap: () => Navigator.pop(context, ImageSource.gallery),
                contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              ),
            ],
          ),
        ),
      ),
    );

    if (source == null) return;

    final pickedFile = await picker.pickImage(
      source: source,
      maxWidth: 512,
      maxHeight: 512,
      imageQuality: 85,
    );

    if (pickedFile == null) return;

    setState(() => _isUploadingAvatar = true);

    try {
      await ref.read(authProvider.notifier).uploadAvatar(pickedFile.path);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(l10n.settingsAvatarSuccess, style: const TextStyle(fontSize: 16)),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(l10n.settingsAvatarError, style: const TextStyle(fontSize: 16)),
            backgroundColor: Theme.of(context).colorScheme.error,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isUploadingAvatar = false);
      }
    }
  }

  Future<void> _showProfileEditDialog() async {
    final user = ref.read(currentUserProvider);
    if (user == null) return;

    final result = await showDialog<bool>(
      context: context,
      builder: (context) => ProfileEditDialog(
        user: user,
        onSave: ({name, birthYear}) async {
          final prefsRepo = ref.read(preferencesRepositoryProvider);
          final updatedUser = await prefsRepo.updateProfile(
            name: name,
            birthYear: birthYear,
          );
          ref.read(authProvider.notifier).updateUser(updatedUser);

          // Also update stored user
          final authRepo = ref.read(authRepositoryProvider);
          await authRepo.updateStoredUser(updatedUser);
        },
      ),
    );

    if (result == true && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('个人资料已更新', style: TextStyle(fontSize: 16)),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.navSettings, style: const TextStyle(fontSize: 20)),
        centerTitle: true,
      ),
      body: Consumer(
        builder: (context, ref, child) {
          final settingsState = ref.watch(settingsProvider);
          final prefsState = ref.watch(preferencesProvider);

          if (settingsState.isLoading || prefsState.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (settingsState.error != null || prefsState.error != null) {
            return _buildErrorState(
              ErrorUtils.getLocalizedMessage(
                l10n,
                settingsState.errorI18nKey ?? prefsState.errorI18nKey,
                settingsState.error ?? prefsState.error,
              ),
              l10n,
              theme,
            );
          }

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Profile Section
                _buildProfileSection(theme, l10n),

                const SizedBox(height: 16),
                const Divider(height: 1, thickness: 1),
                const SizedBox(height: 8),

                // Check-in Settings Section
                _buildSectionTitle('打卡设置', Icons.schedule, theme),
                _buildCheckInSettings(l10n, theme),

                const SizedBox(height: 16),
                const Divider(height: 1, thickness: 1),
                const SizedBox(height: 8),

                // Appearance Section
                _buildSectionTitle('外观设置', Icons.palette_outlined, theme),
                _buildAppearanceSettings(l10n, theme),

                const SizedBox(height: 16),
                const Divider(height: 1, thickness: 1),
                const SizedBox(height: 8),

                // Language Section
                _buildSectionTitle(l10n.settingsLanguage, Icons.language, theme),
                _buildLanguageSettings(l10n, theme),

                const SizedBox(height: 16),
                const Divider(height: 1, thickness: 1),
                const SizedBox(height: 8),

                // Account Section
                _buildSectionTitle('账户设置', Icons.person_outline, theme),
                _buildAccountSettings(l10n, theme),

                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionTitle(String title, IconData icon, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
      child: Row(
        children: [
          Icon(icon, size: 24, color: theme.colorScheme.primary),
          const SizedBox(width: 8),
          Text(
            title,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
              fontSize: 20,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfileSection(ThemeData theme, AppLocalizations l10n) {
    return Consumer(
      builder: (context, ref, child) {
        final user = ref.watch(currentUserProvider);
        if (user == null) return const SizedBox.shrink();

        return Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.colorScheme.primaryContainer.withOpacity(0.3),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            children: [
              // Avatar
              GestureDetector(
                onTap: _isUploadingAvatar ? null : _pickAndUploadAvatar,
                child: Stack(
                  children: [
                    user.avatar != null && user.avatar!.isNotEmpty
                        ? ClipOval(
                            child: CachedNetworkImage(
                              imageUrl: user.avatar!,
                              width: 80,
                              height: 80,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => CircleAvatar(
                                radius: 40,
                                backgroundColor: theme.colorScheme.primary,
                                child: const SizedBox(
                                  width: 24,
                                  height: 24,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              errorWidget: (context, url, error) {
                                return CircleAvatar(
                                  radius: 40,
                                  backgroundColor: theme.colorScheme.primary,
                                  child: Text(
                                    user.name.substring(0, 1).toUpperCase(),
                                    style: theme.textTheme.headlineMedium?.copyWith(
                                      color: theme.colorScheme.onPrimary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                );
                              },
                            ),
                          )
                        : CircleAvatar(
                            radius: 40,
                            backgroundColor: theme.colorScheme.primary,
                            child: Text(
                              user.name.substring(0, 1).toUpperCase(),
                              style: theme.textTheme.headlineMedium?.copyWith(
                                color: theme.colorScheme.onPrimary,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                    if (_isUploadingAvatar)
                      Positioned.fill(
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.black45,
                            shape: BoxShape.circle,
                          ),
                          child: const Center(
                            child: CircularProgressIndicator(
                              strokeWidth: 3,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      )
                    else
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.primary,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: theme.colorScheme.surface,
                              width: 3,
                            ),
                          ),
                          child: Icon(
                            Icons.camera_alt,
                            size: 16,
                            color: theme.colorScheme.onPrimary,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Name
              Text(
                user.name,
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 22,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),

              // Email/Username
              Text(
                user.email ?? user.username ?? user.id,
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.6),
                  fontSize: 16,
                ),
                textAlign: TextAlign.center,
              ),

              // Birth Year
              if (user.birthYear != null) ...[
                const SizedBox(height: 4),
                Text(
                  '${DateTime.now().year - user.birthYear!} 岁',
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                    fontSize: 16,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],

              const SizedBox(height: 16),

              // Edit Profile Button
              OutlinedButton.icon(
                onPressed: _showProfileEditDialog,
                icon: const Icon(Icons.edit, size: 20),
                label: const Text('编辑个人资料', style: TextStyle(fontSize: 16)),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCheckInSettings(AppLocalizations l10n, ThemeData theme) {
    return Consumer(
      builder: (context, ref, child) {
        final settings = ref.watch(settingsProvider).settings;
        if (settings == null) return const SizedBox.shrink();

        return Column(
          children: [
            // Deadline Time
            ListTile(
              leading: Icon(Icons.access_time, size: 28, color: theme.colorScheme.primary),
              title: Text(l10n.settingsDeadline, style: const TextStyle(fontSize: 18)),
              subtitle: Text(l10n.settingsDeadlineDesc, style: const TextStyle(fontSize: 14)),
              trailing: TextButton(
                onPressed: () => _showTimePickerDialog(
                  l10n.settingsDeadline,
                  settings.deadlineTime,
                  (time) async {
                    await ref.read(settingsProvider.notifier).updateSettings(
                          deadlineTime: time,
                        );
                  },
                ),
                child: Text(
                  settings.deadlineTime,
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            ),

            // Reminder Enabled
            SwitchListTile(
              secondary: Icon(Icons.notifications, size: 28, color: theme.colorScheme.primary),
              title: Text(l10n.settingsReminderEnabled, style: const TextStyle(fontSize: 18)),
              subtitle: Text(l10n.settingsReminderEnabledDesc, style: const TextStyle(fontSize: 14)),
              value: settings.reminderEnabled,
              onChanged: (value) async {
                await ref.read(settingsProvider.notifier).updateSettings(
                      reminderEnabled: value,
                    );
              },
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            ),

            // Reminder Time
            if (settings.reminderEnabled)
              ListTile(
                leading: Icon(Icons.alarm, size: 28, color: theme.colorScheme.primary),
                title: Text(l10n.settingsReminderTime, style: const TextStyle(fontSize: 18)),
                trailing: TextButton(
                  onPressed: () => _showTimePickerDialog(
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
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w600),
                  ),
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
              ),
          ],
        );
      },
    );
  }

  Widget _buildAppearanceSettings(AppLocalizations l10n, ThemeData theme) {
    return Consumer(
      builder: (context, ref, child) {
        final prefs = ref.watch(preferencesProvider).preferences;
        if (prefs == null) return const SizedBox.shrink();

        return Column(
          children: [
            // Theme
            ListTile(
              leading: Icon(Icons.color_lens, size: 28, color: theme.colorScheme.primary),
              title: Text(l10n.settingsTheme, style: const TextStyle(fontSize: 18)),
              trailing: DropdownButton<ThemeType>(
                value: prefs.theme,
                items: ThemeType.values.map((type) {
                  return DropdownMenuItem(
                    value: type,
                    child: Text(_getThemeName(type, l10n), style: const TextStyle(fontSize: 16)),
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
            ),

            // Font Size
            ListTile(
              leading: Icon(Icons.text_fields, size: 28, color: theme.colorScheme.primary),
              title: Text(l10n.settingsFontSize, style: const TextStyle(fontSize: 18)),
              subtitle: Slider(
                value: prefs.fontSize.toDouble(),
                min: 14,
                max: 24,
                divisions: 5,
                label: '${prefs.fontSize}',
                onChanged: (value) async {
                  await ref.read(preferencesProvider.notifier).updatePreferences(
                        fontSize: value.round(),
                      );
                },
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            ),

            // High Contrast
            SwitchListTile(
              secondary: Icon(Icons.contrast, size: 28, color: theme.colorScheme.primary),
              title: Text(l10n.settingsHighContrast, style: const TextStyle(fontSize: 18)),
              subtitle: Text(l10n.settingsHighContrastDesc, style: const TextStyle(fontSize: 14)),
              value: prefs.highContrast,
              onChanged: (value) async {
                await ref.read(preferencesProvider.notifier).updatePreferences(
                      highContrast: value,
                    );
              },
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            ),

            // Reduced Motion
            SwitchListTile(
              secondary: Icon(Icons.animation, size: 28, color: theme.colorScheme.primary),
              title: Text(l10n.settingsReducedMotion, style: const TextStyle(fontSize: 18)),
              subtitle: Text(l10n.settingsReducedMotionDesc, style: const TextStyle(fontSize: 14)),
              value: prefs.reducedMotion,
              onChanged: (value) async {
                await ref.read(preferencesProvider.notifier).updatePreferences(
                      reducedMotion: value,
                    );
              },
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            ),
          ],
        );
      },
    );
  }

  Widget _buildLanguageSettings(AppLocalizations l10n, ThemeData theme) {
    return Consumer(
      builder: (context, ref, child) {
        final currentCode = ref.watch(languageProvider);

        return Column(
          children: languages.map((lang) {
            final isSelected = lang.code == currentCode;
            return RadioListTile<String>(
              value: lang.code,
              groupValue: currentCode,
              onChanged: (value) {
                if (value != null) {
                  ref.read(languageProvider.notifier).state = value;
                }
              },
              title: Row(
                children: [
                  Text(lang.flag, style: const TextStyle(fontSize: 24)),
                  const SizedBox(width: 12),
                  Text(lang.name, style: const TextStyle(fontSize: 18)),
                ],
              ),
              selected: isSelected,
              activeColor: theme.colorScheme.primary,
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            );
          }).toList(),
        );
      },
    );
  }

  Widget _buildAccountSettings(AppLocalizations l10n, ThemeData theme) {
    return Column(
      children: [
        ListTile(
          leading: Icon(Icons.logout, size: 28, color: theme.colorScheme.error),
          title: Text(
            l10n.settingsLogout,
            style: TextStyle(
              fontSize: 18,
              color: theme.colorScheme.error,
              fontWeight: FontWeight.w500,
            ),
          ),
          trailing: Icon(Icons.chevron_right, color: theme.colorScheme.error),
          onTap: _handleLogout,
          contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
        ),
      ],
    );
  }

  Widget _buildErrorState(String error, AppLocalizations l10n, ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: theme.colorScheme.error,
            ),
            const SizedBox(height: 24),
            Text(
              l10n.error,
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.error,
                fontSize: 22,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              error,
              style: const TextStyle(fontSize: 16),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            FilledButton.icon(
              onPressed: () {
                ref.read(settingsProvider.notifier).loadSettings();
                ref.read(preferencesProvider.notifier).loadPreferences();
              },
              icon: const Icon(Icons.refresh, size: 24),
              label: Text(l10n.retry, style: const TextStyle(fontSize: 18)),
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }

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

  Future<void> _showTimePickerDialog(
    String title,
    String currentTime,
    Future<void> Function(String) onSave,
  ) async {
    final parts = currentTime.split(':');
    final initialTime = TimeOfDay(
      hour: int.parse(parts[0]),
      minute: int.parse(parts[1]),
    );

    final picked = await showTimePicker(
      context: context,
      initialTime: initialTime,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            timePickerTheme: TimePickerThemeData(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      final time =
          '${picked.hour.toString().padLeft(2, '0')}:${picked.minute.toString().padLeft(2, '0')}';
      await onSave(time);
    }
  }
}
