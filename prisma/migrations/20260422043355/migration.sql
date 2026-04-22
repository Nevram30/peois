-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "ModeOfImplementation" AS ENUM ('BY_ADMINISTRATION', 'BY_CONTRACT');

-- CreateEnum
CREATE TYPE "SourceOfFund" AS ENUM ('GENERAL_FUND', 'SEF', 'TRUST_FUND', 'TWENTY_PERCENT_DEV_FUND', 'AID', 'LOAN', 'OTHERS', 'FIVE_PERCENT_CONFIDENTIAL_FUND', 'PPOC', 'LDRRM', 'MOOE', 'NCDC', 'PRDP', 'MIADP');

-- CreateEnum
CREATE TYPE "District" AS ENUM ('DISTRICT_I', 'DISTRICT_II');

-- CreateEnum
CREATE TYPE "ProjectSubType" AS ENUM ('WATER_SYSTEMS', 'GOVERNMENT_BUILDINGS', 'ELECTRIFICATION', 'RESPONSE_CAMP_MGMT', 'SUPPLEMENTAL_BUDGET_2', 'PARK_AND_DEVELOPMENT', 'DOH', 'PROVINCIAL_GOVT_OFFICE', 'VARIOUS_WATER_SYSTEM_DEV', 'RURAL_ELECTRIFICATION', 'SLOPE_PROTECTION_LAND_DEV', 'INFRA_DEV_GOVT_BUILDINGS', 'LOCAL_ROADS_DRAINAGE', 'PROVINCIAL_ROADS_BRIDGES', 'SUPPLEMENTAL_BUDGET_1', 'SUPPLEMENTAL_BUDGET_3', 'SUPPLEMENTAL_BUDGET_4', 'SUPPLEMENTAL_BUDGET_5', 'PDRRMO_RESPONSE_CAMP_MGMT', 'PDRRMO_REHAB_RECOVERY', 'PDRRMO_PREVENTION_MITIGATION', 'PDRRMO_DISASTER_PREPAREDNESS', 'PAMANA', 'NCDC');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('NOT_YET_STARTED', 'ON_GOING', 'COMPLETED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('POW', 'PURCHASE_REQUEST');

-- CreateEnum
CREATE TYPE "ProjectFileType" AS ENUM ('IMAGE', 'BLUEPRINT', 'REPORT', 'CONTRACT', 'PERMIT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('DRAFT', 'FOR_REVIEW', 'REVISION', 'RELEASED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "employeeId" TEXT,
    "designation" TEXT,
    "division" TEXT,
    "contactNumber" TEXT,
    "sex" "Sex",
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subType" "ProjectSubType",
    "modeOfImplementation" "ModeOfImplementation" NOT NULL,
    "locationImplementation" "District" NOT NULL,
    "sourceOfFund" "SourceOfFund" NOT NULL,
    "projectCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contractCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "contractorName" TEXT,
    "projectEngineer" TEXT,
    "budgetYear" TEXT,
    "dateStarted" TIMESTAMP(3),
    "targetCompletionDate" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "revisedCompletionDate" TIMESTAMP(3),
    "dateCompleted" TIMESTAMP(3),
    "daysSuspended" INTEGER NOT NULL DEFAULT 0,
    "daysExtended" INTEGER NOT NULL DEFAULT 0,
    "numFemale" INTEGER NOT NULL DEFAULT 0,
    "numMale" INTEGER NOT NULL DEFAULT 0,
    "numPersons" INTEGER NOT NULL DEFAULT 0,
    "numManDays" INTEGER NOT NULL DEFAULT 0,
    "district" "District",
    "cityMunicipality" TEXT,
    "barangay" TEXT,
    "purok" TEXT,
    "sitio" TEXT,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'NOT_YET_STARTED',
    "completionPercentage" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "documentUrl" TEXT,
    "documentName" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectActivity" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disbursement" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceNumber" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Disbursement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskNotification" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "notifyUserId" TEXT NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledgedAt" TIMESTAMP(3),
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskReply" (
    "id" TEXT NOT NULL,
    "taskNotificationId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "taskStatus" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskReplyDocument" (
    "id" TEXT NOT NULL,
    "replyId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaskReplyDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "filePath" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "amount" DOUBLE PRECISION,
    "purpose" TEXT,
    "district" "District" NOT NULL,
    "projectRef" TEXT,
    "releasedAt" TIMESTAMP(3),
    "releasedTo" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFile" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" "ProjectFileType" NOT NULL DEFAULT 'OTHER',
    "fileSize" INTEGER,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_employeeId_key" ON "User"("employeeId");

-- CreateIndex
CREATE INDEX "UserSession_userId_idx" ON "UserSession"("userId");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");

-- CreateIndex
CREATE INDEX "Project_title_idx" ON "Project"("title");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_createdById_idx" ON "Project"("createdById");

-- CreateIndex
CREATE INDEX "ProjectActivity_projectId_idx" ON "ProjectActivity"("projectId");

-- CreateIndex
CREATE INDEX "ProjectActivity_createdById_idx" ON "ProjectActivity"("createdById");

-- CreateIndex
CREATE INDEX "Disbursement_projectId_idx" ON "Disbursement"("projectId");

-- CreateIndex
CREATE INDEX "Disbursement_createdById_idx" ON "Disbursement"("createdById");

-- CreateIndex
CREATE INDEX "TaskNotification_projectId_idx" ON "TaskNotification"("projectId");

-- CreateIndex
CREATE INDEX "TaskNotification_notifyUserId_idx" ON "TaskNotification"("notifyUserId");

-- CreateIndex
CREATE INDEX "TaskNotification_createdById_idx" ON "TaskNotification"("createdById");

-- CreateIndex
CREATE INDEX "TaskReply_taskNotificationId_idx" ON "TaskReply"("taskNotificationId");

-- CreateIndex
CREATE INDEX "TaskReply_createdById_idx" ON "TaskReply"("createdById");

-- CreateIndex
CREATE INDEX "TaskReplyDocument_replyId_idx" ON "TaskReplyDocument"("replyId");

-- CreateIndex
CREATE UNIQUE INDEX "Document_documentCode_key" ON "Document"("documentCode");

-- CreateIndex
CREATE INDEX "Document_type_idx" ON "Document"("type");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Document_district_idx" ON "Document"("district");

-- CreateIndex
CREATE INDEX "Document_createdById_idx" ON "Document"("createdById");

-- CreateIndex
CREATE INDEX "ProjectFile_projectId_idx" ON "ProjectFile"("projectId");

-- CreateIndex
CREATE INDEX "ProjectFile_createdById_idx" ON "ProjectFile"("createdById");

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectActivity" ADD CONSTRAINT "ProjectActivity_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disbursement" ADD CONSTRAINT "Disbursement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskNotification" ADD CONSTRAINT "TaskNotification_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskNotification" ADD CONSTRAINT "TaskNotification_notifyUserId_fkey" FOREIGN KEY ("notifyUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskNotification" ADD CONSTRAINT "TaskNotification_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReply" ADD CONSTRAINT "TaskReply_taskNotificationId_fkey" FOREIGN KEY ("taskNotificationId") REFERENCES "TaskNotification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReply" ADD CONSTRAINT "TaskReply_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskReplyDocument" ADD CONSTRAINT "TaskReplyDocument_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "TaskReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFile" ADD CONSTRAINT "ProjectFile_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
