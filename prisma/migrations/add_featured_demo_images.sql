-- Add headerImage and advertImage fields to DemoClass table
-- This migration adds support for Featured Live Demo images

ALTER TABLE "DemoClass" 
ADD COLUMN IF NOT EXISTS "headerImage" TEXT,
ADD COLUMN IF NOT EXISTS "advertImage" TEXT;

-- Add comments to explain the fields
COMMENT ON COLUMN "DemoClass"."headerImage" IS 'Header image for the demonstration detail page';
COMMENT ON COLUMN "DemoClass"."advertImage" IS 'Advertisement image for homepage Featured Live Demo section';
