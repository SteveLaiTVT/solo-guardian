import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/router/app_router.dart';
import '../../../data/models/contact.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/contacts_provider.dart';

class ContactsScreen extends ConsumerStatefulWidget {
  const ContactsScreen({super.key});

  @override
  ConsumerState<ContactsScreen> createState() => _ContactsScreenState();
}

class _ContactsScreenState extends ConsumerState<ContactsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(contactsProvider.notifier).loadContacts();
    });
  }

  Future<void> _showAddContactDialog() async {
    final result = await showModalBottomSheet<Map<String, String?>>(
      context: context,
      isScrollControlled: true,
      builder: (context) => const _ContactFormSheet(),
    );

    if (result != null) {
      try {
        await ref.read(contactsProvider.notifier).createContact(
              name: result['name']!,
              email: result['email'],
              phone: result['phone'],
            );
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final contactsState = ref.watch(contactsProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.navContacts),
        actions: [
          TextButton.icon(
            icon: const Icon(Icons.link),
            label: Text(l10n.contactsLinked),
            onPressed: () => context.push(AppRoutes.linkedContacts),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(contactsProvider.notifier).loadContacts(),
        child: contactsState.isLoading && contactsState.contacts.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : contactsState.contacts.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.contacts_outlined,
                          size: 64,
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          l10n.contactsEmpty,
                          style: theme.textTheme.bodyLarge?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                          ),
                        ),
                        const SizedBox(height: 24),
                        FilledButton.icon(
                          icon: const Icon(Icons.add),
                          label: Text(l10n.contactsAdd),
                          onPressed: _showAddContactDialog,
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: contactsState.contacts.length,
                    itemBuilder: (context, index) {
                      final contact = contactsState.contacts[index];
                      return _ContactCard(
                        contact: contact,
                        onDelete: () async {
                          final confirm = await showDialog<bool>(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: Text(l10n.contactsDeleteTitle),
                              content: Text(l10n.contactsDeleteConfirm(contact.name)),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context, false),
                                  child: Text(l10n.cancel),
                                ),
                                FilledButton(
                                  onPressed: () => Navigator.pop(context, true),
                                  child: Text(l10n.delete),
                                ),
                              ],
                            ),
                          );

                          if (confirm == true) {
                            try {
                              await ref
                                  .read(contactsProvider.notifier)
                                  .deleteContact(contact.id);
                            } catch (e) {
                              if (mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text(e.toString())),
                                );
                              }
                            }
                          }
                        },
                      );
                    },
                  ),
      ),
      floatingActionButton: contactsState.contacts.isNotEmpty
          ? FloatingActionButton(
              onPressed: _showAddContactDialog,
              child: const Icon(Icons.add),
            )
          : null,
    );
  }
}

class _ContactCard extends StatelessWidget {
  final EmergencyContact contact;
  final VoidCallback onDelete;

  const _ContactCard({
    required this.contact,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: theme.colorScheme.primary.withValues(alpha: 0.1),
          child: Text(
            contact.name.substring(0, 1).toUpperCase(),
            style: TextStyle(color: theme.colorScheme.primary),
          ),
        ),
        title: Row(
          children: [
            Expanded(child: Text(contact.name)),
            if (contact.isVerified)
              Icon(
                Icons.verified,
                size: 16,
                color: Colors.green,
              ),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(contact.email),
            if (contact.phone != null)
              Row(
                children: [
                  Text(contact.phone!),
                  if (contact.phoneVerified) ...[
                    const SizedBox(width: 4),
                    Icon(Icons.verified, size: 12, color: Colors.green),
                  ],
                ],
              ),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  const Icon(Icons.delete, color: Colors.red),
                  const SizedBox(width: 8),
                  Text(l10n.delete),
                ],
              ),
            ),
          ],
          onSelected: (value) {
            if (value == 'delete') {
              onDelete();
            }
          },
        ),
      ),
    );
  }
}

class _ContactFormSheet extends StatefulWidget {
  const _ContactFormSheet();

  @override
  State<_ContactFormSheet> createState() => _ContactFormSheetState();
}

class _ContactFormSheetState extends State<_ContactFormSheet> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 24,
        right: 24,
        top: 24,
      ),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text(
              l10n.contactsAddTitle,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 24),
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: l10n.fieldsName,
              ),
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return l10n.validationNameRequired;
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: l10n.fieldsEmail,
              ),
              keyboardType: TextInputType.emailAddress,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return l10n.validationEmailRequired;
                }
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _phoneController,
              decoration: InputDecoration(
                labelText: l10n.fieldsPhone,
                hintText: l10n.fieldsPhonePlaceholder,
              ),
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  Navigator.pop(
                    context,
                    CreateContactRequest(
                      name: _nameController.text.trim(),
                      email: _emailController.text.trim(),
                      phone: _phoneController.text.isNotEmpty
                          ? _phoneController.text.trim()
                          : null,
                    ),
                  );
                }
              },
              child: Text(l10n.save),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}
