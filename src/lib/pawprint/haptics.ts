import { useCallback } from "react";

/** Subtle haptic feedback where the platform supports it. */
export function useHaptics() {
  return useCallback((pattern: number | number[] = 12) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* unsupported */
      }
    }
  }, []);
}
