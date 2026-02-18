import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "~/server/api/trpc";
export const userRouter = createTRPCRouter({
  getAll: superAdminProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          role: z.string().optional(),
          division: z.string().optional(),
          status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
          page: z.number().min(1).default(1),
          pageSize: z.number().min(1).max(100).default(10),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const page = input?.page ?? 1;
      const pageSize = input?.pageSize ?? 10;
      const skip = (page - 1) * pageSize;

      const where: Record<string, unknown> = {};

      if (input?.search) {
        where.OR = [
          { name: { contains: input.search, mode: "insensitive" } },
          { email: { contains: input.search, mode: "insensitive" } },
          { employeeId: { contains: input.search, mode: "insensitive" } },
        ];
      }

      if (input?.role) {
        where.role = input.role;
      }

      if (input?.division) {
        where.division = input.division;
      }

      if (input?.status) {
        where.status = input.status;
      }

      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            employeeId: true,
            designation: true,
            division: true,
            sex: true,
            status: true,
            image: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        ctx.db.user.count({ where }),
      ]);

      return { users, total, page, pageSize };
    }),

  getStats: superAdminProcedure.query(async ({ ctx }) => {
    const [total, active, inactive, pending] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.user.count({ where: { status: "ACTIVE" } }),
      ctx.db.user.count({ where: { status: "INACTIVE" } }),
      ctx.db.user.count({ where: { status: "PENDING" } }),
    ]);

    return { total, active, inactive, pending };
  }),

  getDivisions: superAdminProcedure.query(async ({ ctx }) => {
    const divisions = await ctx.db.user.findMany({
      where: { division: { not: null } },
      select: { division: true },
      distinct: ["division"],
    });
    return divisions.map((d) => d.division).filter(Boolean) as string[];
  }),

  create: superAdminProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        middleName: z.string().optional(),
        lastName: z.string().min(1, "Last name is required"),
        extension: z.string().optional(),
        employeeId: z.string().min(1, "Employee ID is required"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum([
          "ADMIN",
          "ADMIN_ASSISTANT",
          "DIVISION_CLERK",
          "DIVISION_HEAD",
          "SECTION_HEAD",
          "PROVINCIAL_ENGR",
        ]),
        designation: z.string().min(1, "Designation is required"),
        division: z.string().min(1, "Division is required"),
        sex: z.enum(["MALE", "FEMALE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Build full name
      const nameParts = [input.firstName];
      if (input.middleName) nameParts.push(input.middleName);
      nameParts.push(input.lastName);
      if (input.extension) nameParts.push(input.extension);
      const fullName = nameParts.join(" ");

      // Build email from employeeId
      const email = `${input.employeeId}@peo.gov.ph`;

      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const existingEmpId = await ctx.db.user.findUnique({
        where: { employeeId: input.employeeId },
      });

      if (existingEmpId) {
        throw new Error("Employee ID already in use");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      return ctx.db.user.create({
        data: {
          name: fullName,
          email,
          password: hashedPassword,
          role: input.role,
          employeeId: input.employeeId,
          designation: input.designation,
          division: input.division,
          sex: input.sex,
          status: "ACTIVE",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          employeeId: true,
          designation: true,
          division: true,
          sex: true,
          status: true,
          createdAt: true,
        },
      });
    }),

  update: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        role: z.enum([
          "ADMIN",
          "ADMIN_ASSISTANT",
          "DIVISION_CLERK",
          "DIVISION_HEAD",
          "SECTION_HEAD",
          "PROVINCIAL_ENGR",
        ]),
        designation: z.string().optional(),
        division: z.string().optional(),
        sex: z.enum(["MALE", "FEMALE"]).optional(),
        status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.role === "SUPER_ADMIN") {
        throw new Error("Cannot modify super admin");
      }

      // Check email uniqueness if changed
      if (input.email !== user.email) {
        const existingEmail = await ctx.db.user.findUnique({
          where: { email: input.email },
        });
        if (existingEmail) {
          throw new Error("Email already in use by another user");
        }
      }

      return ctx.db.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          designation: input.designation ?? null,
          division: input.division ?? null,
          sex: input.sex ?? null,
          status: input.status,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          employeeId: true,
          designation: true,
          division: true,
          sex: true,
          status: true,
          createdAt: true,
        },
      });
    }),

  updateStatus: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.role === "SUPER_ADMIN") {
        throw new Error("Cannot modify super admin status");
      }

      return ctx.db.user.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  delete: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.role === "SUPER_ADMIN") {
        throw new Error("Cannot delete a super admin");
      }

      return ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }),
});
