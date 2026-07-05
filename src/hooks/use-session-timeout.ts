"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

import {
  ACTIVITY_THROTTLE_MS,
  IDLE_CHECK_INTERVAL_MS,
  LAST_ACTIVITY_STORAGE_KEY,
  SESSION_KEEPALIVE_INTERVAL_MS,
  SESSION_MAX_AGE_MS,
} from "~/lib/auth-constants";

const ACTIVITY_EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
] as const;

/**
 * Signs the user out and redirects to /login after SESSION_MAX_AGE_MS of
 * inactivity, matching the rolling JWT maxAge in edge-config.ts.
 *
 * While the user IS active, pings /api/auth/session so the rolling cookie is
 * refreshed (tRPC calls don't refresh it — only requests through the NextAuth
 * middleware or session endpoint do). Never pings while idle: an unconditional
 * poll would reset the rolling maxAge and keep idle sessions alive forever.
 *
 * The last-activity timestamp is mirrored to localStorage so activity in any
 * tab keeps every tab alive.
 */
export function useSessionTimeout() {
  const lastActivityRef = useRef(Date.now());
  const lastKeepaliveRef = useRef(Date.now());
  const expiredRef = useRef(false);

  useEffect(() => {
    const expire = async () => {
      if (expiredRef.current) return;
      expiredRef.current = true;
      try {
        await signOut({ callbackUrl: "/login?expired=1" });
      } catch {
        window.location.href = "/login?expired=1";
      }
    };

    const effectiveLastActivity = () => {
      const stored = Number(
        window.localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY),
      );
      return Math.max(lastActivityRef.current, stored || 0);
    };

    const checkExpiry = () => {
      if (Date.now() - effectiveLastActivity() >= SESSION_MAX_AGE_MS) {
        void expire();
      }
    };

    const onActivity = () => {
      const now = Date.now();
      if (now - lastActivityRef.current < ACTIVITY_THROTTLE_MS) return;
      lastActivityRef.current = now;
      try {
        window.localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(now));
      } catch {
        // localStorage unavailable (private mode/quota) — same-tab timer still works
      }
      if (now - lastKeepaliveRef.current >= SESSION_KEEPALIVE_INTERVAL_MS) {
        lastKeepaliveRef.current = now;
        void fetch("/api/auth/session").catch(() => undefined);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== LAST_ACTIVITY_STORAGE_KEY || !event.newValue) return;
      const ts = Number(event.newValue);
      if (ts > lastActivityRef.current) lastActivityRef.current = ts;
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") checkExpiry();
    };

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, {
        capture: true,
        passive: true,
      });
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", checkExpiry);
    window.addEventListener("pageshow", checkExpiry);
    document.addEventListener("visibilitychange", onVisible);

    // Short interval with wall-clock math instead of one long setTimeout:
    // background tabs and laptop sleep throttle/freeze timers, so the check
    // must self-correct against real elapsed time.
    const interval = window.setInterval(checkExpiry, IDLE_CHECK_INTERVAL_MS);

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity, { capture: true });
      }
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", checkExpiry);
      window.removeEventListener("pageshow", checkExpiry);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(interval);
    };
  }, []);
}
