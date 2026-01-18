// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'check_in.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

CheckIn _$CheckInFromJson(Map<String, dynamic> json) {
  return _CheckIn.fromJson(json);
}

/// @nodoc
mixin _$CheckIn {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get checkInDate => throw _privateConstructorUsedError;
  String get checkedInAt => throw _privateConstructorUsedError;
  String? get note => throw _privateConstructorUsedError;

  /// Serializes this CheckIn to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CheckIn
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CheckInCopyWith<CheckIn> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CheckInCopyWith<$Res> {
  factory $CheckInCopyWith(CheckIn value, $Res Function(CheckIn) then) =
      _$CheckInCopyWithImpl<$Res, CheckIn>;
  @useResult
  $Res call({
    String id,
    String userId,
    String checkInDate,
    String checkedInAt,
    String? note,
  });
}

/// @nodoc
class _$CheckInCopyWithImpl<$Res, $Val extends CheckIn>
    implements $CheckInCopyWith<$Res> {
  _$CheckInCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CheckIn
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? checkInDate = null,
    Object? checkedInAt = null,
    Object? note = freezed,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            userId: null == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String,
            checkInDate: null == checkInDate
                ? _value.checkInDate
                : checkInDate // ignore: cast_nullable_to_non_nullable
                      as String,
            checkedInAt: null == checkedInAt
                ? _value.checkedInAt
                : checkedInAt // ignore: cast_nullable_to_non_nullable
                      as String,
            note: freezed == note
                ? _value.note
                : note // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CheckInImplCopyWith<$Res> implements $CheckInCopyWith<$Res> {
  factory _$$CheckInImplCopyWith(
    _$CheckInImpl value,
    $Res Function(_$CheckInImpl) then,
  ) = __$$CheckInImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String userId,
    String checkInDate,
    String checkedInAt,
    String? note,
  });
}

/// @nodoc
class __$$CheckInImplCopyWithImpl<$Res>
    extends _$CheckInCopyWithImpl<$Res, _$CheckInImpl>
    implements _$$CheckInImplCopyWith<$Res> {
  __$$CheckInImplCopyWithImpl(
    _$CheckInImpl _value,
    $Res Function(_$CheckInImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CheckIn
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? checkInDate = null,
    Object? checkedInAt = null,
    Object? note = freezed,
  }) {
    return _then(
      _$CheckInImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        checkInDate: null == checkInDate
            ? _value.checkInDate
            : checkInDate // ignore: cast_nullable_to_non_nullable
                  as String,
        checkedInAt: null == checkedInAt
            ? _value.checkedInAt
            : checkedInAt // ignore: cast_nullable_to_non_nullable
                  as String,
        note: freezed == note
            ? _value.note
            : note // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CheckInImpl implements _CheckIn {
  const _$CheckInImpl({
    required this.id,
    required this.userId,
    required this.checkInDate,
    required this.checkedInAt,
    this.note,
  });

  factory _$CheckInImpl.fromJson(Map<String, dynamic> json) =>
      _$$CheckInImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final String checkInDate;
  @override
  final String checkedInAt;
  @override
  final String? note;

  @override
  String toString() {
    return 'CheckIn(id: $id, userId: $userId, checkInDate: $checkInDate, checkedInAt: $checkedInAt, note: $note)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CheckInImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.checkInDate, checkInDate) ||
                other.checkInDate == checkInDate) &&
            (identical(other.checkedInAt, checkedInAt) ||
                other.checkedInAt == checkedInAt) &&
            (identical(other.note, note) || other.note == note));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, userId, checkInDate, checkedInAt, note);

  /// Create a copy of CheckIn
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CheckInImplCopyWith<_$CheckInImpl> get copyWith =>
      __$$CheckInImplCopyWithImpl<_$CheckInImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CheckInImplToJson(this);
  }
}

abstract class _CheckIn implements CheckIn {
  const factory _CheckIn({
    required final String id,
    required final String userId,
    required final String checkInDate,
    required final String checkedInAt,
    final String? note,
  }) = _$CheckInImpl;

  factory _CheckIn.fromJson(Map<String, dynamic> json) = _$CheckInImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  String get checkInDate;
  @override
  String get checkedInAt;
  @override
  String? get note;

