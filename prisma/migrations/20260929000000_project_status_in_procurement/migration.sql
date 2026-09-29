-- "In Procurement" project status. Purely additive; IF NOT EXISTS keeps it
-- safe on a database that already got the value via `prisma db push`.

-- AlterEnum
ALTER TYPE "ProjectStatus" ADD VALUE IF NOT EXISTS 'IN_PROCUREMENT';
