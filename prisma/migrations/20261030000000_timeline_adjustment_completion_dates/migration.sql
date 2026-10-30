-- Project Completion Date and Revised Project Completion Date become selectable
-- timeline adjustment types.

-- AlterEnum
ALTER TYPE "TimelineAdjustmentType" ADD VALUE IF NOT EXISTS 'PROJECT_COMPLETION_DATE';
ALTER TYPE "TimelineAdjustmentType" ADD VALUE IF NOT EXISTS 'REVISED_PROJECT_COMPLETION_DATE';
