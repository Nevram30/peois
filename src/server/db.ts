import { env } from "~/env";
import { PrismaClient } from "../../generated/prisma";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// In dev, always create a fresh client so schema changes are picked up
// without needing a full server restart. In production, reuse the singleton.
export const db =
  env.NODE_ENV === "production"
    ? (globalForPrisma.prisma ?? createPrismaClient())
    : createPrismaClient();

if (env.NODE_ENV === "production") globalForPrisma.prisma = db;
