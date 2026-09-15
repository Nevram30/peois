-- Location category for the project's geospatial data, captured on the Add New
-- Project form. A BUILDING keeps the single latitude/longitude pin; a ROAD uses
-- latitude/longitude as its start point and the new end columns as its end.
-- All nullable: existing records have no category and read as a building.

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('BUILDING', 'ROAD');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN "locationType" "LocationType",
ADD COLUMN "endLatitude" DOUBLE PRECISION,
ADD COLUMN "endLongitude" DOUBLE PRECISION;
