import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  DOC_TYPE_VALUES,
  PROJECT_FILE_TYPE_VALUES,
} from "~/lib/project-documents";
import { PREPARATION_STAGE_LABEL, advancePreparationStage } from "~/lib/preparation-stage";

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
      return ctx.db.$transaction(async (tx) => {
        const file = await tx.projectFile.create({
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

        // Uploading project documents moves the project into Preparation of
        // Plans. Only the preparation stage changes; the status is left alone.
        const project = await tx.project.findUnique({
          where: { id: input.projectId },
          select: { preparationStage: true },
        });
        const next = project && advancePreparationStage(project.preparationStage, "FOR_PLANS");
        if (next) {
          await tx.project.update({
            where: { id: input.projectId },
            data: { preparationStage: next },
          });
          await tx.projectActivity.create({
            data: {
              projectId: input.projectId,
              description: `Preparation stage moved to ${PREPARATION_STAGE_LABEL[next]} after uploading "${input.fileName}".`,
              createdById: ctx.session.user.id,
            },
          });
        }

        // `advancedTo` lets an open edit form show the new stage without a refetch.
        return { ...file, advancedTo: next ?? null };
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
