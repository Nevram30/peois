/**
 * Session timeout constants — shared by the NextAuth config (server/edge)
 * and the client-side idle timer. Keep this file free of imports so it is
 * safe in every runtime.
 */

export const SESSION_MAX_AGE_SECONDS = 5 * 60;
export const SESSION_MAX_AGE_MS = SESSION_MAX_AGE_SECONDS * 1000;

/** How often an active user's browser pings /api/auth/session to refresh the rolling JWT cookie. Must stay well under SESSION_MAX_AGE_MS. */
export const SESSION_KEEPALIVE_INTERVAL_MS = 2 * 60 * 1000;

export const IDLE_CHECK_INTERVAL_MS = 10 * 1000;
export const ACTIVITY_THROTTLE_MS = 5 * 1000;

/** localStorage key sharing the last-activity timestamp across tabs. */
export const LAST_ACTIVITY_STORAGE_KEY = "peois.lastActivity";
