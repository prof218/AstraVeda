"use client";

import { useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  // Re-check every minute so long-open pages roll over at midnight.
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};

function localKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Today's local date as "yyyy-MM-dd" on the client, `null` during SSR/prerender.
 * Avoids hydration mismatches and Cache Components' clock restrictions.
 */
export function useTodayKey(): string | null {
  return useSyncExternalStore(subscribe, localKey, () => null);
}

export function useMounted(): boolean {
  return useSyncExternalStore(() => () => {}, () => true, () => false);
}
