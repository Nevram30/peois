-- A timeline entry that records the project is running to plan — no extension,
-- suspension, resumption or revision, just the schedule as filed. Recorded from
-- the Project Timeline card the same way as the other adjustment types.

-- AlterEnum
ALTER TYPE "TimelineAdjustmentType" ADD VALUE IF NOT EXISTS 'ON_SCHEDULE';
