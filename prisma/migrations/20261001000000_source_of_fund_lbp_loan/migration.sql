-- "LBP Loan" source of fund. Purely additive; IF NOT EXISTS keeps it
-- safe on a database that already got the value via `prisma db push`.

-- AlterEnum
ALTER TYPE "SourceOfFund" ADD VALUE IF NOT EXISTS 'LBP_LOAN';
