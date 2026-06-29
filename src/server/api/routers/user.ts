import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
  adminProcedure,
} from "~/server/api/trpc";
export const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: { id: true, name: true, email: true, employeeId: true },
    });
  }),

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
            contactNumber: true,
            sex: true,
            birthday: true,
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

  getStats: adminProcedure.query(async ({ ctx }) => {
    const [total, active, inactive, pending] = await Promise.all([
      ctx.db.user.count(),
      ctx.db.user.count({ where: { status: "ACTIVE" } }),
      ctx.db.user.count({ where: { status: "INACTIVE" } }),
      ctx.db.user.count({ where: { status: "PENDING" } }),
    ]);

    return { total, active, inactive, pending };
  }),

  getForSelect: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true, email: true, image: true },
      orderBy: { name: "asc" },
    });
  }),

  getDivisions: superAdminProcedure.query(async ({ ctx }) => {
    const divisions = await ctx.db.user.findMany({
      where: { division: { not: null } },
      select: { division: true },
      distinct: ["division"],
    });
    return divisions.map((d) => d.division).filter(Boolean) as string[];
  }),

  // getNextEmployeeId: superAdminProcedure.query(async ({ ctx }) => {
  //   // Find the highest numeric prefix from existing employee IDs
  //   const users = await ctx.db.user.findMany({
  //     where: { employeeId: { not: null } },
  //     select: { employeeId: true },
  //   });
  //
  //   let maxNumber = 0;
  //   for (const u of users) {
  //     if (u.employeeId) {
  //       const match = /^(\d+)-/.exec(u.employeeId);
  //       if (match) {
  //         const num = parseInt(match[1]!, 10);
  //         if (num > maxNumber) maxNumber = num;
  //       }
  //     }
  //   }
  //
  //   const nextNumber = String(maxNumber + 1).padStart(4, "0");
  //   const now = new Date();
  //   const month = String(now.getMonth() + 1).padStart(2, "0");
  //   const day = String(now.getDate()).padStart(2, "0");
  //   const year = now.getFullYear();
  //   return `${nextNumber}-${month}${day}${year}`;
  // }),

  create: superAdminProcedure
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        middleName: z.string().optional(),
        lastName: z.string().min(1, "Last name is required"),
        extension: z.string().optional(),
        employeeId: z.string().min(1, "Employee ID is required"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        role: z.enum(["ADMIN", "USER"]),
        designation: z.string().min(1, "Designation is required"),
        division: z.string().min(1, "Division is required"),
        contactNumber: z.string().min(1, "Contact number is required"),
        birthday: z.string().optional(),
        sex: z.enum(["MALE", "FEMALE"]),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Build full name
      const nameParts = [input.firstName];
      if (input.middleName) nameParts.push(input.middleName);
      nameParts.push(input.lastName);
      if (input.extension) nameParts.push(input.extension);
      const fullName = nameParts.join(" ");

      const employeeId = input.employeeId.trim();

      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const existingEmpId = await ctx.db.user.findUnique({
        where: { employeeId },
      });

      if (existingEmpId) {
        throw new Error("Employee ID already in use");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      return ctx.db.user.create({
        data: {
          name: fullName,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          employeeId,
          designation: input.designation,
          division: input.division,
          contactNumber: input.contactNumber,
          birthday: input.birthday ? new Date(input.birthday) : null,
          sex: input.sex,
          status: "ACTIVE",
          image: input.image ?? null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          employeeId: true,
          designation: true,
          division: true,
          contactNumber: true,
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
        role: z.enum(["ADMIN", "USER"]),
        designation: z.string().optional(),
        division: z.string().optional(),
        contactNumber: z.string().optional(),
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
          contactNumber: input.contactNumber ?? null,
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
          contactNumber: true,
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
        designation: true,
        division: true,
        image: true,
      },
    });
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        image: z.string().url().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (input.email) {
        const existing = await ctx.db.user.findUnique({
          where: { email: input.email },
          select: { id: true },
        });
        if (existing && existing.id !== userId) {
          throw new Error("Email already in use by another account");
        }
      }

      return ctx.db.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          email: input.email,
          ...(input.image !== undefined ? { image: input.image } : {}),
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          designation: true,
          division: true,
        },
      });
    }),

  changePassword: protectedProcedure
    .input(
      z
        .object({
          currentPassword: z.string().min(1, "Current password is required"),
          newPassword: z
            .string()
            .min(8, "New password must be at least 8 characters"),
          confirmPassword: z.string().min(1, "Confirm password is required"),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: "Passwords do not match",
          path: ["confirmPassword"],
        }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "SUPER_ADMIN") {
        throw new Error("Only super admins can change their password here");
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { password: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const matches = await bcrypt.compare(input.currentPassword, user.password);
      if (!matches) {
        throw new Error("Current password is incorrect");
      }

      const hashed = await bcrypt.hash(input.newPassword, 12);

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashed },
      });

      return { success: true };
    }),
});
