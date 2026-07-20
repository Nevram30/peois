"use client";

import { useEffect } from "react";

/**
 * Minimal fixed-position toast for live (SSE) notifications.
 * Auto-dismisses after 5 seconds; parent owns the message state.
 */
export const LiveToast = ({
  message,
  onDismiss,
}: {
  message: string | null;
  onDismiss: () => void;
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-lg">
      <span className="mt-0.5 flex h-2 w-2 shrink-0 rounded-full bg-blue-500" />
      <p className="text-xs leading-relaxed text-gray-700">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="ml-1 shrink-0 text-gray-300 transition hover:text-gray-500"
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  );
}
