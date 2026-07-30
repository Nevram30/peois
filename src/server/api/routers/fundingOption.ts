import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "~/server/api/trpc";
import { SOURCE_OF_FUND_VALUES } from "~/lib/fund-constants";

// Super admins extend the Funding Information dropdowns at runtime from the
// Manual Entry card on the project override page. Everyone can read the lists —
// they feed the same selects on the admin create/update project forms — but only
// super admins can add to or remove from them.

const isDuplicate = (e: unknown) =>
  typeof e === "object" && e !== null && "code" in e && e.code === "P2002";

export const fundingOptionRouter = createTRPCRouter({
  /** Everything the Funding Information selects need, in one round trip. */
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const [programs, projects, landbankNumbers] = await Promise.all([
      ctx.db.fundingProgramOption.findMany({ orderBy: { name: "asc" } }),
      ctx.db.fundingProjectOption.findMany({ orderBy: { name: "asc" } }),
      ctx.db.landbankLoanOption.findMany({ orderBy: { createdAt: "asc" } }),
    ]);

    return {
      programs: programs.map((p) => ({
        id: p.id,
        name: p.name,
        sourceOfFund: p.sourceOfFund as string,
      })),
      projects: projects.map((p) => ({ id: p.id, name: p.name, program: p.program })),
      landbankNumbers: landbankNumbers.map((l) => ({ id: l.id, number: l.number })),
    };
  }),

  createProgram: superAdminProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Program name is required"),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.fundingProgramOption.create({
          data: {
            name: input.name,
            sourceOfFund: input.sourceOfFund,
            createdById: ctx.session.user.id,
          },
        });
      } catch (e) {
        if (isDuplicate(e)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "That program already exists for this source of fund.",
          });
        }
        throw e;
      }
    }),

  createProject: superAdminProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Project name is required"),
        // Built-in FUNDING_PROGRAM_VALUES key or a custom program name.
        program: z.string().trim().min(1, "Program is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.fundingProjectOption.create({
          data: {
            name: input.name,
            program: input.program,
            createdById: ctx.session.user.id,
          },
        });
      } catch (e) {
        if (isDuplicate(e)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "That project already exists for this program.",
          });
        }
        throw e;
      }
    }),

  createLandbankNumber: superAdminProcedure
    .input(z.object({ number: z.string().trim().min(1, "LBP-TL number is required") }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.landbankLoanOption.create({
          data: { number: input.number, createdById: ctx.session.user.id },
        });
      } catch (e) {
        if (isDuplicate(e)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "That LBP-TL number is already registered.",
          });
        }
        throw e;
      }
    }),

  deleteProgram: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fundingProgramOption.delete({ where: { id: input.id } });
    }),

  deleteProject: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.fundingProjectOption.delete({ where: { id: input.id } });
    }),

  deleteLandbankNumber: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.landbankLoanOption.delete({ where: { id: input.id } });
    }),
});
