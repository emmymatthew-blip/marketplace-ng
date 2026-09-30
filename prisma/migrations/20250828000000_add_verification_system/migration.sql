-- CreateEnum
CREATE TYPE "UserVerificationType" AS ENUM ('IDENTITY', 'BUSINESS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REQUEST_INFO');

-- AlterTable User: add verification fields
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationLevel" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationStatus" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "identityVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "businessVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "enterpriseVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable UserVerification
CREATE TABLE IF NOT EXISTS "UserVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verificationType" "UserVerificationType" NOT NULL,
    "documentUrl" TEXT,
    "documentType" TEXT,
    "status" "UserVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "notes" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "UserVerification_userId_idx" ON "UserVerification"("userId");
CREATE INDEX IF NOT EXISTS "UserVerification_status_idx" ON "UserVerification"("status");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'UserVerification_userId_fkey'
  ) THEN
    ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
