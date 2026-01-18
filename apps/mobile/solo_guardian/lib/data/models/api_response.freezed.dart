// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'api_response.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
  'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models',
);

ApiError _$ApiErrorFromJson(Map<String, dynamic> json) {
  return _ApiError.fromJson(json);
}

/// @nodoc
mixin _$ApiError {
  String get code => throw _privateConstructorUsedError;
  String get category => throw _privateConstructorUsedError;
  String get message => throw _privateConstructorUsedError;
  String get i18nKey => throw _privateConstructorUsedError;
  Map<String, dynamic>? get details => throw _privateConstructorUsedError;
  String? get field => throw _privateConstructorUsedError;
  String get timestamp => throw _privateConstructorUsedError;

  /// Serializes this ApiError to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ApiError
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ApiErrorCopyWith<ApiError> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ApiErrorCopyWith<$Res> {
  factory $ApiErrorCopyWith(ApiError value, $Res Function(ApiError) then) =
      _$ApiErrorCopyWithImpl<$Res, ApiError>;
  @useResult
  $Res call({
    String code,
    String category,
    String message,
    String i18nKey,
    Map<String, dynamic>? details,
    String? field,
    String timestamp,
  });
}

/// @nodoc
class _$ApiErrorCopyWithImpl<$Res, $Val extends ApiError>
    implements $ApiErrorCopyWith<$Res> {
  _$ApiErrorCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ApiError
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? code = null,
    Object? category = null,
    Object? message = null,
    Object? i18nKey = null,
    Object? details = freezed,
    Object? field = freezed,
    Object? timestamp = null,
  }) {
    return _then(
      _value.copyWith(
            code: null == code
                ? _value.code
                : code // ignore: cast_nullable_to_non_nullable
                      as String,
            category: null == category
                ? _value.category
                : category // ignore: cast_nullable_to_non_nullable
                      as String,
            message: null == message
                ? _value.message
                : message // ignore: cast_nullable_to_non_nullable
                      as String,
            i18nKey: null == i18nKey
                ? _value.i18nKey
                : i18nKey // ignore: cast_nullable_to_non_nullable
                      as String,
            details: freezed == details
                ? _value.details
                : details // ignore: cast_nullable_to_non_nullable
                      as Map<String, dynamic>?,
            field: freezed == field
                ? _value.field
                : field // ignore: cast_nullable_to_non_nullable
                      as String?,
            timestamp: null == timestamp
                ? _value.timestamp
                : timestamp // ignore: cast_nullable_to_non_nullable
                      as String,
          )
          as $Val,
    );
  }
}

/// @nodoc
abstract class _$$ApiErrorImplCopyWith<$Res>
    implements $ApiErrorCopyWith<$Res> {
  factory _$$ApiErrorImplCopyWith(
    _$ApiErrorImpl value,
    $Res Function(_$ApiErrorImpl) then,
  ) = __$$ApiErrorImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({
    String code,
    String category,
    String message,
    String i18nKey,
    Map<String, dynamic>? details,
    String? field,
    String timestamp,
  });
}

/// @nodoc
class __$$ApiErrorImplCopyWithImpl<$Res>
    extends _$ApiErrorCopyWithImpl<$Res, _$ApiErrorImpl>
    implements _$$ApiErrorImplCopyWith<$Res> {
  __$$ApiErrorImplCopyWithImpl(
    _$ApiErrorImpl _value,
    $Res Function(_$ApiErrorImpl) _then,
  ) : super(_value, _then);

  /// Create a copy of ApiError
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? code = null,
    Object? category = null,
    Object? message = null,
    Object? i18nKey = null,
    Object? details = freezed,
    Object? field = freezed,
    Object? timestamp = null,
  }) {
    return _then(
      _$ApiErrorImpl(
        code: null == code
            ? _value.code
            : code // ignore: cast_nullable_to_non_nullable
                  as String,
        category: null == category
            ? _value.category
            : category // ignore: cast_nullable_to_non_nullable
                  as String,
        message: null == message
            ? _value.message
            : message // ignore: cast_nullable_to_non_nullable
                  as String,
        i18nKey: null == i18nKey
            ? _value.i18nKey
            : i18nKey // ignore: cast_nullable_to_non_nullable
                  as String,
        details: freezed == details
            ? _value._details
            : details // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
        field: freezed == field
            ? _value.field
            : field // ignore: cast_nullable_to_non_nullable
                  as String?,
        timestamp: null == timestamp
            ? _value.timestamp
            : timestamp // ignore: cast_nullable_to_non_nullable
                  as String,
      ),
    );
  }
}

