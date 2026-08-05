-- History behind the slippage figures on Project: one row per filed
-- assessment, holding the target and actual physical accomplishment (in
-- percent), the revision it was filed as and the encoder's remarks. The
-- slippage percentage itself stays derived (actual − target), so it is not
-- stored. `date` is the assessment date and may be back-dated, which is why
-- it is kept apart from `createdAt`.

-- CreateTable
CREATE TABLE "SlippageAssessment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
    "remarks" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlippageAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SlippageAssessment_projectId_idx" ON "SlippageAssessment"("projectId");

-- CreateIndex
CREATE INDEX "SlippageAssessment_createdById_idx" ON "SlippageAssessment"("createdById");

-- AddForeignKey
ALTER TABLE "SlippageAssessment" ADD CONSTRAINT "SlippageAssessment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlippageAssessment" ADD CONSTRAINT "SlippageAssessment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
