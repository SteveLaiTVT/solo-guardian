// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'check_in.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CheckInImpl _$$CheckInImplFromJson(Map<String, dynamic> json) =>
    _$CheckInImpl(
      id: json['id'] as String,
      userId: json['userId'] as String,
      checkInDate: json['checkInDate'] as String,
      checkedInAt: json['checkedInAt'] as String,
      note: json['note'] as String?,
    );

Map<String, dynamic> _$$CheckInImplToJson(_$CheckInImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'checkInDate': instance.checkInDate,
      'checkedInAt': instance.checkedInAt,
      'note': instance.note,
    };

_$CreateCheckInRequestImpl _$$CreateCheckInRequestImplFromJson(
  Map<String, dynamic> json,
) => _$CreateCheckInRequestImpl(note: json['note'] as String?);

Map<String, dynamic> _$$CreateCheckInRequestImplToJson(
  _$CreateCheckInRequestImpl instance,
) => <String, dynamic>{'note': instance.note};

_$TodayStatusImpl _$$TodayStatusImplFromJson(Map<String, dynamic> json) =>
    _$TodayStatusImpl(
      hasCheckedIn: json['hasCheckedIn'] as bool,
      checkIn: json['checkIn'] == null
          ? null
          : CheckIn.fromJson(json['checkIn'] as Map<String, dynamic>),
      deadlineTime: json['deadlineTime'] as String,
      isOverdue: json['isOverdue'] as bool,
    );

Map<String, dynamic> _$$TodayStatusImplToJson(_$TodayStatusImpl instance) =>
    <String, dynamic>{
      'hasCheckedIn': instance.hasCheckedIn,
      'checkIn': instance.checkIn,
      'deadlineTime': instance.deadlineTime,
      'isOverdue': instance.isOverdue,
    };

_$CheckInHistoryImpl _$$CheckInHistoryImplFromJson(Map<String, dynamic> json) =>
    _$CheckInHistoryImpl(
      checkIns: (json['checkIns'] as List<dynamic>)
          .map((e) => CheckIn.fromJson(e as Map<String, dynamic>))
          .toList(),
      total: (json['total'] as num).toInt(),
      page: (json['page'] as num).toInt(),
      pageSize: (json['pageSize'] as num).toInt(),
    );

Map<String, dynamic> _$$CheckInHistoryImplToJson(
  _$CheckInHistoryImpl instance,
) => <String, dynamic>{
  'checkIns': instance.checkIns,
  'total': instance.total,
  'page': instance.page,
  'pageSize': instance.pageSize,
};
