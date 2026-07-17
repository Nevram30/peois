import { z } from "zod";

import { archiverProcedure, createTRPCRouter } from "~/server/api/trpc";

export const archiveRouter = createTRPCRouter({
  // Lightweight project list for the archiver's project selector.
  listProjects: archiverProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      select: {
        id: true,
        projectCode: true,
        title: true,
      },
      orderBy: { title: "asc" },
    });
  }),

  create: archiverProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project is required"),
        roomLocation: z.string().min(1, "Room location is required"),
        cabinetLabel: z.string().min(1, "Cabinet label is required"),
        shelfNumber: z
          .number()
          .int("Shelf number must be a whole number")
          .min(1, "Shelf number must be at least 1"),
        boxId: z.string().min(1, "Box ID is required"),
        folderRange: z.string().min(1, "Folder number / sequence is required"),
        remarks: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        select: { id: true },
      });

      if (!project) {
        throw new Error("Project not found");
      }

      return ctx.db.physicalArchiveLocation.create({
        data: {
          projectId: input.projectId,
          roomLocation: input.roomLocation,
          cabinetLabel: input.cabinetLabel.trim(),
          shelfNumber: input.shelfNumber,
          boxId: input.boxId.trim(),
          folderRange: input.folderRange.trim(),
          remarks: input.remarks?.trim() ?? null,
          createdById: ctx.session.user.id,
        },
      });
    }),

  // Archive registry: every saved physical location, newest first.
  getAll: archiverProcedure.query(async ({ ctx }) => {
    return ctx.db.physicalArchiveLocation.findMany({
      include: {
        project: {
          select: { id: true, projectCode: true, title: true },
        },
        createdBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  delete: archiverProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.physicalArchiveLocation.delete({
        where: { id: input.id },
      });
    }),
});
