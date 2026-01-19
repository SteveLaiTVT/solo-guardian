/**
 * @file offline_first_contacts_repository.dart
 * @description Offline-first repository for emergency contacts
 * @task TASK-103
 * @design_state_version 3.13.0
 */
import '../../core/database/models/sync_enums.dart';
import '../../core/database/converters/model_converters.dart';
import '../../domain/repositories/contacts_repository.dart';
import '../datasources/contacts_datasource.dart';
import '../datasources/local/local_datasources.dart';
import '../models/contact.dart';

class OfflineFirstContactsRepository implements ContactsRepository {
  final ContactsDatasource _remoteDatasource;
  final ContactsLocalDatasource _localDatasource;
  final PendingOperationsLocalDatasource _pendingOpsDatasource;
  final String Function() _getUserId;
  final bool Function() _isOnline;

  OfflineFirstContactsRepository({
    required ContactsDatasource remoteDatasource,
    required ContactsLocalDatasource localDatasource,
    required PendingOperationsLocalDatasource pendingOpsDatasource,
    required String Function() getUserId,
    required bool Function() isOnline,
  })  : _remoteDatasource = remoteDatasource,
        _localDatasource = localDatasource,
        _pendingOpsDatasource = pendingOpsDatasource,
        _getUserId = getUserId,
        _isOnline = isOnline;

