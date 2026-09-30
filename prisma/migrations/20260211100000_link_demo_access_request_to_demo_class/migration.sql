-- Link approved demo access requests to seeded DemoClass drafts

ALTER TABLE "DemoClass"
  ADD COLUMN IF NOT EXISTS "sourceRequestId" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "DemoClass_sourceRequestId_key"
  ON "DemoClass"("sourceRequestId")
  WHERE "sourceRequestId" IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'DemoClass_sourceRequestId_fkey'
  ) THEN
    ALTER TABLE "DemoClass"
      ADD CONSTRAINT "DemoClass_sourceRequestId_fkey"
      FOREIGN KEY ("sourceRequestId")
      REFERENCES "DemoAccessRequest"("id")
      ON DELETE SET NULL
      ON UPDATE CASCADE;
  END IF;
END $$;
