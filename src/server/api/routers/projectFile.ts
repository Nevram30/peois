import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  DOC_TYPE_VALUES,
  PROJECT_FILE_TYPE_VALUES,
} from "~/lib/project-documents";

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
        fileType: z.enum(PROJECT_FILE_TYPE_VALUES).default("OTHER"),
        docType: z.enum(DOC_TYPE_VALUES).optional(),
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
          docType: input.docType,
          fileSize: input.fileSize,
          createdById: ctx.session.user.id,
        },
      });
    }),

  // Re-filing a document under a different requirement. fileType travels with
  // docType because it is derived from it (see docFileType).
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        docType: z.enum(DOC_TYPE_VALUES),
        fileType: z.enum(PROJECT_FILE_TYPE_VALUES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectFile.update({
        where: { id: input.id },
        data: { docType: input.docType, fileType: input.fileType },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectFile.delete({ where: { id: input.id } });
    }),
});
