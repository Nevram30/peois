import { on } from "node:events";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  notificationEmitter,
  type ReplyCreatedEvent,
  type TaskAcknowledgedEvent,
  type TaskCreatedEvent,
} from "~/server/api/events";

function assertParticipant(
  task: { notifyUserId: string; createdById: string } | null,
  userId: string,
  userRole?: string,
): asserts task {
  if (!task) throw new TRPCError({ code: "NOT_FOUND" });
  if (
    task.notifyUserId !== userId &&
    task.createdById !== userId &&
    userRole !== "SUPER_ADMIN"
  ) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
}

export const taskNotificationRouter = createTRPCRouter({
  // User: get all tasks assigned to me
  getMyTasks: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.taskNotification.findMany({
      where: { notifyUserId: ctx.session.user.id },
      include: {
        project: { select: { id: true, title: true, projectCode: true } },
        createdBy: { select: { id: true, name: true, email: true, image: true } },
        replies: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Admin: get tasks sent by me
  getTasksSentByMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.taskNotification.findMany({
      where: { createdById: ctx.session.user.id },
      include: {
        project: { select: { id: true, title: true, projectCode: true } },
        notifyUser: { select: { id: true, name: true, email: true, image: true } },
        replies: { select: { id: true, taskStatus: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Admin: get notifications (replies + acknowledgments) on tasks I sent
  getAdminNotifications: protectedProcedure.query(async ({ ctx }) => {
    const [replies, acknowledgments] = await Promise.all([
      ctx.db.taskReply.findMany({
        where: {
          taskNotification: { createdById: ctx.session.user.id },
          createdById: { not: ctx.session.user.id },
        },
        include: {
          taskNotification: {
            select: {
              id: true,
              description: true,
              priority: true,
              project: { select: { id: true, title: true, projectCode: true } },
            },
          },
          createdBy: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      ctx.db.taskNotification.findMany({
        where: { createdById: ctx.session.user.id, acknowledged: true },
        select: {
          id: true,
          description: true,
          priority: true,
          acknowledgedAt: true,
          project: { select: { id: true, title: true, projectCode: true } },
          notifyUser: { select: { id: true, name: true, email: true, image: true } },
        },
        orderBy: { acknowledgedAt: "desc" },
        take: 20,
      }),
    ]);

    return { replies, acknowledgments };
  }),

  // Get single task by id (with replies) — participants and super admins only
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.taskNotification.findUnique({
        where: { id: input.id },
        include: {
          project: { select: { id: true, title: true, projectCode: true } },
          createdBy: { select: { id: true, name: true, email: true, image: true } },
          notifyUser: { select: { id: true, name: true, email: true, image: true } },
          replies: {
            include: {
              createdBy: { select: { id: true, name: true, email: true, image: true } },
              documents: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
      assertParticipant(task, ctx.session.user.id, ctx.session.user.role);
      return task;
    }),

  // User: acknowledge a task — only the assignee, via explicit button click
  acknowledge: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { count } = await ctx.db.taskNotification.updateMany({
        where: {
          id: input.taskId,
          notifyUserId: ctx.session.user.id,
          acknowledged: false,
        },
        data: {
          acknowledged: true,
          acknowledgedAt: new Date(),
        },
      });
      if (count === 0) throw new TRPCError({ code: "NOT_FOUND" });

      const task = await ctx.db.taskNotification.findUnique({
        where: { id: input.taskId },
        select: { createdById: true, description: true },
      });
      if (task) {
        notificationEmitter.emit("task.acknowledged", {
          taskId: input.taskId,
          recipientId: task.createdById,
          acknowledgedById: ctx.session.user.id,
          acknowledgedByName: ctx.session.user.name ?? null,
          description: task.description,
        });
      }

      return { success: true };
    }),

  // User: submit a reply
  reply: protectedProcedure
    .input(z.object({
      taskId: z.string(),
      message: z.string().min(1),
      taskStatus: z.enum(["in-progress", "action-taken"]).optional(),
      documents: z.array(z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number().optional(),
        fileType: z.string().optional(),
      })).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.taskNotification.findUnique({
        where: { id: input.taskId },
        select: { id: true, notifyUserId: true, createdById: true },
      });
      assertParticipant(task, ctx.session.user.id);

      const reply = await ctx.db.taskReply.create({
        data: {
          taskNotificationId: input.taskId,
          message: input.message,
          taskStatus: input.taskStatus,
          createdById: ctx.session.user.id,
          documents: input.documents?.length
            ? { create: input.documents }
            : undefined,
        },
        include: { documents: true },
      });

      const authorId = ctx.session.user.id;
      notificationEmitter.emit("reply.created", {
        replyId: reply.id,
        taskId: task.id,
        recipientId:
          authorId === task.createdById ? task.notifyUserId : task.createdById,
        authorId,
        authorName: ctx.session.user.name ?? null,
        message: input.message,
      });

      return reply;
    }),

  // SSE: live "task assigned to me" events
  onTaskCreated: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    for await (const [event] of on(notificationEmitter, "task.created", {
      signal,
    })) {
      const e = event as TaskCreatedEvent;
      if (e.notifyUserId === ctx.session.user.id) yield e;
    }
  }),

  // SSE: live "someone replied on my task" events
  onReplyCreated: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    for await (const [event] of on(notificationEmitter, "reply.created", {
      signal,
    })) {
      const e = event as ReplyCreatedEvent;
      if (e.recipientId === ctx.session.user.id) yield e;
    }
  }),

  // SSE: live "user acknowledged my task" events (for the task creator)
  onTaskAcknowledged: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    for await (const [event] of on(notificationEmitter, "task.acknowledged", {
      signal,
    })) {
      const e = event as TaskAcknowledgedEvent;
      if (e.recipientId === ctx.session.user.id) yield e;
    }
  }),
});
