import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/models/caregiver.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/caregiver_provider.dart';

class CaregiverScreen extends ConsumerStatefulWidget {
  const CaregiverScreen({super.key});

  @override
  ConsumerState<CaregiverScreen> createState() => _CaregiverScreenState();
}

class _CaregiverScreenState extends ConsumerState<CaregiverScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(eldersProvider.notifier).loadElders();
      ref.read(caregiversProvider.notifier).loadCaregivers();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.navCare),
        bottom: TabBar(
          controller: _tabController,
          tabs: [
            Tab(text: l10n.caregiverElders),
            Tab(text: l10n.caregiverCaregivers),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _EldersTab(),
          _CaregiversTab(),
        ],
      ),
    );
  }
}

class _EldersTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final eldersState = ref.watch(eldersProvider);

    return RefreshIndicator(
      onRefresh: () => ref.read(eldersProvider.notifier).loadElders(),
      child: eldersState.isLoading && eldersState.elders.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : eldersState.elders.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.people_outline,
                        size: 64,
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        l10n.caregiverEldersEmpty,
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: eldersState.elders.length,
                  itemBuilder: (context, index) {
                    final elder = eldersState.elders[index];
                    return _ElderCard(elder: elder);
                  },
                ),
    );
  }
}

class _ElderCard extends ConsumerWidget {
  final ElderSummary elder;

  const _ElderCard({required this.elder});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);

    Color statusColor;
    IconData statusIcon;
    String statusText;

    switch (elder.todayStatus) {
      case ElderTodayStatus.checkedIn:
        statusColor = Colors.green;
        statusIcon = Icons.check_circle;
        statusText = l10n.caregiverStatusCheckedIn;
        break;
      case ElderTodayStatus.pending:
        statusColor = Colors.orange;
        statusIcon = Icons.access_time;
        statusText = l10n.caregiverStatusPending;
        break;
      case ElderTodayStatus.overdue:
        statusColor = Colors.red;
        statusIcon = Icons.warning;
        statusText = l10n.caregiverStatusOverdue;
        break;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () => _showElderDetail(context, ref),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: statusColor.withValues(alpha: 0.1),
                child: Icon(statusIcon, color: statusColor),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(elder.name, style: theme.textTheme.titleMedium),
                    Text(
                      statusText,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: statusColor,
                      ),
                    ),
                  ],
                ),
              ),
              if (elder.todayStatus != ElderTodayStatus.checkedIn &&
                  elder.isAccepted)
                FilledButton(
                  onPressed: () => _checkInOnBehalf(context, ref),
                  child: Text(l10n.caregiverCheckIn),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _showElderDetail(BuildContext context, WidgetRef ref) async {
    final l10n = AppLocalizations.of(context);
    final elderDetail = await ref.read(elderDetailProvider(elder.id).future);

    if (!context.mounted) return;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.9,
        minChildSize: 0.3,
        expand: false,
        builder: (context, scrollController) => ListView(
          controller: scrollController,
          padding: const EdgeInsets.all(24),
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              elderDetail.name,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(elderDetail.email),
            const SizedBox(height: 24),
            if (elderDetail.checkInSettings != null) ...[
              Text(
                l10n.caregiverDeadline(
                    elderDetail.checkInSettings!.deadlineTime),
              ),
              const SizedBox(height: 8),
            ],
            if (elderDetail.pendingAlerts > 0)
              Card(
                color: Colors.red.shade50,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(Icons.warning, color: Colors.red),
                      const SizedBox(width: 12),
                      Text(l10n.caregiverPendingAlerts(elderDetail.pendingAlerts)),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _checkInOnBehalf(BuildContext context, WidgetRef ref) async {
    final l10n = AppLocalizations.of(context);

    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.caregiverCheckInTitle),
        content: Text(l10n.caregiverCheckInConfirm(elder.name)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text(l10n.cancel),
          ),
          FilledButton(
            onPressed: () => Navigator.pop(context, true),
            child: Text(l10n.caregiverCheckIn),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        await ref.read(eldersProvider.notifier).checkInOnBehalf(elder.id);
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(l10n.caregiverCheckInSuccess(elder.name))),
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(e.toString())),
          );
        }
      }
    }
  }
}

class _CaregiversTab extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final caregiversState = ref.watch(caregiversProvider);

    return RefreshIndicator(
      onRefresh: () => ref.read(caregiversProvider.notifier).loadCaregivers(),
      child: caregiversState.isLoading && caregiversState.caregivers.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : caregiversState.caregivers.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.favorite_outline,
                        size: 64,
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        l10n.caregiverCaregiversEmpty,
                        style: theme.textTheme.bodyLarge?.copyWith(
                          color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                      ),
                      const SizedBox(height: 24),
                      FilledButton.icon(
                        icon: const Icon(Icons.person_add),
                        label: Text(l10n.caregiverInvite),
                        onPressed: () => _showInviteDialog(context, ref),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: caregiversState.caregivers.length + 1,
                  itemBuilder: (context, index) {
                    if (index == caregiversState.caregivers.length) {
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        child: OutlinedButton.icon(
                          icon: const Icon(Icons.person_add),
                          label: Text(l10n.caregiverInvite),
                          onPressed: () => _showInviteDialog(context, ref),
                        ),
                      );
                    }

                    final caregiver = caregiversState.caregivers[index];
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor:
                              theme.colorScheme.primary.withValues(alpha: 0.1),
                          child: Text(
                            caregiver.name.substring(0, 1).toUpperCase(),
                            style: TextStyle(color: theme.colorScheme.primary),
                          ),
                        ),
                        title: Text(caregiver.name),
                        subtitle: Text(caregiver.email),
                        trailing: caregiver.isAccepted
                            ? Icon(Icons.check_circle, color: Colors.green)
                            : Icon(Icons.pending, color: Colors.orange),
                      ),
                    );
                  },
                ),
    );
  }

  Future<void> _showInviteDialog(BuildContext context, WidgetRef ref) async {
    final l10n = AppLocalizations.of(context);

    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(l10n.caregiverInviteTitle),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.favorite),
              title: Text(l10n.caregiverTypeCaregiver),
              onTap: () async {
                Navigator.pop(context);
                await _createInvitation(
                    context, ref, RelationshipType.caregiver);
              },
            ),
            ListTile(
              leading: const Icon(Icons.family_restroom),
              title: Text(l10n.caregiverTypeFamily),
              onTap: () async {
                Navigator.pop(context);
                await _createInvitation(context, ref, RelationshipType.family);
              },
            ),
            ListTile(
              leading: const Icon(Icons.medical_services),
              title: Text(l10n.caregiverTypeCaretaker),
              onTap: () async {
                Navigator.pop(context);
                await _createInvitation(
                    context, ref, RelationshipType.caretaker);
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _createInvitation(
    BuildContext context,
    WidgetRef ref,
    RelationshipType type,
  ) async {
    final l10n = AppLocalizations.of(context);

    try {
      final invitation = await ref
          .read(caregiversProvider.notifier)
          .createInvitation(type.name);

      if (context.mounted) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: Text(l10n.caregiverInvitationCreated),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(l10n.caregiverShareLink),
                const SizedBox(height: 16),
                SelectableText(invitation.qrUrl),
              ],
            ),
            actions: [
              FilledButton(
                onPressed: () => Navigator.pop(context),
                child: Text(l10n.ok),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }
}
