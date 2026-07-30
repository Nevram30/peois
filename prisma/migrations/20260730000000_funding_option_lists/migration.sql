-- Funding option lists managed by super admins.
--
-- Project.program / Project.subType (and the VariationOrder equivalents) stop
-- being Postgres enums so that Programs and Projects added at runtime from the
-- Manual Entry card can be stored alongside the built-in values.
--
-- NOTE: these are written as ALTER COLUMN ... USING casts on purpose. Prisma's
-- own generated diff for an enum -> String change is DROP COLUMN + ADD COLUMN,
-- which would silently discard every existing program/subType value.

-- AlterTable — enum -> text, preserving existing values
ALTER TABLE "Project" ALTER COLUMN "program" TYPE TEXT USING "program"::text;
ALTER TABLE "Project" ALTER COLUMN "subType" TYPE TEXT USING "subType"::text;
ALTER TABLE "VariationOrder" ALTER COLUMN "program" TYPE TEXT USING "program"::text;
ALTER TABLE "VariationOrder" ALTER COLUMN "subType" TYPE TEXT USING "subType"::text;

-- AlterTable
ALTER TABLE "Disbursement" ADD COLUMN "remarks" TEXT;

-- CreateTable
CREATE TABLE "FundingProgramOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceOfFund" "SourceOfFund" NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundingProgramOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundingProjectOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FundingProjectOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandbankLoanOption" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LandbankLoanOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FundingProgramOption_createdById_idx" ON "FundingProgramOption"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "FundingProgramOption_sourceOfFund_name_key" ON "FundingProgramOption"("sourceOfFund", "name");

-- CreateIndex
CREATE INDEX "FundingProjectOption_createdById_idx" ON "FundingProjectOption"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "FundingProjectOption_program_name_key" ON "FundingProjectOption"("program", "name");

-- CreateIndex
CREATE UNIQUE INDEX "LandbankLoanOption_number_key" ON "LandbankLoanOption"("number");

-- CreateIndex
CREATE INDEX "LandbankLoanOption_createdById_idx" ON "LandbankLoanOption"("createdById");

-- AddForeignKey
ALTER TABLE "FundingProgramOption" ADD CONSTRAINT "FundingProgramOption_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundingProjectOption" ADD CONSTRAINT "FundingProjectOption_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandbankLoanOption" ADD CONSTRAINT "LandbankLoanOption_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
