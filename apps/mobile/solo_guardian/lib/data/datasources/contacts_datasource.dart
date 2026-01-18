import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/contact.dart';

part 'contacts_datasource.g.dart';

@RestApi()
abstract class ContactsDatasource {
  factory ContactsDatasource(Dio dio, {String baseUrl}) = _ContactsDatasource;

  @GET('/api/v1/emergency-contacts')
  Future<dynamic> getContacts();

  @GET('/api/v1/emergency-contacts/{id}')
  Future<dynamic> getContact(@Path('id') String id);

  @POST('/api/v1/emergency-contacts')
  Future<dynamic> createContact(@Body() Map<String, dynamic> request);

  @PUT('/api/v1/emergency-contacts/{id}')
  Future<dynamic> updateContact(
    @Path('id') String id,
    @Body() Map<String, dynamic> request,
  );

  @DELETE('/api/v1/emergency-contacts/{id}')
  Future<void> deleteContact(@Path('id') String id);

  @PUT('/api/v1/emergency-contacts/reorder')
  Future<dynamic> reorderContacts(@Body() Map<String, dynamic> request);

  @POST('/api/v1/emergency-contacts/{id}/send-verification')
  Future<dynamic> sendVerification(@Path('id') String id);

  @POST('/api/v1/emergency-contacts/{id}/resend-verification')
  Future<dynamic> resendVerification(@Path('id') String id);

  @POST('/api/v1/emergency-contacts/{id}/send-phone-verification')
  Future<dynamic> sendPhoneVerification(@Path('id') String id);

  @POST('/api/v1/emergency-contacts/{id}/verify-phone')
  Future<dynamic> verifyPhone(
    @Path('id') String id,
    @Body() Map<String, dynamic> request,
  );

  @POST('/api/v1/emergency-contacts/{id}/resend-phone-verification')
  Future<dynamic> resendPhoneVerification(@Path('id') String id);

  @GET('/api/v1/emergency-contacts/linked')
  Future<dynamic> getLinkedContacts();

  @GET('/api/v1/emergency-contacts/linked/pending')
  Future<dynamic> getPendingInvitations();

  @GET('/api/v1/emergency-contacts/link/{token}')
  Future<dynamic> getContactLinkInvitation(@Path('token') String token);

  @POST('/api/v1/emergency-contacts/link/{token}/accept')
  Future<dynamic> acceptContactLink(@Path('token') String token);
}

extension ContactsDatasourceExtension on ContactsDatasource {
  List<EmergencyContact> parseContacts(dynamic response) {
    final list = response as List<dynamic>;
    return list.map((e) => EmergencyContact.fromJson(e as Map<String, dynamic>)).toList();
  }

  EmergencyContact parseContact(dynamic response) {
    final map = response as Map<String, dynamic>;
    return EmergencyContact.fromJson(map);
  }

  List<LinkedContact> parseLinkedContacts(dynamic response) {
    final list = response as List<dynamic>;
    return list.map((e) => LinkedContact.fromJson(e as Map<String, dynamic>)).toList();
  }

  List<PendingContactInvitation> parsePendingInvitations(dynamic response) {
    final list = response as List<dynamic>;
    return list.map((e) => PendingContactInvitation.fromJson(e as Map<String, dynamic>)).toList();
  }

  Map<String, dynamic> createContactRequest({
    required String name,
    String? email,
    String? phone,
  }) {
    return {
      'name': name,
      if (email != null) 'email': email,
      if (phone != null) 'phone': phone,
    };
  }

  Map<String, dynamic> updateContactRequest({String? name, String? email, String? phone}) {
    return {
      if (name != null) 'name': name,
      if (email != null) 'email': email,
      if (phone != null) 'phone': phone,
    };
  }

  Map<String, dynamic> reorderContactsRequest(List<String> contactIds) {
    return {'contactIds': contactIds};
  }

  Map<String, dynamic> verifyPhoneRequest(String code) {
    return {'code': code};
  }
}
