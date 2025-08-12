import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = <T>(value: T): T => {
  if (value === undefined || value === null) return value;
  return JSON.parse(JSON.stringify(value));
};

export const convertFileToUrl = (file: File): string =>
  URL.createObjectURL(file);

/**
 * Formats a date string into various human-readable formats.
 */
export const formatDateTime = (dateInput: Date | string) => {
  const date = new Date(dateInput);

  const options = {
    dateTime: {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
    dateDay: {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
    dateOnly: {
      month: "short",
      year: "numeric",
      day: "numeric",
    },
    timeOnly: {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  } satisfies Record<string, Intl.DateTimeFormatOptions>;

  return {
    dateTime: date.toLocaleString("en-US", options.dateTime),
    dateDay: date.toLocaleString("en-US", options.dateDay),
    dateOnly: date.toLocaleString("en-US", options.dateOnly),
    timeOnly: date.toLocaleString("en-US", options.timeOnly),
  };
};

/**
 * Base64 encode a string (basic obfuscation).
 */
export function encryptKey(passkey: string): string {
  return btoa(unescape(encodeURIComponent(passkey)));
}

/**
 * Base64 decode a string.
 */
export function decryptKey(encoded: string): string {
  return decodeURIComponent(escape(atob(encoded)));
}
