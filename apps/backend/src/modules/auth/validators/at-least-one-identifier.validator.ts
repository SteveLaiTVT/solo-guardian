/**
 * @file at-least-one-identifier.validator.ts
 * @description Custom validator to ensure at least one identifier is provided
 * @task TASK-077
 */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function AtLeastOneIdentifier(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'atLeastOneIdentifier',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_value: unknown, args: ValidationArguments): boolean {
          const obj = args.object as Record<string, unknown>;
          const hasUsername =
            typeof obj.username === 'string' && obj.username.trim().length > 0;
          const hasEmail =
            typeof obj.email === 'string' && obj.email.trim().length > 0;
          const hasPhone =
            typeof obj.phone === 'string' && obj.phone.trim().length > 0;
          return hasUsername || hasEmail || hasPhone;
        },
        defaultMessage(): string {
          return 'At least one identifier (username, email, or phone) is required';
        },
      },
    });
  };
}
