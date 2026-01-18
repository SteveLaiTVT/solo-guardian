// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'caregiver.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ElderSummary _$ElderSummaryFromJson(Map<String, dynamic> json) {
  return _ElderSummary.fromJson(json);
}

/// @nodoc
mixin _$ElderSummary {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get lastCheckIn => throw _privateConstructorUsedError;
  ElderTodayStatus get todayStatus => throw _privateConstructorUsedError;
  bool get isAccepted => throw _privateConstructorUsedError;

  /// Serializes this ElderSummary to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ElderSummary
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ElderSummaryCopyWith<ElderSummary> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ElderSummaryCopyWith<$Res> {
  factory $ElderSummaryCopyWith(
    ElderSummary value,
    $Res Function(ElderSummary) then,
  ) = _$ElderSummaryCopyWithImpl<$Res, ElderSummary>;
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? lastCheckIn,
    ElderTodayStatus todayStatus,
    bool isAccepted,
  });
}

/// @nodoc
class _$ElderSummaryCopyWithImpl<$Res, $Val extends ElderSummary>
    implements $ElderSummaryCopyWith<$Res> {
  _$ElderSummaryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ElderSummary
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? lastCheckIn = freezed,
    Object? todayStatus = null,
    Object? isAccepted = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            lastCheckIn: freezed == lastCheckIn
                ? _value.lastCheckIn
                : lastCheckIn // ignore: cast_nullable_to_non_nullable
                      as String?,
            todayStatus: null == todayStatus
                ? _value.todayStatus
                : todayStatus // ignore: cast_nullable_to_non_nullable
                      as ElderTodayStatus,
            isAccepted: null == isAccepted
                ? _value.isAccepted
                : isAccepted // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ElderSummaryImplCopyWith<$Res>
    implements $ElderSummaryCopyWith<$Res> {
  factory _$$ElderSummaryImplCopyWith(
    _$ElderSummaryImpl value,
    $Res Function(_$ElderSummaryImpl) then,
  ) = __$$ElderSummaryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? lastCheckIn,
    ElderTodayStatus todayStatus,
    bool isAccepted,
  });
}

/// @nodoc
class __$$ElderSummaryImplCopyWithImpl<$Res>
    extends _$ElderSummaryCopyWithImpl<$Res, _$ElderSummaryImpl>
    implements _$$ElderSummaryImplCopyWith<$Res> {
  __$$ElderSummaryImplCopyWithImpl(
    _$ElderSummaryImpl _value,
    $Res Function(_$ElderSummaryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ElderSummary
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? lastCheckIn = freezed,
    Object? todayStatus = null,
    Object? isAccepted = null,
  }) {
    return _then(
      _$ElderSummaryImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        lastCheckIn: freezed == lastCheckIn
            ? _value.lastCheckIn
            : lastCheckIn // ignore: cast_nullable_to_non_nullable
                  as String?,
        todayStatus: null == todayStatus
            ? _value.todayStatus
            : todayStatus // ignore: cast_nullable_to_non_nullable
                  as ElderTodayStatus,
        isAccepted: null == isAccepted
            ? _value.isAccepted
            : isAccepted // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ElderSummaryImpl implements _ElderSummary {
  const _$ElderSummaryImpl({
    required this.id,
    required this.name,
    required this.email,
    this.lastCheckIn,
    required this.todayStatus,
    required this.isAccepted,
  });

  factory _$ElderSummaryImpl.fromJson(Map<String, dynamic> json) =>
      _$$ElderSummaryImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String? lastCheckIn;
  @override
  final ElderTodayStatus todayStatus;
  @override
  final bool isAccepted;

  @override
  String toString() {
    return 'ElderSummary(id: $id, name: $name, email: $email, lastCheckIn: $lastCheckIn, todayStatus: $todayStatus, isAccepted: $isAccepted)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ElderSummaryImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.lastCheckIn, lastCheckIn) ||
                other.lastCheckIn == lastCheckIn) &&
            (identical(other.todayStatus, todayStatus) ||
                other.todayStatus == todayStatus) &&
            (identical(other.isAccepted, isAccepted) ||
                other.isAccepted == isAccepted));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    email,
    lastCheckIn,
    todayStatus,
    isAccepted,
  );

  /// Create a copy of ElderSummary
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ElderSummaryImplCopyWith<_$ElderSummaryImpl> get copyWith =>
      __$$ElderSummaryImplCopyWithImpl<_$ElderSummaryImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ElderSummaryImplToJson(this);
  }
}

abstract class _ElderSummary implements ElderSummary {
  const factory _ElderSummary({
    required final String id,
    required final String name,
    required final String email,
    final String? lastCheckIn,
    required final ElderTodayStatus todayStatus,
    required final bool isAccepted,
  }) = _$ElderSummaryImpl;

  factory _ElderSummary.fromJson(Map<String, dynamic> json) =
      _$ElderSummaryImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String? get lastCheckIn;
  @override
  ElderTodayStatus get todayStatus;
  @override
  bool get isAccepted;

  /// Create a copy of ElderSummary
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ElderSummaryImplCopyWith<_$ElderSummaryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CaregiverSummary _$CaregiverSummaryFromJson(Map<String, dynamic> json) {
  return _CaregiverSummary.fromJson(json);
}

/// @nodoc
mixin _$CaregiverSummary {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  bool get isAccepted => throw _privateConstructorUsedError;

  /// Serializes this CaregiverSummary to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CaregiverSummary
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CaregiverSummaryCopyWith<CaregiverSummary> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CaregiverSummaryCopyWith<$Res> {
  factory $CaregiverSummaryCopyWith(
    CaregiverSummary value,
    $Res Function(CaregiverSummary) then,
  ) = _$CaregiverSummaryCopyWithImpl<$Res, CaregiverSummary>;
  @useResult
  $Res call({String id, String name, String email, bool isAccepted});
}

/// @nodoc
class _$CaregiverSummaryCopyWithImpl<$Res, $Val extends CaregiverSummary>
    implements $CaregiverSummaryCopyWith<$Res> {
  _$CaregiverSummaryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CaregiverSummary
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? isAccepted = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            isAccepted: null == isAccepted
                ? _value.isAccepted
                : isAccepted // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CaregiverSummaryImplCopyWith<$Res>
    implements $CaregiverSummaryCopyWith<$Res> {
  factory _$$CaregiverSummaryImplCopyWith(
    _$CaregiverSummaryImpl value,
    $Res Function(_$CaregiverSummaryImpl) then,
  ) = __$$CaregiverSummaryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, String email, bool isAccepted});
}

/// @nodoc
class __$$CaregiverSummaryImplCopyWithImpl<$Res>
    extends _$CaregiverSummaryCopyWithImpl<$Res, _$CaregiverSummaryImpl>
    implements _$$CaregiverSummaryImplCopyWith<$Res> {
  __$$CaregiverSummaryImplCopyWithImpl(
    _$CaregiverSummaryImpl _value,
    $Res Function(_$CaregiverSummaryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CaregiverSummary
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? isAccepted = null,
  }) {
    return _then(
      _$CaregiverSummaryImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        isAccepted: null == isAccepted
            ? _value.isAccepted
            : isAccepted // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CaregiverSummaryImpl implements _CaregiverSummary {
  const _$CaregiverSummaryImpl({
    required this.id,
    required this.name,
    required this.email,
    required this.isAccepted,
  });

  factory _$CaregiverSummaryImpl.fromJson(Map<String, dynamic> json) =>
      _$$CaregiverSummaryImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final bool isAccepted;

  @override
  String toString() {
    return 'CaregiverSummary(id: $id, name: $name, email: $email, isAccepted: $isAccepted)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CaregiverSummaryImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.isAccepted, isAccepted) ||
                other.isAccepted == isAccepted));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, email, isAccepted);

  /// Create a copy of CaregiverSummary
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CaregiverSummaryImplCopyWith<_$CaregiverSummaryImpl> get copyWith =>
      __$$CaregiverSummaryImplCopyWithImpl<_$CaregiverSummaryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CaregiverSummaryImplToJson(this);
  }
}

