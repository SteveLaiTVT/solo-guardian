/**
 * @file offline_indicator.dart
 * @description UI widgets for offline status and sync indicators
 * @task TASK-106
 * @design_state_version 3.13.0
 */
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/connectivity_service.dart';
import '../../core/sync/sync_manager.dart';
import '../../core/errors/offline_errors.dart';

class OfflineBanner extends ConsumerWidget {
  const OfflineBanner({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return StreamBuilder<ConnectivityStatus>(
      stream: ConnectivityService().statusStream,
      initialData: ConnectivityService().currentStatus,
      builder: (context, snapshot) {
        final status = snapshot.data ?? ConnectivityStatus.unknown;

        if (status == ConnectivityStatus.online) {
          return const SizedBox.shrink();
        }

        return Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: Colors.orange.shade100,
          child: Row(
            children: [
              Icon(
                Icons.cloud_off,
                size: 16,
                color: Colors.orange.shade800,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  FriendlyErrorMessages.getOfflineModeMessage(),
                  style: TextStyle(
                    fontSize: 13,
                    color: Colors.orange.shade900,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class SyncStatusIndicator extends StatelessWidget {
  final SyncManager syncManager;

  const SyncStatusIndicator({
    super.key,
    required this.syncManager,
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<SyncState>(
      stream: syncManager.stateStream,
      initialData: syncManager.currentState,
      builder: (context, stateSnapshot) {
        return StreamBuilder<int>(
          stream: syncManager.pendingCountStream,
          builder: (context, countSnapshot) {
            final state = stateSnapshot.data ?? SyncState.idle;
            final count = countSnapshot.data ?? 0;

            if (state == SyncState.idle && count == 0) {
              return const SizedBox.shrink();
            }

            return _buildIndicator(context, state, count);
          },
        );
      },
    );
  }

  Widget _buildIndicator(BuildContext context, SyncState state, int count) {
    IconData icon;
    Color color;
    String message;
    VoidCallback? onTap;

    switch (state) {
      case SyncState.syncing:
        icon = Icons.sync;
        color = Colors.blue;
        message = FriendlyErrorMessages.getSyncingMessage();
        break;
      case SyncState.error:
        icon = Icons.sync_problem;
        color = Colors.red;
        message = FriendlyErrorMessages.getSyncFailedMessage(count);
        onTap = () => syncManager.retryAllFailed();
        break;
      case SyncState.idle:
        if (count > 0) {
          icon = Icons.cloud_upload_outlined;
          color = Colors.orange;
          message = FriendlyErrorMessages.getSyncPendingMessage(count);
        } else {
          return const SizedBox.shrink();
        }
        break;
    }

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            state == SyncState.syncing
                ? SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation(color),
                    ),
                  )
                : Icon(icon, size: 14, color: color),
            const SizedBox(width: 6),
            Text(
              message,
              style: TextStyle(
                fontSize: 12,
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (onTap != null) ...[
              const SizedBox(width: 4),
              Icon(Icons.refresh, size: 12, color: color),
            ],
          ],
        ),
      ),
    );
  }
}

class PendingSyncBadge extends StatelessWidget {
  final SyncManager syncManager;

  const PendingSyncBadge({
    super.key,
    required this.syncManager,
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<int>(
      stream: syncManager.pendingCountStream,
      builder: (context, snapshot) {
        final count = snapshot.data ?? 0;

        if (count == 0) {
          return const SizedBox.shrink();
        }

        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: Colors.orange,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            count > 99 ? '99+' : count.toString(),
            style: const TextStyle(
              fontSize: 10,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        );
      },
    );
  }
}

class OfflineAwareButton extends StatelessWidget {
  final Widget child;
  final VoidCallback? onPressed;
  final bool requiresOnline;
  final String offlineMessage;

  const OfflineAwareButton({
    super.key,
    required this.child,
    this.onPressed,
    this.requiresOnline = false,
    this.offlineMessage = 'This action requires an internet connection.',
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ConnectivityStatus>(
      stream: ConnectivityService().statusStream,
      initialData: ConnectivityService().currentStatus,
      builder: (context, snapshot) {
        final isOnline = snapshot.data == ConnectivityStatus.online;
        final isDisabled = requiresOnline && !isOnline;

        return Opacity(
          opacity: isDisabled ? 0.5 : 1.0,
          child: GestureDetector(
            onTap: isDisabled
                ? () => _showOfflineSnackbar(context)
                : onPressed,
            child: child,
          ),
        );
      },
    );
  }

  void _showOfflineSnackbar(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.cloud_off, color: Colors.white, size: 18),
            const SizedBox(width: 8),
            Expanded(child: Text(offlineMessage)),
          ],
        ),
        backgroundColor: Colors.orange.shade700,
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
      ),
    );
  }
}

void showOfflineToast(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Row(
        children: [
          const Icon(Icons.info_outline, color: Colors.white, size: 18),
          const SizedBox(width: 8),
          Expanded(child: Text(message)),
        ],
      ),
      backgroundColor: Colors.blue.shade700,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 3),
    ),
  );
}

void showSyncSuccessToast(BuildContext context) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Row(
        children: [
          const Icon(Icons.cloud_done, color: Colors.white, size: 18),
          const SizedBox(width: 8),
          Text(FriendlyErrorMessages.getSyncCompleteMessage()),
        ],
      ),
      backgroundColor: Colors.green.shade700,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 2),
    ),
  );
}

void showErrorToast(BuildContext context, String message) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      content: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.white, size: 18),
          const SizedBox(width: 8),
          Expanded(child: Text(message)),
        ],
      ),
      backgroundColor: Colors.red.shade700,
      behavior: SnackBarBehavior.floating,
      duration: const Duration(seconds: 4),
    ),
  );
}
