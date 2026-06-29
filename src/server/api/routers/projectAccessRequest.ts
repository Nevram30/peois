import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "~/server/api/trpc";

const actionEnum = z.enum(["VIEW", "DOWNLOAD"]);

export const projectAccessRequestRouter = createTRPCRouter({
  /**
   * Admin requests access to a specific document action (view or download).
   * Idempotent: if a PENDING or APPROVED request already exists for the same
   * file/action/user it is returned instead of creating a duplicate. A DENIED
   * request can be re-submitted, which resets it to PENDING.
   */
  request: protectedProcedure
    .input(
      z.object({
        projectFileId: z.string(),
        action: actionEnum,
        note: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.projectFile.findUnique({
        where: { id: input.projectFileId },
        select: { id: true, projectId: true },
      });
      if (!file) {
        throw new Error("Document not found.");
      }

      const existing = await ctx.db.projectAccessRequest.findFirst({
        where: {
          projectFileId: input.projectFileId,
          action: input.action,
          requestedById: ctx.session.user.id,
        },
        orderBy: { createdAt: "desc" },
      });

      if (existing && existing.status !== "DENIED") {
        return existing;
      }

      if (existing?.status === "DENIED") {
        return ctx.db.projectAccessRequest.update({
          where: { id: existing.id },
          data: {
            status: "PENDING",
            note: input.note,
            reviewedById: null,
            reviewedAt: null,
          },
        });
      }

      return ctx.db.projectAccessRequest.create({
        data: {
          projectId: file.projectId,
          projectFileId: input.projectFileId,
          action: input.action,
          note: input.note,
          requestedById: ctx.session.user.id,
        },
      });
    }),

  /**
   * Returns the current admin's access requests for a project, so the document
   * actions column can render the right state (request / pending / approved).
   */
  getMyForProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.projectAccessRequest.findMany({
        where: {
          projectId: input.projectId,
          requestedById: ctx.session.user.id,
        },
        select: {
          id: true,
          projectFileId: true,
          action: true,
          status: true,
        },
      });
    }),

  /** Super-admin: full list of access requests across all projects. */
  list: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.projectAccessRequest.findMany({
      include: {
        project: { select: { id: true, title: true, projectCode: true } },
        projectFile: { select: { id: true, fileName: true, fileType: true, fileUrl: true } },
        requestedBy: { select: { name: true, email: true, image: true, employeeId: true, role: true } },
        reviewedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Super-admin: count of pending requests (for the nav badge). */
  pendingCount: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.projectAccessRequest.count({ where: { status: "PENDING" } });
  }),

  /** Super-admin: approve or deny a request. */
  decide: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
        decision: z.enum(["APPROVED", "DENIED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectAccessRequest.update({
        where: { id: input.id },
        data: {
          status: input.decision,
          reviewedById: ctx.session.user.id,
          reviewedAt: new Date(),
        },
      });
    }),
});
