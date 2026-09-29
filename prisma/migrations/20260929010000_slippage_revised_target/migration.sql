-- Revised target % per slippage assessment. Purely additive (nullable);
-- IF NOT EXISTS keeps it safe on a database that already got the column via
-- `prisma db push`.

-- AlterTable
ALTER TABLE "SlippageAssessment" ADD COLUMN IF NOT EXISTS "revisedTarget" DOUBLE PRECISION;
