import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectActivityRouter = createTRPCRouter({
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.projectActivity.findMany({
        where: { projectId: input.projectId },
        include: {
          createdBy: { select: { name: true, email: true, image: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.projectActivity.findMany({
      include: {
        createdBy: { select: { name: true, email: true, image: true } },
        project: { select: { id: true, projectCode: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /**
   * Count of activity entries created since the given timestamp (for the nav
   * badge). Defaults to the last 24 hours when no timestamp is provided.
   */
  recentCount: protectedProcedure
    .input(z.object({ since: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const since = input?.since
        ? new Date(input.since)
        : new Date(Date.now() - 24 * 60 * 60 * 1000);
      return ctx.db.projectActivity.count({ where: { createdAt: { gte: since } } });
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        description: z.string().min(1, "Activity description is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectActivity.create({
        data: {
          projectId: input.projectId,
          description: input.description,
          createdById: ctx.session.user.id,
        },
        include: {
          createdBy: { select: { name: true, email: true, image: true } },
        },
      });
    }),
});


/*routers structure:

export const projectActivityRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async ({ ctx }) => { 
  
  return ctx.db.projectActivity.findMany({
  
  })
  
  }),

  create: protectedProcedure.input().mutation(async ({ ctx, input }) => {     })


})*/