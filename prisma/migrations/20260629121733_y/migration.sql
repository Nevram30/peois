-- CreateEnum
CREATE TYPE "TimelineAdjustmentType" AS ENUM ('EXTENSION', 'SUSPENSION', 'RESUMPTION', 'REVISION');

-- CreateEnum
CREATE TYPE "AccessRequestAction" AS ENUM ('VIEW', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "AccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- AlterEnum
ALTER TYPE "SourceOfFund" ADD VALUE 'CONFIDENTIAL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthday" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "VariationOrder" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceOfFund" "SourceOfFund",
    "amount" DOUBLE PRECISION NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VariationOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimelineAdjustment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "type" "TimelineAdjustmentType" NOT NULL,
    "justification" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectAccessRequest" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "projectFileId" TEXT NOT NULL,
    "action" "AccessRequestAction" NOT NULL,
    "status" "AccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "requestedById" TEXT NOT NULL,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectAccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VariationOrder_projectId_idx" ON "VariationOrder"("projectId");

-- CreateIndex
CREATE INDEX "VariationOrder_createdById_idx" ON "VariationOrder"("createdById");

-- CreateIndex
CREATE INDEX "TimelineAdjustment_projectId_idx" ON "TimelineAdjustment"("projectId");

-- CreateIndex
CREATE INDEX "TimelineAdjustment_createdById_idx" ON "TimelineAdjustment"("createdById");

-- CreateIndex
CREATE INDEX "ProjectAccessRequest_projectId_idx" ON "ProjectAccessRequest"("projectId");

-- CreateIndex
CREATE INDEX "ProjectAccessRequest_projectFileId_idx" ON "ProjectAccessRequest"("projectFileId");

-- CreateIndex
CREATE INDEX "ProjectAccessRequest_requestedById_idx" ON "ProjectAccessRequest"("requestedById");

-- CreateIndex
CREATE INDEX "ProjectAccessRequest_status_idx" ON "ProjectAccessRequest"("status");

-- AddForeignKey
ALTER TABLE "VariationOrder" ADD CONSTRAINT "VariationOrder_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationOrder" ADD CONSTRAINT "VariationOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineAdjustment" ADD CONSTRAINT "TimelineAdjustment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimelineAdjustment" ADD CONSTRAINT "TimelineAdjustment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAccessRequest" ADD CONSTRAINT "ProjectAccessRequest_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAccessRequest" ADD CONSTRAINT "ProjectAccessRequest_projectFileId_fkey" FOREIGN KEY ("projectFileId") REFERENCES "ProjectFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAccessRequest" ADD CONSTRAINT "ProjectAccessRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectAccessRequest" ADD CONSTRAINT "ProjectAccessRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
