/*
  Warnings:

  - A unique constraint covering the columns `[trackingNumber]` on the table `Disbursement` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Disbursement" ADD COLUMN     "trackingNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Disbursement_trackingNumber_key" ON "Disbursement"("trackingNumber");
