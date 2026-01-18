import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/utils/date_utils.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/contacts_provider.dart';

class LinkedContactsScreen extends ConsumerStatefulWidget {
  const LinkedContactsScreen({super.key});

  @override
  ConsumerState<LinkedContactsScreen> createState() => _LinkedContactsScreenState();
}

class _LinkedContactsScreenState extends ConsumerState<LinkedContactsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(linkedContactsProvider.notifier).loadLinkedContacts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final linkedState = ref.watch(linkedContactsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.linkedContactsTitle),
      ),
      body: RefreshIndicator(
        onRefresh: () =>
            ref.read(linkedContactsProvider.notifier).loadLinkedContacts(),
        child: linkedState.isLoading
            ? const Center(child: CircularProgressIndicator())
            : linkedState.linkedContacts.isEmpty &&
                    linkedState.pendingInvitations.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.link_off,
                          size: 64,
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          l10n.linkedContactsEmpty,
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      if (linkedState.pendingInvitations.isNotEmpty) ...[
                        Text(
                          l10n.linkedContactsPending,
                          style: theme.textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        ...linkedState.pendingInvitations.map((invitation) {
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            color: Colors.amber.shade50,
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: Colors.amber.shade100,
                                child: Icon(
                                  Icons.pending,
                                  color: Colors.amber.shade700,
                                ),
                              ),
                              title: Text(invitation.elderName),
                              subtitle: Text(invitation.elderEmail),
                              trailing: FilledButton(
                                onPressed: () async {
                                  try {
                                    await ref
                                        .read(linkedContactsProvider.notifier)
                                        .acceptContactLink(invitation.id);
                                  } catch (e) {
                                    if (mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text(e.toString())),
                                      );
                                    }
                                  }
                                },
                                child: Text(l10n.accept),
                              ),
                            ),
                          );
                        }),
                        const SizedBox(height: 24),
                      ],
                      if (linkedState.linkedContacts.isNotEmpty) ...[
                        Text(
                          l10n.linkedContactsActive,
                          style: theme.textTheme.titleMedium,
                        ),
                        const SizedBox(height: 8),
                        ...linkedState.linkedContacts.map((contact) {
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor:
                                    theme.colorScheme.primary.withValues(alpha: 0.1),
                                child: Text(
                                  contact.elderName.substring(0, 1).toUpperCase(),
                                  style: TextStyle(color: theme.colorScheme.primary),
                                ),
                              ),
                              title: Text(contact.elderName),
                              subtitle: Text(l10n.linkedContactsSince(
                                AppDateUtils.formatDate(
                                  DateTime.parse(contact.relationshipSince),
                                ),
                              )),
                              trailing: contact.hasActiveAlerts
                                  ? Icon(Icons.warning, color: Colors.red)
                                  : Icon(Icons.check_circle, color: Colors.green),
                            ),
                          );
                        }),
                      ],
                    ],
                  ),
      ),
    );
  }
}
