-- Add demo access status fields to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "demoAccessStatus" TEXT DEFAULT 'NOT_APPLIED',
ADD COLUMN IF NOT EXISTS "demoAccessRequestedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "demoAccessApprovedAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "demoRequestTitle" TEXT,
ADD COLUMN IF NOT EXISTS "demoRequestDescription" TEXT;

-- Add comments
COMMENT ON COLUMN "User"."demoAccessStatus" IS 'Status of demo access application: NOT_APPLIED, PENDING, APPROVED, REJECTED';
COMMENT ON COLUMN "User"."demoAccessRequestedAt" IS 'When user applied for demo access';
COMMENT ON COLUMN "User"."demoAccessApprovedAt" IS 'When admin approved the demo access request';
COMMENT ON COLUMN "User"."demoRequestTitle" IS 'Title of the requested demonstration';
COMMENT ON COLUMN "User"."demoRequestDescription" IS 'Description of the requested demonstration';
