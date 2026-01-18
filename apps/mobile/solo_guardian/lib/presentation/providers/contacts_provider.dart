import 'package:flutter_riverpod/flutter_riverpod.dart';
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
    state = state.copyWith(isLoading: true, error: null);
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      final contacts = await contactsRepo.getContacts();
      state = ContactsState(contacts: contacts);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
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
      state = state.copyWith(isLoading: false, error: e.toString());
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
      state = state.copyWith(error: e.toString());
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
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> reorderContacts(List<String> contactIds) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      final contacts = await contactsRepo.reorderContacts(contactIds);
      state = state.copyWith(contacts: contacts);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> sendVerification(String id) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.sendVerification(id);
      await loadContacts();
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> sendPhoneVerification(String id) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.sendPhoneVerification(id);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> verifyPhone(String id, String otp) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.verifyPhone(id, otp);
      await loadContacts();
    } catch (e) {
      state = state.copyWith(error: e.toString());
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
    state = state.copyWith(isLoading: true, error: null);
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      final linkedContacts = await contactsRepo.getLinkedContacts();
      final pendingInvitations = await contactsRepo.getPendingInvitations();
      state = LinkedContactsState(
        linkedContacts: linkedContacts,
        pendingInvitations: pendingInvitations,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> acceptContactLink(String token) async {
    try {
      final contactsRepo = _ref.read(contactsRepositoryProvider);
      await contactsRepo.acceptContactLink(token);
      await loadLinkedContacts();
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }
}

final linkedContactsProvider =
    StateNotifierProvider<LinkedContactsNotifier, LinkedContactsState>((ref) {
  return LinkedContactsNotifier(ref);
});
