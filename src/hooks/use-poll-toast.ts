"use client";

import { useCallback, useEffect, useRef } from "react";

export type PollToastItem = {
  id: string;
  message: string;
};

/**
 * Fires `onNew(message)` when a polled list gains ids not seen before.
 *
 * The first defined `items` array is treated as the baseline — nothing
 * toasts on initial load. `markSeen` lets SSE `onData` handlers pre-register
 * an id so the refetch that follows their invalidate doesn't toast the same
 * event twice. This is the delivery fallback for deployments where the
 * in-process EventEmitter behind the SSE subscriptions doesn't span
 * instances (see src/server/api/events.ts).
 */
export const usePollToast = (
  items: PollToastItem[] | undefined,
  onNew: (message: string) => void,
) => {
  const seenRef = useRef(new Set<string>());
  const initializedRef = useRef(false);
  const onNewRef = useRef(onNew);
  onNewRef.current = onNew;

  useEffect(() => {
    if (!items) return;
    const seen = seenRef.current;
    if (!initializedRef.current) {
      initializedRef.current = true;
      for (const item of items) seen.add(item.id);
      return;
    }
    const fresh = items.filter((item) => !seen.has(item.id));
    for (const item of fresh) seen.add(item.id);
    if (fresh[0]) {
      onNewRef.current(
        fresh.length > 1
          ? `${fresh[0].message} (+${fresh.length - 1} more)`
          : fresh[0].message,
      );
    }
  }, [items]);

  const markSeen = useCallback((id: string) => {
    seenRef.current.add(id);
  }, []);

  return { markSeen };
}
