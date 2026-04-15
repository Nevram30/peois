import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectFileRouter = createTRPCRouter({
  getByProjectId: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.projectFile.findMany({
        where: { projectId: input.projectId },
        include: { createdBy: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        fileName: z.string().min(1),
        fileUrl: z.string().min(1),
        fileType: z
          .enum(["IMAGE", "BLUEPRINT", "REPORT", "CONTRACT", "PERMIT", "OTHER"])
          .default("OTHER"),
        fileSize: z.number().int().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectFile.create({
        data: {
          projectId: input.projectId,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          fileType: input.fileType,
          fileSize: input.fileSize,
          createdById: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectFile.delete({ where: { id: input.id } });
    }),
});