  /// Create a copy of CheckIn
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CheckInImplCopyWith<_$CheckInImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CreateCheckInRequest _$CreateCheckInRequestFromJson(Map<String, dynamic> json) {
  return _CreateCheckInRequest.fromJson(json);
}

/// @nodoc
mixin _$CreateCheckInRequest {
  String? get note => throw _privateConstructorUsedError;

  /// Serializes this CreateCheckInRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateCheckInRequestCopyWith<CreateCheckInRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateCheckInRequestCopyWith<$Res> {
  factory $CreateCheckInRequestCopyWith(
    CreateCheckInRequest value,
    $Res Function(CreateCheckInRequest) then,
  ) = _$CreateCheckInRequestCopyWithImpl<$Res, CreateCheckInRequest>;
  @useResult
  $Res call({String? note});
}

/// @nodoc
class _$CreateCheckInRequestCopyWithImpl<
  $Res,
  $Val extends CreateCheckInRequest
>
    implements $CreateCheckInRequestCopyWith<$Res> {
  _$CreateCheckInRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? note = freezed}) {
    return _then(
      _value.copyWith(
            note: freezed == note
                ? _value.note
                : note // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CreateCheckInRequestImplCopyWith<$Res>
    implements $CreateCheckInRequestCopyWith<$Res> {
  factory _$$CreateCheckInRequestImplCopyWith(
    _$CreateCheckInRequestImpl value,
    $Res Function(_$CreateCheckInRequestImpl) then,
  ) = __$$CreateCheckInRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String? note});
}

/// @nodoc
class __$$CreateCheckInRequestImplCopyWithImpl<$Res>
    extends _$CreateCheckInRequestCopyWithImpl<$Res, _$CreateCheckInRequestImpl>
    implements _$$CreateCheckInRequestImplCopyWith<$Res> {
  __$$CreateCheckInRequestImplCopyWithImpl(
    _$CreateCheckInRequestImpl _value,
    $Res Function(_$CreateCheckInRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CreateCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? note = freezed}) {
    return _then(
      _$CreateCheckInRequestImpl(
        note: freezed == note
            ? _value.note
            : note // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateCheckInRequestImpl implements _CreateCheckInRequest {
  const _$CreateCheckInRequestImpl({this.note});

  factory _$CreateCheckInRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateCheckInRequestImplFromJson(json);

  @override
  final String? note;

  @override
  String toString() {
    return 'CreateCheckInRequest(note: $note)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateCheckInRequestImpl &&
            (identical(other.note, note) || other.note == note));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, note);

  /// Create a copy of CreateCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateCheckInRequestImplCopyWith<_$CreateCheckInRequestImpl>
  get copyWith =>
      __$$CreateCheckInRequestImplCopyWithImpl<_$CreateCheckInRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateCheckInRequestImplToJson(this);
  }
}

abstract class _CreateCheckInRequest implements CreateCheckInRequest {
  const factory _CreateCheckInRequest({final String? note}) =
      _$CreateCheckInRequestImpl;

  factory _CreateCheckInRequest.fromJson(Map<String, dynamic> json) =
      _$CreateCheckInRequestImpl.fromJson;

  @override
  String? get note;

  /// Create a copy of CreateCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateCheckInRequestImplCopyWith<_$CreateCheckInRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

TodayStatus _$TodayStatusFromJson(Map<String, dynamic> json) {
  return _TodayStatus.fromJson(json);
}

/// @nodoc
mixin _$TodayStatus {
  bool get hasCheckedIn => throw _privateConstructorUsedError;
  CheckIn? get checkIn => throw _privateConstructorUsedError;
  String get deadlineTime => throw _privateConstructorUsedError;
  bool get isOverdue => throw _privateConstructorUsedError;

  /// Serializes this TodayStatus to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TodayStatus
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TodayStatusCopyWith<TodayStatus> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TodayStatusCopyWith<$Res> {
  factory $TodayStatusCopyWith(
    TodayStatus value,
    $Res Function(TodayStatus) then,
  ) = _$TodayStatusCopyWithImpl<$Res, TodayStatus>;
  @useResult
  $Res call({
    bool hasCheckedIn,
    CheckIn? checkIn,
    String deadlineTime,
    bool isOverdue,
  });

  $CheckInCopyWith<$Res>? get checkIn;
}

/// @nodoc
class _$TodayStatusCopyWithImpl<$Res, $Val extends TodayStatus>
    implements $TodayStatusCopyWith<$Res> {
  _$TodayStatusCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TodayStatus
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? hasCheckedIn = null,
    Object? checkIn = freezed,
    Object? deadlineTime = null,
    Object? isOverdue = null,
  }) {
    return _then(
      _value.copyWith(
            hasCheckedIn: null == hasCheckedIn
                ? _value.hasCheckedIn
                : hasCheckedIn // ignore: cast_nullable_to_non_nullable
                      as bool,
            checkIn: freezed == checkIn
                ? _value.checkIn
                : checkIn // ignore: cast_nullable_to_non_nullable
                      as CheckIn?,
            deadlineTime: null == deadlineTime
                ? _value.deadlineTime
                : deadlineTime // ignore: cast_nullable_to_non_nullable
                      as String,
            isOverdue: null == isOverdue
                ? _value.isOverdue
                : isOverdue // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }

  /// Create a copy of TodayStatus
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $CheckInCopyWith<$Res>? get checkIn {
    if (_value.checkIn == null) {
      return null;
    }

    return $CheckInCopyWith<$Res>(_value.checkIn!, (value) {
      return _then(_value.copyWith(checkIn: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$TodayStatusImplCopyWith<$Res>
    implements $TodayStatusCopyWith<$Res> {
  factory _$$TodayStatusImplCopyWith(
    _$TodayStatusImpl value,
    $Res Function(_$TodayStatusImpl) then,
  ) = __$$TodayStatusImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    bool hasCheckedIn,
    CheckIn? checkIn,
    String deadlineTime,
    bool isOverdue,
  });

  @override
  $CheckInCopyWith<$Res>? get checkIn;
}

/// @nodoc
class __$$TodayStatusImplCopyWithImpl<$Res>
    extends _$TodayStatusCopyWithImpl<$Res, _$TodayStatusImpl>
    implements _$$TodayStatusImplCopyWith<$Res> {
  __$$TodayStatusImplCopyWithImpl(
    _$TodayStatusImpl _value,
    $Res Function(_$TodayStatusImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of TodayStatus
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? hasCheckedIn = null,
    Object? checkIn = freezed,
    Object? deadlineTime = null,
    Object? isOverdue = null,
  }) {
    return _then(
      _$TodayStatusImpl(
        hasCheckedIn: null == hasCheckedIn
            ? _value.hasCheckedIn
            : hasCheckedIn // ignore: cast_nullable_to_non_nullable
                  as bool,
        checkIn: freezed == checkIn
            ? _value.checkIn
            : checkIn // ignore: cast_nullable_to_non_nullable
                  as CheckIn?,
        deadlineTime: null == deadlineTime
            ? _value.deadlineTime
            : deadlineTime // ignore: cast_nullable_to_non_nullable
                  as String,
        isOverdue: null == isOverdue
            ? _value.isOverdue
            : isOverdue // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$TodayStatusImpl implements _TodayStatus {
  const _$TodayStatusImpl({
    required this.hasCheckedIn,
    this.checkIn,
    required this.deadlineTime,
    required this.isOverdue,
  });

  factory _$TodayStatusImpl.fromJson(Map<String, dynamic> json) =>
      _$$TodayStatusImplFromJson(json);

  @override
  final bool hasCheckedIn;
  @override
  final CheckIn? checkIn;
  @override
  final String deadlineTime;
  @override
  final bool isOverdue;

  @override
  String toString() {
    return 'TodayStatus(hasCheckedIn: $hasCheckedIn, checkIn: $checkIn, deadlineTime: $deadlineTime, isOverdue: $isOverdue)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TodayStatusImpl &&
            (identical(other.hasCheckedIn, hasCheckedIn) ||
                other.hasCheckedIn == hasCheckedIn) &&
            (identical(other.checkIn, checkIn) || other.checkIn == checkIn) &&
            (identical(other.deadlineTime, deadlineTime) ||
                other.deadlineTime == deadlineTime) &&
            (identical(other.isOverdue, isOverdue) ||
                other.isOverdue == isOverdue));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, hasCheckedIn, checkIn, deadlineTime, isOverdue);

  /// Create a copy of TodayStatus
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TodayStatusImplCopyWith<_$TodayStatusImpl> get copyWith =>
      __$$TodayStatusImplCopyWithImpl<_$TodayStatusImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TodayStatusImplToJson(this);
  }
}

abstract class _TodayStatus implements TodayStatus {
  const factory _TodayStatus({
    required final bool hasCheckedIn,
    final CheckIn? checkIn,
    required final String deadlineTime,
    required final bool isOverdue,
  }) = _$TodayStatusImpl;

  factory _TodayStatus.fromJson(Map<String, dynamic> json) =
      _$TodayStatusImpl.fromJson;

  @override
  bool get hasCheckedIn;
  @override
  CheckIn? get checkIn;
  @override
  String get deadlineTime;
  @override
  bool get isOverdue;

  /// Create a copy of TodayStatus
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TodayStatusImplCopyWith<_$TodayStatusImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CheckInHistory _$CheckInHistoryFromJson(Map<String, dynamic> json) {
  return _CheckInHistory.fromJson(json);
}

/// @nodoc
mixin _$CheckInHistory {
  List<CheckIn> get checkIns => throw _privateConstructorUsedError;
  int get total => throw _privateConstructorUsedError;
  int get page => throw _privateConstructorUsedError;
  int get pageSize => throw _privateConstructorUsedError;

  /// Serializes this CheckInHistory to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CheckInHistory
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CheckInHistoryCopyWith<CheckInHistory> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CheckInHistoryCopyWith<$Res> {
  factory $CheckInHistoryCopyWith(
    CheckInHistory value,
    $Res Function(CheckInHistory) then,
  ) = _$CheckInHistoryCopyWithImpl<$Res, CheckInHistory>;
  @useResult
  $Res call({List<CheckIn> checkIns, int total, int page, int pageSize});
}

/// @nodoc
class _$CheckInHistoryCopyWithImpl<$Res, $Val extends CheckInHistory>
    implements $CheckInHistoryCopyWith<$Res> {
  _$CheckInHistoryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CheckInHistory
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? checkIns = null,
    Object? total = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(
      _value.copyWith(
            checkIns: null == checkIns
                ? _value.checkIns
                : checkIns // ignore: cast_nullable_to_non_nullable
                      as List<CheckIn>,
            total: null == total
                ? _value.total
                : total // ignore: cast_nullable_to_non_nullable
                      as int,
            page: null == page
                ? _value.page
                : page // ignore: cast_nullable_to_non_nullable
                      as int,
            pageSize: null == pageSize
                ? _value.pageSize
                : pageSize // ignore: cast_nullable_to_non_nullable
                      as int,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CheckInHistoryImplCopyWith<$Res>
    implements $CheckInHistoryCopyWith<$Res> {
  factory _$$CheckInHistoryImplCopyWith(
    _$CheckInHistoryImpl value,
    $Res Function(_$CheckInHistoryImpl) then,
  ) = __$$CheckInHistoryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<CheckIn> checkIns, int total, int page, int pageSize});
}

/// @nodoc
class __$$CheckInHistoryImplCopyWithImpl<$Res>
    extends _$CheckInHistoryCopyWithImpl<$Res, _$CheckInHistoryImpl>
    implements _$$CheckInHistoryImplCopyWith<$Res> {
  __$$CheckInHistoryImplCopyWithImpl(
    _$CheckInHistoryImpl _value,
    $Res Function(_$CheckInHistoryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CheckInHistory
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? checkIns = null,
    Object? total = null,
    Object? page = null,
    Object? pageSize = null,
  }) {
    return _then(
      _$CheckInHistoryImpl(
        checkIns: null == checkIns
            ? _value._checkIns
            : checkIns // ignore: cast_nullable_to_non_nullable
                  as List<CheckIn>,
        total: null == total
            ? _value.total
            : total // ignore: cast_nullable_to_non_nullable
                  as int,
        page: null == page
            ? _value.page
            : page // ignore: cast_nullable_to_non_nullable
                  as int,
        pageSize: null == pageSize
            ? _value.pageSize
            : pageSize // ignore: cast_nullable_to_non_nullable
                  as int,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CheckInHistoryImpl implements _CheckInHistory {
  const _$CheckInHistoryImpl({
    required final List<CheckIn> checkIns,
    required this.total,
    required this.page,
    required this.pageSize,
  }) : _checkIns = checkIns;

  factory _$CheckInHistoryImpl.fromJson(Map<String, dynamic> json) =>
      _$$CheckInHistoryImplFromJson(json);

  final List<CheckIn> _checkIns;
  @override
  List<CheckIn> get checkIns {
    if (_checkIns is EqualUnmodifiableListView) return _checkIns;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_checkIns);
  }

  @override
  final int total;
  @override
  final int page;
  @override
  final int pageSize;

  @override
  String toString() {
    return 'CheckInHistory(checkIns: $checkIns, total: $total, page: $page, pageSize: $pageSize)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CheckInHistoryImpl &&
            const DeepCollectionEquality().equals(other._checkIns, _checkIns) &&
            (identical(other.total, total) || other.total == total) &&
            (identical(other.page, page) || other.page == page) &&
            (identical(other.pageSize, pageSize) ||
                other.pageSize == pageSize));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_checkIns),
    total,
    page,
    pageSize,
  );

  /// Create a copy of CheckInHistory
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CheckInHistoryImplCopyWith<_$CheckInHistoryImpl> get copyWith =>
      __$$CheckInHistoryImplCopyWithImpl<_$CheckInHistoryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CheckInHistoryImplToJson(this);
  }
}

abstract class _CheckInHistory implements CheckInHistory {
  const factory _CheckInHistory({
    required final List<CheckIn> checkIns,
    required final int total,
    required final int page,
    required final int pageSize,
  }) = _$CheckInHistoryImpl;

  factory _CheckInHistory.fromJson(Map<String, dynamic> json) =
      _$CheckInHistoryImpl.fromJson;

  @override
  List<CheckIn> get checkIns;
  @override
  int get total;
  @override
  int get page;
  @override
  int get pageSize;

  /// Create a copy of CheckInHistory
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CheckInHistoryImplCopyWith<_$CheckInHistoryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