  @override
  Future<List<EmergencyContact>> getContacts() async {
    final userId = _getUserId();

    final localContacts = await _localDatasource.getContacts(userId);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.getContacts();
        final serverContacts = _remoteDatasource.parseContacts(response);

        await _localDatasource.replaceAllContacts(userId, serverContacts);

        return serverContacts;
      } catch (e) {
        return localContacts;
      }
    } else {
      return localContacts;
    }
  }

  @override
  Future<EmergencyContact> getContact(String id) async {
    final localContact = await _localDatasource.getContact(id);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.getContact(id);
        final serverContact = _remoteDatasource.parseContact(response);

        await _localDatasource.saveContact(serverContact);

        return serverContact;
      } catch (e) {
        if (localContact != null) {
          return localContact;
        }
        rethrow;
      }
    } else {
      if (localContact != null) {
        return localContact;
      }
      throw Exception('Contact not found offline');
    }
  }

  @override
  Future<EmergencyContact> createContact({
    required String name,
    String? email,
    String? phone,
  }) async {
    final userId = _getUserId();
    final tempId = 'temp_${DateTime.now().millisecondsSinceEpoch}';

    final localContact = await _localDatasource.createPendingContact(
      id: tempId,
      userId: userId,
      name: name,
      email: email ?? '',
      phone: phone,
    );

    final contact = ContactConverter.fromLocal(localContact);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.createContact(
          _remoteDatasource.createContactRequest(
            name: name,
            email: email,
            phone: phone,
          ),
        );
        final serverContact = _remoteDatasource.parseContact(response);

        await _localDatasource.markAsSynced(tempId, serverContact);

        return serverContact;
      } catch (e) {
        await _queueContactOperation(
          localId: tempId,
          operationType: OperationType.create,
          data: {'name': name, 'email': email, 'phone': phone},
        );
        return contact;
      }
    } else {
      await _queueContactOperation(
        localId: tempId,
        operationType: OperationType.create,
        data: {'name': name, 'email': email, 'phone': phone},
      );
      return contact;
    }
  }

  @override
  Future<EmergencyContact> updateContact(
    String id, {
    String? name,
    String? email,
    String? phone,
  }) async {
    await _localDatasource.updatePendingContact(
      id: id,
      name: name,
      email: email,
      phone: phone,
    );

    final localContact = await _localDatasource.getContact(id);

    if (_isOnline()) {
      try {
        final response = await _remoteDatasource.updateContact(
          id,
          _remoteDatasource.updateContactRequest(
            name: name,
            email: email,
            phone: phone,
          ),
        );
        final serverContact = _remoteDatasource.parseContact(response);

        await _localDatasource.markAsSynced(id, serverContact);

        return serverContact;
      } catch (e) {
        await _queueContactOperation(
          localId: id,
          operationType: OperationType.update,
          data: {'name': name, 'email': email, 'phone': phone},
        );
        return localContact!;
      }
    } else {
      await _queueContactOperation(
        localId: id,
        operationType: OperationType.update,
        data: {'name': name, 'email': email, 'phone': phone},
      );
      return localContact!;
    }
  }

  @override
  Future<void> deleteContact(String id) async {
    await _localDatasource.markForDeletion(id);

    if (_isOnline()) {
      try {
        await _remoteDatasource.deleteContact(id);
        await _localDatasource.deleteContact(id);
      } catch (e) {
        await _queueContactOperation(
          localId: id,
          operationType: OperationType.delete,
          data: {'id': id},
        );
      }
    } else {
      await _queueContactOperation(
        localId: id,
        operationType: OperationType.delete,
        data: {'id': id},
      );
    }
  }

  @override
  Future<List<EmergencyContact>> reorderContacts(List<String> contactIds) async {
    if (_isOnline()) {
      final response = await _remoteDatasource.reorderContacts(
        _remoteDatasource.reorderContactsRequest(contactIds),
      );
      return _remoteDatasource.parseContacts(response);
    } else {
      throw Exception('Cannot reorder contacts while offline');
    }
  }

  @override
  Future<EmergencyContact> sendVerification(String id) async {
    if (!_isOnline()) {
      throw Exception('Cannot send verification while offline');
    }
    final response = await _remoteDatasource.sendVerification(id);
    return _remoteDatasource.parseContact(response);
  }

  @override
  Future<EmergencyContact> resendVerification(String id) async {
    if (!_isOnline()) {
      throw Exception('Cannot resend verification while offline');
    }
    final response = await _remoteDatasource.resendVerification(id);
    return _remoteDatasource.parseContact(response);
  }

  @override
  Future<SendPhoneVerificationResult> sendPhoneVerification(String id) async {
    if (!_isOnline()) {
      throw Exception('Cannot send phone verification while offline');
    }
    final response = await _remoteDatasource.sendPhoneVerification(id);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return SendPhoneVerificationResult.fromJson(data);
  }

  @override
  Future<VerifyPhoneResult> verifyPhone(String id, String code) async {
    if (!_isOnline()) {
      throw Exception('Cannot verify phone while offline');
    }
    final response = await _remoteDatasource.verifyPhone(
      id,
      _remoteDatasource.verifyPhoneRequest(code),
    );
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return VerifyPhoneResult.fromJson(data);
  }

  @override
  Future<SendPhoneVerificationResult> resendPhoneVerification(String id) async {
    if (!_isOnline()) {
      throw Exception('Cannot resend phone verification while offline');
    }
    final response = await _remoteDatasource.resendPhoneVerification(id);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return SendPhoneVerificationResult.fromJson(data);
  }

  @override
  Future<List<LinkedContact>> getLinkedContacts() async {
    if (!_isOnline()) {
      return [];
    }
    final response = await _remoteDatasource.getLinkedContacts();
    return _remoteDatasource.parseLinkedContacts(response);
  }

  @override
  Future<List<PendingContactInvitation>> getPendingInvitations() async {
    if (!_isOnline()) {
      return [];
    }
    final response = await _remoteDatasource.getPendingInvitations();
    return _remoteDatasource.parsePendingInvitations(response);
  }

  @override
  Future<ContactLinkInvitationDetails> getContactLinkInvitation(String token) async {
    if (!_isOnline()) {
      throw Exception('Cannot get invitation while offline');
    }
    final response = await _remoteDatasource.getContactLinkInvitation(token);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return ContactLinkInvitationDetails.fromJson(data);
  }

  @override
  Future<AcceptContactLinkResult> acceptContactLink(String token) async {
    if (!_isOnline()) {
      throw Exception('Cannot accept invitation while offline');
    }
    final response = await _remoteDatasource.acceptContactLink(token);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return AcceptContactLinkResult.fromJson(data);
  }

  Future<void> _queueContactOperation({
    required String localId,
    required OperationType operationType,
    required Map<String, dynamic> data,
  }) async {
    final operation = PendingOperationHelper.createContactOperation(
      contactId: localId,
      operationType: operationType,
      data: data,
    );

    await _pendingOpsDatasource.addOperation(operation);
  }

  Future<void> syncPendingContacts() async {
    if (!_isOnline()) return;

    final pendingContacts = await _localDatasource.getPendingContacts();

    for (final local in pendingContacts) {
      try {
        if (local.syncStatus == SyncStatus.pendingCreate) {
          final response = await _remoteDatasource.createContact(
            _remoteDatasource.createContactRequest(
              name: local.name,
              email: local.email,
              phone: local.phone,
            ),
          );
          final serverContact = _remoteDatasource.parseContact(response);
          await _localDatasource.markAsSynced(local.id, serverContact);
        } else if (local.syncStatus == SyncStatus.pendingUpdate) {
          final response = await _remoteDatasource.updateContact(
            local.id,
            _remoteDatasource.updateContactRequest(
              name: local.name,
              email: local.email,
              phone: local.phone,
            ),
          );
          final serverContact = _remoteDatasource.parseContact(response);
          await _localDatasource.markAsSynced(local.id, serverContact);
        } else if (local.syncStatus == SyncStatus.pendingDelete) {
          await _remoteDatasource.deleteContact(local.id);
          await _localDatasource.deleteContact(local.id);
        }

        final operations = await _pendingOpsDatasource.getOperationsByEntity(
          EntityType.contact,
          local.id,
        );
        for (final op in operations) {
          await _pendingOpsDatasource.markAsCompleted(op.id);
        }
      } catch (e) {
        await _localDatasource.updateSyncStatus(
          local.id,
          SyncStatus.failed,
        );
      }
    }
  }

  Future<void> clearLocalData() async {
    final userId = _getUserId();
    await _localDatasource.clearUserData(userId);
  }
}
