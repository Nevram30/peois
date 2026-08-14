-- The project in-charge (an ADMIN user) a requester addresses a document
-- access request to, picked from the dropdown in the Request Access modal.
-- Nullable: rows created before this column existed have no in-charge, and the
-- admin-side "confirm" request flow does not ask for one.

-- AlterTable
-- IF NOT EXISTS because this column is first applied via `prisma db push`.
ALTER TABLE "ProjectAccessRequest" ADD COLUMN IF NOT EXISTS "assignedToId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ProjectAccessRequest_assignedToId_idx" ON "ProjectAccessRequest"("assignedToId");

-- AddForeignKey
DO $$
BEGIN
  ALTER TABLE "ProjectAccessRequest"
    ADD CONSTRAINT "ProjectAccessRequest_assignedToId_fkey"
    FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
