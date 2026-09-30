-- Add dispute workflow fields to Complaint
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "proposedResolution" TEXT;
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "resolutionNote" TEXT;
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "initiatorConfirmedResolutionAt" TIMESTAMP(3);
ALTER TABLE "Complaint" ADD COLUMN IF NOT EXISTS "receiverConfirmedResolutionAt" TIMESTAMP(3);

-- DisputeResponse table for responses and timeline
CREATE TABLE IF NOT EXISTS "DisputeResponse" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "complaintId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "message" TEXT,
  "evidence" TEXT,
  "proposedResolution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DisputeResponse_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE,
  CONSTRAINT "DisputeResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "DisputeResponse_complaintId_idx" ON "DisputeResponse"("complaintId");
CREATE INDEX IF NOT EXISTS "DisputeResponse_userId_idx" ON "DisputeResponse"("userId");

-- Treat existing OPEN complaints as DISPUTED for the new workflow
UPDATE "Complaint" SET status = 'DISPUTED' WHERE status = 'OPEN';