abstract class _CaregiverSummary implements CaregiverSummary {
  const factory _CaregiverSummary({
    required final String id,
    required final String name,
    required final String email,
    required final bool isAccepted,
  }) = _$CaregiverSummaryImpl;

  factory _CaregiverSummary.fromJson(Map<String, dynamic> json) =
      _$CaregiverSummaryImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  bool get isAccepted;

  /// Create a copy of CaregiverSummary
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CaregiverSummaryImplCopyWith<_$CaregiverSummaryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ElderCheckInSettings _$ElderCheckInSettingsFromJson(Map<String, dynamic> json) {
  return _ElderCheckInSettings.fromJson(json);
}

/// @nodoc
mixin _$ElderCheckInSettings {
  String get deadlineTime => throw _privateConstructorUsedError;
  String get reminderTime => throw _privateConstructorUsedError;
  String get timezone => throw _privateConstructorUsedError;

  /// Serializes this ElderCheckInSettings to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ElderCheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ElderCheckInSettingsCopyWith<ElderCheckInSettings> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ElderCheckInSettingsCopyWith<$Res> {
  factory $ElderCheckInSettingsCopyWith(
    ElderCheckInSettings value,
    $Res Function(ElderCheckInSettings) then,
  ) = _$ElderCheckInSettingsCopyWithImpl<$Res, ElderCheckInSettings>;
  @useResult
  $Res call({String deadlineTime, String reminderTime, String timezone});
}

/// @nodoc
class _$ElderCheckInSettingsCopyWithImpl<
  $Res,
  $Val extends ElderCheckInSettings
>
    implements $ElderCheckInSettingsCopyWith<$Res> {
  _$ElderCheckInSettingsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ElderCheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? deadlineTime = null,
    Object? reminderTime = null,
    Object? timezone = null,
  }) {
    return _then(
      _value.copyWith(
            deadlineTime: null == deadlineTime
                ? _value.deadlineTime
                : deadlineTime // ignore: cast_nullable_to_non_nullable
                      as String,
            reminderTime: null == reminderTime
                ? _value.reminderTime
                : reminderTime // ignore: cast_nullable_to_non_nullable
                      as String,
            timezone: null == timezone
                ? _value.timezone
                : timezone // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ElderCheckInSettingsImplCopyWith<$Res>
    implements $ElderCheckInSettingsCopyWith<$Res> {
  factory _$$ElderCheckInSettingsImplCopyWith(
    _$ElderCheckInSettingsImpl value,
    $Res Function(_$ElderCheckInSettingsImpl) then,
  ) = __$$ElderCheckInSettingsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String deadlineTime, String reminderTime, String timezone});
}

/// @nodoc
class __$$ElderCheckInSettingsImplCopyWithImpl<$Res>
    extends _$ElderCheckInSettingsCopyWithImpl<$Res, _$ElderCheckInSettingsImpl>
    implements _$$ElderCheckInSettingsImplCopyWith<$Res> {
  __$$ElderCheckInSettingsImplCopyWithImpl(
    _$ElderCheckInSettingsImpl _value,
    $Res Function(_$ElderCheckInSettingsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ElderCheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? deadlineTime = null,
    Object? reminderTime = null,
    Object? timezone = null,
  }) {
    return _then(
      _$ElderCheckInSettingsImpl(
        deadlineTime: null == deadlineTime
            ? _value.deadlineTime
            : deadlineTime // ignore: cast_nullable_to_non_nullable
                  as String,
        reminderTime: null == reminderTime
            ? _value.reminderTime
            : reminderTime // ignore: cast_nullable_to_non_nullable
                  as String,
        timezone: null == timezone
            ? _value.timezone
            : timezone // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ElderCheckInSettingsImpl implements _ElderCheckInSettings {
  const _$ElderCheckInSettingsImpl({
    required this.deadlineTime,
    required this.reminderTime,
    required this.timezone,
  });

  factory _$ElderCheckInSettingsImpl.fromJson(Map<String, dynamic> json) =>
      _$$ElderCheckInSettingsImplFromJson(json);

  @override
  final String deadlineTime;
  @override
  final String reminderTime;
  @override
  final String timezone;

  @override
  String toString() {
    return 'ElderCheckInSettings(deadlineTime: $deadlineTime, reminderTime: $reminderTime, timezone: $timezone)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ElderCheckInSettingsImpl &&
            (identical(other.deadlineTime, deadlineTime) ||
                other.deadlineTime == deadlineTime) &&
            (identical(other.reminderTime, reminderTime) ||
                other.reminderTime == reminderTime) &&
            (identical(other.timezone, timezone) ||
                other.timezone == timezone));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, deadlineTime, reminderTime, timezone);

  /// Create a copy of ElderCheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ElderCheckInSettingsImplCopyWith<_$ElderCheckInSettingsImpl>
  get copyWith =>
      __$$ElderCheckInSettingsImplCopyWithImpl<_$ElderCheckInSettingsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ElderCheckInSettingsImplToJson(this);
  }
}

abstract class _ElderCheckInSettings implements ElderCheckInSettings {
  const factory _ElderCheckInSettings({
    required final String deadlineTime,
    required final String reminderTime,
    required final String timezone,
  }) = _$ElderCheckInSettingsImpl;

  factory _ElderCheckInSettings.fromJson(Map<String, dynamic> json) =
      _$ElderCheckInSettingsImpl.fromJson;

  @override
  String get deadlineTime;
  @override
  String get reminderTime;
  @override
  String get timezone;

  /// Create a copy of ElderCheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ElderCheckInSettingsImplCopyWith<_$ElderCheckInSettingsImpl>
  get copyWith => throw _privateConstructorUsedError;
}

ElderContactSummary _$ElderContactSummaryFromJson(Map<String, dynamic> json) {
  return _ElderContactSummary.fromJson(json);
}

/// @nodoc
mixin _$ElderContactSummary {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;

  /// Serializes this ElderContactSummary to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ElderContactSummary
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ElderContactSummaryCopyWith<ElderContactSummary> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ElderContactSummaryCopyWith<$Res> {
  factory $ElderContactSummaryCopyWith(
    ElderContactSummary value,
    $Res Function(ElderContactSummary) then,
  ) = _$ElderContactSummaryCopyWithImpl<$Res, ElderContactSummary>;
  @useResult
  $Res call({String id, String name, bool isVerified});
}

/// @nodoc
class _$ElderContactSummaryCopyWithImpl<$Res, $Val extends ElderContactSummary>
    implements $ElderContactSummaryCopyWith<$Res> {
  _$ElderContactSummaryCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ElderContactSummary
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? isVerified = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            isVerified: null == isVerified
                ? _value.isVerified
                : isVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ElderContactSummaryImplCopyWith<$Res>
    implements $ElderContactSummaryCopyWith<$Res> {
  factory _$$ElderContactSummaryImplCopyWith(
    _$ElderContactSummaryImpl value,
    $Res Function(_$ElderContactSummaryImpl) then,
  ) = __$$ElderContactSummaryImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, bool isVerified});
}

/// @nodoc
class __$$ElderContactSummaryImplCopyWithImpl<$Res>
    extends _$ElderContactSummaryCopyWithImpl<$Res, _$ElderContactSummaryImpl>
    implements _$$ElderContactSummaryImplCopyWith<$Res> {
  __$$ElderContactSummaryImplCopyWithImpl(
    _$ElderContactSummaryImpl _value,
    $Res Function(_$ElderContactSummaryImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ElderContactSummary
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? isVerified = null,
  }) {
    return _then(
      _$ElderContactSummaryImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        isVerified: null == isVerified
            ? _value.isVerified
            : isVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ElderContactSummaryImpl implements _ElderContactSummary {
  const _$ElderContactSummaryImpl({
    required this.id,
    required this.name,
    required this.isVerified,
  });

  factory _$ElderContactSummaryImpl.fromJson(Map<String, dynamic> json) =>
      _$$ElderContactSummaryImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final bool isVerified;

  @override
  String toString() {
    return 'ElderContactSummary(id: $id, name: $name, isVerified: $isVerified)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ElderContactSummaryImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, isVerified);

  /// Create a copy of ElderContactSummary
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ElderContactSummaryImplCopyWith<_$ElderContactSummaryImpl> get copyWith =>
      __$$ElderContactSummaryImplCopyWithImpl<_$ElderContactSummaryImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ElderContactSummaryImplToJson(this);
  }
}

abstract class _ElderContactSummary implements ElderContactSummary {
  const factory _ElderContactSummary({
    required final String id,
    required final String name,
    required final bool isVerified,
  }) = _$ElderContactSummaryImpl;

  factory _ElderContactSummary.fromJson(Map<String, dynamic> json) =
      _$ElderContactSummaryImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  bool get isVerified;

  /// Create a copy of ElderContactSummary
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ElderContactSummaryImplCopyWith<_$ElderContactSummaryImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ElderDetail _$ElderDetailFromJson(Map<String, dynamic> json) {
  return _ElderDetail.fromJson(json);
}

/// @nodoc
mixin _$ElderDetail {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get lastCheckIn => throw _privateConstructorUsedError;
  ElderTodayStatus get todayStatus => throw _privateConstructorUsedError;
  bool get isAccepted => throw _privateConstructorUsedError;
  ElderCheckInSettings? get checkInSettings =>
      throw _privateConstructorUsedError;
  int get pendingAlerts => throw _privateConstructorUsedError;
  List<ElderContactSummary> get emergencyContacts =>
      throw _privateConstructorUsedError;

  /// Serializes this ElderDetail to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ElderDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ElderDetailCopyWith<ElderDetail> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ElderDetailCopyWith<$Res> {
  factory $ElderDetailCopyWith(
    ElderDetail value,
    $Res Function(ElderDetail) then,
  ) = _$ElderDetailCopyWithImpl<$Res, ElderDetail>;
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? lastCheckIn,
    ElderTodayStatus todayStatus,
    bool isAccepted,
    ElderCheckInSettings? checkInSettings,
    int pendingAlerts,
    List<ElderContactSummary> emergencyContacts,
  });

  $ElderCheckInSettingsCopyWith<$Res>? get checkInSettings;
}

/// @nodoc
class _$ElderDetailCopyWithImpl<$Res, $Val extends ElderDetail>
    implements $ElderDetailCopyWith<$Res> {
  _$ElderDetailCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ElderDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? lastCheckIn = freezed,
    Object? todayStatus = null,
    Object? isAccepted = null,
    Object? checkInSettings = freezed,
    Object? pendingAlerts = null,
    Object? emergencyContacts = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            lastCheckIn: freezed == lastCheckIn
                ? _value.lastCheckIn
                : lastCheckIn // ignore: cast_nullable_to_non_nullable
                      as String?,
            todayStatus: null == todayStatus
                ? _value.todayStatus
                : todayStatus // ignore: cast_nullable_to_non_nullable
                      as ElderTodayStatus,
            isAccepted: null == isAccepted
                ? _value.isAccepted
                : isAccepted // ignore: cast_nullable_to_non_nullable
                      as bool,
            checkInSettings: freezed == checkInSettings
                ? _value.checkInSettings
                : checkInSettings // ignore: cast_nullable_to_non_nullable
                      as ElderCheckInSettings?,
            pendingAlerts: null == pendingAlerts
                ? _value.pendingAlerts
                : pendingAlerts // ignore: cast_nullable_to_non_nullable
                      as int,
            emergencyContacts: null == emergencyContacts
                ? _value.emergencyContacts
                : emergencyContacts // ignore: cast_nullable_to_non_nullable
                      as List<ElderContactSummary>,
          )
          as $Val,
    );
  }

  /// Create a copy of ElderDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ElderCheckInSettingsCopyWith<$Res>? get checkInSettings {
    if (_value.checkInSettings == null) {
      return null;
    }

    return $ElderCheckInSettingsCopyWith<$Res>(_value.checkInSettings!, (
      value,
    ) {
      return _then(_value.copyWith(checkInSettings: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ElderDetailImplCopyWith<$Res>
    implements $ElderDetailCopyWith<$Res> {
  factory _$$ElderDetailImplCopyWith(
    _$ElderDetailImpl value,
    $Res Function(_$ElderDetailImpl) then,
  ) = __$$ElderDetailImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String name,
    String email,
    String? lastCheckIn,
    ElderTodayStatus todayStatus,
    bool isAccepted,
    ElderCheckInSettings? checkInSettings,
    int pendingAlerts,
    List<ElderContactSummary> emergencyContacts,
  });

  @override
  $ElderCheckInSettingsCopyWith<$Res>? get checkInSettings;
}

/// @nodoc
class __$$ElderDetailImplCopyWithImpl<$Res>
    extends _$ElderDetailCopyWithImpl<$Res, _$ElderDetailImpl>
    implements _$$ElderDetailImplCopyWith<$Res> {
  __$$ElderDetailImplCopyWithImpl(
    _$ElderDetailImpl _value,
    $Res Function(_$ElderDetailImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ElderDetail
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? email = null,
    Object? lastCheckIn = freezed,
    Object? todayStatus = null,
    Object? isAccepted = null,
    Object? checkInSettings = freezed,
    Object? pendingAlerts = null,
    Object? emergencyContacts = null,
  }) {
    return _then(
      _$ElderDetailImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        lastCheckIn: freezed == lastCheckIn
            ? _value.lastCheckIn
            : lastCheckIn // ignore: cast_nullable_to_non_nullable
                  as String?,
        todayStatus: null == todayStatus
            ? _value.todayStatus
            : todayStatus // ignore: cast_nullable_to_non_nullable
                  as ElderTodayStatus,
        isAccepted: null == isAccepted
            ? _value.isAccepted
            : isAccepted // ignore: cast_nullable_to_non_nullable
                  as bool,
        checkInSettings: freezed == checkInSettings
            ? _value.checkInSettings
            : checkInSettings // ignore: cast_nullable_to_non_nullable
                  as ElderCheckInSettings?,
        pendingAlerts: null == pendingAlerts
            ? _value.pendingAlerts
            : pendingAlerts // ignore: cast_nullable_to_non_nullable
                  as int,
        emergencyContacts: null == emergencyContacts
            ? _value._emergencyContacts
            : emergencyContacts // ignore: cast_nullable_to_non_nullable
                  as List<ElderContactSummary>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ElderDetailImpl implements _ElderDetail {
  const _$ElderDetailImpl({
    required this.id,
    required this.name,
    required this.email,
    this.lastCheckIn,
    required this.todayStatus,
    required this.isAccepted,
    this.checkInSettings,
    required this.pendingAlerts,
    required final List<ElderContactSummary> emergencyContacts,
  }) : _emergencyContacts = emergencyContacts;

  factory _$ElderDetailImpl.fromJson(Map<String, dynamic> json) =>
      _$$ElderDetailImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;
  @override
  final String? lastCheckIn;
  @override
  final ElderTodayStatus todayStatus;
  @override
  final bool isAccepted;
  @override
  final ElderCheckInSettings? checkInSettings;
  @override
  final int pendingAlerts;
  final List<ElderContactSummary> _emergencyContacts;
  @override
  List<ElderContactSummary> get emergencyContacts {
    if (_emergencyContacts is EqualUnmodifiableListView)
      return _emergencyContacts;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_emergencyContacts);
  }

  @override
  String toString() {
    return 'ElderDetail(id: $id, name: $name, email: $email, lastCheckIn: $lastCheckIn, todayStatus: $todayStatus, isAccepted: $isAccepted, checkInSettings: $checkInSettings, pendingAlerts: $pendingAlerts, emergencyContacts: $emergencyContacts)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ElderDetailImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.lastCheckIn, lastCheckIn) ||
                other.lastCheckIn == lastCheckIn) &&
            (identical(other.todayStatus, todayStatus) ||
                other.todayStatus == todayStatus) &&
            (identical(other.isAccepted, isAccepted) ||
                other.isAccepted == isAccepted) &&
            (identical(other.checkInSettings, checkInSettings) ||
                other.checkInSettings == checkInSettings) &&
            (identical(other.pendingAlerts, pendingAlerts) ||
                other.pendingAlerts == pendingAlerts) &&
            const DeepCollectionEquality().equals(
              other._emergencyContacts,
              _emergencyContacts,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    name,
    email,
    lastCheckIn,
    todayStatus,
    isAccepted,
    checkInSettings,
    pendingAlerts,
    const DeepCollectionEquality().hash(_emergencyContacts),
  );

  /// Create a copy of ElderDetail
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ElderDetailImplCopyWith<_$ElderDetailImpl> get copyWith =>
      __$$ElderDetailImplCopyWithImpl<_$ElderDetailImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ElderDetailImplToJson(this);
  }
}

abstract class _ElderDetail implements ElderDetail {
  const factory _ElderDetail({
    required final String id,
    required final String name,
    required final String email,
    final String? lastCheckIn,
    required final ElderTodayStatus todayStatus,
    required final bool isAccepted,
    final ElderCheckInSettings? checkInSettings,
    required final int pendingAlerts,
    required final List<ElderContactSummary> emergencyContacts,
  }) = _$ElderDetailImpl;

  factory _ElderDetail.fromJson(Map<String, dynamic> json) =
      _$ElderDetailImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;
  @override
  String? get lastCheckIn;
  @override
  ElderTodayStatus get todayStatus;
  @override
  bool get isAccepted;
  @override
  ElderCheckInSettings? get checkInSettings;
  @override
  int get pendingAlerts;
  @override
  List<ElderContactSummary> get emergencyContacts;

  /// Create a copy of ElderDetail
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ElderDetailImplCopyWith<_$ElderDetailImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CreateInvitationRequest _$CreateInvitationRequestFromJson(
  Map<String, dynamic> json,
) {
  return _CreateInvitationRequest.fromJson(json);
}

/// @nodoc
mixin _$CreateInvitationRequest {
  RelationshipType get relationshipType => throw _privateConstructorUsedError;
  String? get targetEmail => throw _privateConstructorUsedError;
  String? get targetPhone => throw _privateConstructorUsedError;

  /// Serializes this CreateInvitationRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateInvitationRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateInvitationRequestCopyWith<CreateInvitationRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateInvitationRequestCopyWith<$Res> {
  factory $CreateInvitationRequestCopyWith(
    CreateInvitationRequest value,
    $Res Function(CreateInvitationRequest) then,
  ) = _$CreateInvitationRequestCopyWithImpl<$Res, CreateInvitationRequest>;
  @useResult
  $Res call({
    RelationshipType relationshipType,
    String? targetEmail,
    String? targetPhone,
  });
}

/// @nodoc
class _$CreateInvitationRequestCopyWithImpl<
  $Res,
  $Val extends CreateInvitationRequest
>
    implements $CreateInvitationRequestCopyWith<$Res> {
  _$CreateInvitationRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateInvitationRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? relationshipType = null,
    Object? targetEmail = freezed,
    Object? targetPhone = freezed,
  }) {
    return _then(
      _value.copyWith(
            relationshipType: null == relationshipType
                ? _value.relationshipType
                : relationshipType // ignore: cast_nullable_to_non_nullable
                      as RelationshipType,
            targetEmail: freezed == targetEmail
                ? _value.targetEmail
                : targetEmail // ignore: cast_nullable_to_non_nullable
                      as String?,
            targetPhone: freezed == targetPhone
                ? _value.targetPhone
                : targetPhone // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CreateInvitationRequestImplCopyWith<$Res>
    implements $CreateInvitationRequestCopyWith<$Res> {
  factory _$$CreateInvitationRequestImplCopyWith(
    _$CreateInvitationRequestImpl value,
    $Res Function(_$CreateInvitationRequestImpl) then,
  ) = __$$CreateInvitationRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    RelationshipType relationshipType,
    String? targetEmail,
    String? targetPhone,
  });
}

/// @nodoc
class __$$CreateInvitationRequestImplCopyWithImpl<$Res>
    extends
        _$CreateInvitationRequestCopyWithImpl<
          $Res,
          _$CreateInvitationRequestImpl
        >
    implements _$$CreateInvitationRequestImplCopyWith<$Res> {
  __$$CreateInvitationRequestImplCopyWithImpl(
    _$CreateInvitationRequestImpl _value,
    $Res Function(_$CreateInvitationRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CreateInvitationRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? relationshipType = null,
    Object? targetEmail = freezed,
    Object? targetPhone = freezed,
  }) {
    return _then(
      _$CreateInvitationRequestImpl(
        relationshipType: null == relationshipType
            ? _value.relationshipType
            : relationshipType // ignore: cast_nullable_to_non_nullable
                  as RelationshipType,
        targetEmail: freezed == targetEmail
            ? _value.targetEmail
            : targetEmail // ignore: cast_nullable_to_non_nullable
                  as String?,
        targetPhone: freezed == targetPhone
            ? _value.targetPhone
            : targetPhone // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateInvitationRequestImpl implements _CreateInvitationRequest {
  const _$CreateInvitationRequestImpl({
    required this.relationshipType,
    this.targetEmail,
    this.targetPhone,
  });

  factory _$CreateInvitationRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateInvitationRequestImplFromJson(json);

  @override
  final RelationshipType relationshipType;
  @override
  final String? targetEmail;
  @override
  final String? targetPhone;

  @override
  String toString() {
    return 'CreateInvitationRequest(relationshipType: $relationshipType, targetEmail: $targetEmail, targetPhone: $targetPhone)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateInvitationRequestImpl &&
            (identical(other.relationshipType, relationshipType) ||
                other.relationshipType == relationshipType) &&
            (identical(other.targetEmail, targetEmail) ||
                other.targetEmail == targetEmail) &&
            (identical(other.targetPhone, targetPhone) ||
                other.targetPhone == targetPhone));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, relationshipType, targetEmail, targetPhone);

  /// Create a copy of CreateInvitationRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateInvitationRequestImplCopyWith<_$CreateInvitationRequestImpl>
  get copyWith =>
      __$$CreateInvitationRequestImplCopyWithImpl<
        _$CreateInvitationRequestImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateInvitationRequestImplToJson(this);
  }
}

abstract class _CreateInvitationRequest implements CreateInvitationRequest {
  const factory _CreateInvitationRequest({
    required final RelationshipType relationshipType,
    final String? targetEmail,
    final String? targetPhone,
  }) = _$CreateInvitationRequestImpl;

  factory _CreateInvitationRequest.fromJson(Map<String, dynamic> json) =
      _$CreateInvitationRequestImpl.fromJson;

  @override
  RelationshipType get relationshipType;
  @override
  String? get targetEmail;
  @override
  String? get targetPhone;

  /// Create a copy of CreateInvitationRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateInvitationRequestImplCopyWith<_$CreateInvitationRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

InvitationResponse _$InvitationResponseFromJson(Map<String, dynamic> json) {
  return _InvitationResponse.fromJson(json);
}

/// @nodoc
mixin _$InvitationResponse {
  String get id => throw _privateConstructorUsedError;
  String get token => throw _privateConstructorUsedError;
  RelationshipType get relationshipType => throw _privateConstructorUsedError;
  String? get targetEmail => throw _privateConstructorUsedError;
  String? get targetPhone => throw _privateConstructorUsedError;
  String get expiresAt => throw _privateConstructorUsedError;
  String get inviterName => throw _privateConstructorUsedError;
  String get qrUrl => throw _privateConstructorUsedError;

  /// Serializes this InvitationResponse to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InvitationResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InvitationResponseCopyWith<InvitationResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InvitationResponseCopyWith<$Res> {
  factory $InvitationResponseCopyWith(
    InvitationResponse value,
    $Res Function(InvitationResponse) then,
  ) = _$InvitationResponseCopyWithImpl<$Res, InvitationResponse>;
  @useResult
  $Res call({
    String id,
    String token,
    RelationshipType relationshipType,
    String? targetEmail,
    String? targetPhone,
    String expiresAt,
    String inviterName,
    String qrUrl,
  });
}

/// @nodoc
class _$InvitationResponseCopyWithImpl<$Res, $Val extends InvitationResponse>
    implements $InvitationResponseCopyWith<$Res> {
  _$InvitationResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InvitationResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? token = null,
    Object? relationshipType = null,
    Object? targetEmail = freezed,
    Object? targetPhone = freezed,
    Object? expiresAt = null,
    Object? inviterName = null,
    Object? qrUrl = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            token: null == token
                ? _value.token
                : token // ignore: cast_nullable_to_non_nullable
                      as String,
            relationshipType: null == relationshipType
                ? _value.relationshipType
                : relationshipType // ignore: cast_nullable_to_non_nullable
                      as RelationshipType,
            targetEmail: freezed == targetEmail
                ? _value.targetEmail
                : targetEmail // ignore: cast_nullable_to_non_nullable
                      as String?,
            targetPhone: freezed == targetPhone
                ? _value.targetPhone
                : targetPhone // ignore: cast_nullable_to_non_nullable
                      as String?,
            expiresAt: null == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as String,
            inviterName: null == inviterName
                ? _value.inviterName
                : inviterName // ignore: cast_nullable_to_non_nullable
                      as String,
            qrUrl: null == qrUrl
                ? _value.qrUrl
                : qrUrl // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InvitationResponseImplCopyWith<$Res>
    implements $InvitationResponseCopyWith<$Res> {
  factory _$$InvitationResponseImplCopyWith(
    _$InvitationResponseImpl value,
    $Res Function(_$InvitationResponseImpl) then,
  ) = __$$InvitationResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String token,
    RelationshipType relationshipType,
    String? targetEmail,
    String? targetPhone,
    String expiresAt,
    String inviterName,
    String qrUrl,
  });
}

/// @nodoc
class __$$InvitationResponseImplCopyWithImpl<$Res>
    extends _$InvitationResponseCopyWithImpl<$Res, _$InvitationResponseImpl>
    implements _$$InvitationResponseImplCopyWith<$Res> {
  __$$InvitationResponseImplCopyWithImpl(
    _$InvitationResponseImpl _value,
    $Res Function(_$InvitationResponseImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InvitationResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? token = null,
    Object? relationshipType = null,
    Object? targetEmail = freezed,
    Object? targetPhone = freezed,
    Object? expiresAt = null,
    Object? inviterName = null,
    Object? qrUrl = null,
  }) {
    return _then(
      _$InvitationResponseImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        token: null == token
            ? _value.token
            : token // ignore: cast_nullable_to_non_nullable
                  as String,
        relationshipType: null == relationshipType
            ? _value.relationshipType
            : relationshipType // ignore: cast_nullable_to_non_nullable
                  as RelationshipType,
        targetEmail: freezed == targetEmail
            ? _value.targetEmail
            : targetEmail // ignore: cast_nullable_to_non_nullable
                  as String?,
        targetPhone: freezed == targetPhone
            ? _value.targetPhone
            : targetPhone // ignore: cast_nullable_to_non_nullable
                  as String?,
        expiresAt: null == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as String,
        inviterName: null == inviterName
            ? _value.inviterName
            : inviterName // ignore: cast_nullable_to_non_nullable
                  as String,
        qrUrl: null == qrUrl
            ? _value.qrUrl
            : qrUrl // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InvitationResponseImpl implements _InvitationResponse {
  const _$InvitationResponseImpl({
    required this.id,
    required this.token,
    required this.relationshipType,
    this.targetEmail,
    this.targetPhone,
    required this.expiresAt,
    required this.inviterName,
    required this.qrUrl,
  });

  factory _$InvitationResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$InvitationResponseImplFromJson(json);

  @override
  final String id;
  @override
  final String token;
  @override
  final RelationshipType relationshipType;
  @override
  final String? targetEmail;
  @override
  final String? targetPhone;
  @override
  final String expiresAt;
  @override
  final String inviterName;
  @override
  final String qrUrl;

  @override
  String toString() {
    return 'InvitationResponse(id: $id, token: $token, relationshipType: $relationshipType, targetEmail: $targetEmail, targetPhone: $targetPhone, expiresAt: $expiresAt, inviterName: $inviterName, qrUrl: $qrUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InvitationResponseImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.token, token) || other.token == token) &&
            (identical(other.relationshipType, relationshipType) ||
                other.relationshipType == relationshipType) &&
            (identical(other.targetEmail, targetEmail) ||
                other.targetEmail == targetEmail) &&
            (identical(other.targetPhone, targetPhone) ||
                other.targetPhone == targetPhone) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.inviterName, inviterName) ||
                other.inviterName == inviterName) &&
            (identical(other.qrUrl, qrUrl) || other.qrUrl == qrUrl));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    token,
    relationshipType,
    targetEmail,
    targetPhone,
    expiresAt,
    inviterName,
    qrUrl,
  );

  /// Create a copy of InvitationResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InvitationResponseImplCopyWith<_$InvitationResponseImpl> get copyWith =>
      __$$InvitationResponseImplCopyWithImpl<_$InvitationResponseImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InvitationResponseImplToJson(this);
  }
}

abstract class _InvitationResponse implements InvitationResponse {
  const factory _InvitationResponse({
    required final String id,
    required final String token,
    required final RelationshipType relationshipType,
    final String? targetEmail,
    final String? targetPhone,
    required final String expiresAt,
    required final String inviterName,
    required final String qrUrl,
  }) = _$InvitationResponseImpl;

  factory _InvitationResponse.fromJson(Map<String, dynamic> json) =
      _$InvitationResponseImpl.fromJson;

  @override
  String get id;
  @override
  String get token;
  @override
  RelationshipType get relationshipType;
  @override
  String? get targetEmail;
  @override
  String? get targetPhone;
  @override
  String get expiresAt;
  @override
  String get inviterName;
  @override
  String get qrUrl;

  /// Create a copy of InvitationResponse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InvitationResponseImplCopyWith<_$InvitationResponseImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InvitationInviter _$InvitationInviterFromJson(Map<String, dynamic> json) {
  return _InvitationInviter.fromJson(json);
}

/// @nodoc
mixin _$InvitationInviter {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;

  /// Serializes this InvitationInviter to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InvitationInviter
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InvitationInviterCopyWith<InvitationInviter> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InvitationInviterCopyWith<$Res> {
  factory $InvitationInviterCopyWith(
    InvitationInviter value,
    $Res Function(InvitationInviter) then,
  ) = _$InvitationInviterCopyWithImpl<$Res, InvitationInviter>;
  @useResult
  $Res call({String id, String name, String email});
}

/// @nodoc
class _$InvitationInviterCopyWithImpl<$Res, $Val extends InvitationInviter>
    implements $InvitationInviterCopyWith<$Res> {
  _$InvitationInviterCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InvitationInviter
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? id = null, Object? name = null, Object? email = null}) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$InvitationInviterImplCopyWith<$Res>
    implements $InvitationInviterCopyWith<$Res> {
  factory _$$InvitationInviterImplCopyWith(
    _$InvitationInviterImpl value,
    $Res Function(_$InvitationInviterImpl) then,
  ) = __$$InvitationInviterImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String id, String name, String email});
}

/// @nodoc
class __$$InvitationInviterImplCopyWithImpl<$Res>
    extends _$InvitationInviterCopyWithImpl<$Res, _$InvitationInviterImpl>
    implements _$$InvitationInviterImplCopyWith<$Res> {
  __$$InvitationInviterImplCopyWithImpl(
    _$InvitationInviterImpl _value,
    $Res Function(_$InvitationInviterImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InvitationInviter
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? id = null, Object? name = null, Object? email = null}) {
    return _then(
      _$InvitationInviterImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InvitationInviterImpl implements _InvitationInviter {
  const _$InvitationInviterImpl({
    required this.id,
    required this.name,
    required this.email,
  });

  factory _$InvitationInviterImpl.fromJson(Map<String, dynamic> json) =>
      _$$InvitationInviterImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String email;

  @override
  String toString() {
    return 'InvitationInviter(id: $id, name: $name, email: $email)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InvitationInviterImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, email);

  /// Create a copy of InvitationInviter
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InvitationInviterImplCopyWith<_$InvitationInviterImpl> get copyWith =>
      __$$InvitationInviterImplCopyWithImpl<_$InvitationInviterImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InvitationInviterImplToJson(this);
  }
}

abstract class _InvitationInviter implements InvitationInviter {
  const factory _InvitationInviter({
    required final String id,
    required final String name,
    required final String email,
  }) = _$InvitationInviterImpl;

  factory _InvitationInviter.fromJson(Map<String, dynamic> json) =
      _$InvitationInviterImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get email;

  /// Create a copy of InvitationInviter
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InvitationInviterImplCopyWith<_$InvitationInviterImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

InvitationDetails _$InvitationDetailsFromJson(Map<String, dynamic> json) {
  return _InvitationDetails.fromJson(json);
}

/// @nodoc
mixin _$InvitationDetails {
  String get id => throw _privateConstructorUsedError;
  RelationshipType get relationshipType => throw _privateConstructorUsedError;
  InvitationInviter get inviter => throw _privateConstructorUsedError;
  String get expiresAt => throw _privateConstructorUsedError;
  bool get isExpired => throw _privateConstructorUsedError;
  bool get isAccepted => throw _privateConstructorUsedError;

  /// Serializes this InvitationDetails to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of InvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $InvitationDetailsCopyWith<InvitationDetails> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $InvitationDetailsCopyWith<$Res> {
  factory $InvitationDetailsCopyWith(
    InvitationDetails value,
    $Res Function(InvitationDetails) then,
  ) = _$InvitationDetailsCopyWithImpl<$Res, InvitationDetails>;
  @useResult
  $Res call({
    String id,
    RelationshipType relationshipType,
    InvitationInviter inviter,
    String expiresAt,
    bool isExpired,
    bool isAccepted,
  });

  $InvitationInviterCopyWith<$Res> get inviter;
}

/// @nodoc
class _$InvitationDetailsCopyWithImpl<$Res, $Val extends InvitationDetails>
    implements $InvitationDetailsCopyWith<$Res> {
  _$InvitationDetailsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of InvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? relationshipType = null,
    Object? inviter = null,
    Object? expiresAt = null,
    Object? isExpired = null,
    Object? isAccepted = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            relationshipType: null == relationshipType
                ? _value.relationshipType
                : relationshipType // ignore: cast_nullable_to_non_nullable
                      as RelationshipType,
            inviter: null == inviter
                ? _value.inviter
                : inviter // ignore: cast_nullable_to_non_nullable
                      as InvitationInviter,
            expiresAt: null == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as String,
            isExpired: null == isExpired
                ? _value.isExpired
                : isExpired // ignore: cast_nullable_to_non_nullable
                      as bool,
            isAccepted: null == isAccepted
                ? _value.isAccepted
                : isAccepted // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }

  /// Create a copy of InvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $InvitationInviterCopyWith<$Res> get inviter {
    return $InvitationInviterCopyWith<$Res>(_value.inviter, (value) {
      return _then(_value.copyWith(inviter: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$InvitationDetailsImplCopyWith<$Res>
    implements $InvitationDetailsCopyWith<$Res> {
  factory _$$InvitationDetailsImplCopyWith(
    _$InvitationDetailsImpl value,
    $Res Function(_$InvitationDetailsImpl) then,
  ) = __$$InvitationDetailsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    RelationshipType relationshipType,
    InvitationInviter inviter,
    String expiresAt,
    bool isExpired,
    bool isAccepted,
  });

  @override
  $InvitationInviterCopyWith<$Res> get inviter;
}

/// @nodoc
class __$$InvitationDetailsImplCopyWithImpl<$Res>
    extends _$InvitationDetailsCopyWithImpl<$Res, _$InvitationDetailsImpl>
    implements _$$InvitationDetailsImplCopyWith<$Res> {
  __$$InvitationDetailsImplCopyWithImpl(
    _$InvitationDetailsImpl _value,
    $Res Function(_$InvitationDetailsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of InvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? relationshipType = null,
    Object? inviter = null,
    Object? expiresAt = null,
    Object? isExpired = null,
    Object? isAccepted = null,
  }) {
    return _then(
      _$InvitationDetailsImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        relationshipType: null == relationshipType
            ? _value.relationshipType
            : relationshipType // ignore: cast_nullable_to_non_nullable
                  as RelationshipType,
        inviter: null == inviter
            ? _value.inviter
            : inviter // ignore: cast_nullable_to_non_nullable
                  as InvitationInviter,
        expiresAt: null == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as String,
        isExpired: null == isExpired
            ? _value.isExpired
            : isExpired // ignore: cast_nullable_to_non_nullable
                  as bool,
        isAccepted: null == isAccepted
            ? _value.isAccepted
            : isAccepted // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$InvitationDetailsImpl implements _InvitationDetails {
  const _$InvitationDetailsImpl({
    required this.id,
    required this.relationshipType,
    required this.inviter,
    required this.expiresAt,
    required this.isExpired,
    required this.isAccepted,
  });

  factory _$InvitationDetailsImpl.fromJson(Map<String, dynamic> json) =>
      _$$InvitationDetailsImplFromJson(json);

  @override
  final String id;
  @override
  final RelationshipType relationshipType;
  @override
  final InvitationInviter inviter;
  @override
  final String expiresAt;
  @override
  final bool isExpired;
  @override
  final bool isAccepted;

  @override
  String toString() {
    return 'InvitationDetails(id: $id, relationshipType: $relationshipType, inviter: $inviter, expiresAt: $expiresAt, isExpired: $isExpired, isAccepted: $isAccepted)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$InvitationDetailsImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.relationshipType, relationshipType) ||
                other.relationshipType == relationshipType) &&
            (identical(other.inviter, inviter) || other.inviter == inviter) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt) &&
            (identical(other.isExpired, isExpired) ||
                other.isExpired == isExpired) &&
            (identical(other.isAccepted, isAccepted) ||
                other.isAccepted == isAccepted));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    relationshipType,
    inviter,
    expiresAt,
    isExpired,
    isAccepted,
  );

  /// Create a copy of InvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$InvitationDetailsImplCopyWith<_$InvitationDetailsImpl> get copyWith =>
      __$$InvitationDetailsImplCopyWithImpl<_$InvitationDetailsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$InvitationDetailsImplToJson(this);
  }
}

abstract class _InvitationDetails implements InvitationDetails {
  const factory _InvitationDetails({
    required final String id,
    required final RelationshipType relationshipType,
    required final InvitationInviter inviter,
    required final String expiresAt,
    required final bool isExpired,
    required final bool isAccepted,
  }) = _$InvitationDetailsImpl;

  factory _InvitationDetails.fromJson(Map<String, dynamic> json) =
      _$InvitationDetailsImpl.fromJson;

  @override
  String get id;
  @override
  RelationshipType get relationshipType;
  @override
  InvitationInviter get inviter;
  @override
  String get expiresAt;
  @override
  bool get isExpired;
  @override
  bool get isAccepted;

  /// Create a copy of InvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$InvitationDetailsImplCopyWith<_$InvitationDetailsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CaregiverNote _$CaregiverNoteFromJson(Map<String, dynamic> json) {
  return _CaregiverNote.fromJson(json);
}

/// @nodoc
mixin _$CaregiverNote {
  String get id => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  String get noteDate => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this CaregiverNote to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CaregiverNote
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CaregiverNoteCopyWith<CaregiverNote> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CaregiverNoteCopyWith<$Res> {
  factory $CaregiverNoteCopyWith(
    CaregiverNote value,
    $Res Function(CaregiverNote) then,
  ) = _$CaregiverNoteCopyWithImpl<$Res, CaregiverNote>;
  @useResult
  $Res call({
    String id,
    String content,
    String noteDate,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$CaregiverNoteCopyWithImpl<$Res, $Val extends CaregiverNote>
    implements $CaregiverNoteCopyWith<$Res> {
  _$CaregiverNoteCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CaregiverNote
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? content = null,
    Object? noteDate = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            noteDate: null == noteDate
                ? _value.noteDate
                : noteDate // ignore: cast_nullable_to_non_nullable
                      as String,
            createdAt: null == createdAt
                ? _value.createdAt
                : createdAt // ignore: cast_nullable_to_non_nullable
                      as String,
            updatedAt: null == updatedAt
                ? _value.updatedAt
                : updatedAt // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CaregiverNoteImplCopyWith<$Res>
    implements $CaregiverNoteCopyWith<$Res> {
  factory _$$CaregiverNoteImplCopyWith(
    _$CaregiverNoteImpl value,
    $Res Function(_$CaregiverNoteImpl) then,
  ) = __$$CaregiverNoteImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String content,
    String noteDate,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$CaregiverNoteImplCopyWithImpl<$Res>
    extends _$CaregiverNoteCopyWithImpl<$Res, _$CaregiverNoteImpl>
    implements _$$CaregiverNoteImplCopyWith<$Res> {
  __$$CaregiverNoteImplCopyWithImpl(
    _$CaregiverNoteImpl _value,
    $Res Function(_$CaregiverNoteImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CaregiverNote
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? content = null,
    Object? noteDate = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$CaregiverNoteImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        noteDate: null == noteDate
            ? _value.noteDate
            : noteDate // ignore: cast_nullable_to_non_nullable
                  as String,
        createdAt: null == createdAt
            ? _value.createdAt
            : createdAt // ignore: cast_nullable_to_non_nullable
                  as String,
        updatedAt: null == updatedAt
            ? _value.updatedAt
            : updatedAt // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CaregiverNoteImpl implements _CaregiverNote {
  const _$CaregiverNoteImpl({
    required this.id,
    required this.content,
    required this.noteDate,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$CaregiverNoteImpl.fromJson(Map<String, dynamic> json) =>
      _$$CaregiverNoteImplFromJson(json);

  @override
  final String id;
  @override
  final String content;
  @override
  final String noteDate;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'CaregiverNote(id: $id, content: $content, noteDate: $noteDate, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CaregiverNoteImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.noteDate, noteDate) ||
                other.noteDate == noteDate) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, content, noteDate, createdAt, updatedAt);

  /// Create a copy of CaregiverNote
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CaregiverNoteImplCopyWith<_$CaregiverNoteImpl> get copyWith =>
      __$$CaregiverNoteImplCopyWithImpl<_$CaregiverNoteImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CaregiverNoteImplToJson(this);
  }
}

abstract class _CaregiverNote implements CaregiverNote {
  const factory _CaregiverNote({
    required final String id,
    required final String content,
    required final String noteDate,
    required final String createdAt,
    required final String updatedAt,
  }) = _$CaregiverNoteImpl;

  factory _CaregiverNote.fromJson(Map<String, dynamic> json) =
      _$CaregiverNoteImpl.fromJson;

  @override
  String get id;
  @override
  String get content;
  @override
  String get noteDate;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of CaregiverNote
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CaregiverNoteImplCopyWith<_$CaregiverNoteImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CreateNoteRequest _$CreateNoteRequestFromJson(Map<String, dynamic> json) {
  return _CreateNoteRequest.fromJson(json);
}

/// @nodoc
mixin _$CreateNoteRequest {
  String get content => throw _privateConstructorUsedError;
  String? get noteDate => throw _privateConstructorUsedError;

  /// Serializes this CreateNoteRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateNoteRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateNoteRequestCopyWith<CreateNoteRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateNoteRequestCopyWith<$Res> {
  factory $CreateNoteRequestCopyWith(
    CreateNoteRequest value,
    $Res Function(CreateNoteRequest) then,
  ) = _$CreateNoteRequestCopyWithImpl<$Res, CreateNoteRequest>;
  @useResult
  $Res call({String content, String? noteDate});
}

/// @nodoc
class _$CreateNoteRequestCopyWithImpl<$Res, $Val extends CreateNoteRequest>
    implements $CreateNoteRequestCopyWith<$Res> {
  _$CreateNoteRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateNoteRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? content = null, Object? noteDate = freezed}) {
    return _then(
      _value.copyWith(
            content: null == content
                ? _value.content
                : content // ignore: cast_nullable_to_non_nullable
                      as String,
            noteDate: freezed == noteDate
                ? _value.noteDate
                : noteDate // ignore: cast_nullable_to_non_nullable
                      as String?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CreateNoteRequestImplCopyWith<$Res>
    implements $CreateNoteRequestCopyWith<$Res> {
  factory _$$CreateNoteRequestImplCopyWith(
    _$CreateNoteRequestImpl value,
    $Res Function(_$CreateNoteRequestImpl) then,
  ) = __$$CreateNoteRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String content, String? noteDate});
}

/// @nodoc
class __$$CreateNoteRequestImplCopyWithImpl<$Res>
    extends _$CreateNoteRequestCopyWithImpl<$Res, _$CreateNoteRequestImpl>
    implements _$$CreateNoteRequestImplCopyWith<$Res> {
  __$$CreateNoteRequestImplCopyWithImpl(
    _$CreateNoteRequestImpl _value,
    $Res Function(_$CreateNoteRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CreateNoteRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? content = null, Object? noteDate = freezed}) {
    return _then(
      _$CreateNoteRequestImpl(
        content: null == content
            ? _value.content
            : content // ignore: cast_nullable_to_non_nullable
                  as String,
        noteDate: freezed == noteDate
            ? _value.noteDate
            : noteDate // ignore: cast_nullable_to_non_nullable
                  as String?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateNoteRequestImpl implements _CreateNoteRequest {
  const _$CreateNoteRequestImpl({required this.content, this.noteDate});

  factory _$CreateNoteRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateNoteRequestImplFromJson(json);

  @override
  final String content;
  @override
  final String? noteDate;

  @override
  String toString() {
    return 'CreateNoteRequest(content: $content, noteDate: $noteDate)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateNoteRequestImpl &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.noteDate, noteDate) ||
                other.noteDate == noteDate));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, content, noteDate);

  /// Create a copy of CreateNoteRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateNoteRequestImplCopyWith<_$CreateNoteRequestImpl> get copyWith =>
      __$$CreateNoteRequestImplCopyWithImpl<_$CreateNoteRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateNoteRequestImplToJson(this);
  }
}

abstract class _CreateNoteRequest implements CreateNoteRequest {
  const factory _CreateNoteRequest({
    required final String content,
    final String? noteDate,
  }) = _$CreateNoteRequestImpl;

  factory _CreateNoteRequest.fromJson(Map<String, dynamic> json) =
      _$CreateNoteRequestImpl.fromJson;

  @override
  String get content;
  @override
  String? get noteDate;

  /// Create a copy of CreateNoteRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateNoteRequestImplCopyWith<_$CreateNoteRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CaretakerCheckInRequest _$CaretakerCheckInRequestFromJson(
  Map<String, dynamic> json,
) {
  return _CaretakerCheckInRequest.fromJson(json);
}

/// @nodoc
mixin _$CaretakerCheckInRequest {
  String? get note => throw _privateConstructorUsedError;

  /// Serializes this CaretakerCheckInRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CaretakerCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CaretakerCheckInRequestCopyWith<CaretakerCheckInRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CaretakerCheckInRequestCopyWith<$Res> {
  factory $CaretakerCheckInRequestCopyWith(
    CaretakerCheckInRequest value,
    $Res Function(CaretakerCheckInRequest) then,
  ) = _$CaretakerCheckInRequestCopyWithImpl<$Res, CaretakerCheckInRequest>;
  @useResult
  $Res call({String? note});
}

/// @nodoc
class _$CaretakerCheckInRequestCopyWithImpl<
  $Res,
  $Val extends CaretakerCheckInRequest
>
    implements $CaretakerCheckInRequestCopyWith<$Res> {
  _$CaretakerCheckInRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CaretakerCheckInRequest
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
abstract class _$$CaretakerCheckInRequestImplCopyWith<$Res>
    implements $CaretakerCheckInRequestCopyWith<$Res> {
  factory _$$CaretakerCheckInRequestImplCopyWith(
    _$CaretakerCheckInRequestImpl value,
    $Res Function(_$CaretakerCheckInRequestImpl) then,
  ) = __$$CaretakerCheckInRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String? note});
}

/// @nodoc
class __$$CaretakerCheckInRequestImplCopyWithImpl<$Res>
    extends
        _$CaretakerCheckInRequestCopyWithImpl<
          $Res,
          _$CaretakerCheckInRequestImpl
        >
    implements _$$CaretakerCheckInRequestImplCopyWith<$Res> {
  __$$CaretakerCheckInRequestImplCopyWithImpl(
    _$CaretakerCheckInRequestImpl _value,
    $Res Function(_$CaretakerCheckInRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CaretakerCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? note = freezed}) {
    return _then(
      _$CaretakerCheckInRequestImpl(
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
class _$CaretakerCheckInRequestImpl implements _CaretakerCheckInRequest {
  const _$CaretakerCheckInRequestImpl({this.note});

  factory _$CaretakerCheckInRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$CaretakerCheckInRequestImplFromJson(json);

  @override
  final String? note;

  @override
  String toString() {
    return 'CaretakerCheckInRequest(note: $note)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CaretakerCheckInRequestImpl &&
            (identical(other.note, note) || other.note == note));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, note);

  /// Create a copy of CaretakerCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CaretakerCheckInRequestImplCopyWith<_$CaretakerCheckInRequestImpl>
  get copyWith =>
      __$$CaretakerCheckInRequestImplCopyWithImpl<
        _$CaretakerCheckInRequestImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CaretakerCheckInRequestImplToJson(this);
  }
}

abstract class _CaretakerCheckInRequest implements CaretakerCheckInRequest {
  const factory _CaretakerCheckInRequest({final String? note}) =
      _$CaretakerCheckInRequestImpl;

  factory _CaretakerCheckInRequest.fromJson(Map<String, dynamic> json) =
      _$CaretakerCheckInRequestImpl.fromJson;

  @override
  String? get note;

  /// Create a copy of CaretakerCheckInRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CaretakerCheckInRequestImplCopyWith<_$CaretakerCheckInRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

CaretakerCheckInResponse _$CaretakerCheckInResponseFromJson(
  Map<String, dynamic> json,
) {
  return _CaretakerCheckInResponse.fromJson(json);
}

/// @nodoc
mixin _$CaretakerCheckInResponse {
  String get checkInDate => throw _privateConstructorUsedError;
  String get checkedInAt => throw _privateConstructorUsedError;

  /// Serializes this CaretakerCheckInResponse to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CaretakerCheckInResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CaretakerCheckInResponseCopyWith<CaretakerCheckInResponse> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CaretakerCheckInResponseCopyWith<$Res> {
  factory $CaretakerCheckInResponseCopyWith(
    CaretakerCheckInResponse value,
    $Res Function(CaretakerCheckInResponse) then,
  ) = _$CaretakerCheckInResponseCopyWithImpl<$Res, CaretakerCheckInResponse>;
  @useResult
  $Res call({String checkInDate, String checkedInAt});
}

/// @nodoc
class _$CaretakerCheckInResponseCopyWithImpl<
  $Res,
  $Val extends CaretakerCheckInResponse
>
    implements $CaretakerCheckInResponseCopyWith<$Res> {
  _$CaretakerCheckInResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CaretakerCheckInResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? checkInDate = null, Object? checkedInAt = null}) {
    return _then(
      _value.copyWith(
            checkInDate: null == checkInDate
                ? _value.checkInDate
                : checkInDate // ignore: cast_nullable_to_non_nullable
                      as String,
            checkedInAt: null == checkedInAt
                ? _value.checkedInAt
                : checkedInAt // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CaretakerCheckInResponseImplCopyWith<$Res>
    implements $CaretakerCheckInResponseCopyWith<$Res> {
  factory _$$CaretakerCheckInResponseImplCopyWith(
    _$CaretakerCheckInResponseImpl value,
    $Res Function(_$CaretakerCheckInResponseImpl) then,
  ) = __$$CaretakerCheckInResponseImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String checkInDate, String checkedInAt});
}

/// @nodoc
class __$$CaretakerCheckInResponseImplCopyWithImpl<$Res>
    extends
        _$CaretakerCheckInResponseCopyWithImpl<
          $Res,
          _$CaretakerCheckInResponseImpl
        >
    implements _$$CaretakerCheckInResponseImplCopyWith<$Res> {
  __$$CaretakerCheckInResponseImplCopyWithImpl(
    _$CaretakerCheckInResponseImpl _value,
    $Res Function(_$CaretakerCheckInResponseImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CaretakerCheckInResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? checkInDate = null, Object? checkedInAt = null}) {
    return _then(
      _$CaretakerCheckInResponseImpl(
        checkInDate: null == checkInDate
            ? _value.checkInDate
            : checkInDate // ignore: cast_nullable_to_non_nullable
                  as String,
        checkedInAt: null == checkedInAt
            ? _value.checkedInAt
            : checkedInAt // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CaretakerCheckInResponseImpl implements _CaretakerCheckInResponse {
  const _$CaretakerCheckInResponseImpl({
    required this.checkInDate,
    required this.checkedInAt,
  });

  factory _$CaretakerCheckInResponseImpl.fromJson(Map<String, dynamic> json) =>
      _$$CaretakerCheckInResponseImplFromJson(json);

  @override
  final String checkInDate;
  @override
  final String checkedInAt;

  @override
  String toString() {
    return 'CaretakerCheckInResponse(checkInDate: $checkInDate, checkedInAt: $checkedInAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CaretakerCheckInResponseImpl &&
            (identical(other.checkInDate, checkInDate) ||
                other.checkInDate == checkInDate) &&
            (identical(other.checkedInAt, checkedInAt) ||
                other.checkedInAt == checkedInAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, checkInDate, checkedInAt);

  /// Create a copy of CaretakerCheckInResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CaretakerCheckInResponseImplCopyWith<_$CaretakerCheckInResponseImpl>
  get copyWith =>
      __$$CaretakerCheckInResponseImplCopyWithImpl<
        _$CaretakerCheckInResponseImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CaretakerCheckInResponseImplToJson(this);
  }
}

abstract class _CaretakerCheckInResponse implements CaretakerCheckInResponse {
  const factory _CaretakerCheckInResponse({
    required final String checkInDate,
    required final String checkedInAt,
  }) = _$CaretakerCheckInResponseImpl;

  factory _CaretakerCheckInResponse.fromJson(Map<String, dynamic> json) =
      _$CaretakerCheckInResponseImpl.fromJson;

  @override
  String get checkInDate;
  @override
  String get checkedInAt;

  /// Create a copy of CaretakerCheckInResponse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CaretakerCheckInResponseImplCopyWith<_$CaretakerCheckInResponseImpl>
  get copyWith => throw _privateConstructorUsedError;
}
