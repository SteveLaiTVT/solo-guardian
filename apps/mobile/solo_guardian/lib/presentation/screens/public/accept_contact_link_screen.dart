import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/app_router.dart';
import '../../../data/models/contact.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/auth_provider.dart';
import '../../providers/contacts_provider.dart';
import '../../providers/core_providers.dart';

class AcceptContactLinkScreen extends ConsumerStatefulWidget {
  final String token;

  const AcceptContactLinkScreen({super.key, required this.token});

  @override
  ConsumerState<AcceptContactLinkScreen> createState() =>
      _AcceptContactLinkScreenState();
}

class _AcceptContactLinkScreenState
    extends ConsumerState<AcceptContactLinkScreen> {
  bool _isLoading = true;
  bool _isAccepting = false;
  ContactLinkInvitationDetails? _invitation;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadInvitation();
  }

  Future<void> _loadInvitation() async {
    try {
      final contactsRepo = ref.read(contactsRepositoryProvider);
      final invitation =
          await contactsRepo.getContactLinkInvitation(widget.token);

      setState(() {
        _isLoading = false;
        _invitation = invitation;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = e.toString();
      });
    }
  }

  Future<void> _acceptLink() async {
    final authState = ref.read(authProvider);
    if (authState.status != AuthStatus.authenticated) {
      context.go(
          '${AppRoutes.login}?redirect=${AppRoutes.acceptContactLink}?token=${widget.token}');
      return;
    }

    setState(() => _isAccepting = true);

    try {
      await ref
          .read(linkedContactsProvider.notifier)
          .acceptContactLink(widget.token);
      if (mounted) {
        context.go(AppRoutes.linkedContacts);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isAccepting = false);
      }
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
                : _error != null
                    ? Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.error,
                            size: 80,
                            color: Colors.red,
                          ),
                          const SizedBox(height: 24),
                          Text(
                            l10n.acceptContactLinkFailed,
                            style: theme.textTheme.headlineSmall,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            _error!,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: Colors.red,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      )
                    : Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.link,
                            size: 80,
                            color: theme.colorScheme.primary,
                          ),
                          const SizedBox(height: 24),
                          Text(
                            l10n.acceptContactLinkTitle,
                            style: theme.textTheme.headlineSmall,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            l10n.acceptContactLinkMessage(
                              _invitation!.elderName,
                            ),
                            style: theme.textTheme.bodyLarge,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 32),
                          FilledButton(
                            onPressed: _isAccepting ? null : _acceptLink,
                            child: _isAccepting
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  )
                                : Text(l10n.accept),
                          ),
                        ],
                      ),
          ),
        ),
      ),
    );
  }
}
