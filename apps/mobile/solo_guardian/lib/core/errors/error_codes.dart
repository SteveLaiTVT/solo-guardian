enum ErrorCategory {
  validation,
  auth,
  business,
  notFound,
  conflict,
  rateLimit,
  system,
}

class ErrorCodeDefinition {
  final String code;
  final ErrorCategory category;
  final int httpStatus;
  final String i18nKey;

  const ErrorCodeDefinition({
    required this.code,
    required this.category,
    required this.httpStatus,
    required this.i18nKey,
  });
}

abstract class ErrorCodes {
  static const authInvalidCredentials = ErrorCodeDefinition(
    code: 'AUTH_1001',
    category: ErrorCategory.auth,
    httpStatus: 401,
    i18nKey: 'error.auth.invalidCredentials',
  );

  static const authTokenExpired = ErrorCodeDefinition(
    code: 'AUTH_1002',
    category: ErrorCategory.auth,
    httpStatus: 401,
    i18nKey: 'error.auth.tokenExpired',
  );

  static const authTokenInvalid = ErrorCodeDefinition(
    code: 'AUTH_1003',
    category: ErrorCategory.auth,
    httpStatus: 401,
    i18nKey: 'error.auth.tokenInvalid',
  );

  static const authUnauthorized = ErrorCodeDefinition(
    code: 'AUTH_1004',
    category: ErrorCategory.auth,
    httpStatus: 403,
    i18nKey: 'error.auth.unauthorized',
  );

  static const validationFailed = ErrorCodeDefinition(
    code: 'VAL_2001',
    category: ErrorCategory.validation,
    httpStatus: 400,
    i18nKey: 'error.validation.failed',
  );

  static const validationEmailInvalid = ErrorCodeDefinition(
    code: 'VAL_2002',
    category: ErrorCategory.validation,
    httpStatus: 400,
    i18nKey: 'error.validation.emailInvalid',
  );

  static const validationRequiredField = ErrorCodeDefinition(
    code: 'VAL_2003',
    category: ErrorCategory.validation,
    httpStatus: 400,
    i18nKey: 'error.validation.requiredField',
  );

  static const userNotFound = ErrorCodeDefinition(
    code: 'USER_3001',
    category: ErrorCategory.notFound,
    httpStatus: 404,
    i18nKey: 'error.user.notFound',
  );

  static const userEmailExists = ErrorCodeDefinition(
    code: 'USER_3002',
    category: ErrorCategory.conflict,
    httpStatus: 409,
    i18nKey: 'error.user.emailExists',
  );

  static const contactNotFound = ErrorCodeDefinition(
    code: 'CONTACT_4001',
    category: ErrorCategory.notFound,
    httpStatus: 404,
    i18nKey: 'error.contact.notFound',
  );

  static const contactLimitReached = ErrorCodeDefinition(
    code: 'CONTACT_4002',
    category: ErrorCategory.business,
    httpStatus: 400,
    i18nKey: 'error.contact.limitReached',
  );

  static const contactEmailExists = ErrorCodeDefinition(
    code: 'CONTACT_4003',
    category: ErrorCategory.conflict,
    httpStatus: 409,
    i18nKey: 'error.contact.emailExists',
  );

  static const checkinAlreadyToday = ErrorCodeDefinition(
    code: 'CHECKIN_5001',
    category: ErrorCategory.business,
    httpStatus: 400,
    i18nKey: 'error.checkin.alreadyToday',
  );

  static const checkinSettingsNotFound = ErrorCodeDefinition(
    code: 'CHECKIN_5002',
    category: ErrorCategory.notFound,
    httpStatus: 404,
    i18nKey: 'error.checkin.settingsNotFound',
  );

  static const preferencesNotFound = ErrorCodeDefinition(
    code: 'PREF_6001',
    category: ErrorCategory.notFound,
    httpStatus: 404,
    i18nKey: 'error.preferences.notFound',
  );

  static const preferencesInvalidFeature = ErrorCodeDefinition(
    code: 'PREF_6002',
    category: ErrorCategory.business,
    httpStatus: 400,
    i18nKey: 'error.preferences.invalidFeature',
  );

  static const systemInternalError = ErrorCodeDefinition(
    code: 'SYS_9001',
    category: ErrorCategory.system,
    httpStatus: 500,
    i18nKey: 'error.system.internal',
  );

  static const systemServiceUnavailable = ErrorCodeDefinition(
    code: 'SYS_9002',
    category: ErrorCategory.system,
    httpStatus: 503,
    i18nKey: 'error.system.unavailable',
  );

  static const systemRateLimited = ErrorCodeDefinition(
    code: 'SYS_9003',
    category: ErrorCategory.rateLimit,
    httpStatus: 429,
    i18nKey: 'error.system.rateLimited',
  );
}

bool isUserError(ErrorCategory category) {
  return [
    ErrorCategory.validation,
    ErrorCategory.auth,
    ErrorCategory.business,
    ErrorCategory.conflict,
  ].contains(category);
}
