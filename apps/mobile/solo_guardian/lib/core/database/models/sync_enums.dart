/**
 * @file sync_enums.dart
 * @description Sync status enums for offline-first data
 * @task TASK-102
 * @design_state_version 3.13.0
 */

enum SyncStatus {
  synced,
  pendingCreate,
  pendingUpdate,
  pendingDelete,
  failed,
}

enum OperationType {
  create,
  update,
  delete,
}

enum EntityType {
  checkIn,
  contact,
  settings,
}

enum OperationStatus {
  pending,
  inProgress,
  failed,
  completed,
}
