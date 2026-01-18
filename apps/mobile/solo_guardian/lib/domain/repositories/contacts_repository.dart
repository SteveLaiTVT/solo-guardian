import '../../data/models/contact.dart';

abstract class ContactsRepository {
  Future<List<EmergencyContact>> getContacts();
  Future<EmergencyContact> getContact(String id);
  Future<EmergencyContact> createContact({
    required String name,
    String? email,
    String? phone,
  });
  Future<EmergencyContact> updateContact(
    String id, {
    String? name,
    String? email,
    String? phone,
  });
  Future<void> deleteContact(String id);
  Future<List<EmergencyContact>> reorderContacts(List<String> contactIds);
  Future<EmergencyContact> sendVerification(String id);
  Future<EmergencyContact> resendVerification(String id);
  Future<SendPhoneVerificationResult> sendPhoneVerification(String id);
  Future<VerifyPhoneResult> verifyPhone(String id, String code);
  Future<SendPhoneVerificationResult> resendPhoneVerification(String id);
  Future<List<LinkedContact>> getLinkedContacts();
  Future<List<PendingContactInvitation>> getPendingInvitations();
  Future<ContactLinkInvitationDetails> getContactLinkInvitation(String token);
  Future<AcceptContactLinkResult> acceptContactLink(String token);
}
