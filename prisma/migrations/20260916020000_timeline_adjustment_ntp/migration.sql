-- NTP (Notice to Proceed) replaces ON_SCHEDULE as the selectable timeline
-- adjustment type. ON_SCHEDULE stays in the enum so adjustments already
-- recorded with it are kept; the UI just no longer offers it.

-- AlterEnum
ALTER TYPE "TimelineAdjustmentType" ADD VALUE IF NOT EXISTS 'NTP';
