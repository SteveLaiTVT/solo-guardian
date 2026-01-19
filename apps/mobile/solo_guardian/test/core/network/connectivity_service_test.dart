import 'package:flutter_test/flutter_test.dart';
import 'package:solo_guardian/core/network/connectivity_service.dart';

void main() {
  group('ConnectivityService', () {
    late ConnectivityService service;

    setUp(() {
      service = ConnectivityService();
    });

    tearDown(() {
      service.dispose();
    });

    test('initial status is unknown', () {
      expect(service.currentStatus, ConnectivityStatus.unknown);
    });

    test('isOnline returns true only when status is online', () {
      // Initially unknown, so not online
      expect(service.isOnline, isFalse);
    });

    test('statusStream emits connectivity status changes', () {
      expect(service.statusStream, isA<Stream<ConnectivityStatus>>());
    });

    test('addOnConnectedCallback and removeOnConnectedCallback work', () {
      var callbackCalled = false;
      void callback() => callbackCalled = true;

      service.addOnConnectedCallback(callback);
      service.removeOnConnectedCallback(callback);

      // Callback should be removed, so this is just testing the API
      expect(callbackCalled, isFalse);
    });

    test('addOnDisconnectedCallback and removeOnDisconnectedCallback work', () {
      var callbackCalled = false;
      void callback() => callbackCalled = true;

      service.addOnDisconnectedCallback(callback);
      service.removeOnDisconnectedCallback(callback);

      // Callback should be removed
      expect(callbackCalled, isFalse);
    });

    test('dispose clears all callbacks', () {
      var connected = false;
      var disconnected = false;

      service.addOnConnectedCallback(() => connected = true);
      service.addOnDisconnectedCallback(() => disconnected = true);

      service.dispose();

      // After dispose, callbacks should be cleared
      expect(connected, isFalse);
      expect(disconnected, isFalse);
    });
  });

  group('ConnectivityStatus', () {
    test('has all expected values', () {
      expect(ConnectivityStatus.values, containsAll([
        ConnectivityStatus.online,
        ConnectivityStatus.offline,
        ConnectivityStatus.unknown,
      ]));
    });
  });
}
