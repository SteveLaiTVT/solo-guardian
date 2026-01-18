import 'package:flutter/material.dart';

enum AppThemeType { standard, warm, nature, ocean }

class AppTheme {
  final AppThemeType type;
  final bool highContrast;
  final bool reducedMotion;
  final double fontSize;

  const AppTheme({
    this.type = AppThemeType.standard,
    this.highContrast = false,
    this.reducedMotion = false,
    this.fontSize = 16.0,
  });

  static const Map<AppThemeType, _ThemeColors> _themeColors = {
    AppThemeType.standard: _ThemeColors(
      primary: Color(0xFF2D9D78),
      primaryHsl: (162, 0.63, 0.41),
      background: Color(0xFFFCFCFA),
      card: Color(0xFFFDFDFC),
      foreground: Color(0xFF3D3530),
      muted: Color(0xFFEDEBE8),
      mutedForeground: Color(0xFF6B6660),
    ),
    AppThemeType.warm: _ThemeColors(
      primary: Color(0xFFF97316),
      primaryHsl: (25, 0.95, 0.53),
      background: Color(0xFFFCF9F6),
      card: Color(0xFFFDFBF9),
      foreground: Color(0xFF3D3028),
      muted: Color(0xFFF0EAE4),
      mutedForeground: Color(0xFF6B5F55),
    ),
    AppThemeType.nature: _ThemeColors(
      primary: Color(0xFF22C55E),
      primaryHsl: (142, 0.70, 0.40),
      background: Color(0xFFF9FCF9),
      card: Color(0xFFFBFDFB),
      foreground: Color(0xFF283D28),
      muted: Color(0xFFE4F0E4),
      mutedForeground: Color(0xFF556B55),
    ),
    AppThemeType.ocean: _ThemeColors(
      primary: Color(0xFF0EA5E9),
      primaryHsl: (199, 0.89, 0.48),
      background: Color(0xFFF6FAFC),
      card: Color(0xFFF9FBFD),
      foreground: Color(0xFF28333D),
      muted: Color(0xFFE4EDF0),
      mutedForeground: Color(0xFF55636B),
    ),
  };

  static const _highContrastColors = _ThemeColors(
    primary: Color(0xFFFFFF00),
    primaryHsl: (60, 1.0, 0.50),
    background: Color(0xFF000000),
    card: Color(0xFF000000),
    foreground: Color(0xFFFFFFFF),
    muted: Color(0xFF333333),
    mutedForeground: Color(0xFFCCCCCC),
  );

  _ThemeColors get colors {
    if (highContrast) return _highContrastColors;
    return _themeColors[type]!;
  }

  ThemeData get themeData {
    final c = colors;
    final textTheme = _buildTextTheme(c.foreground);

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: c.primary,
        onPrimary: Colors.white,
        secondary: c.muted,
        onSecondary: c.foreground,
        surface: c.card,
        onSurface: c.foreground,
        error: const Color(0xFFDC2626),
        onError: Colors.white,
      ),
      scaffoldBackgroundColor: c.background,
      cardColor: c.card,
      dividerColor: c.muted,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: c.background,
        foregroundColor: c.foreground,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: textTheme.titleLarge,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: c.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: c.primary,
          minimumSize: const Size(double.infinity, 48),
          side: BorderSide(color: c.primary),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: c.muted.withValues(alpha: 0.5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: c.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFDC2626)),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      cardTheme: CardThemeData(
        color: c.card,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: c.muted),
        ),
      ),
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: c.card,
        selectedItemColor: c.primary,
        unselectedItemColor: c.mutedForeground,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      pageTransitionsTheme: reducedMotion
          ? const PageTransitionsTheme(
              builders: {
                TargetPlatform.android: FadeUpwardsPageTransitionsBuilder(),
                TargetPlatform.iOS: FadeUpwardsPageTransitionsBuilder(),
              },
            )
          : null,
    );
  }

  TextTheme _buildTextTheme(Color foreground) {
    final scale = fontSize / 16.0;

    return TextTheme(
      displayLarge: TextStyle(
        fontSize: 32 * scale,
        fontWeight: FontWeight.bold,
        color: foreground,
      ),
      displayMedium: TextStyle(
        fontSize: 28 * scale,
        fontWeight: FontWeight.bold,
        color: foreground,
      ),
      displaySmall: TextStyle(
        fontSize: 24 * scale,
        fontWeight: FontWeight.bold,
        color: foreground,
      ),
      headlineLarge: TextStyle(
        fontSize: 22 * scale,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      headlineMedium: TextStyle(
        fontSize: 20 * scale,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      headlineSmall: TextStyle(
        fontSize: 18 * scale,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      titleLarge: TextStyle(
        fontSize: 18 * scale,
        fontWeight: FontWeight.w600,
        color: foreground,
      ),
      titleMedium: TextStyle(
        fontSize: 16 * scale,
        fontWeight: FontWeight.w500,
        color: foreground,
      ),
      titleSmall: TextStyle(
        fontSize: 14 * scale,
        fontWeight: FontWeight.w500,
        color: foreground,
      ),
      bodyLarge: TextStyle(
        fontSize: 16 * scale,
        fontWeight: FontWeight.normal,
        color: foreground,
      ),
      bodyMedium: TextStyle(
        fontSize: 14 * scale,
        fontWeight: FontWeight.normal,
        color: foreground,
      ),
      bodySmall: TextStyle(
        fontSize: 12 * scale,
        fontWeight: FontWeight.normal,
        color: foreground,
      ),
      labelLarge: TextStyle(
        fontSize: 14 * scale,
        fontWeight: FontWeight.w500,
        color: foreground,
      ),
      labelMedium: TextStyle(
        fontSize: 12 * scale,
        fontWeight: FontWeight.w500,
        color: foreground,
      ),
      labelSmall: TextStyle(
        fontSize: 10 * scale,
        fontWeight: FontWeight.w500,
        color: foreground,
      ),
    );
  }

  AppTheme copyWith({
    AppThemeType? type,
    bool? highContrast,
    bool? reducedMotion,
    double? fontSize,
  }) {
    return AppTheme(
      type: type ?? this.type,
      highContrast: highContrast ?? this.highContrast,
      reducedMotion: reducedMotion ?? this.reducedMotion,
      fontSize: fontSize ?? this.fontSize,
    );
  }
}

class _ThemeColors {
  final Color primary;
  final (double, double, double) primaryHsl;
  final Color background;
  final Color card;
  final Color foreground;
  final Color muted;
  final Color mutedForeground;

  const _ThemeColors({
    required this.primary,
    required this.primaryHsl,
    required this.background,
    required this.card,
    required this.foreground,
    required this.muted,
    required this.mutedForeground,
  });

  Color get secondary => muted;
  Color get accent => HSLColor.fromAHSL(1.0, primaryHsl.$1, primaryHsl.$2 * 0.8, primaryHsl.$3 * 1.2).toColor();
}
