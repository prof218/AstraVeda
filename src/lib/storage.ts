/**
 * Safe localStorage helpers for demo persistence.
 * Every access is wrapped — storage can be unavailable (private mode, SSR).
 */
export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota / privacy errors */
  }
}

export function removeStorage(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export const STORAGE_KEYS = {
  bookingDraft: "astraveda:booking-draft",
  lastBooking: "astraveda:last-booking",
  newsletter: "astraveda:newsletter",
  kundli: "astraveda:kundli-last",
} as const;
