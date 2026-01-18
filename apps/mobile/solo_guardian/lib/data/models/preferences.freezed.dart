// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'preferences.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

UserPreferences _$UserPreferencesFromJson(Map<String, dynamic> json) {
  return _UserPreferences.fromJson(json);
}

/// @nodoc
mixin _$UserPreferences {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  bool get preferFeaturesOn => throw _privateConstructorUsedError;
  ThemeType get theme => throw _privateConstructorUsedError;
  int get fontSize => throw _privateConstructorUsedError;
  bool get highContrast => throw _privateConstructorUsedError;
  bool get reducedMotion => throw _privateConstructorUsedError;
  bool get warmColors => throw _privateConstructorUsedError;
  bool get hobbyCheckIn => throw _privateConstructorUsedError;
  bool get familyAccess => throw _privateConstructorUsedError;
  Map<String, bool> get optionalFeatures => throw _privateConstructorUsedError;
  bool get onboardingCompleted => throw _privateConstructorUsedError;
  String get createdAt => throw _privateConstructorUsedError;
  String get updatedAt => throw _privateConstructorUsedError;

  /// Serializes this UserPreferences to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UserPreferences
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UserPreferencesCopyWith<UserPreferences> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UserPreferencesCopyWith<$Res> {
  factory $UserPreferencesCopyWith(
    UserPreferences value,
    $Res Function(UserPreferences) then,
  ) = _$UserPreferencesCopyWithImpl<$Res, UserPreferences>;
  @useResult
  $Res call({
    String id,
    String userId,
    bool preferFeaturesOn,
    ThemeType theme,
    int fontSize,
    bool highContrast,
    bool reducedMotion,
    bool warmColors,
    bool hobbyCheckIn,
    bool familyAccess,
    Map<String, bool> optionalFeatures,
    bool onboardingCompleted,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class _$UserPreferencesCopyWithImpl<$Res, $Val extends UserPreferences>
    implements $UserPreferencesCopyWith<$Res> {
  _$UserPreferencesCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UserPreferences
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? preferFeaturesOn = null,
    Object? theme = null,
    Object? fontSize = null,
    Object? highContrast = null,
    Object? reducedMotion = null,
    Object? warmColors = null,
    Object? hobbyCheckIn = null,
    Object? familyAccess = null,
    Object? optionalFeatures = null,
    Object? onboardingCompleted = null,
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
            preferFeaturesOn: null == preferFeaturesOn
                ? _value.preferFeaturesOn
                : preferFeaturesOn // ignore: cast_nullable_to_non_nullable
                      as bool,
            theme: null == theme
                ? _value.theme
                : theme // ignore: cast_nullable_to_non_nullable
                      as ThemeType,
            fontSize: null == fontSize
                ? _value.fontSize
                : fontSize // ignore: cast_nullable_to_non_nullable
                      as int,
            highContrast: null == highContrast
                ? _value.highContrast
                : highContrast // ignore: cast_nullable_to_non_nullable
                      as bool,
            reducedMotion: null == reducedMotion
                ? _value.reducedMotion
                : reducedMotion // ignore: cast_nullable_to_non_nullable
                      as bool,
            warmColors: null == warmColors
                ? _value.warmColors
                : warmColors // ignore: cast_nullable_to_non_nullable
                      as bool,
            hobbyCheckIn: null == hobbyCheckIn
                ? _value.hobbyCheckIn
                : hobbyCheckIn // ignore: cast_nullable_to_non_nullable
                      as bool,
            familyAccess: null == familyAccess
                ? _value.familyAccess
                : familyAccess // ignore: cast_nullable_to_non_nullable
                      as bool,
            optionalFeatures: null == optionalFeatures
                ? _value.optionalFeatures
                : optionalFeatures // ignore: cast_nullable_to_non_nullable
                      as Map<String, bool>,
            onboardingCompleted: null == onboardingCompleted
                ? _value.onboardingCompleted
                : onboardingCompleted // ignore: cast_nullable_to_non_nullable
                      as bool,
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
abstract class _$$UserPreferencesImplCopyWith<$Res>
    implements $UserPreferencesCopyWith<$Res> {
  factory _$$UserPreferencesImplCopyWith(
    _$UserPreferencesImpl value,
    $Res Function(_$UserPreferencesImpl) then,
  ) = __$$UserPreferencesImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String id,
    String userId,
    bool preferFeaturesOn,
    ThemeType theme,
    int fontSize,
    bool highContrast,
    bool reducedMotion,
    bool warmColors,
    bool hobbyCheckIn,
    bool familyAccess,
    Map<String, bool> optionalFeatures,
    bool onboardingCompleted,
    String createdAt,
    String updatedAt,
  });
}

/// @nodoc
class __$$UserPreferencesImplCopyWithImpl<$Res>
    extends _$UserPreferencesCopyWithImpl<$Res, _$UserPreferencesImpl>
    implements _$$UserPreferencesImplCopyWith<$Res> {
  __$$UserPreferencesImplCopyWithImpl(
    _$UserPreferencesImpl _value,
    $Res Function(_$UserPreferencesImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UserPreferences
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? preferFeaturesOn = null,
    Object? theme = null,
    Object? fontSize = null,
    Object? highContrast = null,
    Object? reducedMotion = null,
    Object? warmColors = null,
    Object? hobbyCheckIn = null,
    Object? familyAccess = null,
    Object? optionalFeatures = null,
    Object? onboardingCompleted = null,
    Object? createdAt = null,
    Object? updatedAt = null,
  }) {
    return _then(
      _$UserPreferencesImpl(
        id: null == id
            ? _value.id
            : id // ignore: cast_nullable_to_non_nullable
                  as String,
        userId: null == userId
            ? _value.userId
            : userId // ignore: cast_nullable_to_non_nullable
                  as String,
        preferFeaturesOn: null == preferFeaturesOn
            ? _value.preferFeaturesOn
            : preferFeaturesOn // ignore: cast_nullable_to_non_nullable
                  as bool,
        theme: null == theme
            ? _value.theme
            : theme // ignore: cast_nullable_to_non_nullable
                  as ThemeType,
        fontSize: null == fontSize
            ? _value.fontSize
            : fontSize // ignore: cast_nullable_to_non_nullable
                  as int,
        highContrast: null == highContrast
            ? _value.highContrast
            : highContrast // ignore: cast_nullable_to_non_nullable
                  as bool,
        reducedMotion: null == reducedMotion
            ? _value.reducedMotion
            : reducedMotion // ignore: cast_nullable_to_non_nullable
                  as bool,
        warmColors: null == warmColors
            ? _value.warmColors
            : warmColors // ignore: cast_nullable_to_non_nullable
                  as bool,
        hobbyCheckIn: null == hobbyCheckIn
            ? _value.hobbyCheckIn
            : hobbyCheckIn // ignore: cast_nullable_to_non_nullable
                  as bool,
        familyAccess: null == familyAccess
            ? _value.familyAccess
            : familyAccess // ignore: cast_nullable_to_non_nullable
                  as bool,
        optionalFeatures: null == optionalFeatures
            ? _value._optionalFeatures
            : optionalFeatures // ignore: cast_nullable_to_non_nullable
                  as Map<String, bool>,
        onboardingCompleted: null == onboardingCompleted
            ? _value.onboardingCompleted
            : onboardingCompleted // ignore: cast_nullable_to_non_nullable
                  as bool,
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
class _$UserPreferencesImpl implements _UserPreferences {
  const _$UserPreferencesImpl({
    required this.id,
    required this.userId,
    required this.preferFeaturesOn,
    required this.theme,
    required this.fontSize,
    required this.highContrast,
    required this.reducedMotion,
    required this.warmColors,
    required this.hobbyCheckIn,
    required this.familyAccess,
    required final Map<String, bool> optionalFeatures,
    required this.onboardingCompleted,
    required this.createdAt,
    required this.updatedAt,
  }) : _optionalFeatures = optionalFeatures;

  factory _$UserPreferencesImpl.fromJson(Map<String, dynamic> json) =>
      _$$UserPreferencesImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final bool preferFeaturesOn;
  @override
  final ThemeType theme;
  @override
  final int fontSize;
  @override
  final bool highContrast;
  @override
  final bool reducedMotion;
  @override
  final bool warmColors;
  @override
  final bool hobbyCheckIn;
  @override
  final bool familyAccess;
  final Map<String, bool> _optionalFeatures;
  @override
  Map<String, bool> get optionalFeatures {
    if (_optionalFeatures is EqualUnmodifiableMapView) return _optionalFeatures;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(_optionalFeatures);
  }

  @override
  final bool onboardingCompleted;
  @override
  final String createdAt;
  @override
  final String updatedAt;

  @override
  String toString() {
    return 'UserPreferences(id: $id, userId: $userId, preferFeaturesOn: $preferFeaturesOn, theme: $theme, fontSize: $fontSize, highContrast: $highContrast, reducedMotion: $reducedMotion, warmColors: $warmColors, hobbyCheckIn: $hobbyCheckIn, familyAccess: $familyAccess, optionalFeatures: $optionalFeatures, onboardingCompleted: $onboardingCompleted, createdAt: $createdAt, updatedAt: $updatedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UserPreferencesImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.preferFeaturesOn, preferFeaturesOn) ||
                other.preferFeaturesOn == preferFeaturesOn) &&
            (identical(other.theme, theme) || other.theme == theme) &&
            (identical(other.fontSize, fontSize) ||
                other.fontSize == fontSize) &&
            (identical(other.highContrast, highContrast) ||
                other.highContrast == highContrast) &&
            (identical(other.reducedMotion, reducedMotion) ||
                other.reducedMotion == reducedMotion) &&
            (identical(other.warmColors, warmColors) ||
                other.warmColors == warmColors) &&
            (identical(other.hobbyCheckIn, hobbyCheckIn) ||
                other.hobbyCheckIn == hobbyCheckIn) &&
            (identical(other.familyAccess, familyAccess) ||
                other.familyAccess == familyAccess) &&
            const DeepCollectionEquality().equals(
              other._optionalFeatures,
              _optionalFeatures,
            ) &&
            (identical(other.onboardingCompleted, onboardingCompleted) ||
                other.onboardingCompleted == onboardingCompleted) &&
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
    preferFeaturesOn,
    theme,
    fontSize,
    highContrast,
    reducedMotion,
    warmColors,
    hobbyCheckIn,
    familyAccess,
    const DeepCollectionEquality().hash(_optionalFeatures),
    onboardingCompleted,
    createdAt,
    updatedAt,
  );

  /// Create a copy of UserPreferences
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UserPreferencesImplCopyWith<_$UserPreferencesImpl> get copyWith =>
      __$$UserPreferencesImplCopyWithImpl<_$UserPreferencesImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$UserPreferencesImplToJson(this);
  }
}

abstract class _UserPreferences implements UserPreferences {
  const factory _UserPreferences({
    required final String id,
    required final String userId,
    required final bool preferFeaturesOn,
    required final ThemeType theme,
    required final int fontSize,
    required final bool highContrast,
    required final bool reducedMotion,
    required final bool warmColors,
    required final bool hobbyCheckIn,
    required final bool familyAccess,
    required final Map<String, bool> optionalFeatures,
    required final bool onboardingCompleted,
    required final String createdAt,
    required final String updatedAt,
  }) = _$UserPreferencesImpl;

  factory _UserPreferences.fromJson(Map<String, dynamic> json) =
      _$UserPreferencesImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  bool get preferFeaturesOn;
  @override
  ThemeType get theme;
  @override
  int get fontSize;
  @override
  bool get highContrast;
  @override
  bool get reducedMotion;
  @override
  bool get warmColors;
  @override
  bool get hobbyCheckIn;
  @override
  bool get familyAccess;
  @override
  Map<String, bool> get optionalFeatures;
  @override
  bool get onboardingCompleted;
  @override
  String get createdAt;
  @override
  String get updatedAt;

  /// Create a copy of UserPreferences
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UserPreferencesImplCopyWith<_$UserPreferencesImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

UpdatePreferencesRequest _$UpdatePreferencesRequestFromJson(
  Map<String, dynamic> json,
) {
  return _UpdatePreferencesRequest.fromJson(json);
}

/// @nodoc
mixin _$UpdatePreferencesRequest {
  bool? get preferFeaturesOn => throw _privateConstructorUsedError;
  ThemeType? get theme => throw _privateConstructorUsedError;
  int? get fontSize => throw _privateConstructorUsedError;
  bool? get highContrast => throw _privateConstructorUsedError;
  bool? get reducedMotion => throw _privateConstructorUsedError;
  bool? get warmColors => throw _privateConstructorUsedError;
  bool? get hobbyCheckIn => throw _privateConstructorUsedError;
  bool? get familyAccess => throw _privateConstructorUsedError;

  /// Serializes this UpdatePreferencesRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdatePreferencesRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdatePreferencesRequestCopyWith<UpdatePreferencesRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdatePreferencesRequestCopyWith<$Res> {
  factory $UpdatePreferencesRequestCopyWith(
    UpdatePreferencesRequest value,
    $Res Function(UpdatePreferencesRequest) then,
  ) = _$UpdatePreferencesRequestCopyWithImpl<$Res, UpdatePreferencesRequest>;
  @useResult
  $Res call({
    bool? preferFeaturesOn,
    ThemeType? theme,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
    bool? warmColors,
    bool? hobbyCheckIn,
    bool? familyAccess,
  });
}

/// @nodoc
class _$UpdatePreferencesRequestCopyWithImpl<
  $Res,
  $Val extends UpdatePreferencesRequest
>
    implements $UpdatePreferencesRequestCopyWith<$Res> {
  _$UpdatePreferencesRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdatePreferencesRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? preferFeaturesOn = freezed,
    Object? theme = freezed,
    Object? fontSize = freezed,
    Object? highContrast = freezed,
    Object? reducedMotion = freezed,
    Object? warmColors = freezed,
    Object? hobbyCheckIn = freezed,
    Object? familyAccess = freezed,
  }) {
    return _then(
      _value.copyWith(
            preferFeaturesOn: freezed == preferFeaturesOn
                ? _value.preferFeaturesOn
                : preferFeaturesOn // ignore: cast_nullable_to_non_nullable
                      as bool?,
            theme: freezed == theme
                ? _value.theme
                : theme // ignore: cast_nullable_to_non_nullable
                      as ThemeType?,
            fontSize: freezed == fontSize
                ? _value.fontSize
                : fontSize // ignore: cast_nullable_to_non_nullable
                      as int?,
            highContrast: freezed == highContrast
                ? _value.highContrast
                : highContrast // ignore: cast_nullable_to_non_nullable
                      as bool?,
            reducedMotion: freezed == reducedMotion
                ? _value.reducedMotion
                : reducedMotion // ignore: cast_nullable_to_non_nullable
                      as bool?,
            warmColors: freezed == warmColors
                ? _value.warmColors
                : warmColors // ignore: cast_nullable_to_non_nullable
                      as bool?,
            hobbyCheckIn: freezed == hobbyCheckIn
                ? _value.hobbyCheckIn
                : hobbyCheckIn // ignore: cast_nullable_to_non_nullable
                      as bool?,
            familyAccess: freezed == familyAccess
                ? _value.familyAccess
                : familyAccess // ignore: cast_nullable_to_non_nullable
                      as bool?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UpdatePreferencesRequestImplCopyWith<$Res>
    implements $UpdatePreferencesRequestCopyWith<$Res> {
  factory _$$UpdatePreferencesRequestImplCopyWith(
    _$UpdatePreferencesRequestImpl value,
    $Res Function(_$UpdatePreferencesRequestImpl) then,
  ) = __$$UpdatePreferencesRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    bool? preferFeaturesOn,
    ThemeType? theme,
    int? fontSize,
    bool? highContrast,
    bool? reducedMotion,
    bool? warmColors,
    bool? hobbyCheckIn,
    bool? familyAccess,
  });
}

/// @nodoc
class __$$UpdatePreferencesRequestImplCopyWithImpl<$Res>
    extends
        _$UpdatePreferencesRequestCopyWithImpl<
          $Res,
          _$UpdatePreferencesRequestImpl
        >
    implements _$$UpdatePreferencesRequestImplCopyWith<$Res> {
  __$$UpdatePreferencesRequestImplCopyWithImpl(
    _$UpdatePreferencesRequestImpl _value,
    $Res Function(_$UpdatePreferencesRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UpdatePreferencesRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? preferFeaturesOn = freezed,
    Object? theme = freezed,
    Object? fontSize = freezed,
    Object? highContrast = freezed,
    Object? reducedMotion = freezed,
    Object? warmColors = freezed,
    Object? hobbyCheckIn = freezed,
    Object? familyAccess = freezed,
  }) {
    return _then(
      _$UpdatePreferencesRequestImpl(
        preferFeaturesOn: freezed == preferFeaturesOn
            ? _value.preferFeaturesOn
            : preferFeaturesOn // ignore: cast_nullable_to_non_nullable
                  as bool?,
        theme: freezed == theme
            ? _value.theme
            : theme // ignore: cast_nullable_to_non_nullable
                  as ThemeType?,
        fontSize: freezed == fontSize
            ? _value.fontSize
            : fontSize // ignore: cast_nullable_to_non_nullable
                  as int?,
        highContrast: freezed == highContrast
            ? _value.highContrast
            : highContrast // ignore: cast_nullable_to_non_nullable
                  as bool?,
        reducedMotion: freezed == reducedMotion
            ? _value.reducedMotion
            : reducedMotion // ignore: cast_nullable_to_non_nullable
                  as bool?,
        warmColors: freezed == warmColors
            ? _value.warmColors
            : warmColors // ignore: cast_nullable_to_non_nullable
                  as bool?,
        hobbyCheckIn: freezed == hobbyCheckIn
            ? _value.hobbyCheckIn
            : hobbyCheckIn // ignore: cast_nullable_to_non_nullable
                  as bool?,
        familyAccess: freezed == familyAccess
            ? _value.familyAccess
            : familyAccess // ignore: cast_nullable_to_non_nullable
                  as bool?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdatePreferencesRequestImpl implements _UpdatePreferencesRequest {
  const _$UpdatePreferencesRequestImpl({
    this.preferFeaturesOn,
    this.theme,
    this.fontSize,
    this.highContrast,
    this.reducedMotion,
    this.warmColors,
    this.hobbyCheckIn,
    this.familyAccess,
  });

  factory _$UpdatePreferencesRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$UpdatePreferencesRequestImplFromJson(json);

  @override
  final bool? preferFeaturesOn;
  @override
  final ThemeType? theme;
  @override
  final int? fontSize;
  @override
  final bool? highContrast;
  @override
  final bool? reducedMotion;
  @override
  final bool? warmColors;
  @override
  final bool? hobbyCheckIn;
  @override
  final bool? familyAccess;

  @override
  String toString() {
    return 'UpdatePreferencesRequest(preferFeaturesOn: $preferFeaturesOn, theme: $theme, fontSize: $fontSize, highContrast: $highContrast, reducedMotion: $reducedMotion, warmColors: $warmColors, hobbyCheckIn: $hobbyCheckIn, familyAccess: $familyAccess)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdatePreferencesRequestImpl &&
            (identical(other.preferFeaturesOn, preferFeaturesOn) ||
                other.preferFeaturesOn == preferFeaturesOn) &&
            (identical(other.theme, theme) || other.theme == theme) &&
            (identical(other.fontSize, fontSize) ||
                other.fontSize == fontSize) &&
            (identical(other.highContrast, highContrast) ||
                other.highContrast == highContrast) &&
            (identical(other.reducedMotion, reducedMotion) ||
                other.reducedMotion == reducedMotion) &&
            (identical(other.warmColors, warmColors) ||
                other.warmColors == warmColors) &&
            (identical(other.hobbyCheckIn, hobbyCheckIn) ||
                other.hobbyCheckIn == hobbyCheckIn) &&
            (identical(other.familyAccess, familyAccess) ||
                other.familyAccess == familyAccess));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    preferFeaturesOn,
    theme,
    fontSize,
    highContrast,
    reducedMotion,
    warmColors,
    hobbyCheckIn,
    familyAccess,
  );

  /// Create a copy of UpdatePreferencesRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdatePreferencesRequestImplCopyWith<_$UpdatePreferencesRequestImpl>
  get copyWith =>
      __$$UpdatePreferencesRequestImplCopyWithImpl<
        _$UpdatePreferencesRequestImpl
      >(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdatePreferencesRequestImplToJson(this);
  }
}

abstract class _UpdatePreferencesRequest implements UpdatePreferencesRequest {
  const factory _UpdatePreferencesRequest({
    final bool? preferFeaturesOn,
    final ThemeType? theme,
    final int? fontSize,
    final bool? highContrast,
    final bool? reducedMotion,
    final bool? warmColors,
    final bool? hobbyCheckIn,
    final bool? familyAccess,
  }) = _$UpdatePreferencesRequestImpl;

  factory _UpdatePreferencesRequest.fromJson(Map<String, dynamic> json) =
      _$UpdatePreferencesRequestImpl.fromJson;

  @override
  bool? get preferFeaturesOn;
  @override
  ThemeType? get theme;
  @override
  int? get fontSize;
  @override
  bool? get highContrast;
  @override
  bool? get reducedMotion;
  @override
  bool? get warmColors;
  @override
  bool? get hobbyCheckIn;
  @override
  bool? get familyAccess;

  /// Create a copy of UpdatePreferencesRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdatePreferencesRequestImplCopyWith<_$UpdatePreferencesRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

UpdateProfileRequest _$UpdateProfileRequestFromJson(Map<String, dynamic> json) {
  return _UpdateProfileRequest.fromJson(json);
}

/// @nodoc
mixin _$UpdateProfileRequest {
  String? get name => throw _privateConstructorUsedError;
  int? get birthYear => throw _privateConstructorUsedError;

  /// Serializes this UpdateProfileRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of UpdateProfileRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $UpdateProfileRequestCopyWith<UpdateProfileRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $UpdateProfileRequestCopyWith<$Res> {
  factory $UpdateProfileRequestCopyWith(
    UpdateProfileRequest value,
    $Res Function(UpdateProfileRequest) then,
  ) = _$UpdateProfileRequestCopyWithImpl<$Res, UpdateProfileRequest>;
  @useResult
  $Res call({String? name, int? birthYear});
}

/// @nodoc
class _$UpdateProfileRequestCopyWithImpl<
  $Res,
  $Val extends UpdateProfileRequest
>
    implements $UpdateProfileRequestCopyWith<$Res> {
  _$UpdateProfileRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of UpdateProfileRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? name = freezed, Object? birthYear = freezed}) {
    return _then(
      _value.copyWith(
            name: freezed == name
                ? _value.name
                : name // ignore: cast_nullable_to_non_nullable
                      as String?,
            birthYear: freezed == birthYear
                ? _value.birthYear
                : birthYear // ignore: cast_nullable_to_non_nullable
                      as int?,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$UpdateProfileRequestImplCopyWith<$Res>
    implements $UpdateProfileRequestCopyWith<$Res> {
  factory _$$UpdateProfileRequestImplCopyWith(
    _$UpdateProfileRequestImpl value,
    $Res Function(_$UpdateProfileRequestImpl) then,
  ) = __$$UpdateProfileRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String? name, int? birthYear});
}

/// @nodoc
class __$$UpdateProfileRequestImplCopyWithImpl<$Res>
    extends _$UpdateProfileRequestCopyWithImpl<$Res, _$UpdateProfileRequestImpl>
    implements _$$UpdateProfileRequestImplCopyWith<$Res> {
  __$$UpdateProfileRequestImplCopyWithImpl(
    _$UpdateProfileRequestImpl _value,
    $Res Function(_$UpdateProfileRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of UpdateProfileRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? name = freezed, Object? birthYear = freezed}) {
    return _then(
      _$UpdateProfileRequestImpl(
        name: freezed == name
            ? _value.name
            : name // ignore: cast_nullable_to_non_nullable
                  as String?,
        birthYear: freezed == birthYear
            ? _value.birthYear
            : birthYear // ignore: cast_nullable_to_non_nullable
                  as int?,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$UpdateProfileRequestImpl implements _UpdateProfileRequest {
  const _$UpdateProfileRequestImpl({this.name, this.birthYear});

  factory _$UpdateProfileRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$UpdateProfileRequestImplFromJson(json);

  @override
  final String? name;
  @override
  final int? birthYear;

  @override
  String toString() {
    return 'UpdateProfileRequest(name: $name, birthYear: $birthYear)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$UpdateProfileRequestImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.birthYear, birthYear) ||
                other.birthYear == birthYear));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, name, birthYear);

  /// Create a copy of UpdateProfileRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$UpdateProfileRequestImplCopyWith<_$UpdateProfileRequestImpl>
  get copyWith =>
      __$$UpdateProfileRequestImplCopyWithImpl<_$UpdateProfileRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$UpdateProfileRequestImplToJson(this);
  }
}

abstract class _UpdateProfileRequest implements UpdateProfileRequest {
  const factory _UpdateProfileRequest({
    final String? name,
    final int? birthYear,
  }) = _$UpdateProfileRequestImpl;

  factory _UpdateProfileRequest.fromJson(Map<String, dynamic> json) =
      _$UpdateProfileRequestImpl.fromJson;

  @override
  String? get name;
  @override
  int? get birthYear;

  /// Create a copy of UpdateProfileRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$UpdateProfileRequestImplCopyWith<_$UpdateProfileRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}

ToggleFeatureRequest _$ToggleFeatureRequestFromJson(Map<String, dynamic> json) {
  return _ToggleFeatureRequest.fromJson(json);
}

/// @nodoc
mixin _$ToggleFeatureRequest {
  bool get enabled => throw _privateConstructorUsedError;

  /// Serializes this ToggleFeatureRequest to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ToggleFeatureRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ToggleFeatureRequestCopyWith<ToggleFeatureRequest> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ToggleFeatureRequestCopyWith<$Res> {
  factory $ToggleFeatureRequestCopyWith(
    ToggleFeatureRequest value,
    $Res Function(ToggleFeatureRequest) then,
  ) = _$ToggleFeatureRequestCopyWithImpl<$Res, ToggleFeatureRequest>;
  @useResult
  $Res call({bool enabled});
}

/// @nodoc
class _$ToggleFeatureRequestCopyWithImpl<
  $Res,
  $Val extends ToggleFeatureRequest
>
    implements $ToggleFeatureRequestCopyWith<$Res> {
  _$ToggleFeatureRequestCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ToggleFeatureRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? enabled = null}) {
    return _then(
      _value.copyWith(
            enabled: null == enabled
                ? _value.enabled
                : enabled // ignore: cast_nullable_to_non_nullable
                      as bool,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ToggleFeatureRequestImplCopyWith<$Res>
    implements $ToggleFeatureRequestCopyWith<$Res> {
  factory _$$ToggleFeatureRequestImplCopyWith(
    _$ToggleFeatureRequestImpl value,
    $Res Function(_$ToggleFeatureRequestImpl) then,
  ) = __$$ToggleFeatureRequestImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({bool enabled});
}

/// @nodoc
class __$$ToggleFeatureRequestImplCopyWithImpl<$Res>
    extends _$ToggleFeatureRequestCopyWithImpl<$Res, _$ToggleFeatureRequestImpl>
    implements _$$ToggleFeatureRequestImplCopyWith<$Res> {
  __$$ToggleFeatureRequestImplCopyWithImpl(
    _$ToggleFeatureRequestImpl _value,
    $Res Function(_$ToggleFeatureRequestImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ToggleFeatureRequest
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? enabled = null}) {
    return _then(
      _$ToggleFeatureRequestImpl(
        enabled: null == enabled
            ? _value.enabled
            : enabled // ignore: cast_nullable_to_non_nullable
                  as bool,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ToggleFeatureRequestImpl implements _ToggleFeatureRequest {
  const _$ToggleFeatureRequestImpl({required this.enabled});

  factory _$ToggleFeatureRequestImpl.fromJson(Map<String, dynamic> json) =>
      _$$ToggleFeatureRequestImplFromJson(json);

  @override
  final bool enabled;

  @override
  String toString() {
    return 'ToggleFeatureRequest(enabled: $enabled)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ToggleFeatureRequestImpl &&
            (identical(other.enabled, enabled) || other.enabled == enabled));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(runtimeType, enabled);

  /// Create a copy of ToggleFeatureRequest
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ToggleFeatureRequestImplCopyWith<_$ToggleFeatureRequestImpl>
  get copyWith =>
      __$$ToggleFeatureRequestImplCopyWithImpl<_$ToggleFeatureRequestImpl>(
        this,
        _$identity,
      );

  @override
  Map<String, dynamic> toJson() {
    return _$$ToggleFeatureRequestImplToJson(this);
  }
}

abstract class _ToggleFeatureRequest implements ToggleFeatureRequest {
  const factory _ToggleFeatureRequest({required final bool enabled}) =
      _$ToggleFeatureRequestImpl;

  factory _ToggleFeatureRequest.fromJson(Map<String, dynamic> json) =
      _$ToggleFeatureRequestImpl.fromJson;

  @override
  bool get enabled;

  /// Create a copy of ToggleFeatureRequest
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ToggleFeatureRequestImplCopyWith<_$ToggleFeatureRequestImpl>
  get copyWith => throw _privateConstructorUsedError;
}
