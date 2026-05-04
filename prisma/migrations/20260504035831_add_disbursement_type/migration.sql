-- CreateEnum
CREATE TYPE "DisbursementType" AS ENUM ('FUEL', 'LABOR', 'MATERIALS');

-- AlterTable
ALTER TABLE "Disbursement" ADD COLUMN     "type" "DisbursementType";
