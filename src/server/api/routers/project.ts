import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  SOURCE_OF_FUND_VALUES,
  PROJECT_SUB_TYPE_VALUES,
  PROJECT_STATUS_VALUES,
} from "~/lib/fund-constants";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      include: {
        createdBy: { select: { id: true, name: true, email: true, image: true } },
        activities: {
          include: {
            createdBy: { select: { id: true, name: true, email: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: { createdBy: { select: { name: true, email: true } } },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Project title is required"),
        subType: z.enum(PROJECT_SUB_TYPE_VALUES).optional().nullable(),
        modeOfImplementation: z.enum(["BY_ADMINISTRATION", "BY_CONTRACT"]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES),
        projectCost: z.number().min(0).default(0),
        contractCost: z.number().min(0).default(0),
        completionPercentage: z.number().int().min(0).max(100).default(0),
        contractorName: z.string().optional(),
        projectEngineer: z.string().optional(),
        budgetYear: z.string().optional(),
        dateStarted: z.date().optional().nullable(),
        targetCompletionDate: z.date().optional().nullable(),
        revisedCompletionDate: z.date().optional().nullable(),
        dateCompleted: z.date().optional().nullable(),
        daysSuspended: z.number().int().min(0).default(0),
        daysExtended: z.number().int().min(0).default(0),
        numFemale: z.number().int().min(0).default(0),
        numMale: z.number().int().min(0).default(0),
        numManDays: z.number().int().min(0).default(0),
        district: z.enum(["DISTRICT_I", "DISTRICT_II"]).optional().nullable(),
        cityMunicipality: z.string().optional(),
        barangay: z.string().optional(),
        purok: z.string().optional(),
        sitio: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(PROJECT_STATUS_VALUES).optional(),
        imageUrl: z.string().optional(),
        documentUrl: z.string().optional(),
        documentName: z.string().optional(),
        projectCode: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const duration =
        input.dateStarted && input.targetCompletionDate
          ? Math.ceil(
            (input.targetCompletionDate.getTime() -
              input.dateStarted.getTime()) /
            (1000 * 60 * 60 * 24),
          )
          : 0;

      const numPersons = input.numFemale + input.numMale;

      return ctx.db.project.create({
        data: {
          projectCode: input.projectCode ?? "",
          title: input.title,
          subType: input.subType,
          modeOfImplementation: input.modeOfImplementation,
          locationImplementation: input.locationImplementation,
          sourceOfFund: input.sourceOfFund,
          projectCost: input.projectCost,
          contractCost: input.contractCost,
          completionPercentage: input.completionPercentage,
          contractorName: input.contractorName,
          projectEngineer: input.projectEngineer,
          budgetYear: input.budgetYear,
          dateStarted: input.dateStarted,
          targetCompletionDate: input.targetCompletionDate,
          duration,
          revisedCompletionDate: input.revisedCompletionDate,
          dateCompleted: input.dateCompleted,
          daysSuspended: input.daysSuspended,
          daysExtended: input.daysExtended,
          numFemale: input.numFemale,
          numMale: input.numMale,
          numPersons,
          numManDays: input.numManDays,
          district: input.district,
          cityMunicipality: input.cityMunicipality,
          barangay: input.barangay,
          purok: input.purok,
          sitio: input.sitio,
          description: input.description,
          status: input.status ?? "ON_GOING",
          imageUrl: input.imageUrl,
          documentUrl: input.documentUrl,
          documentName: input.documentName,
          createdById: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Project title is required"),
        subType: z.enum(PROJECT_SUB_TYPE_VALUES).optional().nullable(),
        modeOfImplementation: z.enum(["BY_ADMINISTRATION", "BY_CONTRACT"]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES),
        contractCost: z.number().min(0).default(0),
        contractorName: z.string().optional(),
        projectEngineer: z.string().optional(),
        dateStarted: z.date().optional().nullable(),
        targetCompletionDate: z.date().optional().nullable(),
        revisedCompletionDate: z.date().optional().nullable(),
        dateCompleted: z.date().optional().nullable(),
        daysSuspended: z.number().int().min(0).default(0),
        daysExtended: z.number().int().min(0).default(0),
        numFemale: z.number().int().min(0).default(0),
        numMale: z.number().int().min(0).default(0),
        numManDays: z.number().int().min(0).default(0),
        district: z.enum(["DISTRICT_I", "DISTRICT_II"]).optional().nullable(),
        cityMunicipality: z.string().optional(),
        barangay: z.string().optional(),
        purok: z.string().optional(),
        sitio: z.string().optional(),
        budgetYear: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(PROJECT_STATUS_VALUES).optional(),
        completionPercentage: z.number().int().min(0).max(100).optional(),
        imageUrl: z.string().optional(),
        documentUrl: z.string().optional(),
        documentName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const duration =
        data.dateStarted && data.targetCompletionDate
          ? Math.ceil(
            (data.targetCompletionDate.getTime() -
              data.dateStarted.getTime()) /
            (1000 * 60 * 60 * 24),
          )
          : 0;
      const numPersons = data.numFemale + data.numMale;

      return ctx.db.project.update({
        where: { id },
        data: {
          ...data,
          duration,
          numPersons,
        },
      });
    }),

  updateProgress: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(PROJECT_STATUS_VALUES),
        completionPercentage: z.number().int().min(0).max(100),
        imageUrl: z.string().optional(),
        documentUrl: z.string().optional(),
        documentName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.project.update({ where: { id }, data });
    }),

  superAdminOverride: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string().min(1, "Reason is required"),
        title: z.string().min(1),
        modeOfImplementation: z.enum(["BY_ADMINISTRATION", "BY_CONTRACT"]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES),
        subType: z.enum(PROJECT_SUB_TYPE_VALUES).optional().nullable(),
        status: z.enum(PROJECT_STATUS_VALUES).optional(),
        projectCost: z.number().min(0).default(0),
        contractCost: z.number().min(0).default(0),
        completionPercentage: z.number().int().min(0).max(100).optional(),
        contractorName: z.string().optional(),
        projectEngineer: z.string().optional(),
        budgetYear: z.string().optional(),
        dateStarted: z.date().optional().nullable(),
        targetCompletionDate: z.date().optional().nullable(),
        revisedCompletionDate: z.date().optional().nullable(),
        numFemale: z.number().int().min(0).default(0),
        numMale: z.number().int().min(0).default(0),
        numManDays: z.number().int().min(0).default(0),
        district: z.enum(["DISTRICT_I", "DISTRICT_II"]).optional().nullable(),
        cityMunicipality: z.string().optional(),
        barangay: z.string().optional(),
        purok: z.string().optional(),
        sitio: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, reason, ...data } = input;
      const numPersons = data.numFemale + data.numMale;
      const duration =
        data.dateStarted && data.targetCompletionDate
          ? Math.ceil(
            (data.targetCompletionDate.getTime() - data.dateStarted.getTime()) /
            (1000 * 60 * 60 * 24),
          )
          : 0;

      const [project] = await ctx.db.$transaction([
        ctx.db.project.update({
          where: { id },
          data: { ...data, numPersons, duration },
        }),
        ctx.db.projectActivity.create({
          data: {
            projectId: id,
            description: `[OVERRIDE] ${reason}`,
            createdById: ctx.session.user.id,
          },
        }),
      ]);

      return project;
    }),

  createDisbursement: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        amount: z.number().min(0),
        referenceNumber: z.string().optional(),
        type: z.enum(["FUEL", "LABOR", "MATERIALS"]).optional(),
        date: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.disbursement.create({
        data: {
          projectId: input.projectId,
          amount: input.amount,
          referenceNumber: input.referenceNumber,
          type: input.type,
          date: input.date ?? new Date(),
          createdById: ctx.session.user.id,
        },
      });
    }),

  getDisbursements: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.disbursement.findMany({
        where: { projectId: input.projectId },
        orderBy: { date: "asc" },
      });
    }),

  createVariationOrder: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        amount: z.number().min(0),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES).optional(),
        date: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.variationOrder.create({
        data: {
          projectId: input.projectId,
          amount: input.amount,
          sourceOfFund: input.sourceOfFund,
          date: input.date ?? new Date(),
          createdById: ctx.session.user.id,
        },
      });
    }),

  getVariationOrders: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.variationOrder.findMany({
        where: { projectId: input.projectId },
        orderBy: { date: "asc" },
      });
    }),

  sendTaskNotification: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        notifyUserId: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.taskNotification.create({
        data: {
          projectId: input.projectId,
          notifyUserId: input.notifyUserId,
          priority: input.priority,
          description: input.description,
          createdById: ctx.session.user.id,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input.id } });
    }),

  getStats: protectedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const where = input?.budgetYear ? { budgetYear: input.budgetYear } : {};

      const [
        total,
        ongoing,
        completed,
        suspended,
        notYetStarted,
        forImplementation,
        reAlignment,
        others,
        todayCount,
        noAllotted,
      ] = await Promise.all([
        ctx.db.project.count({ where }),
        ctx.db.project.count({ where: { ...where, status: "ON_GOING" } }),
        ctx.db.project.count({ where: { ...where, status: "COMPLETED" } }),
        ctx.db.project.count({ where: { ...where, status: "SUSPENDED" } }),
        ctx.db.project.count({ where: { ...where, status: "NOT_YET_STARTED" } }),
        ctx.db.project.count({ where: { ...where, status: "FOR_IMPLEMENTATION" } }),
        ctx.db.project.count({ where: { ...where, status: "RE_ALIGNMENT" } }),
        ctx.db.project.count({ where: { ...where, status: "OTHERS" } }),
        ctx.db.project.count({ where: { ...where, createdAt: { gte: today } } }),
        ctx.db.project.count({ where: { ...where, contractCost: 0 } }),
      ]);
      return {
        total,
        ongoing,
        completed,
        suspended,
        notYetStarted,
        forImplementation,
        reAlignment,
        others,
        todayCount,
        noAllotted,
      };
    }),

  getOverviewStats: protectedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.budgetYear ? { budgetYear: input.budgetYear } : {};

      const [completed, ongoing, forImplementation, suspended, realigned, notYetStarted, others] =
        await Promise.all([
          ctx.db.project.count({ where: { ...where, status: "COMPLETED" } }),
          ctx.db.project.count({ where: { ...where, status: "ON_GOING" } }),
          ctx.db.project.count({ where: { ...where, status: "FOR_IMPLEMENTATION" } }),
          ctx.db.project.count({ where: { ...where, status: "SUSPENDED" } }),
          ctx.db.project.count({ where: { ...where, status: "RE_ALIGNMENT" } }),
          ctx.db.project.count({ where: { ...where, status: "NOT_YET_STARTED" } }),
          ctx.db.project.count({ where: { ...where, status: "OTHERS" } }),
        ]);
      return { completed, ongoing, forImplementation, suspended, realigned, notYetStarted, others };
    }),

  getBudgetYears: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.project.findMany({
      where: { budgetYear: { not: null } },
      select: { budgetYear: true },
      distinct: ["budgetYear"],
      orderBy: { budgetYear: "desc" },
    });
    return rows.map((r) => r.budgetYear).filter((y): y is string => Boolean(y));
  }),

  // getDistrictData: protectedProcedure
  //   .query(async ({ ctx}) => {
  //     const districtCounts = await ctx.db.project.groupBy({
  //       by: ["district"],
  //       where: { district: { not: null } },
  //       _count: { district: true },
  //     });

  //     return districtCounts.map((d) => ({
  //       district: d.district!,
  //       count: d._count.district,
  //     }));
  //   }),

  //get district 1 and district 2 status like how many ongoing, completed, etc. in each district
  getDistrictData: protectedProcedure
    .query(async ({ ctx }) => {
      const districts = ["DISTRICT_I", "DISTRICT_II"] as const;

      const data = await Promise.all(
        districts.map(async (district) => {
          const counts = await ctx.db.project.groupBy({
            by: ["status"],
            where: { district },
            _count: { status: true },
          });

          return {
            district,
            counts: counts.reduce((acc, curr) => {
              acc[curr.status] = curr._count.status;
              return acc;
            }, {} as Record<string, number>),
          };
        }),
      );

      return data;
    }),

  getFinancialOverview: protectedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const currentYear = new Date().getFullYear().toString();
      const where = input?.budgetYear ? { budgetYear: input.budgetYear } : {};

      const projects = await ctx.db.project.findMany({
        where,
        select: {
          sourceOfFund: true,
          subType: true,
          projectCost: true,
          completionPercentage: true,
        },
      });

      const bySource: Record<string, number> = {};
      const bySubType: Record<string, { amount: number; sourceOfFund: string }> = {};

      let totalAllocation = 0;
      let progressSum = 0;

      for (const p of projects) {

        progressSum += Math.max(0, Math.min(100, p.completionPercentage ?? 0));

        if (p.projectCost > 0) {
          bySource[p.sourceOfFund] = (bySource[p.sourceOfFund] ?? 0) + p.projectCost;
          totalAllocation += p.projectCost;

          const subKey = p.subType ?? `__NONE__:${p.sourceOfFund}`;
          const existing = bySubType[subKey];
          if (existing) {
            existing.amount += p.projectCost;
          } else {
            bySubType[subKey] = {
              amount: p.projectCost,
              sourceOfFund: p.sourceOfFund,
            };
          }
        }
      }

      const executionRate =
        projects.length > 0
          ? Math.min(100, Math.max(0, progressSum / projects.length))
          : 0;

      return {
        budgetYear: input?.budgetYear ?? currentYear,
        totalAllocation,
        bySource,
        bySubType,
        executionRate: Math.round(executionRate * 10) / 10,
      };


    }),
});
