-- CreateEnum
CREATE TYPE "FundingProgram" AS ENUM ('INFRA_DEV_PROGRAM_3918', 'PEACE_ORDER_PROGRAM_3918', 'INFRA_DEV_PROGRAM_8918', 'PEACE_ORDER_PROGRAM_8918', 'HEALTH_DEV_PROGRAM_4918', 'INFRA_DEV_PROGRAM_1999', 'PEACE_ORDER_PROGRAM_1999', 'INFRA_DEV_PROGRAM_4918', 'DISASTER_PREVENTION_MITIGATION_9943', 'DISASTER_PREVENTION_MITIGATION_9942', 'DISASTER_PREPAREDNESS_9942', 'DISASTER_REHAB_RECOVERY_9941', 'ELEM_SECONDARY_EDUCATION_3311', 'ALL_OFFICES', 'PAMANA', 'DOH', 'NCDC', 'LGSF', 'PRDP', 'MIADP', 'LDRRM');

-- CreateEnum
CREATE TYPE "ProjectAccount" AS ENUM ('MOOE', 'PPE');

-- CreateEnum
CREATE TYPE "BoxLabel" AS ENUM ('COMPLETED', 'OTHERS');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProjectSubType" ADD VALUE 'REPAIR_PROV_ROADS_DISTRICT_I';
ALTER TYPE "ProjectSubType" ADD VALUE 'REPAIR_PROV_ROADS_DISTRICT_II';
ALTER TYPE "ProjectSubType" ADD VALUE 'ROAD_OPENING';
ALTER TYPE "ProjectSubType" ADD VALUE 'PRDP_PROVINCIAL_COUNTERPART';
ALTER TYPE "ProjectSubType" ADD VALUE 'BARANGAY_PROJECTS_DISTRICT_I';
ALTER TYPE "ProjectSubType" ADD VALUE 'BARANGAY_PROJECTS_DISTRICT_II';
ALTER TYPE "ProjectSubType" ADD VALUE 'STIMULUS_BARANGAYS_DISTRICT_I';
ALTER TYPE "ProjectSubType" ADD VALUE 'STIMULUS_BARANGAYS_DISTRICT_II';
ALTER TYPE "ProjectSubType" ADD VALUE 'CONFLICT_INSURGENCY_ANTI_TERRORISM';
ALTER TYPE "ProjectSubType" ADD VALUE 'ANTI_CRIMINALITY_LAWLESSNESS';
ALTER TYPE "ProjectSubType" ADD VALUE 'FLOOD_CONTROL_SLOPE_PROTECTION_MOOE';
ALTER TYPE "ProjectSubType" ADD VALUE 'FLOOD_CONTROL_SLOPE_PROTECTION_PPE';
ALTER TYPE "ProjectSubType" ADD VALUE 'DRR_CCA_PROMOTION_AWARENESS_ADVOCACY';
ALTER TYPE "ProjectSubType" ADD VALUE 'BUILDING_BACK_BETTER';
ALTER TYPE "ProjectSubType" ADD VALUE 'QUICK_RESPONSE_FUND';
ALTER TYPE "ProjectSubType" ADD VALUE 'CONST_CHILD_DEV_CENTERS';
ALTER TYPE "ProjectSubType" ADD VALUE 'CONST_IMPVT_COMPL_SCHOOL_BLDGS';
ALTER TYPE "ProjectSubType" ADD VALUE 'CONSTRUCTION_SCHOOL_BUILDINGS';
ALTER TYPE "ProjectSubType" ADD VALUE 'CONSTRUCTION_SCHOOL_BUILDINGS_FACILITIES';
ALTER TYPE "ProjectSubType" ADD VALUE 'REPAIR_MAINT_BUILDINGS_STRUCTURES';
ALTER TYPE "ProjectSubType" ADD VALUE 'OTHER_MAINT_OPERATING_EXPENSES';

-- AlterEnum
ALTER TYPE "SourceOfFund" ADD VALUE 'FIVE_PERCENT_CALAMITY_FUND';

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ARCHIVER';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "landbankNumber" TEXT,
ADD COLUMN     "program" "FundingProgram",
ADD COLUMN     "projectAccount" "ProjectAccount",
ADD COLUMN     "supplementalBudgetNumber" TEXT,
ADD COLUMN     "supplementalBudgetYear" TEXT;

-- AlterTable
ALTER TABLE "VariationOrder" ADD COLUMN     "program" "FundingProgram",
ADD COLUMN     "subType" "ProjectSubType";

-- CreateTable
CREATE TABLE "PhysicalArchiveLocation" (
    "id" TEXT NOT NULL,
    "boxLabel" "BoxLabel" NOT NULL,
    "boxRange" TEXT NOT NULL,
    "boxNumbers" TEXT,
    "remarks" TEXT,
    "projectId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalArchiveLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PhysicalArchiveLocation_projectId_idx" ON "PhysicalArchiveLocation"("projectId");

-- CreateIndex
CREATE INDEX "PhysicalArchiveLocation_createdById_idx" ON "PhysicalArchiveLocation"("createdById");

-- AddForeignKey
ALTER TABLE "PhysicalArchiveLocation" ADD CONSTRAINT "PhysicalArchiveLocation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalArchiveLocation" ADD CONSTRAINT "PhysicalArchiveLocation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
