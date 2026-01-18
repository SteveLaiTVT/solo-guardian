import '../../data/models/caregiver.dart';

abstract class CaregiverRepository {
  Future<List<ElderSummary>> getElders();
  Future<ElderDetail> getElderDetail(String elderId);
  Future<List<CaregiverSummary>> getCaregivers();
  Future<InvitationResponse> createInvitation(String relationshipType);
  Future<InvitationDetails> getInvitation(String token);
  Future<void> acceptInvitation(String token);
  Future<CaretakerCheckInResponse> checkInOnBehalf(String elderId, {String? note});
  Future<CaregiverNote> addNote(String elderId, String content);
  Future<List<CaregiverNote>> getNotes(String elderId);
}
