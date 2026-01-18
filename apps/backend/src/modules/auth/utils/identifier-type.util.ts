/**
 * @file identifier-type.util.ts
 * @description Utility for detecting login identifier types (email, phone, username, UID)
 * @task TASK-076
 */

export enum IdentifierType {
  UID = 'uid',
  EMAIL = 'email',
  PHONE = 'phone',
  USERNAME = 'username',
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

export function detectIdentifierType(identifier: string): IdentifierType {
  const trimmed = identifier.trim();

  if (UUID_REGEX.test(trimmed)) {
    return IdentifierType.UID;
  }

  if (EMAIL_REGEX.test(trimmed)) {
    return IdentifierType.EMAIL;
  }

  if (PHONE_REGEX.test(trimmed)) {
    return IdentifierType.PHONE;
  }

  return IdentifierType.USERNAME;
}

export function normalizeIdentifier(
  identifier: string,
  type: IdentifierType,
): string {
  const trimmed = identifier.trim();

  switch (type) {
    case IdentifierType.EMAIL:
    case IdentifierType.USERNAME:
      return trimmed.toLowerCase();
    case IdentifierType.PHONE:
      return trimmed.replace(/\s|-/g, '');
    case IdentifierType.UID:
      return trimmed.toLowerCase();
    default:
      return trimmed;
  }
}