/// @nodoc
@JsonSerializable()
class _$ApiErrorImpl implements _ApiError {
  const _$ApiErrorImpl({
    required this.code,
    required this.category,
    required this.message,
    required this.i18nKey,
    final Map<String, dynamic>? details,
    this.field,
    required this.timestamp,
  }) : _details = details;

  factory _$ApiErrorImpl.fromJson(Map<String, dynamic> json) =>
      _$$ApiErrorImplFromJson(json);

  @override
  final String code;
  @override
  final String category;
  @override
  final String message;
  @override
  final String i18nKey;
  final Map<String, dynamic>? _details;
  @override
  Map<String, dynamic>? get details {
    final value = _details;
    if (value == null) return null;
    if (_details is EqualUnmodifiableMapView) return _details;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  final String? field;
  @override
  final String timestamp;

  @override
  String toString() {
    return 'ApiError(code: $code, category: $category, message: $message, i18nKey: $i18nKey, details: $details, field: $field, timestamp: $timestamp)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ApiErrorImpl &&
            (identical(other.code, code) || other.code == code) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.message, message) || other.message == message) &&
            (identical(other.i18nKey, i18nKey) || other.i18nKey == i18nKey) &&
            const DeepCollectionEquality().equals(other._details, _details) &&
            (identical(other.field, field) || other.field == field) &&
            (identical(other.timestamp, timestamp) ||
                other.timestamp == timestamp));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
    runtimeType,
    code,
    category,
    message,
    i18nKey,
    const DeepCollectionEquality().hash(_details),
    field,
    timestamp,
  );

  /// Create a copy of ApiError
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ApiErrorImplCopyWith<_$ApiErrorImpl> get copyWith =>
      __$$ApiErrorImplCopyWithImpl<_$ApiErrorImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ApiErrorImplToJson(this);
  }
}

abstract class _ApiError implements ApiError {
  const factory _ApiError({
    required final String code,
    required final String category,
    required final String message,
    required final String i18nKey,
    final Map<String, dynamic>? details,
    final String? field,
    required final String timestamp,
  }) = _$ApiErrorImpl;

  factory _ApiError.fromJson(Map<String, dynamic> json) =
      _$ApiErrorImpl.fromJson;

  @override
  String get code;
  @override
  String get category;
  @override
  String get message;
  @override
  String get i18nKey;
  @override
  Map<String, dynamic>? get details;
  @override
  String? get field;
  @override
  String get timestamp;

  /// Create a copy of ApiError
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ApiErrorImplCopyWith<_$ApiErrorImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
mixin _$ApiResponse<T> {
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(T data, Map<String, dynamic>? meta) success,
    required TResult Function(ApiError error) error,
  }) => throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(T data, Map<String, dynamic>? meta)? success,
    TResult? Function(ApiError error)? error,
  }) => throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(T data, Map<String, dynamic>? meta)? success,
    TResult Function(ApiError error)? error,
    required TResult orElse(),
  }) => throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(ApiSuccessResponse<T> value) success,
    required TResult Function(ApiErrorResponse<T> value) error,
  }) => throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(ApiSuccessResponse<T> value)? success,
    TResult? Function(ApiErrorResponse<T> value)? error,
  }) => throw _privateConstructorUsedError;
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(ApiSuccessResponse<T> value)? success,
    TResult Function(ApiErrorResponse<T> value)? error,
    required TResult orElse(),
  }) => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ApiResponseCopyWith<T, $Res> {
  factory $ApiResponseCopyWith(
    ApiResponse<T> value,
    $Res Function(ApiResponse<T>) then,
  ) = _$ApiResponseCopyWithImpl<T, $Res, ApiResponse<T>>;
}

