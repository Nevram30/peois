import { defaultCache } from "@serwist/next/worker";
import {
  NetworkOnly,
  Serwist,
  type PrecacheEntry,
  type SerwistGlobalConfig,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      // Auth, live data, and uploads must never be served from cache — a
      // cached /api/files response could also outlive the session that was
      // allowed to read it.
      matcher: ({ url }) =>
        url.pathname.startsWith("/api/auth") ||
        url.pathname.startsWith("/api/trpc") ||
        url.pathname.startsWith("/api/uploadthing") ||
        url.pathname.startsWith("/api/upload") ||
        url.pathname.startsWith("/api/files") ||
        url.pathname.startsWith("/uploads"),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
