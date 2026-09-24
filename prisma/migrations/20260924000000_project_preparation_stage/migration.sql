-- Preparation stage of a project (Surveying, Preparation of Plans, POW
-- Preparation), tracked separately from its status. Purely additive: a new
-- type and a nullable column, so existing rows are untouched and read as null.
-- Guarded so it is also safe on a database that got these via `prisma db push`.

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "PreparationStage" AS ENUM ('FOR_SURVEY', 'FOR_PLANS', 'FOR_POW');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "preparationStage" "PreparationStage";