/// @nodoc
class _$ApiResponseCopyWithImpl<T, $Res, $Val extends ApiResponse<T>>
    implements $ApiResponseCopyWith<T, $Res> {
  _$ApiResponseCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
}

/// @nodoc
abstract class _$$ApiSuccessResponseImplCopyWith<T, $Res> {
  factory _$$ApiSuccessResponseImplCopyWith(
    _$ApiSuccessResponseImpl<T> value,
    $Res Function(_$ApiSuccessResponseImpl<T>) then,
  ) = __$$ApiSuccessResponseImplCopyWithImpl<T, $Res>;
  @useResult
  $Res call({T data, Map<String, dynamic>? meta});
}

/// @nodoc
class __$$ApiSuccessResponseImplCopyWithImpl<T, $Res>
    extends _$ApiResponseCopyWithImpl<T, $Res, _$ApiSuccessResponseImpl<T>>
    implements _$$ApiSuccessResponseImplCopyWith<T, $Res> {
  __$$ApiSuccessResponseImplCopyWithImpl(
    _$ApiSuccessResponseImpl<T> _value,
    $Res Function(_$ApiSuccessResponseImpl<T>) _then,
  ) : super(_value, _then);

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? data = freezed, Object? meta = freezed}) {
    return _then(
      _$ApiSuccessResponseImpl<T>(
        data: freezed == data
            ? _value.data
            : data // ignore: cast_nullable_to_non_nullable
                  as T,
        meta: freezed == meta
            ? _value._meta
            : meta // ignore: cast_nullable_to_non_nullable
                  as Map<String, dynamic>?,
      ),
    );
  }
}

/// @nodoc

class _$ApiSuccessResponseImpl<T> implements ApiSuccessResponse<T> {
  const _$ApiSuccessResponseImpl({
    required this.data,
    final Map<String, dynamic>? meta,
  }) : _meta = meta;

  @override
  final T data;
  final Map<String, dynamic>? _meta;
  @override
  Map<String, dynamic>? get meta {
    final value = _meta;
    if (value == null) return null;
    if (_meta is EqualUnmodifiableMapView) return _meta;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableMapView(value);
  }

  @override
  String toString() {
    return 'ApiResponse<$T>.success(data: $data, meta: $meta)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ApiSuccessResponseImpl<T> &&
            const DeepCollectionEquality().equals(other.data, data) &&
            const DeepCollectionEquality().equals(other._meta, _meta));
  }

  @override
  int get hashCode => Object.hash(
    runtimeType,
    const DeepCollectionEquality().hash(data),
    const DeepCollectionEquality().hash(_meta),
  );

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ApiSuccessResponseImplCopyWith<T, _$ApiSuccessResponseImpl<T>>
  get copyWith =>
      __$$ApiSuccessResponseImplCopyWithImpl<T, _$ApiSuccessResponseImpl<T>>(
        this,
        _$identity,
      );

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(T data, Map<String, dynamic>? meta) success,
    required TResult Function(ApiError error) error,
  }) {
    return success(data, meta);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(T data, Map<String, dynamic>? meta)? success,
    TResult? Function(ApiError error)? error,
  }) {
    return success?.call(data, meta);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(T data, Map<String, dynamic>? meta)? success,
    TResult Function(ApiError error)? error,
    required TResult orElse(),
  }) {
    if (success != null) {
      return success(data, meta);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(ApiSuccessResponse<T> value) success,
    required TResult Function(ApiErrorResponse<T> value) error,
  }) {
    return success(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(ApiSuccessResponse<T> value)? success,
    TResult? Function(ApiErrorResponse<T> value)? error,
  }) {
    return success?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(ApiSuccessResponse<T> value)? success,
    TResult Function(ApiErrorResponse<T> value)? error,
    required TResult orElse(),
  }) {
    if (success != null) {
      return success(this);
    }
    return orElse();
  }
}

abstract class ApiSuccessResponse<T> implements ApiResponse<T> {
  const factory ApiSuccessResponse({
    required final T data,
    final Map<String, dynamic>? meta,
  }) = _$ApiSuccessResponseImpl<T>;

