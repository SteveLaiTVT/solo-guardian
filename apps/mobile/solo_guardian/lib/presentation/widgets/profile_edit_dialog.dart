import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../data/models/user.dart';
import '../../l10n/app_localizations.dart';

class ProfileEditDialog extends StatefulWidget {
  final User user;
  final Future<void> Function({String? name, int? birthYear}) onSave;

  const ProfileEditDialog({
    super.key,
    required this.user,
    required this.onSave,
  });

  @override
  State<ProfileEditDialog> createState() => _ProfileEditDialogState();
}

class _ProfileEditDialogState extends State<ProfileEditDialog> {
  late final TextEditingController _nameController;
  late final TextEditingController _birthYearController;
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.user.name);
    _birthYearController = TextEditingController(
      text: widget.user.birthYear?.toString() ?? '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _birthYearController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    final l10n = AppLocalizations.of(context);

    // Validate
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      setState(() => _error = l10n.validationNameRequired);
      return;
    }

    final birthYearText = _birthYearController.text.trim();
    int? birthYear;
    if (birthYearText.isNotEmpty) {
      birthYear = int.tryParse(birthYearText);
      if (birthYear == null) {
        setState(() => _error = l10n.settingsBirthYearInvalid);
        return;
      }
      final currentYear = DateTime.now().year;
      if (birthYear < 1900 || birthYear > currentYear) {
        setState(() => _error = l10n.settingsBirthYearRange(currentYear.toString()));
        return;
      }
    }

    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      await widget.onSave(
        name: name != widget.user.name ? name : null,
        birthYear: birthYear != widget.user.birthYear ? birthYear : null,
      );
      if (mounted) {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Title
            Text(
              l10n.settingsEditProfileTitle,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 24),

            // Name field
            TextField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: l10n.fieldsName,
                labelStyle: theme.textTheme.titleMedium,
                prefixIcon: const Icon(Icons.person_outline, size: 28),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
              ),
              style: theme.textTheme.titleMedium,
              enabled: !_isLoading,
            ),
            const SizedBox(height: 16),

            // Birth year field
            TextField(
              controller: _birthYearController,
              decoration: InputDecoration(
                labelText: l10n.settingsBirthYear,
                labelStyle: theme.textTheme.titleMedium,
                prefixIcon: const Icon(Icons.cake_outlined, size: 28),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 16,
                ),
                hintText: l10n.settingsBirthYearHint,
              ),
              style: theme.textTheme.titleMedium,
              keyboardType: TextInputType.number,
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(4),
              ],
              enabled: !_isLoading,
            ),

            // Error message
            if (_error != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.errorContainer,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  _error!,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    color: theme.colorScheme.onErrorContainer,
                  ),
                ),
              ),
            ],

            const SizedBox(height: 24),

            // Buttons
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: _isLoading
                        ? null
                        : () => Navigator.of(context).pop(),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      l10n.cancel,
                      style: theme.textTheme.titleMedium,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FilledButton(
                    onPressed: _isLoading ? null : _handleSave,
                    style: FilledButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.white,
                            ),
                          )
                        : Text(
                            l10n.save,
                            style: theme.textTheme.titleMedium,
                          ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
