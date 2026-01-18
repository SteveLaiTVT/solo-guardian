import 'package:freezed_annotation/freezed_annotation.dart';

part 'check_in.freezed.dart';
part 'check_in.g.dart';

@freezed
class CheckIn with _$CheckIn {
  const factory CheckIn({
    required String id,
    required String userId,
    required String checkInDate,
    required String checkedInAt,
    String? note,
  }) = _CheckIn;

  factory CheckIn.fromJson(Map<String, dynamic> json) =>
      _$CheckInFromJson(json);
}

@freezed
class CreateCheckInRequest with _$CreateCheckInRequest {
  const factory CreateCheckInRequest({
    String? note,
  }) = _CreateCheckInRequest;

  factory CreateCheckInRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateCheckInRequestFromJson(json);
}

@freezed
class TodayStatus with _$TodayStatus {
  const factory TodayStatus({
    required bool hasCheckedIn,
    CheckIn? checkIn,
    required String deadlineTime,
    required bool isOverdue,
  }) = _TodayStatus;

  factory TodayStatus.fromJson(Map<String, dynamic> json) =>
      _$TodayStatusFromJson(json);
}

@freezed
class CheckInHistory with _$CheckInHistory {
  const factory CheckInHistory({
    required List<CheckIn> checkIns,
    required int total,
    required int page,
    required int pageSize,
  }) = _CheckInHistory;

  factory CheckInHistory.fromJson(Map<String, dynamic> json) =>
      _$CheckInHistoryFromJson(json);
}
