-- Projects carry a gallery of up to 4 photos. Additive: existing rows get an
-- empty array, then the single cover photo already on file becomes slot 1 so
-- nothing that was uploaded before the gallery existed is lost.
ALTER TABLE "Project" ADD COLUMN "imageUrls" TEXT[] NOT NULL DEFAULT '{}';

UPDATE "Project"
SET "imageUrls" = ARRAY["imageUrl"]
WHERE "imageUrl" IS NOT NULL
  AND "imageUrl" <> ''
  AND cardinality("imageUrls") = 0;
