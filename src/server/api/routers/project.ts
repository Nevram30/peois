import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      include: { createdBy: { select: { name: true, email: true } } },
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

      // Auto-generate project code: PEO-YYYY-XXXXX
      const year = new Date().getFullYear();
      const lastProject = await ctx.db.project.findFirst({
        where: { projectCode: { startsWith: `PEO-${year}-` } },
        orderBy: { projectCode: "desc" },
        select: { projectCode: true },
      });

      let seq = 1;
      if (lastProject) {
        const lastSeq = parseInt(lastProject.projectCode.split("-")[2]!, 10);
        if (!isNaN(lastSeq)) seq = lastSeq + 1;
      }
      const projectCode = `PEO-${year}-${String(seq).padStart(5, "0")}`;

      return ctx.db.project.create({
        data: {
          projectCode,
          title: input.title,
          subType: input.subType,
          modeOfImplementation: input.modeOfImplementation,
          locationImplementation: input.locationImplementation,
          sourceOfFund: input.sourceOfFund,
          contractCost: input.contractCost,
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input.id } });
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [total, ongoing, completed] = await Promise.all([
      ctx.db.project.count(),
      ctx.db.project.count({ where: { status: "ON_GOING" } }),
      ctx.db.project.count({ where: { status: "COMPLETED" } }),
    ]);
    return { total, ongoing, completed };
  }),
});
