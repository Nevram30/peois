"use client";

import { useSessionTimeout } from "~/hooks/use-session-timeout";

export function SessionTimeout() {
  useSessionTimeout();
  return null;
}
