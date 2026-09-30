-- Add structured application JSON for curation review (PostgreSQL)
ALTER TABLE "DemoAccessRequest" ADD COLUMN IF NOT EXISTS "applicationPayload" TEXT;
