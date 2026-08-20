-- Physical accomplishment is recorded to the decimal (e.g. 45.75%), so the
-- column moves from INTEGER to a floating point type. Existing whole-number
-- values are preserved by the implicit cast.
ALTER TABLE "Project"
  ALTER COLUMN "completionPercentage" TYPE DOUBLE PRECISION USING "completionPercentage"::DOUBLE PRECISION,
  ALTER COLUMN "completionPercentage" SET DEFAULT 0;
