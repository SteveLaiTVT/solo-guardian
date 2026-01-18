import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/preferences.dart';
import '../../../l10n/app_localizations.dart';
import '../../../theme/app_theme.dart';
import '../../providers/preferences_provider.dart';
import '../../widgets/language_switcher.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  late FixedExtentScrollController _yearScrollController;
  int _currentPage = 0;
  ThemeType _selectedTheme = ThemeType.standard;
  int _selectedFontSize = 16;
  bool _highContrast = false;
  bool _reducedMotion = false;
  bool _warmColors = false;
  bool _autoEnableFeatures = true;
  bool _hobbyCheckIn = false;
  bool _familyAccess = false;
  int? _birthYear;
  bool _isLoading = false;

  static const _totalPages = 9;
  static final _currentYear = DateTime.now().year;
  static final _defaultYear = _currentYear - 65;

  @override
  void initState() {
    super.initState();
    _yearScrollController = FixedExtentScrollController(
      initialItem: _currentYear - _defaultYear,
    );
  }

  @override
  void dispose() {
    _pageController.dispose();
    _yearScrollController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _totalPages - 1) {
      _pageController.nextPage(
        duration: Duration(milliseconds: _reducedMotion ? 50 : 300),
        curve: Curves.easeInOut,
      );
    }
  }

  void _previousPage() {
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: Duration(milliseconds: _reducedMotion ? 50 : 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _showYearInputDialog(AppLocalizations l10n) async {
    final controller = TextEditingController(
      text: (_birthYear ?? _defaultYear).toString(),
    );

    final result = await showDialog<int>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.onboardingBirthYearEnter),
        content: TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          inputFormatters: [
            FilteringTextInputFormatter.digitsOnly,
            LengthLimitingTextInputFormatter(4),
          ],
          decoration: InputDecoration(
            hintText: _defaultYear.toString(),
          ),
          autofocus: true,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(l10n.cancel),
          ),
          FilledButton(
            onPressed: () {
              final year = int.tryParse(controller.text);
              if (year != null && year >= _currentYear - 99 && year <= _currentYear) {
                Navigator.pop(context, year);
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(l10n.onboardingBirthYearInvalid)),
                );
              }
            },
            child: Text(l10n.ok),
          ),
        ],
      ),
    );

    if (result != null) {
      setState(() => _birthYear = result);
      final targetIndex = _currentYear - result;
      _yearScrollController.animateToItem(
        targetIndex,
        duration: Duration(milliseconds: _reducedMotion ? 50 : 300),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _completeOnboarding() async {
    setState(() => _isLoading = true);

    try {
      final prefsNotifier = ref.read(preferencesProvider.notifier);

      await prefsNotifier.updatePreferences(
        theme: _selectedTheme.name,
        fontSize: _selectedFontSize,
        highContrast: _highContrast,
        reducedMotion: _reducedMotion,
      );

      await prefsNotifier.completeOnboarding();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  AppTheme get _previewTheme => AppTheme(
    type: _mapToAppThemeType(_selectedTheme),
    highContrast: _highContrast,
    reducedMotion: _reducedMotion,
    fontSize: _selectedFontSize.toDouble(),
  );

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    // Apply selected visual settings immediately
    final previewTheme = _previewTheme;
    final effectiveTheme = previewTheme.themeData;

    return Theme(
      data: effectiveTheme,
      child: Scaffold(
        backgroundColor: _warmColors
            ? _adjustWarmColor(effectiveTheme.scaffoldBackgroundColor)
            : effectiveTheme.scaffoldBackgroundColor,
        body: SafeArea(
          child: Column(
            children: [
              // Header with language switcher
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 16, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${_currentPage + 1} / $_totalPages',
                      style: effectiveTheme.textTheme.bodyMedium?.copyWith(
                        color: effectiveTheme.colorScheme.onSurface.withValues(alpha: 0.6),
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const LanguageSwitcher(),
                  ],
                ),
              ),
              // Progress indicator
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(_totalPages, (index) {
                    final isCompleted = index < _currentPage;
                    final isCurrent = index == _currentPage;
                    return Container(
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      width: 28,
                      height: 8,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(4),
                        color: isCompleted || isCurrent
                            ? effectiveTheme.colorScheme.primary
                            : effectiveTheme.colorScheme.outline.withValues(alpha: 0.3),
                        border: index > _currentPage
                            ? Border.all(
                                color: effectiveTheme.colorScheme.outline.withValues(alpha: 0.5),
                                width: 1,
                              )
                            : null,
                      ),
                    );
                  }),
                ),
              ),
              Expanded(
                child: PageView(
                  controller: _pageController,
                  onPageChanged: (page) => setState(() => _currentPage = page),
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _buildWelcomePage(l10n, effectiveTheme),
                    _buildProfilePage(l10n, effectiveTheme),
                    _buildThemePage(l10n, effectiveTheme),
                    _buildPreferencePage(l10n, effectiveTheme),
                    _buildFeaturesPage(l10n, effectiveTheme),
                    _buildVisualPage(l10n, effectiveTheme),
                    _buildCheckInTutorialPage(l10n, effectiveTheme),
                    _buildContactsTutorialPage(l10n, effectiveTheme),
                    _buildCaregiverTutorialPage(l10n, effectiveTheme),
                  ],
                ),
              ),
              _buildNavigationButtons(l10n, effectiveTheme),
            ],
          ),
        ),
      ),
    );
  }

  Color _adjustWarmColor(Color color) {
    final hsl = HSLColor.fromColor(color);
    return hsl.withHue((hsl.hue + 15) % 360).withSaturation((hsl.saturation * 1.1).clamp(0.0, 1.0)).toColor();
  }

  Widget _buildNavigationButtons(AppLocalizations l10n, ThemeData theme) {
    final isFirstPage = _currentPage == 0;
    final isLastPage = _currentPage == _totalPages - 1;
    final canSkip = _currentPage == 1 || _currentPage == 2;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Row(
        children: [
          if (!isFirstPage)
            TextButton(
              onPressed: _previousPage,
              child: Text(l10n.onboardingBack),
            )
          else if (canSkip)
            TextButton(
              onPressed: _nextPage,
              child: Text(l10n.onboardingSkip),
            )
          else
            const SizedBox(width: 80),
          const Spacer(),
          FilledButton(
            onPressed: _isLoading
                ? null
                : () {
                    if (isLastPage) {
                      _completeOnboarding();
                    } else {
                      _nextPage();
                    }
                  },
            child: _isLoading
                ? const SizedBox(
                    height: 20,
                    width: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Text(isLastPage ? l10n.onboardingFinish : l10n.onboardingNext),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomePage(AppLocalizations l10n, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.shield,
              size: 64,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 32),
          Text(
            l10n.onboardingWelcomeTitle,
            style: theme.textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            l10n.onboardingWelcomeSubtitle,
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildProfilePage(AppLocalizations l10n, ThemeData theme) {
    final displayYear = _birthYear ?? _defaultYear;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              Icons.person_outline,
              size: 48,
              color: theme.colorScheme.primary,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            l10n.onboardingProfileTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingProfileSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          // Tappable year display
          GestureDetector(
            onTap: () => _showYearInputDialog(l10n),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: theme.colorScheme.primary.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.edit, color: theme.colorScheme.primary, size: 20),
                  const SizedBox(width: 12),
                  Text(
                    displayYear.toString(),
                    style: theme.textTheme.headlineSmall?.copyWith(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    l10n.onboardingBirthYearTap,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.primary.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: theme.colorScheme.outline.withValues(alpha: 0.3),
                ),
              ),
              child: Stack(
                children: [
                  Center(
                    child: Container(
                      height: 56,
                      margin: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: theme.colorScheme.primary.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: theme.colorScheme.primary.withValues(alpha: 0.3),
                          width: 2,
                        ),
                      ),
                    ),
                  ),
                  ListWheelScrollView.useDelegate(
                    controller: _yearScrollController,
                    itemExtent: 56,
                    perspective: 0.003,
                    diameterRatio: 1.5,
                    physics: const FixedExtentScrollPhysics(),
                    onSelectedItemChanged: (index) {
                      setState(() => _birthYear = _currentYear - index);
                    },
                    childDelegate: ListWheelChildBuilderDelegate(
                      childCount: 100,
                      builder: (context, index) {
                        final year = _currentYear - index;
                        final isSelected = _birthYear == year ||
                            (_birthYear == null && year == _defaultYear);
                        return Center(
                          child: Text(
                            year.toString(),
                            style: theme.textTheme.headlineSmall?.copyWith(
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                              color: isSelected
                                  ? theme.colorScheme.primary
                                  : theme.colorScheme.onSurface.withValues(alpha: 0.6),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            l10n.onboardingBirthYearHint,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildThemePage(AppLocalizations l10n, ThemeData theme) {
    final selectedAppTheme = AppTheme(type: _mapToAppThemeType(_selectedTheme));
    final selectedColors = selectedAppTheme.colors;

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            l10n.onboardingThemeTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingThemeSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          AnimatedContainer(
            duration: Duration(milliseconds: _reducedMotion ? 50 : 300),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: selectedColors.background,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: selectedColors.primary, width: 2),
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: selectedColors.primary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.shield, color: Colors.white, size: 28),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        l10n.appName,
                        style: TextStyle(
                          color: selectedColors.foreground,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        l10n.onboardingFontSizePreview,
                        style: TextStyle(
                          color: selectedColors.mutedForeground,
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: selectedColors.primary,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    l10n.ok,
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Expanded(
            child: GridView.count(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.1,
              children: ThemeType.values.map((themeType) {
                return _buildThemeCard(themeType, l10n, theme);
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildThemeCard(ThemeType themeType, AppLocalizations l10n, ThemeData theme) {
    final isSelected = _selectedTheme == themeType;
    final appTheme = AppTheme(type: _mapToAppThemeType(themeType));
    final colors = appTheme.colors;

    String themeName;
    switch (themeType) {
      case ThemeType.standard:
        themeName = l10n.onboardingThemeStandard;
        break;
      case ThemeType.warm:
        themeName = l10n.onboardingThemeWarm;
        break;
      case ThemeType.nature:
        themeName = l10n.onboardingThemeNature;
        break;
      case ThemeType.ocean:
        themeName = l10n.onboardingThemeOcean;
        break;
    }

    return GestureDetector(
      onTap: () => setState(() => _selectedTheme = themeType),
      child: AnimatedContainer(
        duration: Duration(milliseconds: _reducedMotion ? 50 : 200),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? colors.primary : theme.colorScheme.outline.withValues(alpha: 0.3),
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [BoxShadow(color: colors.primary.withValues(alpha: 0.2), blurRadius: 8)]
              : null,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildColorCircle(colors.primary),
                const SizedBox(width: 8),
                _buildColorCircle(colors.secondary),
                const SizedBox(width: 8),
                _buildColorCircle(colors.accent),
              ],
            ),
            const SizedBox(height: 16),
            if (isSelected)
              Icon(Icons.check_circle, color: colors.primary, size: 24)
            else
              Icon(Icons.circle_outlined, color: theme.colorScheme.outline, size: 24),
            const SizedBox(height: 8),
            Text(
              themeName,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildColorCircle(Color color) {
    return Container(
      width: 24,
      height: 24,
      decoration: BoxDecoration(
        color: color,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white.withValues(alpha: 0.3)),
      ),
    );
  }

  AppThemeType _mapToAppThemeType(ThemeType type) {
    switch (type) {
      case ThemeType.standard:
        return AppThemeType.standard;
      case ThemeType.warm:
        return AppThemeType.warm;
      case ThemeType.nature:
        return AppThemeType.nature;
      case ThemeType.ocean:
        return AppThemeType.ocean;
    }
  }

  Widget _buildPreferencePage(AppLocalizations l10n, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            l10n.onboardingPreferenceTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingPreferenceSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          _buildPreferenceCard(
            icon: Icons.auto_awesome,
            title: l10n.onboardingPreferenceEnableAll,
            description: l10n.onboardingPreferenceEnableAllDesc,
            isSelected: _autoEnableFeatures,
            onTap: () => setState(() => _autoEnableFeatures = true),
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildPreferenceCard(
            icon: Icons.tune,
            title: l10n.onboardingPreferenceKeepSimple,
            description: l10n.onboardingPreferenceKeepSimpleDesc,
            isSelected: !_autoEnableFeatures,
            onTap: () => setState(() => _autoEnableFeatures = false),
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildPreferenceCard({
    required IconData icon,
    required String title,
    required String description,
    required bool isSelected,
    required VoidCallback onTap,
    required ThemeData theme,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: Duration(milliseconds: _reducedMotion ? 50 : 200),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isSelected
              ? theme.colorScheme.primary.withValues(alpha: 0.1)
              : theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outline.withValues(alpha: 0.3),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: theme.colorScheme.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: theme.colorScheme.primary),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                    ),
                  ),
                ],
              ),
            ),
            if (isSelected)
              Icon(Icons.check_circle, color: theme.colorScheme.primary),
          ],
        ),
      ),
    );
  }

  Widget _buildFeaturesPage(AppLocalizations l10n, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            l10n.onboardingFeaturesTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingFeaturesSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          _buildFeatureToggleCard(
            icon: Icons.emoji_emotions_outlined,
            title: l10n.onboardingFeatureHobby,
            description: l10n.onboardingFeatureHobbyDesc,
            isEnabled: _hobbyCheckIn,
            onChanged: (value) => setState(() => _hobbyCheckIn = value),
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildFeatureToggleCard(
            icon: Icons.family_restroom,
            title: l10n.onboardingFeatureFamily,
            description: l10n.onboardingFeatureFamilyDesc,
            isEnabled: _familyAccess,
            onChanged: (value) => setState(() => _familyAccess = value),
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildFeatureToggleCard({
    required IconData icon,
    required String title,
    required String description,
    required bool isEnabled,
    required ValueChanged<bool> onChanged,
    required ThemeData theme,
  }) {
    return AnimatedContainer(
      duration: Duration(milliseconds: _reducedMotion ? 50 : 200),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isEnabled
            ? theme.colorScheme.primary.withValues(alpha: 0.1)
            : theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isEnabled ? theme.colorScheme.primary : theme.colorScheme.outline.withValues(alpha: 0.3),
          width: isEnabled ? 2 : 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: theme.colorScheme.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: theme.colorScheme.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  description,
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: isEnabled,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildVisualPage(AppLocalizations l10n, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            l10n.onboardingVisualTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingVisualSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.text_fields, color: theme.colorScheme.primary),
                      const SizedBox(width: 12),
                      Text(
                        l10n.onboardingFontSize,
                        style: theme.textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: theme.colorScheme.primary.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${_selectedFontSize}px',
                          style: TextStyle(
                            color: theme.colorScheme.primary,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Text(
                        'A',
                        style: TextStyle(
                          fontSize: 14,
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                      ),
                      Expanded(
                        child: Slider(
                          value: _selectedFontSize.toDouble(),
                          min: 14,
                          max: 24,
                          divisions: 5,
                          onChanged: (value) {
                            setState(() => _selectedFontSize = value.round());
                          },
                        ),
                      ),
                      Text(
                        'A',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: theme.colorScheme.outline.withValues(alpha: 0.3),
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          l10n.onboardingFontSizePreview,
                          style: TextStyle(
                            fontSize: _selectedFontSize.toDouble(),
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          l10n.onboardingWelcomeSubtitle,
                          style: TextStyle(
                            fontSize: _selectedFontSize.toDouble() * 0.875,
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          _buildVisualToggle(
            icon: Icons.contrast,
            title: l10n.onboardingHighContrast,
            value: _highContrast,
            onChanged: (value) => setState(() => _highContrast = value),
            theme: theme,
          ),
          const SizedBox(height: 12),
          _buildVisualToggle(
            icon: Icons.animation,
            title: l10n.onboardingReducedMotion,
            value: _reducedMotion,
            onChanged: (value) => setState(() => _reducedMotion = value),
            theme: theme,
          ),
          const SizedBox(height: 12),
          _buildVisualToggle(
            icon: Icons.wb_sunny_outlined,
            title: l10n.onboardingWarmColors,
            value: _warmColors,
            onChanged: (value) => setState(() => _warmColors = value),
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildVisualToggle({
    required IconData icon,
    required String title,
    required bool value,
    required ValueChanged<bool> onChanged,
    required ThemeData theme,
  }) {
    return Card(
      child: SwitchListTile(
        secondary: Icon(icon, color: theme.colorScheme.primary),
        title: Text(title),
        value: value,
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildCheckInTutorialPage(AppLocalizations l10n, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.green.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_circle,
              size: 40,
              color: Colors.green,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            l10n.onboardingCheckInTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingCheckInSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          _buildTutorialItem(
            icon: Icons.touch_app,
            title: l10n.onboardingCheckInHowTo,
            description: l10n.onboardingCheckInHowToDesc,
            color: Colors.green,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.schedule,
            title: l10n.onboardingCheckInDeadline,
            description: l10n.onboardingCheckInDeadlineDesc,
            color: Colors.green,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.notifications,
            title: l10n.onboardingCheckInReminder,
            description: l10n.onboardingCheckInReminderDesc,
            color: Colors.green,
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildContactsTutorialPage(AppLocalizations l10n, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.blue.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.contacts,
              size: 40,
              color: Colors.blue,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            l10n.onboardingContactsTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingContactsSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          _buildTutorialItem(
            icon: Icons.person_add,
            title: l10n.onboardingContactsAdd,
            description: l10n.onboardingContactsAddDesc,
            color: Colors.blue,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.verified_user,
            title: l10n.onboardingContactsVerify,
            description: l10n.onboardingContactsVerifyDesc,
            color: Colors.blue,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.notifications_active,
            title: l10n.onboardingContactsAlert,
            description: l10n.onboardingContactsAlertDesc,
            color: Colors.blue,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.lock_outline,
            title: l10n.onboardingContactsPrivacy,
            description: l10n.onboardingContactsPrivacyDesc,
            color: Colors.blue,
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildCaregiverTutorialPage(AppLocalizations l10n, ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.pink.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.favorite,
              size: 40,
              color: Colors.pink,
            ),
          ),
          const SizedBox(height: 24),
          Text(
            l10n.onboardingCaregiverTitle,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            l10n.onboardingCaregiverSubtitle,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          _buildTutorialItem(
            icon: Icons.mail_outline,
            title: l10n.onboardingCaregiverInvite,
            description: l10n.onboardingCaregiverInviteDesc,
            color: Colors.pink,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.qr_code,
            title: l10n.onboardingCaregiverQr,
            description: l10n.onboardingCaregiverQrDesc,
            color: Colors.pink,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.visibility,
            title: l10n.onboardingCaregiverMonitor,
            description: l10n.onboardingCaregiverMonitorDesc,
            color: Colors.pink,
            theme: theme,
          ),
          const SizedBox(height: 16),
          _buildTutorialItem(
            icon: Icons.check_circle_outline,
            title: l10n.onboardingCaregiverCheckIn,
            description: l10n.onboardingCaregiverCheckInDesc,
            color: Colors.pink,
            theme: theme,
          ),
        ],
      ),
    );
  }

  Widget _buildTutorialItem({
    required IconData icon,
    required String title,
    required String description,
    required Color color,
    required ThemeData theme,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withValues(alpha: 0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: theme.textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                description,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
