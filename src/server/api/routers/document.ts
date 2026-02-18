import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  adminAssistantProcedure,
} from "~/server/api/trpc";

export const documentRouter = createTRPCRouter({
  getAll: adminAssistantProcedure.query(async ({ ctx }) => {
    return ctx.db.document.findMany({
      include: { createdBy: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: adminAssistantProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.document.findUnique({
        where: { id: input.id },
        include: { createdBy: { select: { name: true, email: true } } },
      });
    }),

  create: adminAssistantProcedure
    .input(
      z.object({
        type: z.enum(["POW", "PURCHASE_REQUEST"]),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        district: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        filePath: z.string().optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
        projectRef: z.string().optional(),
        amount: z.number().min(0).optional(),
        purpose: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const prefix = input.type === "POW" ? "POW" : "PR";
      const year = new Date().getFullYear();
      const lastDoc = await ctx.db.document.findFirst({
        where: { documentCode: { startsWith: `${prefix}-${year}-` } },
        orderBy: { documentCode: "desc" },
        select: { documentCode: true },
      });

      let seq = 1;
      if (lastDoc) {
        const lastSeq = parseInt(lastDoc.documentCode.split("-")[2]!, 10);
        if (!isNaN(lastSeq)) seq = lastSeq + 1;
      }
      const documentCode = `${prefix}-${year}-${String(seq).padStart(5, "0")}`;

      return ctx.db.document.create({
        data: {
          documentCode,
          type: input.type,
          title: input.title,
          description: input.description,
          district: input.district,
          filePath: input.filePath,
          fileName: input.fileName,
          fileSize: input.fileSize,
          projectRef: input.projectRef,
          amount: input.amount,
          purpose: input.purpose,
          status: "DRAFT",
          createdById: ctx.session.user.id,
        },
      });
    }),

  update: adminAssistantProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional().nullable(),
        district: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        filePath: z.string().optional().nullable(),
        fileName: z.string().optional().nullable(),
        fileSize: z.number().optional().nullable(),
        projectRef: z.string().optional().nullable(),
        amount: z.number().min(0).optional().nullable(),
        purpose: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const doc = await ctx.db.document.findUnique({ where: { id } });
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }
      if (doc.status !== "DRAFT" && doc.status !== "REVISION") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only documents in DRAFT or REVISION status can be edited",
        });
      }
      return ctx.db.document.update({ where: { id }, data });
    }),

  updateStatus: adminAssistantProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["DRAFT", "FOR_REVIEW", "REVISION", "RELEASED"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.document.findUnique({
        where: { id: input.id },
      });
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }

      const validTransitions: Record<string, string[]> = {
        DRAFT: ["FOR_REVIEW"],
        FOR_REVIEW: ["REVISION", "RELEASED"],
        REVISION: ["FOR_REVIEW"],
        RELEASED: [],
      };

      const allowed = validTransitions[doc.status] ?? [];
      if (!allowed.includes(input.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot transition from ${doc.status} to ${input.status}`,
        });
      }

      const updateData: Record<string, unknown> = { status: input.status };
      if (input.status === "RELEASED") {
        updateData.releasedAt = new Date();
        updateData.releasedTo = `Division Clerk - ${doc.district.replace("_", " ")}`;
      }

      return ctx.db.document.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  delete: adminAssistantProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const doc = await ctx.db.document.findUnique({
        where: { id: input.id },
      });
      if (!doc) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Document not found" });
      }
      if (doc.status !== "DRAFT") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only DRAFT documents can be deleted",
        });
      }
      return ctx.db.document.delete({ where: { id: input.id } });
    }),

  getStats: adminAssistantProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, draft, forReview, released, todayCount] = await Promise.all([
      ctx.db.document.count({ where: { createdById: userId } }),
      ctx.db.document.count({ where: { createdById: userId, status: "DRAFT" } }),
      ctx.db.document.count({ where: { createdById: userId, status: "FOR_REVIEW" } }),
      ctx.db.document.count({ where: { createdById: userId, status: "RELEASED" } }),
      ctx.db.document.count({
        where: { createdById: userId, createdAt: { gte: today } },
      }),
    ]);
    return { total, draft, forReview, released, todayCount };
  }),
});
