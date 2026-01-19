import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/error_utils.dart';
import '../../data/models/contact.dart';
import 'core_providers.dart';

// ignore unused imports warning - models may be used in the future

class ContactsState {
  final List<EmergencyContact> contacts;
  final bool isLoading;
  final String? error;

  const ContactsState({
    this.contacts = const [],
    this.isLoading = false,
    this.error,
  });

  ContactsState copyWith({
    List<EmergencyContact>? contacts,
    bool? isLoading,
    String? error,
  }) {
    return ContactsState(
      contacts: contacts ?? this.contacts,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ContactsNotifier extends StateNotifier<ContactsState> {
  final Ref _ref;

  ContactsNotifier(this._ref) : super(const ContactsState());

  Future<void> loadContacts() async {
    debugPrint('ContactsNotifier: Starting loadContacts...');
    state = state.copyWith(isLoading: true, error: null);
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      final contacts = await contactsRepo.getContacts();
      debugPrint('ContactsNotifier: Got ${contacts.length} contacts');
      state = ContactsState(contacts: contacts, isLoading: false);
    } catch (e, stack) {
      debugPrint('ContactsNotifier: Error: $e');
      debugPrint('ContactsNotifier: Stack: $stack');
      state = state.copyWith(isLoading: false, error: ErrorUtils.extractError(e).$1);
    }
  }

  Future<void> createContact({
    required String name,
    String? email,
    String? phone,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.createContact(name: name, email: email, phone: phone);
      await loadContacts();
    } catch (e) {
      state = state.copyWith(isLoading: false, error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> updateContact(
    String id, {
    String? name,
    String? email,
    String? phone,
  }) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.updateContact(id, name: name, email: email, phone: phone);
      await loadContacts();
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> deleteContact(String id) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.deleteContact(id);
      state = state.copyWith(
        contacts: state.contacts.where((c) => c.id != id).toList(),
      );
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> reorderContacts(List<String> contactIds) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      final contacts = await contactsRepo.reorderContacts(contactIds);
      state = state.copyWith(contacts: contacts);
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> sendVerification(String id) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.sendVerification(id);
      await loadContacts();
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> sendPhoneVerification(String id) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.sendPhoneVerification(id);
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }

  Future<void> verifyPhone(String id, String otp) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.verifyPhone(id, otp);
      await loadContacts();
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }
}

final contactsProvider =
    StateNotifierProvider<ContactsNotifier, ContactsState>((ref) {
  return ContactsNotifier(ref);
});

class LinkedContactsState {
  final List<LinkedContact> linkedContacts;
  final List<PendingContactInvitation> pendingInvitations;
  final bool isLoading;
  final String? error;

  const LinkedContactsState({
    this.linkedContacts = const [],
    this.pendingInvitations = const [],
    this.isLoading = false,
    this.error,
  });

  LinkedContactsState copyWith({
    List<LinkedContact>? linkedContacts,
    List<PendingContactInvitation>? pendingInvitations,
    bool? isLoading,
    String? error,
  }) {
    return LinkedContactsState(
      linkedContacts: linkedContacts ?? this.linkedContacts,
      pendingInvitations: pendingInvitations ?? this.pendingInvitations,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class LinkedContactsNotifier extends StateNotifier<LinkedContactsState> {
  final Ref _ref;

  LinkedContactsNotifier(this._ref) : super(const LinkedContactsState());

  Future<void> loadLinkedContacts() async {
    debugPrint('LinkedContactsNotifier: Starting loadLinkedContacts...');
    state = state.copyWith(isLoading: true, error: null);
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      final linkedContacts = await contactsRepo.getLinkedContacts();
      final pendingInvitations = await contactsRepo.getPendingInvitations();
      debugPrint('LinkedContactsNotifier: Got ${linkedContacts.length} linked, ${pendingInvitations.length} pending');
      state = LinkedContactsState(
        linkedContacts: linkedContacts,
        pendingInvitations: pendingInvitations,
        isLoading: false,
      );
    } catch (e, stack) {
      debugPrint('LinkedContactsNotifier: Error: $e');
      debugPrint('LinkedContactsNotifier: Stack: $stack');
      state = state.copyWith(isLoading: false, error: ErrorUtils.extractError(e).$1);
    }
  }

  Future<void> acceptContactLink(String token) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.acceptContactLink(token);
      await loadLinkedContacts();
    } catch (e) {
      state = state.copyWith(error: ErrorUtils.extractError(e).$1);
      rethrow;
    }
  }
}

final linkedContactsProvider =
    StateNotifierProvider<LinkedContactsNotifier, LinkedContactsState>((ref) {
  return LinkedContactsNotifier(ref);
});
