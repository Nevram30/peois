-- Which documentary requirement each uploaded file satisfies, so the Project
-- Documentation checklist survives a save and can be shown (and corrected) on
-- the edit page. fileType alone cannot carry this: it is a lossy many-to-one
-- collapse of these categories (7 of the 12 keys map to REPORT, 2 to PERMIT).
-- Nullable because files uploaded before this column existed have no key.

-- AlterTable
-- IF NOT EXISTS because this column is first applied via `prisma db push`.
ALTER TABLE "ProjectFile" ADD COLUMN IF NOT EXISTS "docType" TEXT;
