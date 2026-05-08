import { deleteField } from 'firebase/firestore';

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

export const sanitizeFirestoreData = <T>(value: T): T => {
  if (value === undefined || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== undefined)
      .map((item) => sanitizeFirestoreData(item)) as T;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .map(([key, entryValue]) => [key, sanitizeFirestoreData(entryValue)])
  ) as T;
};

export const sanitizeFirestoreUpdate = <T extends Record<string, unknown>>(value: T) => {
  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      key,
      entryValue === undefined ? deleteField() : sanitizeFirestoreData(entryValue),
    ])
  );
};