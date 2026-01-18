import '../../domain/repositories/caregiver_repository.dart';
import '../datasources/caregiver_datasource.dart';
import '../models/caregiver.dart';

class CaregiverRepositoryImpl implements CaregiverRepository {
  final CaregiverDatasource _datasource;

  CaregiverRepositoryImpl({required CaregiverDatasource datasource})
      : _datasource = datasource;

  @override
  Future<List<ElderSummary>> getElders() async {
    final response = await _datasource.getElders();
    return _datasource.parseElders(response);
  }

  @override
  Future<ElderDetail> getElderDetail(String elderId) async {
    final response = await _datasource.getElderDetail(elderId);
    return _datasource.parseElderDetail(response);
  }

  @override
  Future<List<CaregiverSummary>> getCaregivers() async {
    final response = await _datasource.getCaregivers();
    return _datasource.parseCaregivers(response);
  }

  @override
  Future<InvitationResponse> createInvitation(String relationshipType) async {
    final response = await _datasource.createInvitation(
      _datasource.createInvitationRequest(relationshipType),
    );
    return _datasource.parseInvitationResponse(response);
  }

  @override
  Future<InvitationDetails> getInvitation(String token) async {
    final response = await _datasource.getInvitation(token);
    return _datasource.parseInvitationDetails(response);
  }

  @override
  Future<void> acceptInvitation(String token) async {
    await _datasource.acceptInvitation(token);
  }

  @override
  Future<CaretakerCheckInResponse> checkInOnBehalf(String elderId, {String? note}) async {
    final response = await _datasource.checkInOnBehalf(
      elderId,
      _datasource.checkInOnBehalfRequest(note: note),
    );
    return _datasource.parseCheckInResponse(response);
  }

  @override
  Future<CaregiverNote> addNote(String elderId, String content) async {
    final response = await _datasource.addNote(
      elderId,
      _datasource.addNoteRequest(content),
    );
    return _datasource.parseNote(response);
  }

  @override
  Future<List<CaregiverNote>> getNotes(String elderId) async {
    final response = await _datasource.getNotes(elderId);
    return _datasource.parseNotes(response);
  }
}
