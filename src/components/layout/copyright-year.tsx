"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** Current year without reading the clock during prerender (Cache Components safe). */
export function CopyrightYear() {
  const year = useSyncExternalStore(noop, () => new Date().getFullYear(), () => 2026);
  return <span suppressHydrationWarning>{year}</span>;
}
