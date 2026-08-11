-- Projects can be encoded before the implementation mode has been decided.
-- AlterEnum
-- IF NOT EXISTS because this value was first applied via `prisma db push`.
ALTER TYPE "ModeOfImplementation" ADD VALUE IF NOT EXISTS 'UNASSIGNED_FOR_DETERMINATION';
