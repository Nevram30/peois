"use client";

import { useSessionTimeout } from "~/hooks/use-session-timeout";

export const SessionTimeout = () => {
  useSessionTimeout();
  return null;
}
