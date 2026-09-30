-- Create DemoAccessRequest table
CREATE TABLE IF NOT EXISTS "DemoAccessRequest" (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  "preferredDate" TIMESTAMP,
  "assignedDate" TIMESTAMP,
  "assignedDateId" TEXT,
  "requestedAt" TIMESTAMP DEFAULT NOW(),
  "approvedAt" TIMESTAMP,
  "rejectedAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Add demoAccessRequests relation (this is handled by Prisma, but we add index for performance)
CREATE INDEX IF NOT EXISTS "DemoAccessRequest_userId_idx" ON "DemoAccessRequest"("userId");
CREATE INDEX IF NOT EXISTS "DemoAccessRequest_status_idx" ON "DemoAccessRequest"("status");

-- Add comments
COMMENT ON TABLE "DemoAccessRequest" IS 'Individual demo access requests from users';
COMMENT ON COLUMN "DemoAccessRequest".status IS 'PENDING, APPROVED, or REJECTED';
COMMENT ON COLUMN "DemoAccessRequest"."preferredDate" IS 'User preferred date when submitting request';
COMMENT ON COLUMN "DemoAccessRequest"."assignedDate" IS 'Date assigned by admin when approving';
COMMENT ON COLUMN "DemoAccessRequest"."assignedDateId" IS 'ID of AvailableDemoDate if a date was assigned';
