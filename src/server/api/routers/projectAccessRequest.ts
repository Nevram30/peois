import { z } from "zod";
import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { normalizeName } from "~/lib/names";

const actionEnum = z.enum(["VIEW", "DOWNLOAD"]);

export const projectAccessRequestRouter = createTRPCRouter({
  /**
   * Admins a document access request for this project can be addressed to.
   * `isInCharge` marks the ones actually tied to the project — an admin whose
   * name is listed under "Engineers In-Charge" (free text on the project) or
   * who created the record — and those are returned first so the dropdown
   * defaults to a real project in-charge.
   */
  getProjectAdmins: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const [project, admins] = await Promise.all([
        ctx.db.project.findUnique({
          where: { id: input.projectId },
          select: { projectEngineer: true, createdById: true },
        }),
        ctx.db.user.findMany({
          where: { role: "ADMIN", status: "ACTIVE" },
          select: {
            id: true,
            name: true,
            email: true,
            employeeId: true,
            designation: true,
          },
          orderBy: { name: "asc" },
        }),
      ]);

      const engineers = new Set(
        (project?.projectEngineer ?? "")
          .split(",")
          .map((e) => normalizeName(e))
          .filter(Boolean),
      );

      return admins
        .map((admin) => ({
          ...admin,
          isInCharge:
            admin.id === project?.createdById ||
            engineers.has(normalizeName(admin.name ?? "")),
        }))
        .sort((a, b) => Number(b.isInCharge) - Number(a.isInCharge));
    }),

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
        /** The project in-charge (an ADMIN) the request is addressed to. */
        assignedToId: z.string().optional(),
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

      if (input.assignedToId) {
        const inCharge = await ctx.db.user.findFirst({
          where: { id: input.assignedToId, role: "ADMIN", status: "ACTIVE" },
          select: { id: true },
        });
        if (!inCharge) {
          throw new Error("Selected project in-charge is not an active admin.");
        }
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
            assignedToId: input.assignedToId ?? null,
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
          assignedToId: input.assignedToId,
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

  /** Admin: full list of access requests across all projects. */
  list: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.projectAccessRequest.findMany({
      include: {
        project: { select: { id: true, title: true, projectCode: true } },
        projectFile: { select: { id: true, fileName: true, fileType: true, fileUrl: true } },
        requestedBy: { select: { name: true, email: true, image: true, employeeId: true, role: true } },
        assignedTo: { select: { name: true, email: true, designation: true } },
        reviewedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  /** Admin: count of pending requests (for the nav badge). */
  pendingCount: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.projectAccessRequest.count({ where: { status: "PENDING" } });
  }),

  /** Admin: approve or deny a request. */
  decide: adminProcedure
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
