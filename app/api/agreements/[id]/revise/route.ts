import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import { query } from "@/lib/db"
import { notifyAgreementRevised } from "@/lib/notifications"

const reviseSchema = z.object({
  title: z.string().optional(),
  terms: z.string().min(10, { message: "Terms must be at least 10 characters" }),
  notes: z.string().optional(),
  changeSummary: z.string().optional(),
  paymentTerms: z.string().optional(),
  deliveryTerms: z.string().optional(),
  value: z.string().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
})

async function getAgreementRecord(id: string) {
  const rows = (await query(
    `SELECT a.*, i.name as "initiatorName", i."companyName" as "initiatorCompanyName",
            r.id as "receiverId", r.name as "receiverName"
     FROM "Agreement" a
     JOIN "User" i ON a."initiatorId" = i.id
     JOIN "User" r ON a."receiverId" = r.id
     WHERE a.id = ?`,
    [id]
  )) as any[]
  return rows[0] ?? null
}

async function getAgreementEvents(agreementId: string) {
  await ensureAgreementThreadSupport()
  const rows = (await query(
    `SELECT e.*, u.name as "actorName", u."companyName" as "actorCompanyName"
     FROM "AgreementEvent" e
     LEFT JOIN "User" u ON u.id = e."actorId"
     WHERE e."agreementId" = ?
     ORDER BY e."createdAt" ASC`,
    [agreementId]
  )) as any[]
  return rows.map((row: any) => ({
    id: row.id,
    status: row.status,
    eventType: row.eventType ?? null,
    createdAt: row.createdAt,
    actorId: row.actorId ?? null,
    actor: row.actorCompanyName ?? row.actorName ?? null,
  }))
}

async function getAgreementRevisions(agreementId: string) {
  try {
    const rows = (await query(
      `SELECT r.id, r.version, r.title, r."changeSummary", r."createdAt", u.name as "createdByName", u."companyName" as "createdByCompanyName"
       FROM "AgreementRevision" r
       LEFT JOIN "User" u ON u.id = r."createdById"
       WHERE r."agreementId" = ?
       ORDER BY r.version ASC`,
      [agreementId]
    )) as any[]
    return (rows ?? []).map((row: any) => ({
      id: row.id,
      version: Number(row.version) || 0,
      title: row.title ?? null,
      changeSummary: row.changeSummary ?? null,
      createdAt: row.createdAt,
      createdBy: row.createdByCompanyName ?? row.createdByName ?? null,
    }))
  } catch {
    return []
  }
}

async function getLatestModificationRequest(agreementId: string) {
  try {
    const rows = (await query(
      `SELECT m.id, m.message, m."createdAt", u.name as "requestedByName", u."companyName" as "requestedByCompanyName"
       FROM "AgreementModificationRequest" m
       LEFT JOIN "User" u ON u.id = m."requestedById"
       WHERE m."agreementId" = ?
       ORDER BY m."createdAt" DESC LIMIT 1`,
      [agreementId]
    )) as any[]
    const row = rows?.[0]
    if (!row) return null
    return {
      id: row.id,
      message: row.message ?? "",
      createdAt: row.createdAt,
      requestedBy: row.requestedByCompanyName ?? row.requestedByName ?? null,
    }
  } catch {
    return null
  }
}

function formatAgreement(record: any, currentUserId: string) {
  return {
    id: record.id,
    title: record.title ?? null,
    status: record.status,
    terms: record.terms,
    notes: record.notes,
    currentVersion: record.currentVersion ?? 1,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    initiator: { name: record.initiatorName, companyName: record.initiatorCompanyName },
    receiver: { id: record.receiverId, name: record.receiverName },
    isInitiator: record.initiatorId === currentUserId,
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureAgreementThreadSupport()
    const agreement = await getAgreementRecord(params.id)
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    const initiatorId = agreement.initiatorId ?? agreement["initiatorId"]
    const receiverId = agreement.receiverId ?? agreement["receiverId"]
    if (initiatorId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the agreement creator can submit a revision" },
        { status: 403 }
      )
    }

    const currentStatus = agreement.status ?? agreement["status"]
    if (currentStatus !== "MODIFICATION_REQUESTED") {
      return NextResponse.json(
        { error: "Agreement can only be revised when modification has been requested" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const data = reviseSchema.parse(body)

    const currentVersion = Number(agreement.currentVersion ?? agreement["currentVersion"] ?? 1)
    const nextVersion = currentVersion + 1
    const revisionId = "rev-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)

    await query(
      `INSERT INTO "AgreementRevision" (
        id, "agreementId", version, title, terms, notes, "paymentTerms", "deliveryTerms", value, "startDate", "dueDate", "changeSummary", "createdById", "createdAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        revisionId,
        params.id,
        nextVersion,
        data.title ?? agreement.title ?? agreement["title"],
        data.terms,
        data.notes ?? null,
        data.paymentTerms ?? null,
        data.deliveryTerms ?? null,
        data.value ?? null,
        data.startDate ? new Date(data.startDate) : null,
        data.dueDate ? new Date(data.dueDate) : null,
        data.changeSummary ?? null,
        session.user.id,
      ]
    )

    const titleToSet = data.title ?? agreement.title ?? agreement["title"]
    await query(
      `UPDATE "Agreement" SET terms = ?, notes = ?, title = ?, "currentVersion" = ?, status = ?, "updatedAt" = NOW() WHERE id = ?`,
      [data.terms, data.notes ?? null, titleToSet ?? null, nextVersion, "PROPOSED", params.id]
    )

    const messageContactId = agreement.messageContactId ?? agreement["messageContactId"]
    const productId = agreement.productId ?? agreement["productId"]
    const inquiryId = agreement.inquiryId ?? agreement["inquiryId"]
    await logAgreementThreadEvent({
      agreementId: params.id,
      actorId: session.user.id,
      status: "PROPOSED",
      eventType: "REVISED_AGREEMENT_SENT",
      messageContactId: messageContactId ?? null,
      productId: productId ?? null,
      inquiryId: inquiryId ?? null,
    })

    const threadLink = messageContactId
      ? `/messages/${messageContactId}${productId ? `?productId=${productId}` : ""}`
      : `/agreements/${params.id}`
    const initiatorName = agreement.initiatorCompanyName ?? agreement.initiatorName ?? "The creator"
    notifyAgreementRevised(receiverId, initiatorName, params.id, threadLink).catch(() => {})

    const updated = await getAgreementRecord(params.id)
    if (!updated) {
      return NextResponse.json({ error: "Agreement not found after update" }, { status: 404 })
    }

    const events = await getAgreementEvents(params.id)
    const revisions = await getAgreementRevisions(params.id)
    const latestModificationRequest = await getLatestModificationRequest(params.id)

    return NextResponse.json({
      ...formatAgreement(updated, session.user.id),
      events,
      revisions,
      latestModificationRequest,
    })
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: e.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to revise agreement" }, { status: 500 })
  }
}
