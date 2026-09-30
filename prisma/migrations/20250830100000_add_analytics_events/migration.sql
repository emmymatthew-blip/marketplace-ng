-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "actorId" TEXT,
    "productId" TEXT,
    "vendorId" TEXT,
    "agreementId" TEXT,
    "demoId" TEXT,
    "inquiryId" TEXT,
    "sessionId" TEXT,
    "country" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AnalyticsEvent_ownerId_idx" ON "AnalyticsEvent"("ownerId");
CREATE INDEX "AnalyticsEvent_eventType_idx" ON "AnalyticsEvent"("eventType");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");
CREATE INDEX "AnalyticsEvent_ownerId_eventType_createdAt_idx" ON "AnalyticsEvent"("ownerId", "eventType", "createdAt");
CREATE INDEX "AnalyticsEvent_productId_idx" ON "AnalyticsEvent"("productId");
