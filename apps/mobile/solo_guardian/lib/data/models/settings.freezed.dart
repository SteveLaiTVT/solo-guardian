// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'settings.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

CheckInSettings _$CheckInSettingsFromJson(Map<String, dynamic> json) {
  return _CheckInSettings.fromJson(json);
}

/// @nodoc
mixin _$CheckInSettings {
  String get userId => throw _privateConstructorUsedError;
  String get deadlineTime => throw _privateConstructorUsedError;
  String get reminderTime => throw _privateConstructorUsedError;
  bool get reminderEnabled => throw _privateConstructorUsedError;
  String get timezone => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this CheckInSettings to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CheckInSettingsCopyWith<CheckInSettings> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CheckInSettingsCopyWith<$Res> {
  factory $CheckInSettingsCopyWith(
    CheckInSettings value,
    $Res Function(CheckInSettings) then,
  ) = _$CheckInSettingsCopyWithImpl<$Res, CheckInSettings>;
  @useResult
  $Res call({
    String userId,
    String deadlineTime,
    String reminderTime,
    bool reminderEnabled,
    String timezone,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$CheckInSettingsCopyWithImpl<$Res, $Val extends CheckInSettings>
    implements $CheckInSettingsCopyWith<$Res> {
  _$CheckInSettingsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? userId = null,
    Object? deadlineTime = null,
    Object? reminderTime = null,
    Object? reminderEnabled = null,
    Object? timezone = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _value.copyWith(
            userId: null == userId
                ? _value.userId
                : userId // ignore: cast_nullable_to_non_nullable
                      as String,
            deadlineTime: null == deadlineTime
                ? _value.deadlineTime
                : deadlineTime // ignore: cast_nullable_to_non_nullable
                      as String,
            reminderTime: null == reminderTime
                ? _value.reminderTime
                : reminderTime // ignore: cast_nullable_to_non_nullable
                      as String,
            reminderEnabled: null == reminderEnabled
                ? _value.reminderEnabled
                : reminderEnabled // ignore: cast_nullable_to_non_nullable
                      as bool,
            timezone: null == timezone
                ? _value.timezone
                : timezone // ignore: cast_nullable_to_non_nullable
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
abstract class _$$CheckInSettingsImplCopyWith<$Res>
    implements $CheckInSettingsCopyWith<$Res> {
  factory _$$CheckInSettingsImplCopyWith(
    _$CheckInSettingsImpl value,
    $Res Function(_$CheckInSettingsImpl) then,
  ) = __$$CheckInSettingsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String userId,
    String deadlineTime,
    String reminderTime,
    bool reminderEnabled,
    String timezone,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$CheckInSettingsImplCopyWithImpl<$Res>
    extends _$CheckInSettingsCopyWithImpl<$Res, _$CheckInSettingsImpl>
    implements _$$CheckInSettingsImplCopyWith<$Res> {
  __$$CheckInSettingsImplCopyWithImpl(
    _$CheckInSettingsImpl _value,
    $Res Function(_$CheckInSettingsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? userId = null,
    Object? deadlineTime = null,
    Object? reminderTime = null,
    Object? reminderEnabled = null,
    Object? timezone = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$CheckInSettingsImpl(
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        deadlineTime: null == deadlineTime
            ? _value.deadlineTime
            : deadlineTime // ignore: cast_nullable_to_non_nullable
                  as String,
        reminderTime: null == reminderTime
            ? _value.reminderTime
            : reminderTime // ignore: cast_nullable_to_non_nullable
                  as String,
        reminderEnabled: null == reminderEnabled
            ? _value.reminderEnabled
            : reminderEnabled // ignore: cast_nullable_to_non_nullable
                  as bool,
        timezone: null == timezone
            ? _value.timezone
            : timezone // ignore: cast_nullable_to_non_nullable
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
class _$CheckInSettingsImpl implements _CheckInSettings {
  const _$CheckInSettingsImpl({
    required this.userId,
    required this.deadlineTime,
    required this.reminderTime,
    required this.reminderEnabled,
    required this.timezone,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$CheckInSettingsImpl.fromJson(Map<String, dynamic> json) =>
      _$$CheckInSettingsImplFromJson(json);

  @override
  final String userId;
  @override
  final String deadlineTime;
  @override
  final String reminderTime;
  @override
  final bool reminderEnabled;
  @override
  final String timezone;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'CheckInSettings(userId: $userId, deadlineTime: $deadlineTime, reminderTime: $reminderTime, reminderEnabled: $reminderEnabled, timezone: $timezone, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CheckInSettingsImpl &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.deadlineTime, deadlineTime) ||
                other.deadlineTime == deadlineTime) &&
            (identical(other.reminderTime, reminderTime) ||
                other.reminderTime == reminderTime) &&
            (identical(other.reminderEnabled, reminderEnabled) ||
                other.reminderEnabled == reminderEnabled) &&
            (identical(other.timezone, timezone) ||
                other.timezone == timezone) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    userId,
    deadlineTime,
    reminderTime,
    reminderEnabled,
    timezone,
    createdAt,
    updatedAt,
  );

  /// Create a copy of CheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CheckInSettingsImplCopyWith<_$CheckInSettingsImpl> get copyWith =>
      __$$CheckInSettingsImplCopyWithImpl<_$CheckInSettingsImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CheckInSettingsImplToJson(this);
  }
}

abstract class _CheckInSettings implements CheckInSettings {
  const factory _CheckInSettings({
    required final String userId,
    required final String deadlineTime,
    required final String reminderTime,
    required final bool reminderEnabled,
    required final String timezone,
    required final String createdAt,
    required final String updatedAt,
  }) = _$CheckInSettingsImpl;

  factory _CheckInSettings.fromJson(Map<String, dynamic> json) =
      _$CheckInSettingsImpl.fromJson;

  @override
  String get userId;
  @override
  String get deadlineTime;
  @override
  String get reminderTime;
  @override
  bool get reminderEnabled;
  @override
  String get timezone;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of CheckInSettings
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CheckInSettingsImplCopyWith<_$CheckInSettingsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

UpdateSettingsRequest _$UpdateSettingsRequestFromJson(
  Map<String, dynamic> json,
) {
  return _UpdateSettingsRequest.fromJson(json);
}

/// @nodoc
mixin _$UpdateSettingsRequest {
  String? get deadlineTime => throw _privateConstructorUsedError;
  String? get reminderTime => throw _privateConstructorUsedError;
  bool? get reminderEnabled => throw _privateConstructorUsedError;

  /// Serializes this UpdateSettingsRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateSettingsRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateSettingsRequestCopyWith<UpdateSettingsRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateSettingsRequestCopyWith<$Res> {
  factory $UpdateSettingsRequestCopyWith(
    UpdateSettingsRequest value,
    $Res Function(UpdateSettingsRequest) then,
  ) = _$UpdateSettingsRequestCopyWithImpl<$Res, UpdateSettingsRequest>;
  @useResult
  $Res call({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  });
}

/// @nodoc
class _$UpdateSettingsRequestCopyWithImpl<
  $Res,
  $Val extends UpdateSettingsRequest
>
    implements $UpdateSettingsRequestCopyWith<$Res> {
  _$UpdateSettingsRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateSettingsRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? deadlineTime = freezed,
    Object? reminderTime = freezed,
    Object? reminderEnabled = freezed,
  }) {
    return _then(
      _value.copyWith(
            deadlineTime: freezed == deadlineTime
                ? _value.deadlineTime
                : deadlineTime // ignore: cast_nullable_to_non_nullable
                      as String?,
            reminderTime: freezed == reminderTime
                ? _value.reminderTime
                : reminderTime // ignore: cast_nullable_to_non_nullable
                      as String?,
            reminderEnabled: freezed == reminderEnabled
                ? _value.reminderEnabled
                : reminderEnabled // ignore: cast_nullable_to_non_nullable
                      as bool?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UpdateSettingsRequestImplCopyWith<$Res>
    implements $UpdateSettingsRequestCopyWith<$Res> {
  factory _$$UpdateSettingsRequestImplCopyWith(
    _$UpdateSettingsRequestImpl value,
    $Res Function(_$UpdateSettingsRequestImpl) then,
  ) = __$$UpdateSettingsRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String? deadlineTime,
    String? reminderTime,
    bool? reminderEnabled,
  });
}

/// @nodoc
class __$$UpdateSettingsRequestImplCopyWithImpl<$Res>
    extends
        _$UpdateSettingsRequestCopyWithImpl<$Res, _$UpdateSettingsRequestImpl>
    implements _$$UpdateSettingsRequestImplCopyWith<$Res> {
  __$$UpdateSettingsRequestImplCopyWithImpl(
    _$UpdateSettingsRequestImpl _value,
    $Res Function(_$UpdateSettingsRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UpdateSettingsRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? deadlineTime = freezed,
    Object? reminderTime = freezed,
    Object? reminderEnabled = freezed,
  }) {
    return _then(
      _$UpdateSettingsRequestImpl(
        deadlineTime: freezed == deadlineTime
            ? _value.deadlineTime
            : deadlineTime // ignore: cast_nullable_to_non_nullable
                  as String?,
        reminderTime: freezed == reminderTime
            ? _value.reminderTime
            : reminderTime // ignore: cast_nullable_to_non_nullable
                  as String?,
        reminderEnabled: freezed == reminderEnabled
            ? _value.reminderEnabled
            : reminderEnabled // ignore: cast_nullable_to_non_nullable
                  as bool?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdateSettingsRequestImpl implements _UpdateSettingsRequest {
  const _$UpdateSettingsRequestImpl({
    this.deadlineTime,
    this.reminderTime,
    this.reminderEnabled,
  });

  factory _$UpdateSettingsRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$UpdateSettingsRequestImplFromJson(json);

  @override
  final String? deadlineTime;
  @override
  final String? reminderTime;
  @override
  final bool? reminderEnabled;

  @override
  String toString() {
    return 'UpdateSettingsRequest(deadlineTime: $deadlineTime, reminderTime: $reminderTime, reminderEnabled: $reminderEnabled)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateSettingsRequestImpl &&
            (identical(other.deadlineTime, deadlineTime) ||
                other.deadlineTime == deadlineTime) &&
            (identical(other.reminderTime, reminderTime) ||
                other.reminderTime == reminderTime) &&
            (identical(other.reminderEnabled, reminderEnabled) ||
                other.reminderEnabled == reminderEnabled));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, deadlineTime, reminderTime, reminderEnabled);

  /// Create a copy of UpdateSettingsRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateSettingsRequestImplCopyWith<_$UpdateSettingsRequestImpl>
  get copyWith =>
      __$$UpdateSettingsRequestImplCopyWithImpl<_$UpdateSettingsRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateSettingsRequestImplToJson(this);
  }
}

abstract class _UpdateSettingsRequest implements UpdateSettingsRequest {
  const factory _UpdateSettingsRequest({
    final String? deadlineTime,
    final String? reminderTime,
    final bool? reminderEnabled,
  }) = _$UpdateSettingsRequestImpl;

  factory _UpdateSettingsRequest.fromJson(Map<String, dynamic> json) =
      _$UpdateSettingsRequestImpl.fromJson;

  @override
  String? get deadlineTime;
  @override
  String? get reminderTime;
  @override
  bool? get reminderEnabled;

  /// Create a copy of UpdateSettingsRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateSettingsRequestImplCopyWith<_$UpdateSettingsRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}
