-- Add new AgreementStatus enum values (run once; omit if already applied)
ALTER TYPE "AgreementStatus" ADD VALUE 'MODIFICATION_REQUESTED';
ALTER TYPE "AgreementStatus" ADD VALUE 'RESOLVED';
ALTER TYPE "AgreementStatus" ADD VALUE 'DECLINED';

-- Add versioning and optional columns to Agreement (IF NOT EXISTS for columns that may exist from runtime)
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "title" TEXT;
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "productId" TEXT;
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "inquiryId" TEXT;
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "messageContactId" TEXT;
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "sourceType" TEXT;
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "currentVersion" INTEGER;
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "acceptedAt" TIMESTAMP(3);
ALTER TABLE "Agreement" ADD COLUMN IF NOT EXISTS "completedAt" TIMESTAMP(3);

-- Set default for currentVersion where null
UPDATE "Agreement" SET "currentVersion" = 1 WHERE "currentVersion" IS NULL;
ALTER TABLE "Agreement" ALTER COLUMN "currentVersion" SET DEFAULT 1;

-- Create AgreementRevision table
CREATE TABLE IF NOT EXISTS "AgreementRevision" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT,
    "terms" TEXT NOT NULL,
    "notes" TEXT,
    "paymentTerms" TEXT,
    "deliveryTerms" TEXT,
    "value" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "changeSummary" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgreementRevision_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AgreementRevision_agreementId_version_key" ON "AgreementRevision"("agreementId", "version");
CREATE INDEX IF NOT EXISTS "AgreementRevision_agreementId_idx" ON "AgreementRevision"("agreementId");

ALTER TABLE "AgreementRevision" ADD CONSTRAINT "AgreementRevision_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgreementRevision" ADD CONSTRAINT "AgreementRevision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create AgreementModificationRequest table
CREATE TABLE IF NOT EXISTS "AgreementModificationRequest" (
    "id" TEXT NOT NULL,
    "agreementId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgreementModificationRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AgreementModificationRequest_agreementId_idx" ON "AgreementModificationRequest"("agreementId");

ALTER TABLE "AgreementModificationRequest" ADD CONSTRAINT "AgreementModificationRequest_agreementId_fkey" FOREIGN KEY ("agreementId") REFERENCES "Agreement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AgreementModificationRequest" ADD CONSTRAINT "AgreementModificationRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
