// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserImpl _$$UserImplFromJson(Map<String, dynamic> json) => _$UserImpl(
  id: json['id'] as String,
  email: json['email'] as String?,
  username: json['username'] as String?,
  phone: json['phone'] as String?,
  avatar: json['avatar'] as String?,
  name: json['name'] as String,
  birthYear: (json['birthYear'] as num?)?.toInt(),
  createdAt: json['createdAt'] as String,
);

Map<String, dynamic> _$$UserImplToJson(_$UserImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'username': instance.username,
      'phone': instance.phone,
      'avatar': instance.avatar,
      'name': instance.name,
      'birthYear': instance.birthYear,
      'createdAt': instance.createdAt,
    };
