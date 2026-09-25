-- N/A preparation stage for projects that do not go through survey / plans /
-- POW preparation. Purely additive; IF NOT EXISTS keeps it safe on a database
-- that already got the value via `prisma db push`.

-- AlterEnum
ALTER TYPE "PreparationStage" ADD VALUE IF NOT EXISTS 'NOT_APPLICABLE';
