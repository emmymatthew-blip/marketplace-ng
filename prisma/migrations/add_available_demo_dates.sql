-- Create AvailableDemoDate table
CREATE TABLE IF NOT EXISTS "AvailableDemoDate" (
  id TEXT PRIMARY KEY,
  date TIMESTAMP NOT NULL UNIQUE,
  time TEXT,
  "isAvailable" BOOLEAN DEFAULT true,
  "assignedTo" TEXT,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Add assignedDemoDate to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "assignedDemoDate" TIMESTAMP;

-- Add comments
COMMENT ON TABLE "AvailableDemoDate" IS 'Available dates for Featured Live Demonstrations set by admin';
COMMENT ON COLUMN "AvailableDemoDate".date IS 'The available date for demonstrations';
COMMENT ON COLUMN "AvailableDemoDate".time IS 'Optional time slot for the date';
COMMENT ON COLUMN "AvailableDemoDate"."isAvailable" IS 'Whether this date is still available for assignment';
COMMENT ON COLUMN "AvailableDemoDate"."assignedTo" IS 'User ID if this date has been assigned';
COMMENT ON COLUMN "User"."assignedDemoDate" IS 'Date assigned to user when their demo access is approved';
