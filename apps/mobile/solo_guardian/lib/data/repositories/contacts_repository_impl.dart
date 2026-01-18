import '../../domain/repositories/contacts_repository.dart';
import '../datasources/contacts_datasource.dart';
import '../models/contact.dart';

class ContactsRepositoryImpl implements ContactsRepository {
  final ContactsDatasource _datasource;

  ContactsRepositoryImpl({required ContactsDatasource datasource})
      : _datasource = datasource;

  @override
  Future<List<EmergencyContact>> getContacts() async {
    final response = await _datasource.getContacts();
    return _datasource.parseContacts(response);
  }

  @override
  Future<EmergencyContact> getContact(String id) async {
    final response = await _datasource.getContact(id);
    return _datasource.parseContact(response);
  }

  @override
  Future<EmergencyContact> createContact({
    required String name,
    String? email,
    String? phone,
  }) async {
    final response = await _datasource.createContact(
      _datasource.createContactRequest(name: name, email: email, phone: phone),
    );
    return _datasource.parseContact(response);
  }

  @override
  Future<EmergencyContact> updateContact(
    String id, {
    String? name,
    String? email,
    String? phone,
  }) async {
    final response = await _datasource.updateContact(
      id,
      _datasource.updateContactRequest(name: name, email: email, phone: phone),
    );
    return _datasource.parseContact(response);
  }

  @override
  Future<void> deleteContact(String id) async {
    await _datasource.deleteContact(id);
  }

  @override
  Future<List<EmergencyContact>> reorderContacts(List<String> contactIds) async {
    final response = await _datasource.reorderContacts(
      _datasource.reorderContactsRequest(contactIds),
    );
    return _datasource.parseContacts(response);
  }

  @override
  Future<EmergencyContact> sendVerification(String id) async {
    final response = await _datasource.sendVerification(id);
    return _datasource.parseContact(response);
  }

  @override
  Future<EmergencyContact> resendVerification(String id) async {
    final response = await _datasource.resendVerification(id);
    return _datasource.parseContact(response);
  }

  @override
  Future<SendPhoneVerificationResult> sendPhoneVerification(String id) async {
    final response = await _datasource.sendPhoneVerification(id);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return SendPhoneVerificationResult.fromJson(data);
  }

  @override
  Future<VerifyPhoneResult> verifyPhone(String id, String code) async {
    final response = await _datasource.verifyPhone(
      id,
      _datasource.verifyPhoneRequest(code),
    );
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return VerifyPhoneResult.fromJson(data);
  }

  @override
  Future<SendPhoneVerificationResult> resendPhoneVerification(String id) async {
    final response = await _datasource.resendPhoneVerification(id);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return SendPhoneVerificationResult.fromJson(data);
  }

  @override
  Future<List<LinkedContact>> getLinkedContacts() async {
    final response = await _datasource.getLinkedContacts();
    return _datasource.parseLinkedContacts(response);
  }

  @override
  Future<List<PendingContactInvitation>> getPendingInvitations() async {
    final response = await _datasource.getPendingInvitations();
    return _datasource.parsePendingInvitations(response);
  }

  @override
  Future<ContactLinkInvitationDetails> getContactLinkInvitation(String token) async {
    final response = await _datasource.getContactLinkInvitation(token);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return ContactLinkInvitationDetails.fromJson(data);
  }

  @override
  Future<AcceptContactLinkResult> acceptContactLink(String token) async {
    final response = await _datasource.acceptContactLink(token);
    final data = (response as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    return AcceptContactLinkResult.fromJson(data);
  }
}
