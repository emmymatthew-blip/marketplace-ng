import { randomUUID } from "crypto"

import { query } from "@/lib/db"

type AgreementThreadEventInput = {
  agreementId: string
  actorId?: string | null
  status: string
  eventType?: string | null
  messageContactId?: string | null
  productId?: string | null
  inquiryId?: string | null
}

function parseImages(value: unknown): string[] {
  if (Array.isArray(value)) return value
  if (typeof value !== "string") return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function ensureAgreementThreadSupport() {
  await query(`
    ALTER TABLE "Agreement"
    ADD COLUMN IF NOT EXISTS title TEXT
  `)
  await query(`
    ALTER TABLE "Agreement"
    ADD COLUMN IF NOT EXISTS "sourceType" TEXT
  `)
  await query(`
    ALTER TABLE "Agreement"
    ADD COLUMN IF NOT EXISTS "messageContactId" TEXT
  `)
  await query(`
    ALTER TABLE "Agreement"
    ADD COLUMN IF NOT EXISTS "productId" TEXT
  `)
  await query(`
    ALTER TABLE "Agreement"
    ADD COLUMN IF NOT EXISTS "inquiryId" TEXT
  `)
  await query(`
    CREATE TABLE IF NOT EXISTS "AgreementEvent" (
      id TEXT PRIMARY KEY,
      "agreementId" TEXT NOT NULL,
      status TEXT NOT NULL,
      "eventType" TEXT,
      "actorId" TEXT,
      "messageContactId" TEXT,
      "productId" TEXT,
      "inquiryId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)
  await query(`
    ALTER TABLE "AgreementEvent"
    ADD COLUMN IF NOT EXISTS "eventType" TEXT
  `)
  await query(`
    ALTER TABLE "AgreementEvent"
    ADD COLUMN IF NOT EXISTS "messageContactId" TEXT
  `)
  await query(`
    ALTER TABLE "AgreementEvent"
    ADD COLUMN IF NOT EXISTS "productId" TEXT
  `)
  await query(`
    ALTER TABLE "AgreementEvent"
    ADD COLUMN IF NOT EXISTS "inquiryId" TEXT
  `)
}

export async function logAgreementThreadEvent(input: AgreementThreadEventInput) {
  await ensureAgreementThreadSupport()

  await query(
    `INSERT INTO "AgreementEvent" (
      id,
      "agreementId",
      status,
      "eventType",
      "actorId",
      "messageContactId",
      "productId",
      "inquiryId",
      "createdAt"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
    [
      randomUUID(),
      input.agreementId,
      input.status,
      input.eventType ?? null,
      input.actorId ?? null,
      input.messageContactId ?? null,
      input.productId ?? null,
      input.inquiryId ?? null,
    ]
  )
}

export async function getAgreementThreadEvents(userId: string, contactId: string) {
  await ensureAgreementThreadSupport()

  const rows = (await query(
    `
      SELECT
        e.id,
        e.status,
        e."eventType",
        e."createdAt",
        e."actorId",
        e."messageContactId",
        e."productId" as "eventProductId",
        e."inquiryId",
        a.id as "agreementId",
        a.title as "agreementTitle",
        a.status as "agreementStatus",
        a."initiatorId",
        a."receiverId",
        a."sourceType",
        a."productId" as "agreementProductId",
        a."inquiryId" as "agreementInquiryId",
        actor.name as "actorName",
        actor."companyName" as "actorCompanyName",
        p.id as "productId",
        p.title as "productTitle",
        p.images as "productImages"
      FROM "AgreementEvent" e
      JOIN "Agreement" a ON a.id = e."agreementId"
      LEFT JOIN "User" actor ON actor.id = e."actorId"
      LEFT JOIN "Product" p ON p.id = COALESCE(e."productId", a."productId")
      WHERE
        (
          (a."initiatorId" = ? AND a."receiverId" = ?)
          OR
          (a."initiatorId" = ? AND a."receiverId" = ?)
        )
      ORDER BY e."createdAt" ASC
    `,
    [userId, contactId, contactId, userId]
  )) as any[]

  return rows.map((row) => ({
    id: row.id,
    type: "agreement_event" as const,
    agreementId: row.agreementId,
    agreementTitle: row.agreementTitle ?? null,
    agreementStatus: row.agreementStatus,
    status: row.status,
    eventType: row.eventType ?? null,
    createdAt: row.createdAt,
    actorId: row.actorId ?? null,
    actorName: row.actorCompanyName ?? row.actorName ?? null,
    initiatorId: row.initiatorId,
    receiverId: row.receiverId,
    sourceType: row.sourceType ?? null,
    productId: row.productId ?? row.eventProductId ?? row.agreementProductId ?? null,
    inquiryId: row.inquiryId ?? row.agreementInquiryId ?? null,
    product:
      row.productId || row.productTitle
        ? {
            id: row.productId ?? row.eventProductId ?? row.agreementProductId ?? "",
            title: row.productTitle ?? "Listing",
            images: parseImages(row.productImages),
          }
        : null,
  }))
}
