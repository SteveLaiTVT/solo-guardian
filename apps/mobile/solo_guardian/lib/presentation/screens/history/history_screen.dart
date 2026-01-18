import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/utils/date_utils.dart';
import '../../../core/utils/error_utils.dart';
import '../../../l10n/app_localizations.dart';
import '../../providers/check_in_provider.dart';

class HistoryScreen extends ConsumerStatefulWidget {
  const HistoryScreen({super.key});

  @override
  ConsumerState<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends ConsumerState<HistoryScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(checkInHistoryProvider.notifier).loadHistory(refresh: true);
    });
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      ref.read(checkInHistoryProvider.notifier).loadHistory();
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final historyState = ref.watch(checkInHistoryProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text(l10n.navHistory),
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.read(checkInHistoryProvider.notifier).refresh(),
        child: historyState.checkIns.isEmpty && historyState.isLoading
            ? const Center(child: CircularProgressIndicator())
            : historyState.error != null && historyState.checkIns.isEmpty
                ? _buildErrorState(
                    ErrorUtils.getLocalizedMessage(
                      l10n,
                      historyState.errorI18nKey,
                      historyState.error,
                    ),
                    l10n,
                    theme,
                  )
                    : historyState.checkIns.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.history,
                                  size: 64,
                                  color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
                                ),
                                const SizedBox(height: 16),
                                Text(
                                  l10n.historyEmpty,
                                  style: theme.textTheme.bodyLarge?.copyWith(
                                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            controller: _scrollController,
                            padding: const EdgeInsets.all(16),
                            itemCount: historyState.checkIns.length +
                                (historyState.hasMore ? 1 : 0),
                            itemBuilder: (context, index) {
                              if (index == historyState.checkIns.length) {
                                return const Center(
                                  child: Padding(
                                    padding: EdgeInsets.all(16),
                                    child: CircularProgressIndicator(),
                                  ),
                                );
                              }

                              final checkIn = historyState.checkIns[index];
                              final checkInDate = DateTime.parse(checkIn.checkInDate);
                              final checkedInAt = DateTime.parse(checkIn.checkedInAt);

                              return Card(
                                margin: const EdgeInsets.only(bottom: 8),
                                child: ListTile(
                                  leading: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: theme.colorScheme.primary.withValues(alpha: 0.1),
                                      shape: BoxShape.circle,
                                    ),
                                    child: Icon(
                                      Icons.check_circle,
                                      color: theme.colorScheme.primary,
                                    ),
                                  ),
                                  title: Text(
                                    AppDateUtils.formatRelativeDate(checkInDate),
                                    style: theme.textTheme.titleMedium,
                                  ),
                                  subtitle: Text(
                                    AppDateUtils.formatTime(checkedInAt),
                                    style: theme.textTheme.bodySmall,
                                  ),
                                  trailing: checkIn.note != null
                                      ? Icon(
                                          Icons.note,
                                          color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                                        )
                                      : null,
                                ),
                              );
                            },
                          ),
      ),
    );
  }

  Widget _buildErrorState(String error, AppLocalizations l10n, ThemeData theme) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.error_outline,
            size: 64,
            color: theme.colorScheme.error,
          ),
          const SizedBox(height: 16),
          Text(
            l10n.error,
            style: theme.textTheme.titleLarge?.copyWith(
              color: theme.colorScheme.error,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            error,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          FilledButton.icon(
            onPressed: () {
              ref.read(checkInHistoryProvider.notifier).refresh();
            },
            icon: const Icon(Icons.refresh),
            label: Text(l10n.retry),
          ),
        ],
      ),
    );
  }
}
