import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../l10n/app_localizations.dart';

class LanguageOption {
  final String code;
  final String name;
  final String flag;

  const LanguageOption({
    required this.code,
    required this.name,
    required this.flag,
  });
}

const languages = [
  LanguageOption(code: 'en', name: 'English', flag: '🇺🇸'),
  LanguageOption(code: 'zh', name: '中文', flag: '🇨🇳'),
  LanguageOption(code: 'ja', name: '日本語', flag: '🇯🇵'),
];

final languageProvider = StateProvider<String>((ref) => 'en');

class LanguageSwitcher extends ConsumerWidget {
  const LanguageSwitcher({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentCode = ref.watch(languageProvider);
    final currentLanguage = languages.firstWhere(
      (lang) => lang.code == currentCode,
      orElse: () => languages.first,
    );

    return PopupMenuButton<String>(
      offset: const Offset(0, 40),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      onSelected: (code) {
        ref.read(languageProvider.notifier).state = code;
        AppLocalizations.delegate.load(Locale(code));
      },
      itemBuilder: (context) => languages.map((lang) {
        final isSelected = lang.code == currentCode;
        return PopupMenuItem<String>(
          value: lang.code,
          child: Row(
            children: [
              Text(lang.flag, style: const TextStyle(fontSize: 18)),
              const SizedBox(width: 12),
              Expanded(child: Text(lang.name)),
              if (isSelected)
                Icon(Icons.check, color: Theme.of(context).colorScheme.primary, size: 20),
            ],
          ),
        );
      }).toList(),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          border: Border.all(color: Theme.of(context).colorScheme.outline.withValues(alpha: 0.3)),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(currentLanguage.flag, style: const TextStyle(fontSize: 16)),
            const SizedBox(width: 8),
            Text(
              currentLanguage.name,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(width: 4),
            Icon(
              Icons.arrow_drop_down,
              size: 20,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ],
        ),
      ),
    );
  }
}
