-- Controlled edit workflow for approved weekly demos

DO $$
BEGIN
  IF to_regtype('"DemoUpdateRequestStatus"') IS NULL THEN
    CREATE TYPE "DemoUpdateRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "DemoUpdateRequest" (
  id TEXT PRIMARY KEY,
  "demoId" TEXT NOT NULL,
  "requestedById" TEXT NOT NULL,
  status "DemoUpdateRequestStatus" NOT NULL DEFAULT 'PENDING',
  "changesJson" TEXT NOT NULL,
  reason TEXT,
  "reviewedById" TEXT,
  "reviewNote" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DemoUpdateRequest_demoId_fkey') THEN
    ALTER TABLE "DemoUpdateRequest"
      ADD CONSTRAINT "DemoUpdateRequest_demoId_fkey"
      FOREIGN KEY ("demoId") REFERENCES "DemoClass"(id) ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DemoUpdateRequest_requestedById_fkey') THEN
    ALTER TABLE "DemoUpdateRequest"
      ADD CONSTRAINT "DemoUpdateRequest_requestedById_fkey"
      FOREIGN KEY ("requestedById") REFERENCES "User"(id) ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'DemoUpdateRequest_reviewedById_fkey') THEN
    ALTER TABLE "DemoUpdateRequest"
      ADD CONSTRAINT "DemoUpdateRequest_reviewedById_fkey"
      FOREIGN KEY ("reviewedById") REFERENCES "User"(id) ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "DemoUpdateRequest_demoId_status_idx"
  ON "DemoUpdateRequest"("demoId", status);

CREATE INDEX IF NOT EXISTS "DemoUpdateRequest_requestedById_status_idx"
  ON "DemoUpdateRequest"("requestedById", status);
