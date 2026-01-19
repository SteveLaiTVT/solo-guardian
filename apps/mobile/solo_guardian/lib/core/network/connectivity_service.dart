/**
 * @file connectivity_service.dart
 * @description Network connectivity monitor service
 * @task TASK-105
 * @design_state_version 3.13.0
 */
import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

enum ConnectivityStatus {
  online,
  offline,
  unknown,
}

class ConnectivityService {
  static final ConnectivityService _instance = ConnectivityService._internal();
  factory ConnectivityService() => _instance;
  ConnectivityService._internal();

  final Connectivity _connectivity = Connectivity();
  final StreamController<ConnectivityStatus> _statusController =
      StreamController<ConnectivityStatus>.broadcast();

  ConnectivityStatus _currentStatus = ConnectivityStatus.unknown;
  StreamSubscription<List<ConnectivityResult>>? _subscription;
  bool _isInitialized = false;

  ConnectivityStatus get currentStatus => _currentStatus;
  bool get isOnline => _currentStatus == ConnectivityStatus.online;
  Stream<ConnectivityStatus> get statusStream => _statusController.stream;

  final List<VoidCallback> _onConnectedCallbacks = [];
  final List<VoidCallback> _onDisconnectedCallbacks = [];

  Future<void> initialize() async {
    if (_isInitialized) return;

    final results = await _connectivity.checkConnectivity();
    _updateStatus(results);

    _subscription = _connectivity.onConnectivityChanged.listen(_updateStatus);
    _isInitialized = true;
  }

  void _updateStatus(List<ConnectivityResult> results) {
    final previousStatus = _currentStatus;

    if (results.isEmpty ||
        results.every((r) => r == ConnectivityResult.none)) {
      _currentStatus = ConnectivityStatus.offline;
    } else {
      _currentStatus = ConnectivityStatus.online;
    }

    _statusController.add(_currentStatus);

    if (previousStatus != _currentStatus) {
      if (_currentStatus == ConnectivityStatus.online) {
        _notifyConnected();
      } else if (_currentStatus == ConnectivityStatus.offline) {
        _notifyDisconnected();
      }
    }
  }

  void addOnConnectedCallback(VoidCallback callback) {
    _onConnectedCallbacks.add(callback);
  }

  void removeOnConnectedCallback(VoidCallback callback) {
    _onConnectedCallbacks.remove(callback);
  }

  void addOnDisconnectedCallback(VoidCallback callback) {
    _onDisconnectedCallbacks.add(callback);
  }

  void removeOnDisconnectedCallback(VoidCallback callback) {
    _onDisconnectedCallbacks.remove(callback);
  }

  void _notifyConnected() {
    for (final callback in _onConnectedCallbacks) {
      try {
        callback();
      } catch (e) {
        debugPrint('Error in onConnected callback: $e');
      }
    }
  }

  void _notifyDisconnected() {
    for (final callback in _onDisconnectedCallbacks) {
      try {
        callback();
      } catch (e) {
        debugPrint('Error in onDisconnected callback: $e');
      }
    }
  }

  Future<bool> checkConnectivity() async {
    final results = await _connectivity.checkConnectivity();
    _updateStatus(results);
    return isOnline;
  }

  void dispose() {
    _subscription?.cancel();
    _statusController.close();
    _onConnectedCallbacks.clear();
    _onDisconnectedCallbacks.clear();
    _isInitialized = false;
  }
}
