import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  districtScopedAdminProcedure,
  districtScopedProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { isReachableFromDistrict } from "~/lib/divisions";
import { getMunicipalitiesByDistrict } from "~/lib/davao-del-norte-locations";
import { type District } from "../../../../generated/prisma";
import { notificationEmitter } from "~/server/api/events";
import {
  SOURCE_OF_FUND_VALUES,
  PROJECT_STATUS_VALUES,
  DISBURSEMENT_TYPE_VALUES,
  PROJECT_ACCOUNT_VALUES,
} from "~/lib/fund-constants";
import { PROJECT_IMAGE_SLOTS } from "~/lib/project-images";
import {
  PREPARATION_STAGE_LABEL,
  PREPARATION_STAGE_VALUES,
  advancePreparationStage,
  type PreparationStageValue,
} from "~/lib/preparation-stage";

// Where-clause fragment limiting projects to the caller's district scope
// (empty for unrestricted users), spread into each query's where.
const districtWhere = (scope: District | null) =>
  scope ? { locationImplementation: scope } : {};

export const projectRouter = createTRPCRouter({
  getAll: districtScopedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: districtWhere(ctx.districtScope),
      include: {
        createdBy: { select: { id: true, name: true, email: true, image: true } },
        activities: {
          include: {
            createdBy: { select: { id: true, name: true, email: true, image: true } },
          },
        },
        disbursements: { select: { amount: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getById: districtScopedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findFirst({
        where: { id: input.id, ...districtWhere(ctx.districtScope) },
        include: { createdBy: { select: { name: true, email: true } } },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Project title is required"),
        subType: z.string().optional().nullable(),
        program: z.string().optional().nullable(),
        projectAccount: z.enum(PROJECT_ACCOUNT_VALUES).optional().nullable(),
        landbankNumber: z.string().optional().nullable(),
        supplementalBudgetYear: z.string().optional().nullable(),
        supplementalBudgetNumber: z.string().optional().nullable(),
        modeOfImplementation: z.enum([
          "BY_ADMINISTRATION",
          "BY_CONTRACT",
          "UNASSIGNED_FOR_DETERMINATION",
        ]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES),
        projectCost: z.number().min(0).default(0),
        contractCost: z.number().min(0).default(0),
        completionPercentage: z.number().min(0).max(100).default(0),
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
        latitude: z.number().min(-90).max(90).optional().nullable(),
        longitude: z.number().min(-180).max(180).optional().nullable(),
        // ROAD projects also carry an end point; latitude/longitude is the start.
        locationType: z.enum(["BUILDING", "ROAD"]).optional().nullable(),
        endLatitude: z.number().min(-90).max(90).optional().nullable(),
        endLongitude: z.number().min(-180).max(180).optional().nullable(),
        description: z.string().optional(),
        status: z.enum(PROJECT_STATUS_VALUES).optional(),
        slippageTarget: z.number().min(0).max(100).optional().nullable(),
        slippageActual: z.number().min(0).max(100).optional().nullable(),
        slippageRevision: z.number().int().min(0).default(0),
        imageUrl: z.string().optional(),
        imageUrls: z.array(z.string()).max(PROJECT_IMAGE_SLOTS).optional(),
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

      const project = await ctx.db.project.create({
        data: {
          projectCode: input.projectCode ?? "",
          title: input.title,
          subType: input.subType,
          program: input.program,
          projectAccount: input.projectAccount,
          landbankNumber: input.landbankNumber,
          supplementalBudgetYear: input.supplementalBudgetYear,
          supplementalBudgetNumber: input.supplementalBudgetNumber,
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
          latitude: input.latitude,
          longitude: input.longitude,
          locationType: input.locationType,
          endLatitude: input.endLatitude,
          endLongitude: input.endLongitude,
          description: input.description,
          status: input.status ?? "ON_GOING",
          // Every new project starts its preparation at Surveying.
          preparationStage: "FOR_SURVEY",
          slippageTarget: input.slippageTarget,
          slippageActual: input.slippageActual,
          slippageRevision: input.slippageRevision,
          imageUrl: input.imageUrl,
          imageUrls: input.imageUrls ?? [],
          documentUrl: input.documentUrl,
          documentName: input.documentName,
          createdById: ctx.session.user.id,
        },
      });

      // Audit trail: record who created the project in the activity log.
      await ctx.db.projectActivity.create({
        data: {
          projectId: project.id,
          description: `Created new project "${project.title}"`,
          createdById: ctx.session.user.id,
        },
      });

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Project title is required"),
        subType: z.string().optional().nullable(),
        program: z.string().optional().nullable(),
        projectAccount: z.enum(PROJECT_ACCOUNT_VALUES).optional().nullable(),
        landbankNumber: z.string().optional().nullable(),
        supplementalBudgetYear: z.string().optional().nullable(),
        supplementalBudgetNumber: z.string().optional().nullable(),
        modeOfImplementation: z.enum([
          "BY_ADMINISTRATION",
          "BY_CONTRACT",
          "UNASSIGNED_FOR_DETERMINATION",
        ]),
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
        completionPercentage: z.number().min(0).max(100).optional(),
        latitude: z.number().min(-90).max(90).optional().nullable(),
        longitude: z.number().min(-180).max(180).optional().nullable(),
        locationType: z.enum(["BUILDING", "ROAD"]).optional().nullable(),
        endLatitude: z.number().min(-90).max(90).optional().nullable(),
        endLongitude: z.number().min(-180).max(180).optional().nullable(),
        // Nullable, not just optional: clearing every photo has to be able to
        // clear the mirrored cover too, or toImageSlots would fall back to the
        // stale imageUrl and resurrect a photo the user just removed.
        imageUrl: z.string().nullable().optional(),
        imageUrls: z.array(z.string()).max(PROJECT_IMAGE_SLOTS).optional(),
        documentUrl: z.string().optional(),
        documentName: z.string().optional(),
        // Manual override from the edit form; sent only when the admin changed
        // it. Not nullable: a stage, once set, can be changed but not cleared.
        preparationStage: z.enum(PREPARATION_STAGE_VALUES).optional(),
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

      return ctx.db.$transaction(async (tx) => {
        const before = data.preparationStage
          ? await tx.project.findUnique({ where: { id }, select: { preparationStage: true } })
          : null;

        const project = await tx.project.update({
          where: { id },
          data: {
            ...data,
            duration,
            numPersons,
          },
        });

        // A manual stage change is logged like the automatic ones. The
        // automatic rules read the stored stage when they fire, so they carry
        // on from whatever was set here.
        if (data.preparationStage && before && before.preparationStage !== data.preparationStage) {
          const was = before.preparationStage
            ? PREPARATION_STAGE_LABEL[before.preparationStage]
            : "not set";
          await tx.projectActivity.create({
            data: {
              projectId: id,
              description: `Preparation stage manually set to ${PREPARATION_STAGE_LABEL[data.preparationStage]} (was ${was}).`,
              createdById: ctx.session.user.id,
            },
          });
        }

        return project;
      });
    }),

  // Filing a slippage assessment. Kept apart from `update` because each save is
  // a numbered re-assessment rather than an edit: the revision counter advances
  // here, on the server, so two encoders cannot file the same revision number.
  updateSlippage: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        slippageTarget: z.number().min(0).max(100).nullable(),
        slippageActual: z.number().min(0).max(100).nullable(),
        revisedTarget: z.number().min(0).max(100).nullable().optional(),
        // Assessment date and remarks for the history row this save files.
        // The date may be back-dated; it defaults to the moment of filing.
        date: z.date().optional(),
        remarks: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const current = await ctx.db.project.findUnique({
        where: { id: input.id },
        select: {
          slippageTarget: true,
          slippageActual: true,
          slippageRevision: true,
        },
      });
      if (!current) throw new Error("Project not found");

      // Rev. 0 is the first assessment on file; every later filing rolls the
      // counter forward. Each Record files its own history row, even when the
      // figures repeat — a later date at the same percentage is itself a
      // reading (the project stalled).
      const hadAssessment =
        current.slippageTarget !== null && current.slippageActual !== null;
      const filing = input.slippageTarget !== null && input.slippageActual !== null;
      const slippageRevision =
        hadAssessment && filing
          ? current.slippageRevision + 1
          : current.slippageRevision;

      // Clearing the assessment leaves the history untouched — a filed
      // revision stays on the record even once the current figures are gone.
      const historyRow =
        input.slippageTarget !== null && input.slippageActual !== null
          ? ctx.db.slippageAssessment.create({
            data: {
              projectId: input.id,
              date: input.date ?? new Date(),
              target: input.slippageTarget,
              revisedTarget: input.revisedTarget ?? null,
              actual: input.slippageActual,
              revision: slippageRevision,
              remarks: input.remarks?.trim() ?? null,
              createdById: ctx.session.user.id,
            },
          })
          : null;

      const [project] = await ctx.db.$transaction([
        ctx.db.project.update({
          where: { id: input.id },
          data: {
            slippageTarget: input.slippageTarget,
            slippageActual: input.slippageActual,
            slippageRevision,
          },
        }),
        ...(historyRow ? [historyRow] : []),
      ]);

      return project;
    }),

  // Filing an assessment against a project that already exists — used by the
  // Add New Project form to persist the rows queued before the project had an
  // id. The revision is the one the form displayed for that row.
  createSlippageAssessment: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        date: z.date(),
        target: z.number().min(0).max(100),
        revisedTarget: z.number().min(0).max(100).nullable().optional(),
        actual: z.number().min(0).max(100),
        revision: z.number().int().min(0).default(0),
        remarks: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.slippageAssessment.create({
        data: {
          projectId: input.projectId,
          date: input.date,
          target: input.target,
          revisedTarget: input.revisedTarget ?? null,
          actual: input.actual,
          revision: input.revision,
          remarks: input.remarks?.trim() ?? null,
          createdById: ctx.session.user.id,
        },
      });
    }),

  // Correcting a filed row. The revision it was filed as never changes — only
  // the figures, the date and the remarks the assessment recorded.
  updateSlippageAssessment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.date(),
        target: z.number().min(0).max(100),
        revisedTarget: z.number().min(0).max(100).nullable().optional(),
        actual: z.number().min(0).max(100),
        remarks: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.slippageAssessment.update({
        where: { id: input.id },
        data: {
          date: input.date,
          target: input.target,
          revisedTarget: input.revisedTarget ?? null,
          actual: input.actual,
          remarks: input.remarks?.trim() ?? null,
        },
      });
    }),

  deleteSlippageAssessment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.slippageAssessment.delete({ where: { id: input.id } });
    }),

  // Newest assessment first, the order the history table reads in.
  getSlippageAssessments: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.slippageAssessment.findMany({
        where: { projectId: input.projectId },
        orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      });
    }),

  updateProgress: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(PROJECT_STATUS_VALUES),
        completionPercentage: z.number().min(0).max(100),
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
        reason: z.string().optional().default(""),
        title: z.string(),
        projectCode: z.string().optional(),
        modeOfImplementation: z.enum([
          "BY_ADMINISTRATION",
          "BY_CONTRACT",
          "UNASSIGNED_FOR_DETERMINATION",
        ]),
        locationImplementation: z.enum(["DISTRICT_I", "DISTRICT_II"]),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES),
        subType: z.string().optional().nullable(),
        program: z.string().optional().nullable(),
        projectAccount: z.enum(PROJECT_ACCOUNT_VALUES).optional().nullable(),
        landbankNumber: z.string().optional().nullable(),
        supplementalBudgetYear: z.string().optional().nullable(),
        supplementalBudgetNumber: z.string().optional().nullable(),
        status: z.enum(PROJECT_STATUS_VALUES).optional(),
        projectCost: z.number().min(0).default(0),
        contractCost: z.number().min(0).default(0),
        completionPercentage: z.number().min(0).max(100).optional(),
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
      const { id, reason, projectCode, ...data } = input;
      const numPersons = data.numFemale + data.numMale;
      const duration =
        data.dateStarted && data.targetCompletionDate
          ? Math.ceil(
            (data.targetCompletionDate.getTime() - data.dateStarted.getTime()) /
            (1000 * 60 * 60 * 24),
          )
          : 0;

      // projectCode is unique, so reject a code already held by another project
      // rather than letting the update fail on the constraint.
      const newProjectCode = projectCode?.trim();
      if (newProjectCode) {
        const taken = await ctx.db.project.findUnique({
          where: { projectCode: newProjectCode },
          select: { id: true },
        });
        if (taken && taken.id !== id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Project ID "${newProjectCode}" is already used by another project`,
          });
        }
      }

      const [project] = await ctx.db.$transaction([
        ctx.db.project.update({
          where: { id },
          data: {
            ...data,
            ...(newProjectCode ? { projectCode: newProjectCode } : {}),
            numPersons,
            duration,
          },
        }),
        ctx.db.projectActivity.create({
          data: {
            projectId: id,
            description: `[OVERRIDE] ${reason.trim() || "No reason provided"}`,
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
        type: z.enum(DISBURSEMENT_TYPE_VALUES).optional(),
        percentage: z.number().min(0).optional(),
        remarks: z.string().optional(),
        date: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        const disbursement = await tx.disbursement.create({
          data: {
            projectId: input.projectId,
            amount: input.amount,
            referenceNumber: input.referenceNumber,
            type: input.type,
            percentage: input.percentage,
            remarks: input.remarks,
            date: input.date ?? new Date(),
            createdById: ctx.session.user.id,
          },
        });

        // Recording the financials moves the project into POW Preparation.
        // Only the preparation stage changes; the project status is left alone.
        const project = await tx.project.findUnique({
          where: { id: input.projectId },
          select: { preparationStage: true },
        });
        const next = project && advancePreparationStage(project.preparationStage, "FOR_POW");
        if (next) {
          await tx.project.update({
            where: { id: input.projectId },
            data: { preparationStage: next },
          });
          await tx.projectActivity.create({
            data: {
              projectId: input.projectId,
              description: `Preparation stage moved to ${PREPARATION_STAGE_LABEL[next]} after recording a disbursement.`,
              createdById: ctx.session.user.id,
            },
          });
        }

        return disbursement;
      });
    }),

  deleteDisbursement: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.disbursement.delete({ where: { id: input.id } });
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
        program: z.string().optional().nullable(),
        subType: z.string().optional().nullable(),
        date: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.variationOrder.create({
        data: {
          projectId: input.projectId,
          amount: input.amount,
          sourceOfFund: input.sourceOfFund,
          program: input.program,
          subType: input.subType,
          date: input.date ?? new Date(),
          createdById: ctx.session.user.id,
        },
      });
    }),

  updateVariationOrder: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        amount: z.number().min(0),
        sourceOfFund: z.enum(SOURCE_OF_FUND_VALUES).optional().nullable(),
        program: z.string().optional().nullable(),
        subType: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.variationOrder.update({
        where: { id: input.id },
        data: {
          amount: input.amount,
          sourceOfFund: input.sourceOfFund,
          program: input.program,
          subType: input.subType,
        },
      });
    }),

  deleteVariationOrder: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.variationOrder.delete({ where: { id: input.id } });
    }),

  getVariationOrders: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.variationOrder.findMany({
        where: { projectId: input.projectId },
        orderBy: { date: "asc" },
      });
    }),

  createTimelineAdjustment: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        duration: z.number().int().min(0),
        type: z.enum(["EXTENSION", "SUSPENSION", "RESUMPTION", "REVISION", "NTP"]),
        justification: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timelineAdjustment.create({
        data: {
          projectId: input.projectId,
          startDate: input.startDate,
          endDate: input.endDate,
          duration: input.duration,
          type: input.type,
          justification: input.justification,
          createdById: ctx.session.user.id,
        },
      });
    }),

  // Correcting a recorded adjustment: the dates, duration, type and basis.
  updateTimelineAdjustment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        duration: z.number().int().min(0),
        // ON_SCHEDULE is legacy: not offered for new records, but a row already
        // recorded with it must still save when only its dates are corrected.
        type: z.enum(["EXTENSION", "SUSPENSION", "RESUMPTION", "REVISION", "NTP", "ON_SCHEDULE"]),
        justification: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timelineAdjustment.update({
        where: { id: input.id },
        data: {
          startDate: input.startDate,
          endDate: input.endDate,
          duration: input.duration,
          type: input.type,
          justification: input.justification?.trim() ?? null,
        },
      });
    }),

  deleteTimelineAdjustment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.timelineAdjustment.delete({ where: { id: input.id } });
    }),

  getTimelineAdjustments: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.timelineAdjustment.findMany({
        where: { projectId: input.projectId },
        orderBy: { startDate: "asc" },
      });
    }),

  sendTaskNotification: districtScopedAdminProcedure
    .input(
      z.object({
        projectId: z.string(),
        notifyUserId: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
        description: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const recipient = await ctx.db.user.findUnique({
        where: { id: input.notifyUserId },
        select: { role: true, status: true, division: true },
      });
      // Must mirror `user.getForSelect`, which is what populates the recipient
      // dropdown — widening one without the other only produces send errors.
      const canReceiveTasks =
        recipient?.status === "ACTIVE" &&
        (recipient.role === "USER" || recipient.role === "ADMIN");
      if (!canReceiveTasks) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Recipient must be an active user or admin account",
        });
      }
      // District separation, re-checked here because the dropdown filter is a
      // convenience and not a boundary — a crafted request must not cross it.
      // Office-division recipients serve both districts and stay reachable.
      if (!isReachableFromDistrict(recipient.division, ctx.districtScope)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Recipient must belong to your engineering district",
        });
      }

      const task = await ctx.db.taskNotification.create({
        data: {
          projectId: input.projectId,
          notifyUserId: input.notifyUserId,
          priority: input.priority,
          description: input.description,
          createdById: ctx.session.user.id,
        },
        include: { project: { select: { title: true } } },
      });

      notificationEmitter.emit("task.created", {
        taskId: task.id,
        projectId: input.projectId,
        projectTitle: task.project.title,
        notifyUserId: input.notifyUserId,
        priority: input.priority,
        description: input.description,
        createdByName: ctx.session.user.name ?? null,
      });

      return task;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.delete({ where: { id: input.id } });
    }),

  getStats: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const where = {
        ...districtWhere(ctx.districtScope),
        ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
      };

      const [
        total,
        ongoing,
        completed,
        suspended,
        notYetStarted,
        forImplementation,
        inProcurement,
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
        ctx.db.project.count({ where: { ...where, status: "IN_PROCUREMENT" } }),
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
        inProcurement,
        reAlignment,
        others,
        todayCount,
        noAllotted,
      };
    }),

  getOverviewStats: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = {
        ...districtWhere(ctx.districtScope),
        ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
      };

      const [completed, ongoing, forImplementation, suspended, realigned, notYetStarted, others, inProcurement] =
        await Promise.all([
          ctx.db.project.count({ where: { ...where, status: "COMPLETED" } }),
          ctx.db.project.count({ where: { ...where, status: "ON_GOING" } }),
          ctx.db.project.count({ where: { ...where, status: "FOR_IMPLEMENTATION" } }),
          ctx.db.project.count({ where: { ...where, status: "SUSPENDED" } }),
          ctx.db.project.count({ where: { ...where, status: "RE_ALIGNMENT" } }),
          ctx.db.project.count({ where: { ...where, status: "NOT_YET_STARTED" } }),
          ctx.db.project.count({ where: { ...where, status: "OTHERS" } }),
          ctx.db.project.count({ where: { ...where, status: "IN_PROCUREMENT" } }),
        ]);
      return { completed, ongoing, forImplementation, suspended, realigned, notYetStarted, others, inProcurement };
    }),

  getBudgetYears: districtScopedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db.project.findMany({
      where: { budgetYear: { not: null }, ...districtWhere(ctx.districtScope) },
      select: { budgetYear: true },
      distinct: ["budgetYear"],
      orderBy: { budgetYear: "desc" },
    });
    return rows.map((r) => r.budgetYear).filter((y): y is string => Boolean(y));
  }),

  // District the caller's division limits them to, or null if unrestricted.
  getMyDistrictScope: districtScopedProcedure.query(({ ctx }) => ctx.districtScope),

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
  getDistrictData: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const districts: readonly District[] = ctx.districtScope
        ? [ctx.districtScope]
        : (["DISTRICT_I", "DISTRICT_II"] as const);

      const data = await Promise.all(
        districts.map(async (district) => {
          const counts = await ctx.db.project.groupBy({
            by: ["status"],
            where: {
              locationImplementation: district,
              ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
            },
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

  // How many projects sit at each preparation stage (For Survey / For Plans /
  // For POW), per district and overall, for the admin dashboard. Scoped like
  // getDistrictData; projects with no stage (created before stages existed)
  // are left out of the counts.
  getPreparationStageStats: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const districts: readonly District[] = ctx.districtScope
        ? [ctx.districtScope]
        : (["DISTRICT_I", "DISTRICT_II"] as const);

      const emptyCounts = (): Record<PreparationStageValue, number> =>
        Object.fromEntries(PREPARATION_STAGE_VALUES.map((s) => [s, 0])) as Record<
          PreparationStageValue,
          number
        >;

      const byDistrict = await Promise.all(
        districts.map(async (district) => {
          const rows = await ctx.db.project.groupBy({
            by: ["preparationStage"],
            where: {
              locationImplementation: district,
              preparationStage: { not: null },
              ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
            },
            _count: { _all: true },
          });
          const counts = emptyCounts();
          for (const row of rows) {
            if (row.preparationStage) counts[row.preparationStage] = row._count._all;
          }
          return { district, counts };
        }),
      );

      const totals = emptyCounts();
      for (const { counts } of byDistrict) {
        for (const stage of PREPARATION_STAGE_VALUES) totals[stage] += counts[stage];
      }

      return { totals, byDistrict };
    }),

  // Physical accomplishment of every project, one series per district, for the
  // dashboard's progress line chart. District-scoped callers (1ST/2ND ENGR
  // DIST) get only their own district's series; office divisions get both.
  //
  // Points come back ordered by progress, so the chart's x axis is each
  // project's rank within its district and the line reads as that district's
  // progress curve. Ordering by date instead was tried and abandoned: progress
  // barely correlates with start date, so the line became noise, and a segment
  // drawn between two unrelated projects implied a trend that isn't there.
  getProgressByDistrict: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const districts: readonly District[] = ctx.districtScope
        ? [ctx.districtScope]
        : (["DISTRICT_I", "DISTRICT_II"] as const);

      const projects = await ctx.db.project.findMany({
        where: {
          locationImplementation: { in: [...districts] },
          ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
        },
        select: {
          id: true,
          projectCode: true,
          title: true,
          status: true,
          locationImplementation: true,
          completionPercentage: true,
          dateStarted: true,
          createdAt: true,
        },
      });

      return districts.map((district) => {
        const points = projects
          .filter((p) => p.locationImplementation === district)
          .map((p) => ({
            id: p.id,
            projectCode: p.projectCode,
            title: p.title,
            status: p.status,
            progress: p.completionPercentage ?? 0,
            // Not an axis — the tooltip shows it so a point on the curve can
            // still be placed in time.
            date: p.dateStarted ?? p.createdAt,
            // Distinguishes a real start date from the createdAt stand-in, so
            // the chart can say "added" rather than "started" in its tooltip.
            estimated: p.dateStarted === null,
          }))
          .sort((a, b) => a.progress - b.progress);

        return { district, points };
      });
    }),

  // Per-location breakdown for the dashboard's location tab: for each
  // city/municipality, how many projects it has, their average physical
  // accomplishment, and how they split by status. One entry per district, with
  // the same scoping as getProgressByDistrict — district-scoped callers
  // (1ST/2ND ENGR DIST) get only their own district.
  //
  // Every municipality the static location list assigns to the district is
  // returned even with zero projects, so a gap in coverage is visible rather
  // than silently missing. Names found on projects but not in that list
  // (legacy free text) are kept as their own rows, and projects with no
  // municipality recorded are grouped under `null`.
  getLocationBreakdown: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const districts: readonly District[] = ctx.districtScope
        ? [ctx.districtScope]
        : (["DISTRICT_I", "DISTRICT_II"] as const);

      const projects = await ctx.db.project.findMany({
        where: {
          locationImplementation: { in: [...districts] },
          ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
        },
        select: {
          locationImplementation: true,
          cityMunicipality: true,
          status: true,
          completionPercentage: true,
        },
      });

      return districts.map((district) => {
        type Bucket = { name: string | null; known: boolean; total: number; progressSum: number; counts: Record<string, number> };
        const buckets = new Map<string, Bucket>();
        const bucketFor = (name: string | null, known = false) => {
          const key = name ?? "";
          let bucket = buckets.get(key);
          if (!bucket) {
            bucket = { name, known, total: 0, progressSum: 0, counts: {} };
            buckets.set(key, bucket);
          }
          return bucket;
        };

        for (const m of getMunicipalitiesByDistrict(district)) bucketFor(m.name, true);

        for (const p of projects) {
          if (p.locationImplementation !== district) continue;
          // Blank or whitespace-only names count as "no municipality recorded".
          const municipality = p.cityMunicipality?.trim() ?? "";
          const bucket = bucketFor(municipality.length > 0 ? municipality : null);
          bucket.total += 1;
          bucket.progressSum += p.completionPercentage ?? 0;
          bucket.counts[p.status] = (bucket.counts[p.status] ?? 0) + 1;
        }

        const locations = [...buckets.values()]
          // The unassigned bucket only exists if a project landed in it.
          .filter((b) => b.name !== null || b.total > 0)
          .map((b) => ({
            name: b.name,
            // True for the district's official municipalities; false for legacy
            // free-text names and the unassigned bucket, so coverage counts
            // ("5 of 6 locations") only count real municipalities.
            known: b.known,
            total: b.total,
            avgProgress: b.total ? b.progressSum / b.total : 0,
            counts: b.counts,
          }));

        return { district, locations };
      });
    }),

  // Per-project progress points tagged with source of fund and sub-type, for
  // the admin dashboard's "Overall Percentage per Source / Sub" line chart.
  // Same point shape as getProgressByDistrict, so the same chart plots it; the
  // client groups by source / sub-type and averages from these points.
  getProgressBySource: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const projects = await ctx.db.project.findMany({
        where: {
          ...districtWhere(ctx.districtScope),
          ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
        },
        select: {
          id: true,
          projectCode: true,
          title: true,
          status: true,
          sourceOfFund: true,
          subType: true,
          completionPercentage: true,
          dateStarted: true,
          createdAt: true,
        },
      });

      return projects
        .map((p) => ({
          id: p.id,
          projectCode: p.projectCode,
          title: p.title,
          status: p.status,
          sourceOfFund: p.sourceOfFund as string,
          subType: p.subType,
          progress: p.completionPercentage ?? 0,
          date: p.dateStarted ?? p.createdAt,
          estimated: p.dateStarted === null,
        }))
        .sort((a, b) => a.progress - b.progress);
    }),

  // Every project that has at least one filed slippage assessment, with its
  // history oldest first — the order a timeline reads in. Projects never
  // assessed are left out; there is nothing to plot for them.
  getSlippageHistory: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findMany({
        where: {
          ...districtWhere(ctx.districtScope),
          ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
          slippageAssessments: { some: {} },
        },
        select: {
          id: true,
          projectCode: true,
          title: true,
          cityMunicipality: true,
          locationImplementation: true,
          // Ends of the S-curve on the Physical Progress tab: the 0% baseline
          // and the 100% planned / revised completion points.
          dateStarted: true,
          targetCompletionDate: true,
          revisedCompletionDate: true,
          slippageAssessments: {
            select: { id: true, date: true, target: true, revisedTarget: true, actual: true, revision: true },
            orderBy: [{ date: "asc" }, { createdAt: "asc" }],
          },
        },
        orderBy: { projectCode: "asc" },
      });
    }),

  getFinancialOverview: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const currentYear = new Date().getFullYear().toString();
      const where = {
        ...districtWhere(ctx.districtScope),
        ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
      };

      const projects = await ctx.db.project.findMany({
        where,
        select: {
          projectCode: true,
          sourceOfFund: true,
          subType: true,
          projectCost: true,
          completionPercentage: true,
          variationOrders: { select: { amount: true, sourceOfFund: true } },
        },
      });

      const bySource: Record<string, number> = {};
      const bySubType: Record<string, { amount: number; sourceOfFund: string }> = {};
      // Portion of each source's allocation that comes from variation orders, kept
      // separate from the base project fund so the dashboard can show the split.
      const variationBySource: Record<string, number> = {};
      // Same split broken down by project tracking number (projectCode), so the
      // dashboard can show which projects the variation funds belong to.
      const variationProjectsBySource: Record<string, Record<string, number>> = {};

      let totalAllocation = 0;
      let totalVariation = 0;
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

        // Variation orders add to the annual allocation under the source of fund
        // they are charged against (falling back to the project's own source).
        for (const vo of p.variationOrders) {
          if (vo.amount <= 0) continue;
          const voSource = vo.sourceOfFund ?? p.sourceOfFund;
          bySource[voSource] = (bySource[voSource] ?? 0) + vo.amount;
          variationBySource[voSource] = (variationBySource[voSource] ?? 0) + vo.amount;
          const byProject = (variationProjectsBySource[voSource] ??= {});
          byProject[p.projectCode] = (byProject[p.projectCode] ?? 0) + vo.amount;
          totalAllocation += vo.amount;
          totalVariation += vo.amount;
        }
      }

      const executionRate =
        projects.length > 0
          ? Math.min(100, Math.max(0, progressSum / projects.length))
          : 0;

      return {
        budgetYear: input?.budgetYear ?? currentYear,
        totalAllocation,
        totalVariation,
        bySource,
        bySubType,
        variationBySource,
        variationProjectsBySource,
        executionRate: Math.round(executionRate * 10) / 10,
      };


    }),

  // Remaining balance from annual allocation, grouped by source of fund and
  // sub-type. Remaining = project allocation (projectCost) minus the total
  // amount already disbursed for that project.
  getRemainingBalance: districtScopedProcedure
    .input(z.object({ budgetYear: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const currentYear = new Date().getFullYear().toString();
      const where = {
        ...districtWhere(ctx.districtScope),
        ...(input?.budgetYear ? { budgetYear: input.budgetYear } : {}),
      };

      const projects = await ctx.db.project.findMany({
        where,
        select: {
          projectCode: true,
          sourceOfFund: true,
          subType: true,
          projectCost: true,
          disbursements: { select: { amount: true } },
          variationOrders: { select: { amount: true, sourceOfFund: true } },
        },
      });

      type SubTypeMap = Record<string, { amount: number; sourceOfFund: string }>;

      const remainingBySource: Record<string, number> = {};
      const remainingBySubType: SubTypeMap = {};
      const disbursedBySource: Record<string, number> = {};
      const disbursedBySubType: SubTypeMap = {};
      // Variation-order portions broken down by the tracking number of the
      // project each order belongs to, so the dashboard cards can show which
      // projects the variation-order balances/disbursements come from.
      const remainingVariationBySource: Record<string, Record<string, number>> = {};
      const disbursedVariationBySource: Record<string, Record<string, number>> = {};

      let totalAllocation = 0;
      let totalDisbursed = 0;
      let totalRemaining = 0;

      const addToSubType = (
        map: SubTypeMap,
        subKey: string,
        sourceOfFund: string,
        amount: number,
      ) => {
        const existing = map[subKey];
        if (existing) existing.amount += amount;
        else map[subKey] = { amount, sourceOfFund };
      };

      for (const p of projects) {
        const disbursed = p.disbursements.reduce((s, d) => s + d.amount, 0);
        const subKey = p.subType ?? `__NONE__:${p.sourceOfFund}`;

        // Disbursements draw down the project cost (primary fund) first; any
        // excess overflows onto the variation orders. Neither balance is allowed
        // to go below zero, mirroring the project edit/detail views — so a fully
        // (or over-) disbursed project shows a remaining balance of 0, not a
        // negative number.
        const rawPrimary = p.projectCost - disbursed;
        const primaryRemaining = Math.max(0, rawPrimary);
        let overflow = Math.max(0, -rawPrimary);
        // Only the portion covered by the project cost is charged to the
        // primary source of fund; the overflow is charged to the variation
        // orders' sources below.
        const primaryDisbursed = Math.min(disbursed, Math.max(0, p.projectCost));

        if (p.projectCost > 0) {
          totalAllocation += p.projectCost;
          totalRemaining += primaryRemaining;

          remainingBySource[p.sourceOfFund] = (remainingBySource[p.sourceOfFund] ?? 0) + primaryRemaining;
          addToSubType(remainingBySubType, subKey, p.sourceOfFund, primaryRemaining);
        }

        if (primaryDisbursed > 0) {
          totalDisbursed += primaryDisbursed;
          disbursedBySource[p.sourceOfFund] = (disbursedBySource[p.sourceOfFund] ?? 0) + primaryDisbursed;
          addToSubType(disbursedBySubType, subKey, p.sourceOfFund, primaryDisbursed);
        }

        // Variation orders raise the available balance for the source of fund
        // they are charged against, but the overflow from over-disbursing the
        // project cost eats into them first so the remaining balance never goes
        // negative. The consumed portion counts as a disbursement against the
        // variation order's own source of fund, tracked per project tracking
        // number. The sub-type maps get the same amounts under hidden __NONE__
        // keys so they stay in sync with the by-source maps.
        for (const vo of p.variationOrders) {
          if (vo.amount <= 0) continue;
          const voSource = vo.sourceOfFund ?? p.sourceOfFund;
          const consumed = Math.min(overflow, vo.amount);
          overflow -= consumed;
          const voRemaining = vo.amount - consumed;

          totalAllocation += vo.amount;
          totalRemaining += voRemaining;
          remainingBySource[voSource] = (remainingBySource[voSource] ?? 0) + voRemaining;
          addToSubType(remainingBySubType, `__NONE__:${voSource}`, voSource, voRemaining);
          if (voRemaining > 0) {
            const byProject = (remainingVariationBySource[voSource] ??= {});
            byProject[p.projectCode] = (byProject[p.projectCode] ?? 0) + voRemaining;
          }

          if (consumed > 0) {
            totalDisbursed += consumed;
            disbursedBySource[voSource] = (disbursedBySource[voSource] ?? 0) + consumed;
            addToSubType(disbursedBySubType, `__NONE__:${voSource}`, voSource, consumed);
            const byProject = (disbursedVariationBySource[voSource] ??= {});
            byProject[p.projectCode] = (byProject[p.projectCode] ?? 0) + consumed;
          }
        }

        // Disbursements beyond the project cost and all variation orders still
        // count toward the project's own source so the summary matches the
        // disbursement records.
        if (overflow > 0) {
          totalDisbursed += overflow;
          disbursedBySource[p.sourceOfFund] = (disbursedBySource[p.sourceOfFund] ?? 0) + overflow;
          addToSubType(disbursedBySubType, subKey, p.sourceOfFund, overflow);
        }
      }

      return {
        budgetYear: input?.budgetYear ?? currentYear,
        totalAllocation,
        remaining: {
          total: totalRemaining,
          bySource: remainingBySource,
          bySubType: remainingBySubType,
          variationProjectsBySource: remainingVariationBySource,
        },
        disbursed: {
          total: totalDisbursed,
          bySource: disbursedBySource,
          bySubType: disbursedBySubType,
          variationProjectsBySource: disbursedVariationBySource,
        },
      };
    }),
});
