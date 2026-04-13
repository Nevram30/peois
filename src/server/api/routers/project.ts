import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
        subType: z
          .enum([
            "WATER_SYSTEMS",
            "GOVERNMENT_BUILDINGS",
            "ELECTRIFICATION",
            "RESPONSE_CAMP_MGMT",
            "SUPPLEMENTAL_BUDGET_2",
            "PARK_AND_DEVELOPMENT",
            "DOH",
            "PROVINCIAL_GOVT_OFFICE",
          ])
          .optional()
          .nullable(),
        modeOfImplementation: z.enum(["BY_ADMINISTRATION", "BY_CONTRACT"]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum([
          "GENERAL_FUND",
          "SEF",
          "TRUST_FUND",
          "TWENTY_PERCENT_DEV_FUND",
          "AID",
          "LOAN",
          "OTHERS",
        ]),
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
        sitio: z.string().optional(),
        description: z.string().optional(),
        status: z
          .enum(["NOT_YET_STARTED", "ON_GOING", "COMPLETED", "SUSPENDED"])
          .optional(),
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
          contractCost: input.contractCost,
          contractorName: input.contractorName,
          projectEngineer: input.projectEngineer,
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
        subType: z
          .enum([
            "WATER_SYSTEMS",
            "GOVERNMENT_BUILDINGS",
            "ELECTRIFICATION",
            "RESPONSE_CAMP_MGMT",
            "SUPPLEMENTAL_BUDGET_2",
            "PARK_AND_DEVELOPMENT",
            "DOH",
            "PROVINCIAL_GOVT_OFFICE",
          ])
          .optional()
          .nullable(),
        modeOfImplementation: z.enum(["BY_ADMINISTRATION", "BY_CONTRACT"]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum([
          "GENERAL_FUND",
          "SEF",
          "TRUST_FUND",
          "TWENTY_PERCENT_DEV_FUND",
          "AID",
          "LOAN",
          "OTHERS",
        ]),
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
        sitio: z.string().optional(),
        description: z.string().optional(),
        status: z
          .enum(["NOT_YET_STARTED", "ON_GOING", "COMPLETED", "SUSPENDED"])
          .optional(),
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
        status: z.enum(["NOT_YET_STARTED", "ON_GOING", "COMPLETED", "SUSPENDED"]),
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
        sourceOfFund: z.enum([
          "GENERAL_FUND",
          "SEF",
          "TRUST_FUND",
          "TWENTY_PERCENT_DEV_FUND",
          "AID",
          "LOAN",
          "OTHERS",
        ]),
        subType: z
          .enum([
            "WATER_SYSTEMS",
            "GOVERNMENT_BUILDINGS",
            "ELECTRIFICATION",
            "RESPONSE_CAMP_MGMT",
            "SUPPLEMENTAL_BUDGET_2",
            "PARK_AND_DEVELOPMENT",
            "DOH",
            "PROVINCIAL_GOVT_OFFICE",
          ])
          .optional()
          .nullable(),
        status: z.enum(["NOT_YET_STARTED", "ON_GOING", "COMPLETED", "SUSPENDED"]).optional(),
        projectCost: z.number().min(0).default(0),
        contractCost: z.number().min(0).default(0),
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
        date: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.disbursement.create({
        data: {
          projectId: input.projectId,
          amount: input.amount,
          referenceNumber: input.referenceNumber,
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

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, ongoing, completed, suspended, notYetStarted, todayCount] =
      await Promise.all([
        ctx.db.project.count(),
        ctx.db.project.count({ where: { status: "ON_GOING" } }),
        ctx.db.project.count({ where: { status: "COMPLETED" } }),
        ctx.db.project.count({ where: { status: "SUSPENDED" } }),
        ctx.db.project.count({ where: { status: "NOT_YET_STARTED" } }),
        ctx.db.project.count({ where: { createdAt: { gte: today } } }),
      ]);
    return { total, ongoing, completed, suspended, notYetStarted, todayCount };
  }),
});
