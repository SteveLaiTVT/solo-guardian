// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'api_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$ApiErrorImpl _$$ApiErrorImplFromJson(Map<String, dynamic> json) =>
    _$ApiErrorImpl(
      code: json['code'] as String,
      category: json['category'] as String,
      message: json['message'] as String,
      i18nKey: json['i18nKey'] as String,
      details: json['details'] as Map<String, dynamic>?,
      field: json['field'] as String?,
      timestamp: json['timestamp'] as String,
    );

Map<String, dynamic> _$$ApiErrorImplToJson(_$ApiErrorImpl instance) =>
    <String, dynamic>{
      'code': instance.code,
      'category': instance.category,
      'message': instance.message,
      'i18nKey': instance.i18nKey,
      'details': instance.details,
      'field': instance.field,
      'timestamp': instance.timestamp,
    };
