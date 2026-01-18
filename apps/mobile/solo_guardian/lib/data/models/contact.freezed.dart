// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'contact.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

EmergencyContact _$EmergencyContactFromJson(Map<String, dynamic> json) {
  return _EmergencyContact.fromJson(json);
}

/// @nodoc
mixin _$EmergencyContact {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  int get priority => throw _privateConstructorUsedError;
  bool get isVerified => throw _privateConstructorUsedError;
  bool get phoneVerified => throw _privateConstructorUsedError;
  NotificationChannel get preferredChannel =>
      throw _privateConstructorUsedError;
  bool get isActive => throw _privateConstructorUsedError;
  String? get linkedUserId => throw _privateConstructorUsedError;
  String? get linkedUserName => throw _privateConstructorUsedError;
  InvitationStatus get invitationStatus => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this EmergencyContact to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of EmergencyContact
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $EmergencyContactCopyWith<EmergencyContact> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EmergencyContactCopyWith<$Res> {
  factory $EmergencyContactCopyWith(
    EmergencyContact value,
    $Res Function(EmergencyContact) then,
  ) = _$EmergencyContactCopyWithImpl<$Res, EmergencyContact>;
  @useResult
  $Res call({
    String id,
    String userId,
    String name,
    String email,
    String? phone,
    int priority,
    bool isVerified,
    bool phoneVerified,
    NotificationChannel preferredChannel,
    bool isActive,
    String? linkedUserId,
    String? linkedUserName,
    InvitationStatus invitationStatus,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$EmergencyContactCopyWithImpl<$Res, $Val extends EmergencyContact>
    implements $EmergencyContactCopyWith<$Res> {
  _$EmergencyContactCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of EmergencyContact
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? priority = null,
    Object? isVerified = null,
    Object? phoneVerified = null,
    Object? preferredChannel = null,
    Object? isActive = null,
    Object? linkedUserId = freezed,
    Object? linkedUserName = freezed,
    Object? invitationStatus = null,
    Object? createdAt = null,
    Object? updatedAt = null,
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
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            priority: null == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as int,
            isVerified: null == isVerified
                ? _value.isVerified
                : isVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            phoneVerified: null == phoneVerified
                ? _value.phoneVerified
                : phoneVerified // ignore: cast_nullable_to_non_nullable
                      as bool,
            preferredChannel: null == preferredChannel
                ? _value.preferredChannel
                : preferredChannel // ignore: cast_nullable_to_non_nullable
                      as NotificationChannel,
            isActive: null == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool,
            linkedUserId: freezed == linkedUserId
                ? _value.linkedUserId
                : linkedUserId // ignore: cast_nullable_to_non_nullable
                      as String?,
            linkedUserName: freezed == linkedUserName
                ? _value.linkedUserName
                : linkedUserName // ignore: cast_nullable_to_non_nullable
                      as String?,
            invitationStatus: null == invitationStatus
                ? _value.invitationStatus
                : invitationStatus // ignore: cast_nullable_to_non_nullable
                      as InvitationStatus,
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
abstract class _$$EmergencyContactImplCopyWith<$Res>
    implements $EmergencyContactCopyWith<$Res> {
  factory _$$EmergencyContactImplCopyWith(
    _$EmergencyContactImpl value,
    $Res Function(_$EmergencyContactImpl) then,
  ) = __$$EmergencyContactImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String userId,
    String name,
    String email,
    String? phone,
    int priority,
    bool isVerified,
    bool phoneVerified,
    NotificationChannel preferredChannel,
    bool isActive,
    String? linkedUserId,
    String? linkedUserName,
    InvitationStatus invitationStatus,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$EmergencyContactImplCopyWithImpl<$Res>
    extends _$EmergencyContactCopyWithImpl<$Res, _$EmergencyContactImpl>
    implements _$$EmergencyContactImplCopyWith<$Res> {
  __$$EmergencyContactImplCopyWithImpl(
    _$EmergencyContactImpl _value,
    $Res Function(_$EmergencyContactImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of EmergencyContact
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? priority = null,
    Object? isVerified = null,
    Object? phoneVerified = null,
    Object? preferredChannel = null,
    Object? isActive = null,
    Object? linkedUserId = freezed,
    Object? linkedUserName = freezed,
    Object? invitationStatus = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$EmergencyContactImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        priority: null == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as int,
        isVerified: null == isVerified
            ? _value.isVerified
            : isVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        phoneVerified: null == phoneVerified
            ? _value.phoneVerified
            : phoneVerified // ignore: cast_nullable_to_non_nullable
                  as bool,
        preferredChannel: null == preferredChannel
            ? _value.preferredChannel
            : preferredChannel // ignore: cast_nullable_to_non_nullable
                  as NotificationChannel,
        isActive: null == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool,
        linkedUserId: freezed == linkedUserId
            ? _value.linkedUserId
            : linkedUserId // ignore: cast_nullable_to_non_nullable
                  as String?,
        linkedUserName: freezed == linkedUserName
            ? _value.linkedUserName
            : linkedUserName // ignore: cast_nullable_to_non_nullable
                  as String?,
        invitationStatus: null == invitationStatus
            ? _value.invitationStatus
            : invitationStatus // ignore: cast_nullable_to_non_nullable
                  as InvitationStatus,
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
class _$EmergencyContactImpl implements _EmergencyContact {
  const _$EmergencyContactImpl({
    required this.id,
    required this.userId,
    required this.name,
    required this.email,
    this.phone,
    required this.priority,
    required this.isVerified,
    required this.phoneVerified,
    required this.preferredChannel,
    required this.isActive,
    this.linkedUserId,
    this.linkedUserName,
    required this.invitationStatus,
    required this.createdAt,
    required this.updatedAt,
  });

  factory _$EmergencyContactImpl.fromJson(Map<String, dynamic> json) =>
      _$$EmergencyContactImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final String name;
  @override
  final String email;
  @override
  final String? phone;
  @override
  final int priority;
  @override
  final bool isVerified;
  @override
  final bool phoneVerified;
  @override
  final NotificationChannel preferredChannel;
  @override
  final bool isActive;
  @override
  final String? linkedUserId;
  @override
  final String? linkedUserName;
  @override
  final InvitationStatus invitationStatus;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'EmergencyContact(id: $id, userId: $userId, name: $name, email: $email, phone: $phone, priority: $priority, isVerified: $isVerified, phoneVerified: $phoneVerified, preferredChannel: $preferredChannel, isActive: $isActive, linkedUserId: $linkedUserId, linkedUserName: $linkedUserName, invitationStatus: $invitationStatus, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EmergencyContactImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.isVerified, isVerified) ||
                other.isVerified == isVerified) &&
            (identical(other.phoneVerified, phoneVerified) ||
                other.phoneVerified == phoneVerified) &&
            (identical(other.preferredChannel, preferredChannel) ||
                other.preferredChannel == preferredChannel) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.linkedUserId, linkedUserId) ||
                other.linkedUserId == linkedUserId) &&
            (identical(other.linkedUserName, linkedUserName) ||
                other.linkedUserName == linkedUserName) &&
            (identical(other.invitationStatus, invitationStatus) ||
                other.invitationStatus == invitationStatus) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.updatedAt, updatedAt) ||
                other.updatedAt == updatedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    userId,
    name,
    email,
    phone,
    priority,
    isVerified,
    phoneVerified,
    preferredChannel,
    isActive,
    linkedUserId,
    linkedUserName,
    invitationStatus,
    createdAt,
    updatedAt,
  );

  /// Create a copy of EmergencyContact
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$EmergencyContactImplCopyWith<_$EmergencyContactImpl> get copyWith =>
      __$$EmergencyContactImplCopyWithImpl<_$EmergencyContactImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$EmergencyContactImplToJson(this);
  }
}

abstract class _EmergencyContact implements EmergencyContact {
  const factory _EmergencyContact({
    required final String id,
    required final String userId,
    required final String name,
    required final String email,
    final String? phone,
    required final int priority,
    required final bool isVerified,
    required final bool phoneVerified,
    required final NotificationChannel preferredChannel,
    required final bool isActive,
    final String? linkedUserId,
    final String? linkedUserName,
    required final InvitationStatus invitationStatus,
    required final String createdAt,
    required final String updatedAt,
  }) = _$EmergencyContactImpl;

  factory _EmergencyContact.fromJson(Map<String, dynamic> json) =
      _$EmergencyContactImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  String get name;
  @override
  String get email;
  @override
  String? get phone;
  @override
  int get priority;
  @override
  bool get isVerified;
  @override
  bool get phoneVerified;
  @override
  NotificationChannel get preferredChannel;
  @override
  bool get isActive;
  @override
  String? get linkedUserId;
  @override
  String? get linkedUserName;
  @override
  InvitationStatus get invitationStatus;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of EmergencyContact
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$EmergencyContactImplCopyWith<_$EmergencyContactImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CreateContactRequest _$CreateContactRequestFromJson(Map<String, dynamic> json) {
  return _CreateContactRequest.fromJson(json);
}

/// @nodoc
mixin _$CreateContactRequest {
  String get name => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  int? get priority => throw _privateConstructorUsedError;
  NotificationChannel? get preferredChannel =>
      throw _privateConstructorUsedError;

  /// Serializes this CreateContactRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CreateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CreateContactRequestCopyWith<CreateContactRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CreateContactRequestCopyWith<$Res> {
  factory $CreateContactRequestCopyWith(
    CreateContactRequest value,
    $Res Function(CreateContactRequest) then,
  ) = _$CreateContactRequestCopyWithImpl<$Res, CreateContactRequest>;
  @useResult
  $Res call({
    String name,
    String email,
    String? phone,
    int? priority,
    NotificationChannel? preferredChannel,
  });
}

/// @nodoc
class _$CreateContactRequestCopyWithImpl<
  $Res,
  $Val extends CreateContactRequest
>
    implements $CreateContactRequestCopyWith<$Res> {
  _$CreateContactRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CreateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? priority = freezed,
    Object? preferredChannel = freezed,
  }) {
    return _then(
      _value.copyWith(
            name: null == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String,
            email: null == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            priority: freezed == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as int?,
            preferredChannel: freezed == preferredChannel
                ? _value.preferredChannel
                : preferredChannel // ignore: cast_nullable_to_non_nullable
                      as NotificationChannel?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$CreateContactRequestImplCopyWith<$Res>
    implements $CreateContactRequestCopyWith<$Res> {
  factory _$$CreateContactRequestImplCopyWith(
    _$CreateContactRequestImpl value,
    $Res Function(_$CreateContactRequestImpl) then,
  ) = __$$CreateContactRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String name,
    String email,
    String? phone,
    int? priority,
    NotificationChannel? preferredChannel,
  });
}

/// @nodoc
class __$$CreateContactRequestImplCopyWithImpl<$Res>
    extends _$CreateContactRequestCopyWithImpl<$Res, _$CreateContactRequestImpl>
    implements _$$CreateContactRequestImplCopyWith<$Res> {
  __$$CreateContactRequestImplCopyWithImpl(
    _$CreateContactRequestImpl _value,
    $Res Function(_$CreateContactRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of CreateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? email = null,
    Object? phone = freezed,
    Object? priority = freezed,
    Object? preferredChannel = freezed,
  }) {
    return _then(
      _$CreateContactRequestImpl(
        name: null == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String,
        email: null == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        priority: freezed == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as int?,
        preferredChannel: freezed == preferredChannel
            ? _value.preferredChannel
            : preferredChannel // ignore: cast_nullable_to_non_nullable
                  as NotificationChannel?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$CreateContactRequestImpl implements _CreateContactRequest {
  const _$CreateContactRequestImpl({
    required this.name,
    required this.email,
    this.phone,
    this.priority,
    this.preferredChannel,
  });

  factory _$CreateContactRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$CreateContactRequestImplFromJson(json);

  @override
  final String name;
  @override
  final String email;
  @override
  final String? phone;
  @override
  final int? priority;
  @override
  final NotificationChannel? preferredChannel;

  @override
  String toString() {
    return 'CreateContactRequest(name: $name, email: $email, phone: $phone, priority: $priority, preferredChannel: $preferredChannel)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CreateContactRequestImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.preferredChannel, preferredChannel) ||
                other.preferredChannel == preferredChannel));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, name, email, phone, priority, preferredChannel);

  /// Create a copy of CreateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CreateContactRequestImplCopyWith<_$CreateContactRequestImpl>
  get copyWith =>
      __$$CreateContactRequestImplCopyWithImpl<_$CreateContactRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$CreateContactRequestImplToJson(this);
  }
}

abstract class _CreateContactRequest implements CreateContactRequest {
  const factory _CreateContactRequest({
    required final String name,
    required final String email,
    final String? phone,
    final int? priority,
    final NotificationChannel? preferredChannel,
  }) = _$CreateContactRequestImpl;

  factory _CreateContactRequest.fromJson(Map<String, dynamic> json) =
      _$CreateContactRequestImpl.fromJson;

  @override
  String get name;
  @override
  String get email;
  @override
  String? get phone;
  @override
  int? get priority;
  @override
  NotificationChannel? get preferredChannel;

  /// Create a copy of CreateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CreateContactRequestImplCopyWith<_$CreateContactRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

UpdateContactRequest _$UpdateContactRequestFromJson(Map<String, dynamic> json) {
  return _UpdateContactRequest.fromJson(json);
}

/// @nodoc
mixin _$UpdateContactRequest {
  String? get name => throw _privateConstructorUsedError;
  String? get email => throw _privateConstructorUsedError;
  String? get phone => throw _privateConstructorUsedError;
  int? get priority => throw _privateConstructorUsedError;
  bool? get isActive => throw _privateConstructorUsedError;
  NotificationChannel? get preferredChannel =>
      throw _privateConstructorUsedError;

  /// Serializes this UpdateContactRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateContactRequestCopyWith<UpdateContactRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateContactRequestCopyWith<$Res> {
  factory $UpdateContactRequestCopyWith(
    UpdateContactRequest value,
    $Res Function(UpdateContactRequest) then,
  ) = _$UpdateContactRequestCopyWithImpl<$Res, UpdateContactRequest>;
  @useResult
  $Res call({
    String? name,
    String? email,
    String? phone,
    int? priority,
    bool? isActive,
    NotificationChannel? preferredChannel,
  });
}

/// @nodoc
class _$UpdateContactRequestCopyWithImpl<
  $Res,
  $Val extends UpdateContactRequest
>
    implements $UpdateContactRequestCopyWith<$Res> {
  _$UpdateContactRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = freezed,
    Object? email = freezed,
    Object? phone = freezed,
    Object? priority = freezed,
    Object? isActive = freezed,
    Object? preferredChannel = freezed,
  }) {
    return _then(
      _value.copyWith(
            name: freezed == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String?,
            email: freezed == email
                ? _value.email
                : email // ignore: cast_nullable_to_non_nullable
                      as String?,
            phone: freezed == phone
                ? _value.phone
                : phone // ignore: cast_nullable_to_non_nullable
                      as String?,
            priority: freezed == priority
                ? _value.priority
                : priority // ignore: cast_nullable_to_non_nullable
                      as int?,
            isActive: freezed == isActive
                ? _value.isActive
                : isActive // ignore: cast_nullable_to_non_nullable
                      as bool?,
            preferredChannel: freezed == preferredChannel
                ? _value.preferredChannel
                : preferredChannel // ignore: cast_nullable_to_non_nullable
                      as NotificationChannel?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UpdateContactRequestImplCopyWith<$Res>
    implements $UpdateContactRequestCopyWith<$Res> {
  factory _$$UpdateContactRequestImplCopyWith(
    _$UpdateContactRequestImpl value,
    $Res Function(_$UpdateContactRequestImpl) then,
  ) = __$$UpdateContactRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String? name,
    String? email,
    String? phone,
    int? priority,
    bool? isActive,
    NotificationChannel? preferredChannel,
  });
}

/// @nodoc
class __$$UpdateContactRequestImplCopyWithImpl<$Res>
    extends _$UpdateContactRequestCopyWithImpl<$Res, _$UpdateContactRequestImpl>
    implements _$$UpdateContactRequestImplCopyWith<$Res> {
  __$$UpdateContactRequestImplCopyWithImpl(
    _$UpdateContactRequestImpl _value,
    $Res Function(_$UpdateContactRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UpdateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = freezed,
    Object? email = freezed,
    Object? phone = freezed,
    Object? priority = freezed,
    Object? isActive = freezed,
    Object? preferredChannel = freezed,
  }) {
    return _then(
      _$UpdateContactRequestImpl(
        name: freezed == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String?,
        email: freezed == email
            ? _value.email
            : email // ignore: cast_nullable_to_non_nullable
                  as String?,
        phone: freezed == phone
            ? _value.phone
            : phone // ignore: cast_nullable_to_non_nullable
                  as String?,
        priority: freezed == priority
            ? _value.priority
            : priority // ignore: cast_nullable_to_non_nullable
                  as int?,
        isActive: freezed == isActive
            ? _value.isActive
            : isActive // ignore: cast_nullable_to_non_nullable
                  as bool?,
        preferredChannel: freezed == preferredChannel
            ? _value.preferredChannel
            : preferredChannel // ignore: cast_nullable_to_non_nullable
                  as NotificationChannel?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdateContactRequestImpl implements _UpdateContactRequest {
  const _$UpdateContactRequestImpl({
    this.name,
    this.email,
    this.phone,
    this.priority,
    this.isActive,
    this.preferredChannel,
  });

  factory _$UpdateContactRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$UpdateContactRequestImplFromJson(json);

  @override
  final String? name;
  @override
  final String? email;
  @override
  final String? phone;
  @override
  final int? priority;
  @override
  final bool? isActive;
  @override
  final NotificationChannel? preferredChannel;

  @override
  String toString() {
    return 'UpdateContactRequest(name: $name, email: $email, phone: $phone, priority: $priority, isActive: $isActive, preferredChannel: $preferredChannel)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateContactRequestImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.email, email) || other.email == email) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.priority, priority) ||
                other.priority == priority) &&
            (identical(other.isActive, isActive) ||
                other.isActive == isActive) &&
            (identical(other.preferredChannel, preferredChannel) ||
                other.preferredChannel == preferredChannel));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    name,
    email,
    phone,
    priority,
    isActive,
    preferredChannel,
  );

  /// Create a copy of UpdateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateContactRequestImplCopyWith<_$UpdateContactRequestImpl>
  get copyWith =>
      __$$UpdateContactRequestImplCopyWithImpl<_$UpdateContactRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateContactRequestImplToJson(this);
  }
}

abstract class _UpdateContactRequest implements UpdateContactRequest {
  const factory _UpdateContactRequest({
    final String? name,
    final String? email,
    final String? phone,
    final int? priority,
    final bool? isActive,
    final NotificationChannel? preferredChannel,
  }) = _$UpdateContactRequestImpl;

  factory _UpdateContactRequest.fromJson(Map<String, dynamic> json) =
      _$UpdateContactRequestImpl.fromJson;

  @override
  String? get name;
  @override
  String? get email;
  @override
  String? get phone;
  @override
  int? get priority;
  @override
  bool? get isActive;
  @override
  NotificationChannel? get preferredChannel;

  /// Create a copy of UpdateContactRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateContactRequestImplCopyWith<_$UpdateContactRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

ReorderContactsRequest _$ReorderContactsRequestFromJson(
  Map<String, dynamic> json,
) {
  return _ReorderContactsRequest.fromJson(json);
}

/// @nodoc
mixin _$ReorderContactsRequest {
  List<String> get contactIds => throw _privateConstructorUsedError;

  /// Serializes this ReorderContactsRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ReorderContactsRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ReorderContactsRequestCopyWith<ReorderContactsRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ReorderContactsRequestCopyWith<$Res> {
  factory $ReorderContactsRequestCopyWith(
    ReorderContactsRequest value,
    $Res Function(ReorderContactsRequest) then,
  ) = _$ReorderContactsRequestCopyWithImpl<$Res, ReorderContactsRequest>;
  @useResult
  $Res call({List<String> contactIds});
}

/// @nodoc
class _$ReorderContactsRequestCopyWithImpl<
  $Res,
  $Val extends ReorderContactsRequest
>
    implements $ReorderContactsRequestCopyWith<$Res> {
  _$ReorderContactsRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ReorderContactsRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? contactIds = null}) {
    return _then(
      _value.copyWith(
            contactIds: null == contactIds
                ? _value.contactIds
                : contactIds // ignore: cast_nullable_to_non_nullable
                      as List<String>,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ReorderContactsRequestImplCopyWith<$Res>
    implements $ReorderContactsRequestCopyWith<$Res> {
  factory _$$ReorderContactsRequestImplCopyWith(
    _$ReorderContactsRequestImpl value,
    $Res Function(_$ReorderContactsRequestImpl) then,
  ) = __$$ReorderContactsRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({List<String> contactIds});
}

/// @nodoc
class __$$ReorderContactsRequestImplCopyWithImpl<$Res>
    extends
        _$ReorderContactsRequestCopyWithImpl<$Res, _$ReorderContactsRequestImpl>
    implements _$$ReorderContactsRequestImplCopyWith<$Res> {
  __$$ReorderContactsRequestImplCopyWithImpl(
    _$ReorderContactsRequestImpl _value,
    $Res Function(_$ReorderContactsRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ReorderContactsRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? contactIds = null}) {
    return _then(
      _$ReorderContactsRequestImpl(
        contactIds: null == contactIds
            ? _value._contactIds
            : contactIds // ignore: cast_nullable_to_non_nullable
                  as List<String>,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ReorderContactsRequestImpl implements _ReorderContactsRequest {
  const _$ReorderContactsRequestImpl({required final List<String> contactIds})
    : _contactIds = contactIds;

  factory _$ReorderContactsRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$ReorderContactsRequestImplFromJson(json);

  final List<String> _contactIds;
  @override
  List<String> get contactIds {
    if (_contactIds is EqualUnmodifiableListView) return _contactIds;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_contactIds);
  }

  @override
  String toString() {
    return 'ReorderContactsRequest(contactIds: $contactIds)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ReorderContactsRequestImpl &&
            const DeepCollectionEquality().equals(
              other._contactIds,
              _contactIds,
            ));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(_contactIds),
  );

  /// Create a copy of ReorderContactsRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ReorderContactsRequestImplCopyWith<_$ReorderContactsRequestImpl>
  get copyWith =>
      __$$ReorderContactsRequestImplCopyWithImpl<_$ReorderContactsRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ReorderContactsRequestImplToJson(this);
  }
}

abstract class _ReorderContactsRequest implements ReorderContactsRequest {
  const factory _ReorderContactsRequest({
    required final List<String> contactIds,
  }) = _$ReorderContactsRequestImpl;

  factory _ReorderContactsRequest.fromJson(Map<String, dynamic> json) =
      _$ReorderContactsRequestImpl.fromJson;

  @override
  List<String> get contactIds;

  /// Create a copy of ReorderContactsRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ReorderContactsRequestImplCopyWith<_$ReorderContactsRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

LinkedContact _$LinkedContactFromJson(Map<String, dynamic> json) {
  return _LinkedContact.fromJson(json);
}

/// @nodoc
mixin _$LinkedContact {
  String get id => throw _privateConstructorUsedError;
  String get elderName => throw _privateConstructorUsedError;
  String get elderEmail => throw _privateConstructorUsedError;
  String get contactName => throw _privateConstructorUsedError;
  String get relationshipSince => throw _privateConstructorUsedError;
  bool get hasActiveAlerts => throw _privateConstructorUsedError;

  /// Serializes this LinkedContact to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of LinkedContact
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $LinkedContactCopyWith<LinkedContact> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $LinkedContactCopyWith<$Res> {
  factory $LinkedContactCopyWith(
    LinkedContact value,
    $Res Function(LinkedContact) then,
  ) = _$LinkedContactCopyWithImpl<$Res, LinkedContact>;
  @useResult
  $Res call({
    String id,
    String elderName,
    String elderEmail,
    String contactName,
    String relationshipSince,
    bool hasActiveAlerts,
  });
}

/// @nodoc
class _$LinkedContactCopyWithImpl<$Res, $Val extends LinkedContact>
    implements $LinkedContactCopyWith<$Res> {
  _$LinkedContactCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of LinkedContact
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? elderName = null,
    Object? elderEmail = null,
    Object? contactName = null,
    Object? relationshipSince = null,
    Object? hasActiveAlerts = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            elderName: null == elderName
                ? _value.elderName
                : elderName // ignore: cast_nullable_to_non_nullable
                      as String,
            elderEmail: null == elderEmail
                ? _value.elderEmail
                : elderEmail // ignore: cast_nullable_to_non_nullable
                      as String,
            contactName: null == contactName
                ? _value.contactName
                : contactName // ignore: cast_nullable_to_non_nullable
                      as String,
            relationshipSince: null == relationshipSince
                ? _value.relationshipSince
                : relationshipSince // ignore: cast_nullable_to_non_nullable
                      as String,
            hasActiveAlerts: null == hasActiveAlerts
                ? _value.hasActiveAlerts
                : hasActiveAlerts // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$LinkedContactImplCopyWith<$Res>
    implements $LinkedContactCopyWith<$Res> {
  factory _$$LinkedContactImplCopyWith(
    _$LinkedContactImpl value,
    $Res Function(_$LinkedContactImpl) then,
  ) = __$$LinkedContactImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String elderName,
    String elderEmail,
    String contactName,
    String relationshipSince,
    bool hasActiveAlerts,
  });
}

/// @nodoc
class __$$LinkedContactImplCopyWithImpl<$Res>
    extends _$LinkedContactCopyWithImpl<$Res, _$LinkedContactImpl>
    implements _$$LinkedContactImplCopyWith<$Res> {
  __$$LinkedContactImplCopyWithImpl(
    _$LinkedContactImpl _value,
    $Res Function(_$LinkedContactImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of LinkedContact
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? elderName = null,
    Object? elderEmail = null,
    Object? contactName = null,
    Object? relationshipSince = null,
    Object? hasActiveAlerts = null,
  }) {
    return _then(
      _$LinkedContactImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        elderName: null == elderName
            ? _value.elderName
            : elderName // ignore: cast_nullable_to_non_nullable
                  as String,
        elderEmail: null == elderEmail
            ? _value.elderEmail
            : elderEmail // ignore: cast_nullable_to_non_nullable
                  as String,
        contactName: null == contactName
            ? _value.contactName
            : contactName // ignore: cast_nullable_to_non_nullable
                  as String,
        relationshipSince: null == relationshipSince
            ? _value.relationshipSince
            : relationshipSince // ignore: cast_nullable_to_non_nullable
                  as String,
        hasActiveAlerts: null == hasActiveAlerts
            ? _value.hasActiveAlerts
            : hasActiveAlerts // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$LinkedContactImpl implements _LinkedContact {
  const _$LinkedContactImpl({
    required this.id,
    required this.elderName,
    required this.elderEmail,
    required this.contactName,
    required this.relationshipSince,
    required this.hasActiveAlerts,
  });

  factory _$LinkedContactImpl.fromJson(Map<String, dynamic> json) =>
      _$$LinkedContactImplFromJson(json);

  @override
  final String id;
  @override
  final String elderName;
  @override
  final String elderEmail;
  @override
  final String contactName;
  @override
  final String relationshipSince;
  @override
  final bool hasActiveAlerts;

  @override
  String toString() {
    return 'LinkedContact(id: $id, elderName: $elderName, elderEmail: $elderEmail, contactName: $contactName, relationshipSince: $relationshipSince, hasActiveAlerts: $hasActiveAlerts)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$LinkedContactImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.elderName, elderName) ||
                other.elderName == elderName) &&
            (identical(other.elderEmail, elderEmail) ||
                other.elderEmail == elderEmail) &&
            (identical(other.contactName, contactName) ||
                other.contactName == contactName) &&
            (identical(other.relationshipSince, relationshipSince) ||
                other.relationshipSince == relationshipSince) &&
            (identical(other.hasActiveAlerts, hasActiveAlerts) ||
                other.hasActiveAlerts == hasActiveAlerts));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    elderName,
    elderEmail,
    contactName,
    relationshipSince,
    hasActiveAlerts,
  );

  /// Create a copy of LinkedContact
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$LinkedContactImplCopyWith<_$LinkedContactImpl> get copyWith =>
      __$$LinkedContactImplCopyWithImpl<_$LinkedContactImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$LinkedContactImplToJson(this);
  }
}

abstract class _LinkedContact implements LinkedContact {
  const factory _LinkedContact({
    required final String id,
    required final String elderName,
    required final String elderEmail,
    required final String contactName,
    required final String relationshipSince,
    required final bool hasActiveAlerts,
  }) = _$LinkedContactImpl;

  factory _LinkedContact.fromJson(Map<String, dynamic> json) =
      _$LinkedContactImpl.fromJson;

  @override
  String get id;
  @override
  String get elderName;
  @override
  String get elderEmail;
  @override
  String get contactName;
  @override
  String get relationshipSince;
  @override
  bool get hasActiveAlerts;

  /// Create a copy of LinkedContact
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$LinkedContactImplCopyWith<_$LinkedContactImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

PendingContactInvitation _$PendingContactInvitationFromJson(
  Map<String, dynamic> json,
) {
  return _PendingContactInvitation.fromJson(json);
}

/// @nodoc
mixin _$PendingContactInvitation {
  String get id => throw _privateConstructorUsedError;
  String get elderName => throw _privateConstructorUsedError;
  String get elderEmail => throw _privateConstructorUsedError;
  String get contactName => throw _privateConstructorUsedError;
  String get invitedAt => throw _privateConstructorUsedError;

  /// Serializes this PendingContactInvitation to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of PendingContactInvitation
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $PendingContactInvitationCopyWith<PendingContactInvitation> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PendingContactInvitationCopyWith<$Res> {
  factory $PendingContactInvitationCopyWith(
    PendingContactInvitation value,
    $Res Function(PendingContactInvitation) then,
  ) = _$PendingContactInvitationCopyWithImpl<$Res, PendingContactInvitation>;
  @useResult
  $Res call({
    String id,
    String elderName,
    String elderEmail,
    String contactName,
    String invitedAt,
  });
}

/// @nodoc
class _$PendingContactInvitationCopyWithImpl<
  $Res,
  $Val extends PendingContactInvitation
>
    implements $PendingContactInvitationCopyWith<$Res> {
  _$PendingContactInvitationCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of PendingContactInvitation
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? elderName = null,
    Object? elderEmail = null,
    Object? contactName = null,
    Object? invitedAt = null,
  }) {
    return _then(
      _value.copyWith(
            id: null == id
                ? _value.id
                : id // ignore: cast_nullable_to_non_nullable
                      as String,
            elderName: null == elderName
                ? _value.elderName
                : elderName // ignore: cast_nullable_to_non_nullable
                      as String,
            elderEmail: null == elderEmail
                ? _value.elderEmail
                : elderEmail // ignore: cast_nullable_to_non_nullable
                      as String,
            contactName: null == contactName
                ? _value.contactName
                : contactName // ignore: cast_nullable_to_non_nullable
                      as String,
            invitedAt: null == invitedAt
                ? _value.invitedAt
                : invitedAt // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$PendingContactInvitationImplCopyWith<$Res>
    implements $PendingContactInvitationCopyWith<$Res> {
  factory _$$PendingContactInvitationImplCopyWith(
    _$PendingContactInvitationImpl value,
    $Res Function(_$PendingContactInvitationImpl) then,
  ) = __$$PendingContactInvitationImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String elderName,
    String elderEmail,
    String contactName,
    String invitedAt,
  });
}

/// @nodoc
class __$$PendingContactInvitationImplCopyWithImpl<$Res>
    extends
        _$PendingContactInvitationCopyWithImpl<
          $Res,
          _$PendingContactInvitationImpl
        >
    implements _$$PendingContactInvitationImplCopyWith<$Res> {
  __$$PendingContactInvitationImplCopyWithImpl(
    _$PendingContactInvitationImpl _value,
    $Res Function(_$PendingContactInvitationImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of PendingContactInvitation
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? elderName = null,
    Object? elderEmail = null,
    Object? contactName = null,
    Object? invitedAt = null,
  }) {
    return _then(
      _$PendingContactInvitationImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        elderName: null == elderName
            ? _value.elderName
            : elderName // ignore: cast_nullable_to_non_nullable
                  as String,
        elderEmail: null == elderEmail
            ? _value.elderEmail
            : elderEmail // ignore: cast_nullable_to_non_nullable
                  as String,
        contactName: null == contactName
            ? _value.contactName
            : contactName // ignore: cast_nullable_to_non_nullable
                  as String,
        invitedAt: null == invitedAt
            ? _value.invitedAt
            : invitedAt // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$PendingContactInvitationImpl implements _PendingContactInvitation {
  const _$PendingContactInvitationImpl({
    required this.id,
    required this.elderName,
    required this.elderEmail,
    required this.contactName,
    required this.invitedAt,
  });

  factory _$PendingContactInvitationImpl.fromJson(Map<String, dynamic> json) =>
      _$$PendingContactInvitationImplFromJson(json);

  @override
  final String id;
  @override
  final String elderName;
  @override
  final String elderEmail;
  @override
  final String contactName;
  @override
  final String invitedAt;

  @override
  String toString() {
    return 'PendingContactInvitation(id: $id, elderName: $elderName, elderEmail: $elderEmail, contactName: $contactName, invitedAt: $invitedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PendingContactInvitationImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.elderName, elderName) ||
                other.elderName == elderName) &&
            (identical(other.elderEmail, elderEmail) ||
                other.elderEmail == elderEmail) &&
            (identical(other.contactName, contactName) ||
                other.contactName == contactName) &&
            (identical(other.invitedAt, invitedAt) ||
                other.invitedAt == invitedAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    id,
    elderName,
    elderEmail,
    contactName,
    invitedAt,
  );

  /// Create a copy of PendingContactInvitation
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$PendingContactInvitationImplCopyWith<_$PendingContactInvitationImpl>
  get copyWith =>
      __$$PendingContactInvitationImplCopyWithImpl<
        _$PendingContactInvitationImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PendingContactInvitationImplToJson(this);
  }
}

abstract class _PendingContactInvitation implements PendingContactInvitation {
  const factory _PendingContactInvitation({
    required final String id,
    required final String elderName,
    required final String elderEmail,
    required final String contactName,
    required final String invitedAt,
  }) = _$PendingContactInvitationImpl;

  factory _PendingContactInvitation.fromJson(Map<String, dynamic> json) =
      _$PendingContactInvitationImpl.fromJson;

  @override
  String get id;
  @override
  String get elderName;
  @override
  String get elderEmail;
  @override
  String get contactName;
  @override
  String get invitedAt;

  /// Create a copy of PendingContactInvitation
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$PendingContactInvitationImplCopyWith<_$PendingContactInvitationImpl>
  get copyWith => throw _privateConstructorUsedError;
}

ContactLinkInvitationDetails _$ContactLinkInvitationDetailsFromJson(
  Map<String, dynamic> json,
) {
  return _ContactLinkInvitationDetails.fromJson(json);
}

/// @nodoc
mixin _$ContactLinkInvitationDetails {
  String get contactId => throw _privateConstructorUsedError;
  String get elderName => throw _privateConstructorUsedError;
  String get elderEmail => throw _privateConstructorUsedError;
  String get contactName => throw _privateConstructorUsedError;

  /// Serializes this ContactLinkInvitationDetails to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ContactLinkInvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ContactLinkInvitationDetailsCopyWith<ContactLinkInvitationDetails>
  get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ContactLinkInvitationDetailsCopyWith<$Res> {
  factory $ContactLinkInvitationDetailsCopyWith(
    ContactLinkInvitationDetails value,
    $Res Function(ContactLinkInvitationDetails) then,
  ) =
      _$ContactLinkInvitationDetailsCopyWithImpl<
        $Res,
        ContactLinkInvitationDetails
      >;
  @useResult
  $Res call({
    String contactId,
    String elderName,
    String elderEmail,
    String contactName,
  });
}

/// @nodoc
class _$ContactLinkInvitationDetailsCopyWithImpl<
  $Res,
  $Val extends ContactLinkInvitationDetails
>
    implements $ContactLinkInvitationDetailsCopyWith<$Res> {
  _$ContactLinkInvitationDetailsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ContactLinkInvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? contactId = null,
    Object? elderName = null,
    Object? elderEmail = null,
    Object? contactName = null,
  }) {
    return _then(
      _value.copyWith(
            contactId: null == contactId
                ? _value.contactId
                : contactId // ignore: cast_nullable_to_non_nullable
                      as String,
            elderName: null == elderName
                ? _value.elderName
                : elderName // ignore: cast_nullable_to_non_nullable
                      as String,
            elderEmail: null == elderEmail
                ? _value.elderEmail
                : elderEmail // ignore: cast_nullable_to_non_nullable
                      as String,
            contactName: null == contactName
                ? _value.contactName
                : contactName // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ContactLinkInvitationDetailsImplCopyWith<$Res>
    implements $ContactLinkInvitationDetailsCopyWith<$Res> {
  factory _$$ContactLinkInvitationDetailsImplCopyWith(
    _$ContactLinkInvitationDetailsImpl value,
    $Res Function(_$ContactLinkInvitationDetailsImpl) then,
  ) = __$$ContactLinkInvitationDetailsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String contactId,
    String elderName,
    String elderEmail,
    String contactName,
  });
}

/// @nodoc
class __$$ContactLinkInvitationDetailsImplCopyWithImpl<$Res>
    extends
        _$ContactLinkInvitationDetailsCopyWithImpl<
          $Res,
          _$ContactLinkInvitationDetailsImpl
        >
    implements _$$ContactLinkInvitationDetailsImplCopyWith<$Res> {
  __$$ContactLinkInvitationDetailsImplCopyWithImpl(
    _$ContactLinkInvitationDetailsImpl _value,
    $Res Function(_$ContactLinkInvitationDetailsImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ContactLinkInvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? contactId = null,
    Object? elderName = null,
    Object? elderEmail = null,
    Object? contactName = null,
  }) {
    return _then(
      _$ContactLinkInvitationDetailsImpl(
        contactId: null == contactId
            ? _value.contactId
            : contactId // ignore: cast_nullable_to_non_nullable
                  as String,
        elderName: null == elderName
            ? _value.elderName
            : elderName // ignore: cast_nullable_to_non_nullable
                  as String,
        elderEmail: null == elderEmail
            ? _value.elderEmail
            : elderEmail // ignore: cast_nullable_to_non_nullable
                  as String,
        contactName: null == contactName
            ? _value.contactName
            : contactName // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ContactLinkInvitationDetailsImpl
    implements _ContactLinkInvitationDetails {
  const _$ContactLinkInvitationDetailsImpl({
    required this.contactId,
    required this.elderName,
    required this.elderEmail,
    required this.contactName,
  });

  factory _$ContactLinkInvitationDetailsImpl.fromJson(
    Map<String, dynamic> json,
  ) => _$$ContactLinkInvitationDetailsImplFromJson(json);

  @override
  final String contactId;
  @override
  final String elderName;
  @override
  final String elderEmail;
  @override
  final String contactName;

  @override
  String toString() {
    return 'ContactLinkInvitationDetails(contactId: $contactId, elderName: $elderName, elderEmail: $elderEmail, contactName: $contactName)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ContactLinkInvitationDetailsImpl &&
            (identical(other.contactId, contactId) ||
                other.contactId == contactId) &&
            (identical(other.elderName, elderName) ||
                other.elderName == elderName) &&
            (identical(other.elderEmail, elderEmail) ||
                other.elderEmail == elderEmail) &&
            (identical(other.contactName, contactName) ||
                other.contactName == contactName));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, contactId, elderName, elderEmail, contactName);

  /// Create a copy of ContactLinkInvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ContactLinkInvitationDetailsImplCopyWith<
    _$ContactLinkInvitationDetailsImpl
  >
  get copyWith =>
      __$$ContactLinkInvitationDetailsImplCopyWithImpl<
        _$ContactLinkInvitationDetailsImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ContactLinkInvitationDetailsImplToJson(this);
  }
}

abstract class _ContactLinkInvitationDetails
    implements ContactLinkInvitationDetails {
  const factory _ContactLinkInvitationDetails({
    required final String contactId,
    required final String elderName,
    required final String elderEmail,
    required final String contactName,
  }) = _$ContactLinkInvitationDetailsImpl;

  factory _ContactLinkInvitationDetails.fromJson(Map<String, dynamic> json) =
      _$ContactLinkInvitationDetailsImpl.fromJson;

  @override
  String get contactId;
  @override
  String get elderName;
  @override
  String get elderEmail;
  @override
  String get contactName;

  /// Create a copy of ContactLinkInvitationDetails
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ContactLinkInvitationDetailsImplCopyWith<
    _$ContactLinkInvitationDetailsImpl
  >
  get copyWith => throw _privateConstructorUsedError;
}

AcceptContactLinkResult _$AcceptContactLinkResultFromJson(
  Map<String, dynamic> json,
) {
  return _AcceptContactLinkResult.fromJson(json);
}

/// @nodoc
mixin _$AcceptContactLinkResult {
  bool get success => throw _privateConstructorUsedError;
  String get elderName => throw _privateConstructorUsedError;

  /// Serializes this AcceptContactLinkResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of AcceptContactLinkResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $AcceptContactLinkResultCopyWith<AcceptContactLinkResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $AcceptContactLinkResultCopyWith<$Res> {
  factory $AcceptContactLinkResultCopyWith(
    AcceptContactLinkResult value,
    $Res Function(AcceptContactLinkResult) then,
  ) = _$AcceptContactLinkResultCopyWithImpl<$Res, AcceptContactLinkResult>;
  @useResult
  $Res call({bool success, String elderName});
}

/// @nodoc
class _$AcceptContactLinkResultCopyWithImpl<
  $Res,
  $Val extends AcceptContactLinkResult
>
    implements $AcceptContactLinkResultCopyWith<$Res> {
  _$AcceptContactLinkResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of AcceptContactLinkResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? success = null, Object? elderName = null}) {
    return _then(
      _value.copyWith(
            success: null == success
                ? _value.success
                : success // ignore: cast_nullable_to_non_nullable
                      as bool,
            elderName: null == elderName
                ? _value.elderName
                : elderName // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$AcceptContactLinkResultImplCopyWith<$Res>
    implements $AcceptContactLinkResultCopyWith<$Res> {
  factory _$$AcceptContactLinkResultImplCopyWith(
    _$AcceptContactLinkResultImpl value,
    $Res Function(_$AcceptContactLinkResultImpl) then,
  ) = __$$AcceptContactLinkResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({bool success, String elderName});
}

/// @nodoc
class __$$AcceptContactLinkResultImplCopyWithImpl<$Res>
    extends
        _$AcceptContactLinkResultCopyWithImpl<
          $Res,
          _$AcceptContactLinkResultImpl
        >
    implements _$$AcceptContactLinkResultImplCopyWith<$Res> {
  __$$AcceptContactLinkResultImplCopyWithImpl(
    _$AcceptContactLinkResultImpl _value,
    $Res Function(_$AcceptContactLinkResultImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of AcceptContactLinkResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? success = null, Object? elderName = null}) {
    return _then(
      _$AcceptContactLinkResultImpl(
        success: null == success
            ? _value.success
            : success // ignore: cast_nullable_to_non_nullable
                  as bool,
        elderName: null == elderName
            ? _value.elderName
            : elderName // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$AcceptContactLinkResultImpl implements _AcceptContactLinkResult {
  const _$AcceptContactLinkResultImpl({
    required this.success,
    required this.elderName,
  });

  factory _$AcceptContactLinkResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$AcceptContactLinkResultImplFromJson(json);

  @override
  final bool success;
  @override
  final String elderName;

  @override
  String toString() {
    return 'AcceptContactLinkResult(success: $success, elderName: $elderName)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$AcceptContactLinkResultImpl &&
            (identical(other.success, success) || other.success == success) &&
            (identical(other.elderName, elderName) ||
                other.elderName == elderName));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, success, elderName);

  /// Create a copy of AcceptContactLinkResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$AcceptContactLinkResultImplCopyWith<_$AcceptContactLinkResultImpl>
  get copyWith =>
      __$$AcceptContactLinkResultImplCopyWithImpl<
        _$AcceptContactLinkResultImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$AcceptContactLinkResultImplToJson(this);
  }
}

abstract class _AcceptContactLinkResult implements AcceptContactLinkResult {
  const factory _AcceptContactLinkResult({
    required final bool success,
    required final String elderName,
  }) = _$AcceptContactLinkResultImpl;

  factory _AcceptContactLinkResult.fromJson(Map<String, dynamic> json) =
      _$AcceptContactLinkResultImpl.fromJson;

  @override
  bool get success;
  @override
  String get elderName;

  /// Create a copy of AcceptContactLinkResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$AcceptContactLinkResultImplCopyWith<_$AcceptContactLinkResultImpl>
  get copyWith => throw _privateConstructorUsedError;
}

VerifyContactResult _$VerifyContactResultFromJson(Map<String, dynamic> json) {
  return _VerifyContactResult.fromJson(json);
}

/// @nodoc
mixin _$VerifyContactResult {
  bool get success => throw _privateConstructorUsedError;
  String get contactName => throw _privateConstructorUsedError;
  String get userName => throw _privateConstructorUsedError;

  /// Serializes this VerifyContactResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of VerifyContactResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $VerifyContactResultCopyWith<VerifyContactResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $VerifyContactResultCopyWith<$Res> {
  factory $VerifyContactResultCopyWith(
    VerifyContactResult value,
    $Res Function(VerifyContactResult) then,
  ) = _$VerifyContactResultCopyWithImpl<$Res, VerifyContactResult>;
  @useResult
  $Res call({bool success, String contactName, String userName});
}

/// @nodoc
class _$VerifyContactResultCopyWithImpl<$Res, $Val extends VerifyContactResult>
    implements $VerifyContactResultCopyWith<$Res> {
  _$VerifyContactResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of VerifyContactResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? contactName = null,
    Object? userName = null,
  }) {
    return _then(
      _value.copyWith(
            success: null == success
                ? _value.success
                : success // ignore: cast_nullable_to_non_nullable
                      as bool,
            contactName: null == contactName
                ? _value.contactName
                : contactName // ignore: cast_nullable_to_non_nullable
                      as String,
            userName: null == userName
                ? _value.userName
                : userName // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$VerifyContactResultImplCopyWith<$Res>
    implements $VerifyContactResultCopyWith<$Res> {
  factory _$$VerifyContactResultImplCopyWith(
    _$VerifyContactResultImpl value,
    $Res Function(_$VerifyContactResultImpl) then,
  ) = __$$VerifyContactResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({bool success, String contactName, String userName});
}

/// @nodoc
class __$$VerifyContactResultImplCopyWithImpl<$Res>
    extends _$VerifyContactResultCopyWithImpl<$Res, _$VerifyContactResultImpl>
    implements _$$VerifyContactResultImplCopyWith<$Res> {
  __$$VerifyContactResultImplCopyWithImpl(
    _$VerifyContactResultImpl _value,
    $Res Function(_$VerifyContactResultImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of VerifyContactResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? success = null,
    Object? contactName = null,
    Object? userName = null,
  }) {
    return _then(
      _$VerifyContactResultImpl(
        success: null == success
            ? _value.success
            : success // ignore: cast_nullable_to_non_nullable
                  as bool,
        contactName: null == contactName
            ? _value.contactName
            : contactName // ignore: cast_nullable_to_non_nullable
                  as String,
        userName: null == userName
            ? _value.userName
            : userName // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$VerifyContactResultImpl implements _VerifyContactResult {
  const _$VerifyContactResultImpl({
    required this.success,
    required this.contactName,
    required this.userName,
  });

  factory _$VerifyContactResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$VerifyContactResultImplFromJson(json);

  @override
  final bool success;
  @override
  final String contactName;
  @override
  final String userName;

  @override
  String toString() {
    return 'VerifyContactResult(success: $success, contactName: $contactName, userName: $userName)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$VerifyContactResultImpl &&
            (identical(other.success, success) || other.success == success) &&
            (identical(other.contactName, contactName) ||
                other.contactName == contactName) &&
            (identical(other.userName, userName) ||
                other.userName == userName));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, success, contactName, userName);

  /// Create a copy of VerifyContactResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$VerifyContactResultImplCopyWith<_$VerifyContactResultImpl> get copyWith =>
      __$$VerifyContactResultImplCopyWithImpl<_$VerifyContactResultImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$VerifyContactResultImplToJson(this);
  }
}

abstract class _VerifyContactResult implements VerifyContactResult {
  const factory _VerifyContactResult({
    required final bool success,
    required final String contactName,
    required final String userName,
  }) = _$VerifyContactResultImpl;

  factory _VerifyContactResult.fromJson(Map<String, dynamic> json) =
      _$VerifyContactResultImpl.fromJson;

  @override
  bool get success;
  @override
  String get contactName;
  @override
  String get userName;

  /// Create a copy of VerifyContactResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$VerifyContactResultImplCopyWith<_$VerifyContactResultImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

SendPhoneVerificationResult _$SendPhoneVerificationResultFromJson(
  Map<String, dynamic> json,
) {
  return _SendPhoneVerificationResult.fromJson(json);
}

/// @nodoc
mixin _$SendPhoneVerificationResult {
  String get message => throw _privateConstructorUsedError;
  String get expiresAt => throw _privateConstructorUsedError;

  /// Serializes this SendPhoneVerificationResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of SendPhoneVerificationResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $SendPhoneVerificationResultCopyWith<SendPhoneVerificationResult>
  get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $SendPhoneVerificationResultCopyWith<$Res> {
  factory $SendPhoneVerificationResultCopyWith(
    SendPhoneVerificationResult value,
    $Res Function(SendPhoneVerificationResult) then,
  ) =
      _$SendPhoneVerificationResultCopyWithImpl<
        $Res,
        SendPhoneVerificationResult
      >;
  @useResult
  $Res call({String message, String expiresAt});
}

/// @nodoc
class _$SendPhoneVerificationResultCopyWithImpl<
  $Res,
  $Val extends SendPhoneVerificationResult
>
    implements $SendPhoneVerificationResultCopyWith<$Res> {
  _$SendPhoneVerificationResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of SendPhoneVerificationResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? message = null, Object? expiresAt = null}) {
    return _then(
      _value.copyWith(
            message: null == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String,
            expiresAt: null == expiresAt
                ? _value.expiresAt
                : expiresAt // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$SendPhoneVerificationResultImplCopyWith<$Res>
    implements $SendPhoneVerificationResultCopyWith<$Res> {
  factory _$$SendPhoneVerificationResultImplCopyWith(
    _$SendPhoneVerificationResultImpl value,
    $Res Function(_$SendPhoneVerificationResultImpl) then,
  ) = __$$SendPhoneVerificationResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String message, String expiresAt});
}

/// @nodoc
class __$$SendPhoneVerificationResultImplCopyWithImpl<$Res>
    extends
        _$SendPhoneVerificationResultCopyWithImpl<
          $Res,
          _$SendPhoneVerificationResultImpl
        >
    implements _$$SendPhoneVerificationResultImplCopyWith<$Res> {
  __$$SendPhoneVerificationResultImplCopyWithImpl(
    _$SendPhoneVerificationResultImpl _value,
    $Res Function(_$SendPhoneVerificationResultImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of SendPhoneVerificationResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? message = null, Object? expiresAt = null}) {
    return _then(
      _$SendPhoneVerificationResultImpl(
        message: null == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String,
        expiresAt: null == expiresAt
            ? _value.expiresAt
            : expiresAt // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$SendPhoneVerificationResultImpl
    implements _SendPhoneVerificationResult {
  const _$SendPhoneVerificationResultImpl({
    required this.message,
    required this.expiresAt,
  });

  factory _$SendPhoneVerificationResultImpl.fromJson(
    Map<String, dynamic> json,
  ) => _$$SendPhoneVerificationResultImplFromJson(json);

  @override
  final String message;
  @override
  final String expiresAt;

  @override
  String toString() {
    return 'SendPhoneVerificationResult(message: $message, expiresAt: $expiresAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$SendPhoneVerificationResultImpl &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.expiresAt, expiresAt) ||
                other.expiresAt == expiresAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, message, expiresAt);

  /// Create a copy of SendPhoneVerificationResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$SendPhoneVerificationResultImplCopyWith<_$SendPhoneVerificationResultImpl>
  get copyWith =>
      __$$SendPhoneVerificationResultImplCopyWithImpl<
        _$SendPhoneVerificationResultImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$SendPhoneVerificationResultImplToJson(this);
  }
}

abstract class _SendPhoneVerificationResult
    implements SendPhoneVerificationResult {
  const factory _SendPhoneVerificationResult({
    required final String message,
    required final String expiresAt,
  }) = _$SendPhoneVerificationResultImpl;

  factory _SendPhoneVerificationResult.fromJson(Map<String, dynamic> json) =
      _$SendPhoneVerificationResultImpl.fromJson;

  @override
  String get message;
  @override
  String get expiresAt;

  /// Create a copy of SendPhoneVerificationResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$SendPhoneVerificationResultImplCopyWith<_$SendPhoneVerificationResultImpl>
  get copyWith => throw _privateConstructorUsedError;
}

VerifyPhoneRequest _$VerifyPhoneRequestFromJson(Map<String, dynamic> json) {
  return _VerifyPhoneRequest.fromJson(json);
}

/// @nodoc
mixin _$VerifyPhoneRequest {
  String get otp => throw _privateConstructorUsedError;

  /// Serializes this VerifyPhoneRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of VerifyPhoneRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $VerifyPhoneRequestCopyWith<VerifyPhoneRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $VerifyPhoneRequestCopyWith<$Res> {
  factory $VerifyPhoneRequestCopyWith(
    VerifyPhoneRequest value,
    $Res Function(VerifyPhoneRequest) then,
  ) = _$VerifyPhoneRequestCopyWithImpl<$Res, VerifyPhoneRequest>;
  @useResult
  $Res call({String otp});
}

/// @nodoc
class _$VerifyPhoneRequestCopyWithImpl<$Res, $Val extends VerifyPhoneRequest>
    implements $VerifyPhoneRequestCopyWith<$Res> {
  _$VerifyPhoneRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of VerifyPhoneRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? otp = null}) {
    return _then(
      _value.copyWith(
            otp: null == otp
                ? _value.otp
                : otp // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$VerifyPhoneRequestImplCopyWith<$Res>
    implements $VerifyPhoneRequestCopyWith<$Res> {
  factory _$$VerifyPhoneRequestImplCopyWith(
    _$VerifyPhoneRequestImpl value,
    $Res Function(_$VerifyPhoneRequestImpl) then,
  ) = __$$VerifyPhoneRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String otp});
}

/// @nodoc
class __$$VerifyPhoneRequestImplCopyWithImpl<$Res>
    extends _$VerifyPhoneRequestCopyWithImpl<$Res, _$VerifyPhoneRequestImpl>
    implements _$$VerifyPhoneRequestImplCopyWith<$Res> {
  __$$VerifyPhoneRequestImplCopyWithImpl(
    _$VerifyPhoneRequestImpl _value,
    $Res Function(_$VerifyPhoneRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of VerifyPhoneRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? otp = null}) {
    return _then(
      _$VerifyPhoneRequestImpl(
        otp: null == otp
            ? _value.otp
            : otp // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$VerifyPhoneRequestImpl implements _VerifyPhoneRequest {
  const _$VerifyPhoneRequestImpl({required this.otp});

  factory _$VerifyPhoneRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$VerifyPhoneRequestImplFromJson(json);

  @override
  final String otp;

  @override
  String toString() {
    return 'VerifyPhoneRequest(otp: $otp)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$VerifyPhoneRequestImpl &&
            (identical(other.otp, otp) || other.otp == otp));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, otp);

  /// Create a copy of VerifyPhoneRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$VerifyPhoneRequestImplCopyWith<_$VerifyPhoneRequestImpl> get copyWith =>
      __$$VerifyPhoneRequestImplCopyWithImpl<_$VerifyPhoneRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$VerifyPhoneRequestImplToJson(this);
  }
}

abstract class _VerifyPhoneRequest implements VerifyPhoneRequest {
  const factory _VerifyPhoneRequest({required final String otp}) =
      _$VerifyPhoneRequestImpl;

  factory _VerifyPhoneRequest.fromJson(Map<String, dynamic> json) =
      _$VerifyPhoneRequestImpl.fromJson;

  @override
  String get otp;

  /// Create a copy of VerifyPhoneRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$VerifyPhoneRequestImplCopyWith<_$VerifyPhoneRequestImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

VerifyPhoneResult _$VerifyPhoneResultFromJson(Map<String, dynamic> json) {
  return _VerifyPhoneResult.fromJson(json);
}

/// @nodoc
mixin _$VerifyPhoneResult {
  bool get success => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;

  /// Serializes this VerifyPhoneResult to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of VerifyPhoneResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $VerifyPhoneResultCopyWith<VerifyPhoneResult> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $VerifyPhoneResultCopyWith<$Res> {
  factory $VerifyPhoneResultCopyWith(
    VerifyPhoneResult value,
    $Res Function(VerifyPhoneResult) then,
  ) = _$VerifyPhoneResultCopyWithImpl<$Res, VerifyPhoneResult>;
  @useResult
  $Res call({bool success, String message});
}

/// @nodoc
class _$VerifyPhoneResultCopyWithImpl<$Res, $Val extends VerifyPhoneResult>
    implements $VerifyPhoneResultCopyWith<$Res> {
  _$VerifyPhoneResultCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of VerifyPhoneResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? success = null, Object? message = null}) {
    return _then(
      _value.copyWith(
            success: null == success
                ? _value.success
                : success // ignore: cast_nullable_to_non_nullable
                      as bool,
            message: null == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$VerifyPhoneResultImplCopyWith<$Res>
    implements $VerifyPhoneResultCopyWith<$Res> {
  factory _$$VerifyPhoneResultImplCopyWith(
    _$VerifyPhoneResultImpl value,
    $Res Function(_$VerifyPhoneResultImpl) then,
  ) = __$$VerifyPhoneResultImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({bool success, String message});
}

/// @nodoc
class __$$VerifyPhoneResultImplCopyWithImpl<$Res>
    extends _$VerifyPhoneResultCopyWithImpl<$Res, _$VerifyPhoneResultImpl>
    implements _$$VerifyPhoneResultImplCopyWith<$Res> {
  __$$VerifyPhoneResultImplCopyWithImpl(
    _$VerifyPhoneResultImpl _value,
    $Res Function(_$VerifyPhoneResultImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of VerifyPhoneResult
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? success = null, Object? message = null}) {
    return _then(
      _$VerifyPhoneResultImpl(
        success: null == success
            ? _value.success
            : success // ignore: cast_nullable_to_non_nullable
                  as bool,
        message: null == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$VerifyPhoneResultImpl implements _VerifyPhoneResult {
  const _$VerifyPhoneResultImpl({required this.success, required this.message});

  factory _$VerifyPhoneResultImpl.fromJson(Map<String, dynamic> json) =>
      _$$VerifyPhoneResultImplFromJson(json);

  @override
  final bool success;
  @override
  final String message;

  @override
  String toString() {
    return 'VerifyPhoneResult(success: $success, message: $message)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$VerifyPhoneResultImpl &&
            (identical(other.success, success) || other.success == success) &&
            (identical(other.message, message) || other.message == message));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, success, message);

  /// Create a copy of VerifyPhoneResult
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$VerifyPhoneResultImplCopyWith<_$VerifyPhoneResultImpl> get copyWith =>
      __$$VerifyPhoneResultImplCopyWithImpl<_$VerifyPhoneResultImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$VerifyPhoneResultImplToJson(this);
  }
}

abstract class _VerifyPhoneResult implements VerifyPhoneResult {
  const factory _VerifyPhoneResult({
    required final bool success,
    required final String message,
  }) = _$VerifyPhoneResultImpl;

  factory _VerifyPhoneResult.fromJson(Map<String, dynamic> json) =
      _$VerifyPhoneResultImpl.fromJson;

  @override
  bool get success;
  @override
  String get message;

  /// Create a copy of VerifyPhoneResult
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$VerifyPhoneResultImplCopyWith<_$VerifyPhoneResultImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
