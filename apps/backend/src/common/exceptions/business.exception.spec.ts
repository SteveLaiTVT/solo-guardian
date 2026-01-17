import { BusinessException } from './business.exception';

describe('BusinessException', () => {
  describe('constructor', () => {
    it('should create exception with error code', () => {
      const exception = new BusinessException('VALIDATION_EMAIL_INVALID');

      expect(exception.errorCode).toBeDefined();
      expect(exception.category).toBeDefined();
      expect(exception.i18nKey).toBeDefined();
    });

    it('should include custom message in response', () => {
      const exception = new BusinessException('VALIDATION_EMAIL_INVALID', {
        message: 'Custom error message',
      });

      const response = exception.getResponse() as { error: { message: string } };
      expect(response.error.message).toBe('Custom error message');
    });

    it('should include details in response', () => {
      const exception = new BusinessException('VALIDATION_EMAIL_INVALID', {
        details: { email: 'invalid@test' },
      });

      const response = exception.getResponse() as { error: { details: unknown } };
      expect(response.error.details).toEqual({ email: 'invalid@test' });
    });

    it('should include field in response', () => {
      const exception = new BusinessException('VALIDATION_EMAIL_INVALID', {
        field: 'email',
      });

      const response = exception.getResponse() as { error: { field: string } };
      expect(response.error.field).toBe('email');
    });

    it('should format response as ApiErrorResponse', () => {
      const exception = new BusinessException('CHECKIN_ALREADY_TODAY');

      const response = exception.getResponse() as Record<string, unknown>;
      expect(response.success).toBe(false);
      expect(response.error).toBeDefined();
    });

    it('should include timestamp in response', () => {
      const exception = new BusinessException('VALIDATION_EMAIL_INVALID');

      const response = exception.getResponse() as { error: { timestamp: string } };
      expect(response.error.timestamp).toBeDefined();
      expect(new Date(response.error.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('HTTP status', () => {
    it('should set correct HTTP status based on error code', () => {
      const validationException = new BusinessException('VALIDATION_EMAIL_INVALID');
      expect(validationException.getStatus()).toBeGreaterThanOrEqual(400);
      expect(validationException.getStatus()).toBeLessThan(500);
    });
  });
});
