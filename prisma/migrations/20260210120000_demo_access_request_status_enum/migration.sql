-- DemoAccessRequest.status: string -> PostgreSQL enum (source of truth for application queue)

CREATE TYPE "DemoAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

ALTER TABLE "DemoAccessRequest" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "DemoAccessRequest"
  ALTER COLUMN "status" TYPE "DemoAccessRequestStatus"
  USING (
    CASE
      WHEN "status" = 'PENDING' THEN 'PENDING'::"DemoAccessRequestStatus"
      WHEN "status" = 'APPROVED' THEN 'APPROVED'::"DemoAccessRequestStatus"
      WHEN "status" = 'REJECTED' THEN 'REJECTED'::"DemoAccessRequestStatus"
      ELSE 'PENDING'::"DemoAccessRequestStatus"
    END
  );

ALTER TABLE "DemoAccessRequest"
  ALTER COLUMN "status" SET DEFAULT 'PENDING'::"DemoAccessRequestStatus";
