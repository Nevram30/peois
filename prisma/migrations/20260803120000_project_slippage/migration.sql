-- Slippage assessment captured on the Add New Project form: the target and
-- actual physical accomplishment (in percent) plus the revision counter for
-- re-assessments. The slippage percentage itself is derived from the two
-- values, so it is not stored. Nullable because existing records have no
-- assessment yet.

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "slippageTarget" DOUBLE PRECISION;
ALTER TABLE "Project" ADD COLUMN "slippageActual" DOUBLE PRECISION;
ALTER TABLE "Project" ADD COLUMN "slippageRevision" INTEGER NOT NULL DEFAULT 0;
