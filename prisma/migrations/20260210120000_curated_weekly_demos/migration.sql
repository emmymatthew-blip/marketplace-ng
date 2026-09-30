-- Demonstration lifecycle and weekly featured-slot support
ALTER TABLE "DemoClass" ADD COLUMN IF NOT EXISTS "featuredWeekStart" TIMESTAMP(3);
ALTER TABLE "DemoClass" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "DemoClass" ADD COLUMN IF NOT EXISTS "featuredAt" TIMESTAMP(3);
ALTER TABLE "DemoClass" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "DemoClass" ADD COLUMN IF NOT EXISTS "registrationCount" INTEGER NOT NULL DEFAULT 0;

-- Extend enum values used for lifecycle
DO $$
BEGIN
  IF to_regtype('"DemoStatus"') IS NULL THEN
    CREATE TYPE "DemoStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'DRAFT' AND enumtypid = to_regtype('"DemoStatus"')) THEN
    ALTER TYPE "DemoStatus" ADD VALUE 'DRAFT';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'SUBMITTED' AND enumtypid = to_regtype('"DemoStatus"')) THEN
    ALTER TYPE "DemoStatus" ADD VALUE 'SUBMITTED';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'UNDER_REVIEW' AND enumtypid = to_regtype('"DemoStatus"')) THEN
    ALTER TYPE "DemoStatus" ADD VALUE 'UNDER_REVIEW';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'SCHEDULED' AND enumtypid = to_regtype('"DemoStatus"')) THEN
    ALTER TYPE "DemoStatus" ADD VALUE 'SCHEDULED';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'LIVE' AND enumtypid = to_regtype('"DemoStatus"')) THEN
    ALTER TYPE "DemoStatus" ADD VALUE 'LIVE';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'COMPLETED' AND enumtypid = to_regtype('"DemoStatus"')) THEN
    ALTER TYPE "DemoStatus" ADD VALUE 'COMPLETED';
  END IF;
END $$;

-- Lead capture table
CREATE TABLE IF NOT EXISTS "DemoRegistration" (
  id TEXT PRIMARY KEY,
  "demoId" TEXT NOT NULL REFERENCES "DemoClass"(id) ON DELETE CASCADE,
  "userId" TEXT,
  email TEXT,
  name TEXT,
  "companyName" TEXT,
  phone TEXT,
  message TEXT,
  source TEXT DEFAULT 'REGISTER_INTEREST',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "DemoRegistration_demoId_idx" ON "DemoRegistration"("demoId");
CREATE INDEX IF NOT EXISTS "DemoRegistration_userId_idx" ON "DemoRegistration"("userId");
CREATE INDEX IF NOT EXISTS "DemoRegistration_createdAt_idx" ON "DemoRegistration"("createdAt");

-- Only one featured demo per week
CREATE UNIQUE INDEX IF NOT EXISTS "DemoClass_featured_week_unique_idx"
  ON "DemoClass"("featuredWeekStart")
  WHERE "isFeatured" = true;

