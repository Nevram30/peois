import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

  // Admin: get notifications (replies only) on tasks I sent
  getAdminNotifications: protectedProcedure.query(async ({ ctx }) => {
    const replies = await ctx.db.taskReply.findMany({
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
    });

    return { replies };
  }),

  // Get single task by id (with replies)
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.taskNotification.findUnique({
        where: { id: input.id },
        include: {
          project: { select: { id: true, title: true, projectCode: true } },
          createdBy: { select: { id: true, name: true, email: true, image: true } },
          notifyUser: { select: { id: true, name: true, email: true, image: true } },
          replies: {
            include: {
              createdBy: { select: { id: true, name: true, email: true, image: true } },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });
    }),

  // User: acknowledge a task
  acknowledge: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskNotification.update({
        where: { id: input.taskId },
        data: {
          acknowledged: true,
          acknowledgedAt: new Date(),
        },
      });
    }),

  // User: submit a reply
  reply: protectedProcedure
    .input(z.object({
      taskId: z.string(),
      message: z.string().min(1),
      taskStatus: z.enum(["in-progress", "action-taken"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskReply.create({
        data: {
          taskNotificationId: input.taskId,
          message: input.message,
          taskStatus: input.taskStatus,
          createdById: ctx.session.user.id,
        },
      });
    }),
});