  T get data;
  Map<String, dynamic>? get meta;

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ApiSuccessResponseImplCopyWith<T, _$ApiSuccessResponseImpl<T>>
  get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class _$$ApiErrorResponseImplCopyWith<T, $Res> {
  factory _$$ApiErrorResponseImplCopyWith(
    _$ApiErrorResponseImpl<T> value,
    $Res Function(_$ApiErrorResponseImpl<T>) then,
  ) = __$$ApiErrorResponseImplCopyWithImpl<T, $Res>;
  @useResult
  $Res call({ApiError error});

  $ApiErrorCopyWith<$Res> get error;
}

/// @nodoc
class __$$ApiErrorResponseImplCopyWithImpl<T, $Res>
    extends _$ApiResponseCopyWithImpl<T, $Res, _$ApiErrorResponseImpl<T>>
    implements _$$ApiErrorResponseImplCopyWith<T, $Res> {
  __$$ApiErrorResponseImplCopyWithImpl(
    _$ApiErrorResponseImpl<T> _value,
    $Res Function(_$ApiErrorResponseImpl<T>) _then,
  ) : super(_value, _then);

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({Object? error = null}) {
    return _then(
      _$ApiErrorResponseImpl<T>(
        error: null == error
            ? _value.error
            : error // ignore: cast_nullable_to_non_nullable
                  as ApiError,
      ),
    );
  }

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $ApiErrorCopyWith<$Res> get error {
    return $ApiErrorCopyWith<$Res>(_value.error, (value) {
      return _then(_value.copyWith(error: value));
    });
  }
}

/// @nodoc

class _$ApiErrorResponseImpl<T> implements ApiErrorResponse<T> {
  const _$ApiErrorResponseImpl({required this.error});

  @override
  final ApiError error;

  @override
  String toString() {
    return 'ApiResponse<$T>.error(error: $error)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ApiErrorResponseImpl<T> &&
            (identical(other.error, error) || other.error == error));
  }

  @override
  int get hashCode => Object.hash(runtimeType, error);

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ApiErrorResponseImplCopyWith<T, _$ApiErrorResponseImpl<T>> get copyWith =>
      __$$ApiErrorResponseImplCopyWithImpl<T, _$ApiErrorResponseImpl<T>>(
        this,
        _$identity,
      );

  @override
  @optionalTypeArgs
  TResult when<TResult extends Object?>({
    required TResult Function(T data, Map<String, dynamic>? meta) success,
    required TResult Function(ApiError error) error,
  }) {
    return error(this.error);
  }

  @override
  @optionalTypeArgs
  TResult? whenOrNull<TResult extends Object?>({
    TResult? Function(T data, Map<String, dynamic>? meta)? success,
    TResult? Function(ApiError error)? error,
  }) {
    return error?.call(this.error);
  }

  @override
  @optionalTypeArgs
  TResult maybeWhen<TResult extends Object?>({
    TResult Function(T data, Map<String, dynamic>? meta)? success,
    TResult Function(ApiError error)? error,
    required TResult orElse(),
  }) {
    if (error != null) {
      return error(this.error);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  TResult map<TResult extends Object?>({
    required TResult Function(ApiSuccessResponse<T> value) success,
    required TResult Function(ApiErrorResponse<T> value) error,
  }) {
    return error(this);
  }

  @override
  @optionalTypeArgs
  TResult? mapOrNull<TResult extends Object?>({
    TResult? Function(ApiSuccessResponse<T> value)? success,
    TResult? Function(ApiErrorResponse<T> value)? error,
  }) {
    return error?.call(this);
  }

  @override
  @optionalTypeArgs
  TResult maybeMap<TResult extends Object?>({
    TResult Function(ApiSuccessResponse<T> value)? success,
    TResult Function(ApiErrorResponse<T> value)? error,
    required TResult orElse(),
  }) {
    if (error != null) {
      return error(this);
    }
    return orElse();
  }
}

abstract class ApiErrorResponse<T> implements ApiResponse<T> {
  const factory ApiErrorResponse({required final ApiError error}) =
      _$ApiErrorResponseImpl<T>;

  ApiError get error;

  /// Create a copy of ApiResponse
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ApiErrorResponseImplCopyWith<T, _$ApiErrorResponseImpl<T>> get copyWith =>
      throw _privateConstructorUsedError;
}
