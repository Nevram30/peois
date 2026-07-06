/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `Disbursement` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DisbursementType" ADD VALUE 'BILL_OF_LADING';
ALTER TYPE "DisbursementType" ADD VALUE 'CONTINGENCIES';
ALTER TYPE "DisbursementType" ADD VALUE 'EQUIPMENT_MAINTENANCE';
ALTER TYPE "DisbursementType" ADD VALUE 'EQUIPMENT_POL';
ALTER TYPE "DisbursementType" ADD VALUE 'EQUIPMENT_RENTAL';
ALTER TYPE "DisbursementType" ADD VALUE 'FERRY_LADING';
ALTER TYPE "DisbursementType" ADD VALUE 'MOBILIZATION_DEMOBILIZATION';
ALTER TYPE "DisbursementType" ADD VALUE 'BILLING_ACCOMPLISHMENT';
ALTER TYPE "DisbursementType" ADD VALUE 'MOBILIZATION_15_PERCENT';

-- DropIndex
DROP INDEX "Disbursement_trackingNumber_key";

-- AlterTable
ALTER TABLE "Disbursement" DROP COLUMN "trackingNumber";
