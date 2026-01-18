import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/core_providers.dart';
import '../../../data/datasources/verification_datasource.dart';

class VerifyContactScreen extends ConsumerStatefulWidget {
  final String token;

  const VerifyContactScreen({super.key, required this.token});

  @override
  ConsumerState<VerifyContactScreen> createState() =>
      _VerifyContactScreenState();
}

class _VerifyContactScreenState extends ConsumerState<VerifyContactScreen> {
  bool _isLoading = true;
  bool _isSuccess = false;
  String? _contactName;
  String? _userName;
  String? _error;

  @override
  void initState() {
    super.initState();
    _verifyContact();
  }

  Future<void> _verifyContact() async {
    try {
      final dio = ref.read(dioProvider);
      final datasource = VerificationDatasource(dio);
      final response = await datasource.verifyContact(widget.token);
      final result = datasource.parseVerifyContactResult(response.data);

      setState(() {
        _isLoading = false;
        _isSuccess = result.success;
        _contactName = result.contactName;
        _userName = result.userName;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _isSuccess = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: _isLoading
                ? const CircularProgressIndicator()
                : Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        _isSuccess ? Icons.check_circle : Icons.error,
                        size: 80,
                        color: _isSuccess ? Colors.green : Colors.red,
                      ),
                      const SizedBox(height: 24),
                      Text(
                        _isSuccess
                            ? l10n.verifyContactSuccess
                            : l10n.verifyContactFailed,
                        style: theme.textTheme.headlineSmall,
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 16),
                      if (_isSuccess && _contactName != null && _userName != null)
                        Text(
                          l10n.verifyContactMessage(_contactName!, _userName!),
                          style: theme.textTheme.bodyLarge,
                          textAlign: TextAlign.center,
                        )
                      else if (_error != null)
                        Text(
                          _error!,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            color: Colors.red,
                          ),
                          textAlign: TextAlign.center,
                        ),
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
