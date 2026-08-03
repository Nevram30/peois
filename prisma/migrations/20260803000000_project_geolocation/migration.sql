-- Geospatial pin for the project site, captured on the Add New Project form
-- (map search, manual entry, or the browser's current location).
-- WGS84 decimal degrees; nullable because existing records have no pin yet.

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "latitude" DOUBLE PRECISION;
ALTER TABLE "Project" ADD COLUMN "longitude" DOUBLE PRECISION;
