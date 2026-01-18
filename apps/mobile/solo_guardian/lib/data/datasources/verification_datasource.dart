import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../models/contact.dart';

part 'verification_datasource.g.dart';

@RestApi()
abstract class VerificationDatasource {
  factory VerificationDatasource(Dio dio, {String baseUrl}) = _VerificationDatasource;

  @GET('/api/v1/verify-contact')
  Future<dynamic> verifyContact(@Query('token') String token);
}

extension VerificationDatasourceExtension on VerificationDatasource {
  VerifyContactResult parseVerifyContactResult(dynamic response) {
    final map = response as Map<String, dynamic>;
    return VerifyContactResult.fromJson(map);
  }
}
