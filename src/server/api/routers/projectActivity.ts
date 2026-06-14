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