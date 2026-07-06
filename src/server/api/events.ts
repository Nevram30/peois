import { EventEmitter } from "node:events";

/**
 * In-process pub/sub for task notifications, consumed by tRPC SSE
 * subscriptions. This only works when all requests are served by a single
 * Node process (`next dev` / `next start` on one instance). On serverless or
 * multi-instance deployments, the mutation may run in a different process
 * than the open SSE stream and events will be missed — the client's
 * window-focus refetch remains the fallback. Upgrade path: swap this module's
 * internals for Postgres LISTEN/NOTIFY or Redis pub/sub, keeping the same
 * event interface.
 */

export interface TaskCreatedEvent {
  taskId: string;
  projectId: string;
  projectTitle: string;
  notifyUserId: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  description: string;
  createdByName: string | null;
}

export interface ReplyCreatedEvent {
  replyId: string;
  taskId: string;
  /** The participant who should be notified (the non-author). */
  recipientId: string;
  authorId: string;
  authorName: string | null;
  message: string;
}

export interface TaskAcknowledgedEvent {
  taskId: string;
  /** The task creator (admin) who should be notified. */
  recipientId: string;
  acknowledgedById: string;
  acknowledgedByName: string | null;
  description: string;
}

interface NotificationEvents {
  "task.created": [TaskCreatedEvent];
  "reply.created": [ReplyCreatedEvent];
  "task.acknowledged": [TaskAcknowledgedEvent];
}

const createEmitter = () => {
  const emitter = new EventEmitter<NotificationEvents>();
  // One listener per connected SSE client — no meaningful upper bound.
  emitter.setMaxListeners(0);
  return emitter;
};

// Cached on globalThis so dev HMR doesn't orphan listeners (same pattern as db.ts).
const globalForEvents = globalThis as unknown as {
  notificationEmitter?: ReturnType<typeof createEmitter>;
};

export const notificationEmitter = (globalForEvents.notificationEmitter ??=
  createEmitter());
