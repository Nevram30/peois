import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { archiverProcedure, createTRPCRouter } from "~/server/api/trpc";

export const archiveRouter = createTRPCRouter({
  // All District I & II projects with their archive entry (if any) for the
  // archiver's projects table.
  listProjects: archiverProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        locationImplementation: { in: ["DISTRICT_I", "DISTRICT_II"] },
      },
      select: {
        id: true,
        projectCode: true,
        title: true,
        budgetYear: true,
        status: true,
        locationImplementation: true,
        cityMunicipality: true,
        contractorName: true,
        projectEngineer: true,
        dateCompleted: true,
        archiveLocations: {
          select: {
            id: true,
            boxLabel: true,
            boxRange: true,
            boxNumbers: true,
            createdAt: true,
            createdBy: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { title: "asc" },
    });
  }),

  create: archiverProcedure
    .input(
      z.object({
        projectId: z.string().min(1, "Project is required"),
        boxLabel: z.enum(["COMPLETED", "OTHERS"]),
        boxRange: z.string().min(1, "Box range is required"),
        boxNumbers: z.array(z.string().trim().min(1)).optional(),
        remarks: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.findUnique({
        where: { id: input.projectId },
        select: { id: true, archiveLocations: { select: { id: true } } },
      });

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }
      if (project.archiveLocations.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This project is already archived.",
        });
      }

      return ctx.db.physicalArchiveLocation.create({
        data: {
          projectId: input.projectId,
          boxLabel: input.boxLabel,
          boxRange: input.boxRange.trim(),
          boxNumbers: input.boxNumbers?.length
            ? input.boxNumbers.join(", ")
            : null,
          remarks: input.remarks?.trim() ?? null,
          createdById: ctx.session.user.id,
        },
      });
    }),

  update: archiverProcedure
    .input(
      z.object({
        id: z.string().min(1),
        boxLabel: z.enum(["COMPLETED", "OTHERS"]),
        boxRange: z.string().min(1, "Box range is required"),
        boxNumbers: z.array(z.string().trim().min(1)).optional(),
        remarks: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const entry = await ctx.db.physicalArchiveLocation.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!entry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Archive entry not found",
        });
      }

      return ctx.db.physicalArchiveLocation.update({
        where: { id: input.id },
        data: {
          boxLabel: input.boxLabel,
          boxRange: input.boxRange.trim(),
          boxNumbers: input.boxNumbers?.length
            ? input.boxNumbers.join(", ")
            : null,
          remarks: input.remarks?.trim() ?? null,
        },
      });
    }),

  // Archive registry: every saved physical location, newest first.
  getAll: archiverProcedure.query(async ({ ctx }) => {
    return ctx.db.physicalArchiveLocation.findMany({
      include: {
        project: {
          select: { id: true, projectCode: true, title: true, budgetYear: true },
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
