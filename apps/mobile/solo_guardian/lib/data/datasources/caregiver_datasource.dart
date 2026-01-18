import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/caregiver.dart';

part 'caregiver_datasource.g.dart';

@RestApi()
abstract class CaregiverDatasource {
  factory CaregiverDatasource(Dio dio, {String baseUrl}) = _CaregiverDatasource;

  @GET('/api/v1/caregiver/elders')
  Future<dynamic> getElders();

  @GET('/api/v1/caregiver/elders/{elderId}')
  Future<dynamic> getElderDetail(@Path('elderId') String elderId);

  @GET('/api/v1/caregiver/caregivers')
  Future<dynamic> getCaregivers();

  @POST('/api/v1/caregiver/invitations')
  Future<dynamic> createInvitation(@Body() Map<String, dynamic> request);

  @GET('/api/v1/caregiver/invitations/{token}')
  Future<dynamic> getInvitation(@Path('token') String token);

  @POST('/api/v1/caregiver/invitations/{token}/accept')
  Future<dynamic> acceptInvitation(@Path('token') String token);

  @POST('/api/v1/caregiver/elders/{elderId}/check-in')
  Future<dynamic> checkInOnBehalf(
    @Path('elderId') String elderId,
    @Body() Map<String, dynamic> request,
  );

  @POST('/api/v1/caregiver/elders/{elderId}/notes')
  Future<dynamic> addNote(
    @Path('elderId') String elderId,
    @Body() Map<String, dynamic> request,
  );

  @GET('/api/v1/caregiver/elders/{elderId}/notes')
  Future<dynamic> getNotes(@Path('elderId') String elderId);
}

extension CaregiverDatasourceExtension on CaregiverDatasource {
  List<ElderSummary> parseElders(dynamic response) {
    final list = response as List<dynamic>;
    return list.map((e) => ElderSummary.fromJson(e as Map<String, dynamic>)).toList();
  }

  ElderDetail parseElderDetail(dynamic response) {
    final map = response as Map<String, dynamic>;
    return ElderDetail.fromJson(map);
  }

  List<CaregiverSummary> parseCaregivers(dynamic response) {
    final list = response as List<dynamic>;
    return list.map((e) => CaregiverSummary.fromJson(e as Map<String, dynamic>)).toList();
  }

  InvitationResponse parseInvitationResponse(dynamic response) {
    final map = response as Map<String, dynamic>;
    return InvitationResponse.fromJson(map);
  }

  InvitationDetails parseInvitationDetails(dynamic response) {
    final map = response as Map<String, dynamic>;
    return InvitationDetails.fromJson(map);
  }

  List<CaregiverNote> parseNotes(dynamic response) {
    final list = response as List<dynamic>;
    return list.map((e) => CaregiverNote.fromJson(e as Map<String, dynamic>)).toList();
  }

  CaregiverNote parseNote(dynamic response) {
    final map = response as Map<String, dynamic>;
    return CaregiverNote.fromJson(map);
  }

  CaretakerCheckInResponse parseCheckInResponse(dynamic response) {
    final map = response as Map<String, dynamic>;
    return CaretakerCheckInResponse.fromJson(map);
  }

  Map<String, dynamic> createInvitationRequest(String relationshipType) {
    return {'relationshipType': relationshipType};
  }

  Map<String, dynamic> checkInOnBehalfRequest({String? note}) {
    return {if (note != null) 'note': note};
  }

  Map<String, dynamic> addNoteRequest(String content) {
    return {'content': content};
  }
}
