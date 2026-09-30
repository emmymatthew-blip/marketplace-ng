import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { trackEvent } from "@/lib/analytics"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import { query } from "@/lib/db"
import {
  notifyAdminsAgreementDisputed,
  notifyAgreementAccepted,
  notifyAgreementActivated,
  notifyAgreementCompleted,
  notifyAgreementDisputed,
  notifyAgreementModificationRequested,
  notifyAgreementResolved,
  notifyAgreementRevised,
} from "@/lib/notifications"

const agreementUpdateSchema = z.object({
  status: z.enum(["PROPOSED", "ACTIVE", "COMPLETED", "DISPUTED", "RESOLVED", "DECLINED", "CANCELLED"]).optional(),
  terms: z.string().min(10, { message: "Terms must be at least 10 characters" }).optional(),
  notes: z.string().optional(),
  action: z.enum(["REQUEST_MODIFICATION", "DECLINE", "WITHDRAW"]).optional(),
  modificationMessage: z.string().optional(),
  modificationMetadata: z.string().optional(),
})

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

async function getAgreementRecord(id: string) {
  const rows = (await query(
    `
      SELECT
        a.*,
        i.id as "initiatorId",
        i.name as "initiatorName",
        i.role as "initiatorRole",
        i.image as "initiatorImage",
        i."isVerified" as "initiatorIsVerified",
        i."companyName" as "initiatorCompanyName",
        r.id as "receiverId",
        r.name as "receiverName",
        r.role as "receiverRole",
        r.image as "receiverImage",
        r."isVerified" as "receiverIsVerified",
        r."companyName" as "receiverCompanyName",
        p.id as "linkedProductId",
        p.title as "linkedProductTitle",
        p.images as "linkedProductImages",
        inp.id as "inquiryProductId",
        inp.title as "inquiryProductTitle",
        inp.images as "inquiryProductImages"
      FROM "Agreement" a
      JOIN "User" i ON a."initiatorId" = i.id
      JOIN "User" r ON a."receiverId" = r.id
      LEFT JOIN "Product" p ON a."productId" = p.id
      LEFT JOIN "Inquiry" inq ON a."inquiryId" = inq.id
      LEFT JOIN "Product" inp ON inq."productId" = inp.id
      WHERE a.id = ?
    `,
    [id]
  )) as any[]

  return rows[0] ?? null
}

async function getAgreementEvents(agreementId: string) {
  await ensureAgreementThreadSupport()
  const rows = (await query(
    `
      SELECT
        e.*,
        u.name as "actorName",
        u."companyName" as "actorCompanyName"
      FROM "AgreementEvent" e
      LEFT JOIN "User" u ON u.id = e."actorId"
      WHERE e."agreementId" = ?
      ORDER BY e."createdAt" ASC
    `,
    [agreementId]
  )) as any[]

  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    eventType: row.eventType ?? null,
    createdAt: row.createdAt,
    actorId: row.actorId ?? null,
    actor: row.actorCompanyName ?? row.actorName ?? null,
  }))
}

async function getAgreementRevisions(agreementId: string): Promise<
  { id: string; version: number; title: string | null; changeSummary: string | null; createdAt: string; createdBy: string | null }[]
> {
  try {
    const rows = (await query(
      `SELECT r.id, r.version, r.title, r."changeSummary", r."createdAt", u.name as "createdByName", u."companyName" as "createdByCompanyName"
       FROM "AgreementRevision" r
       LEFT JOIN "User" u ON u.id = r."createdById"
       WHERE r."agreementId" = ?
       ORDER BY r.version ASC`,
      [agreementId]
    )) as any[]
    return (rows ?? []).map((row) => ({
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

async function getLatestModificationRequest(agreementId: string): Promise<{
  id: string
  message: string
  createdAt: string
  requestedBy: string | null
} | null> {
  try {
    const rows = (await query(
      `SELECT m.id, m.message, m."createdAt", u.name as "requestedByName", u."companyName" as "requestedByCompanyName"
       FROM "AgreementModificationRequest" m
       LEFT JOIN "User" u ON u.id = m."requestedById"
       WHERE m."agreementId" = ?
       ORDER BY m."createdAt" DESC
       LIMIT 1`,
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

function pickRecord(record: any, ...keys: string[]): string | null {
  if (!record) return null
  for (const k of keys) {
    const v = record[k] ?? record[k.toLowerCase?.() ?? ""]
    if (v != null && v !== "") return String(v)
  }
  return null
}

function formatAgreement(record: any, currentUserId: string) {
  const agreementProductId = pickRecord(record, "productId")
  const linkedTitle = pickRecord(record, "linkedProductTitle", "productTitle")
  const linkedImages =
    record.linkedProductImages ??
    record["linkedProductImages"] ??
    record.productImages ??
    record["productImages"]
  const inquiryProductId = pickRecord(record, "inquiryProductId")
  const inquiryTitle = pickRecord(record, "inquiryProductTitle")
  const inquiryImages = record.inquiryProductImages ?? record["inquiryProductImages"]
  const product =
    agreementProductId
      ? {
          id: agreementProductId,
          title: linkedTitle || "Listing",
          images: parseImages(linkedImages),
        }
      : inquiryProductId
        ? {
            id: inquiryProductId,
            title: inquiryTitle || "Listing",
            images: parseImages(inquiryImages),
          }
        : null
  return {
    id: record.id,
    title: record.title || null,
    status: record.status,
    terms: record.terms,
    notes: record.notes,
    sourceType: record.sourceType || record["sourceType"] || null,
    messageContactId: record.messageContactId || record["messageContactId"] || null,
    inquiryId: record.inquiryId || record["inquiryId"] || null,
    createdAt: record.createdAt || record["createdAt"],
    updatedAt: record.updatedAt || record["updatedAt"],
    product,
    initiator: {
      id: record.initiatorId || record["initiatorId"],
      name: record.initiatorName || record["initiatorName"],
      image: record.initiatorImage || record["initiatorImage"] || null,
      role: record.initiatorRole || record["initiatorRole"],
      isVerified: Boolean(record.initiatorIsVerified || record["initiatorIsVerified"]),
      companyName: record.initiatorCompanyName || record["initiatorCompanyName"],
    },
    receiver: {
      id: record.receiverId || record["receiverId"],
      name: record.receiverName || record["receiverName"],
      image: record.receiverImage || record["receiverImage"] || null,
      role: record.receiverRole || record["receiverRole"],
      isVerified: Boolean(record.receiverIsVerified || record["receiverIsVerified"]),
      companyName: record.receiverCompanyName || record["receiverCompanyName"],
    },
    isInitiator: (record.initiatorId || record["initiatorId"]) === currentUserId,
    currentVersion: record.currentVersion ?? record["currentVersion"] ?? 1,
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureAgreementThreadSupport()
    const agreement = await getAgreementRecord(id)
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    const initiatorId = agreement.initiatorId || agreement["initiatorId"]
    const receiverId = agreement.receiverId || agreement["receiverId"]
    if (
      initiatorId !== session.user.id &&
      receiverId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "You are not authorized to view this agreement" }, { status: 403 })
    }

    const events = await getAgreementEvents(id)
    const revisions = await getAgreementRevisions(id)
    const latestModificationRequest = await getLatestModificationRequest(id)
    return NextResponse.json({
      ...formatAgreement(agreement, session.user.id),
      events,
      revisions,
      latestModificationRequest,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch agreement" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureAgreementThreadSupport()
    const agreement = await getAgreementRecord(id)
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    const initiatorId = agreement.initiatorId || agreement["initiatorId"]
    const receiverId = agreement.receiverId || agreement["receiverId"]
    if (
      initiatorId !== session.user.id &&
      receiverId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "You are not authorized to update this agreement" }, { status: 403 })
    }

    const body = await req.json()
    const { status, terms, notes, action, modificationMessage, modificationMetadata } = agreementUpdateSchema.parse(body)

    if (action === "DECLINE") {
      if (receiverId !== session.user.id) {
        return NextResponse.json({ error: "Only the receiver can decline the agreement" }, { status: 403 })
      }
      await query('UPDATE "Agreement" SET status = ?, "updatedAt" = NOW() WHERE id = ?', ["DECLINED", id])
      const refreshed = await getAgreementRecord(id)
      if (refreshed) {
        await logAgreementThreadEvent({
          agreementId: id,
          actorId: session.user.id,
          status: "DECLINED",
          eventType: "AGREEMENT_DECLINED",
          messageContactId: refreshed.messageContactId ?? refreshed["messageContactId"] ?? null,
          productId: refreshed.productId ?? refreshed["productId"] ?? null,
          inquiryId: refreshed.inquiryId ?? refreshed["inquiryId"] ?? null,
        })
      }
      const events = await getAgreementEvents(id)
      const record = await getAgreementRecord(id)
      if (!record) {
        return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
      }
      const revisions = await getAgreementRevisions(id)
      const latestModificationRequest = await getLatestModificationRequest(id)
      return NextResponse.json({
        ...formatAgreement(record, session.user.id),
        events,
        revisions,
        latestModificationRequest,
      })
    }

    if (action === "WITHDRAW") {
      if (initiatorId !== session.user.id) {
        return NextResponse.json({ error: "Only the initiator can withdraw the agreement" }, { status: 403 })
      }
      await query('UPDATE "Agreement" SET status = ?, "updatedAt" = NOW() WHERE id = ?', ["CANCELLED", id])
      const refreshed = await getAgreementRecord(id)
      if (refreshed) {
        await logAgreementThreadEvent({
          agreementId: id,
          actorId: session.user.id,
          status: "CANCELLED",
          eventType: "AGREEMENT_WITHDRAWN",
          messageContactId: refreshed.messageContactId ?? refreshed["messageContactId"] ?? null,
          productId: refreshed.productId ?? refreshed["productId"] ?? null,
          inquiryId: refreshed.inquiryId ?? refreshed["inquiryId"] ?? null,
        })
      }
      const events = await getAgreementEvents(id)
      const recordAfterWithdraw = await getAgreementRecord(id)
      if (!recordAfterWithdraw) {
        return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
      }
      const revisions = await getAgreementRevisions(id)
      const latestModificationRequest = await getLatestModificationRequest(id)
      return NextResponse.json({
        ...formatAgreement(recordAfterWithdraw, session.user.id),
        events,
        revisions,
        latestModificationRequest,
      })
    }

    if (status && initiatorId === session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only the receiver or an admin can change the agreement status" },
        { status: 403 }
      )
    }

    const hasContentUpdate = terms !== undefined || notes !== undefined
    if (hasContentUpdate || status) {
    let updateSql = 'UPDATE "Agreement" SET "updatedAt" = NOW()'
    const updateParams: any[] = []

    if (status !== undefined) {
      updateSql += ", status = ?"
      updateParams.push(status)
    }
    if (terms !== undefined) {
      updateSql += ", terms = ?"
      updateParams.push(terms)
    }
    if (notes !== undefined) {
      updateSql += ", notes = ?"
      updateParams.push(notes)
    }

    updateSql += " WHERE id = ?"
      updateParams.push(id)
    await query(updateSql, updateParams)
    }

    const refreshedAgreement = await getAgreementRecord(id)
    if (!refreshedAgreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    const refreshedInitiatorId = refreshedAgreement.initiatorId || refreshedAgreement["initiatorId"]
    const refreshedReceiverId = refreshedAgreement.receiverId || refreshedAgreement["receiverId"]
    const initiatorName =
      refreshedAgreement.initiatorCompanyName ||
      refreshedAgreement["initiatorCompanyName"] ||
      refreshedAgreement.initiatorName ||
      refreshedAgreement["initiatorName"] ||
      "Initiator"
    const receiverName =
      refreshedAgreement.receiverCompanyName ||
      refreshedAgreement["receiverCompanyName"] ||
      refreshedAgreement.receiverName ||
      refreshedAgreement["receiverName"] ||
      "Receiver"

    const threadLink =
      refreshedAgreement.messageContactId || refreshedAgreement["messageContactId"]
        ? `/messages/${refreshedAgreement.messageContactId || refreshedAgreement["messageContactId"]}${
            refreshedAgreement.productId || refreshedAgreement["productId"]
              ? `?productId=${refreshedAgreement.productId || refreshedAgreement["productId"]}`
              : ""
          }`
        : `/agreements/${id}`

    if (action === "REQUEST_MODIFICATION") {
      await query(
        'UPDATE "Agreement" SET status = ?, "updatedAt" = NOW() WHERE id = ?',
        ["MODIFICATION_REQUESTED", id]
      )
      try {
        const modId = "mod-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
        const msg = modificationMessage ?? "Modification requested."
        if (modificationMetadata) {
          try {
            await query(
              `INSERT INTO "AgreementModificationRequest" (id, "agreementId", "requestedById", message, metadata, "createdAt")
               VALUES (?, ?, ?, ?, ?, NOW())`,
              [modId, id, session.user.id, msg, modificationMetadata]
            )
          } catch {
            await query(
              `INSERT INTO "AgreementModificationRequest" (id, "agreementId", "requestedById", message, "createdAt")
               VALUES (?, ?, ?, ?, NOW())`,
              [modId, id, session.user.id, msg]
            )
          }
        } else {
          await query(
            `INSERT INTO "AgreementModificationRequest" (id, "agreementId", "requestedById", message, "createdAt")
             VALUES (?, ?, ?, ?, NOW())`,
            [modId, id, session.user.id, msg]
          )
        }
      } catch {
        // Table may not exist yet
      }
      const refreshedAfterMod = await getAgreementRecord(id)
      await logAgreementThreadEvent({
        agreementId: id,
        actorId: session.user.id,
        status: refreshedAfterMod?.status ?? "MODIFICATION_REQUESTED",
        eventType: "MODIFICATION_REQUESTED",
        messageContactId: refreshedAfterMod?.messageContactId ?? refreshedAfterMod?.["messageContactId"] ?? null,
        productId: refreshedAfterMod?.productId ?? refreshedAfterMod?.["productId"] ?? null,
        inquiryId: refreshedAfterMod?.inquiryId ?? refreshedAfterMod?.["inquiryId"] ?? null,
      })
      const targetUserId = session.user.id === refreshedInitiatorId ? refreshedReceiverId : refreshedInitiatorId
      const fromName = session.user.id === refreshedInitiatorId ? initiatorName : receiverName
      notifyAgreementModificationRequested(targetUserId, fromName, id, threadLink).catch(() => {})
      const refreshedAfterRequest = await getAgreementRecord(id)
      if (refreshedAfterRequest) {
        const events = await getAgreementEvents(id)
        const revisions = await getAgreementRevisions(id)
        const latestModificationRequest = await getLatestModificationRequest(id)
        return NextResponse.json({
          ...formatAgreement(refreshedAfterRequest, session.user.id),
          events,
          revisions,
          latestModificationRequest,
        })
      }
    }

    if (status) {
      await logAgreementThreadEvent({
        agreementId: id,
        actorId: session.user.id,
        status,
        eventType:
          status === "ACTIVE"
            ? "AGREEMENT_ACTIVATED"
            : status === "COMPLETED"
              ? "AGREEMENT_COMPLETED"
              : status === "DISPUTED"
                ? "DISPUTE_OPENED"
                : "STATUS_UPDATED",
        messageContactId: refreshedAgreement.messageContactId || refreshedAgreement["messageContactId"] || null,
        productId: refreshedAgreement.productId || refreshedAgreement["productId"] || null,
        inquiryId: refreshedAgreement.inquiryId || refreshedAgreement["inquiryId"] || null,
      })

      if ((agreement.status || agreement["status"]) === "DISPUTED" && status !== "DISPUTED") {
        await logAgreementThreadEvent({
          agreementId: id,
          actorId: session.user.id,
          status,
          eventType: "DISPUTE_RESOLVED",
          messageContactId: refreshedAgreement.messageContactId || refreshedAgreement["messageContactId"] || null,
          productId: refreshedAgreement.productId || refreshedAgreement["productId"] || null,
          inquiryId: refreshedAgreement.inquiryId || refreshedAgreement["inquiryId"] || null,
        })
        notifyAgreementResolved(refreshedInitiatorId, id, threadLink).catch(() => {})
        notifyAgreementResolved(refreshedReceiverId, id, threadLink).catch(() => {})
      }

      const eventType =
        status === "ACTIVE"
          ? "agreement_accepted"
          : status === "COMPLETED"
            ? "agreement_completed"
            : status === "DISPUTED"
              ? "agreement_disputed"
              : null
      if (eventType) {
        await trackEvent({
          eventType,
          ownerId: refreshedReceiverId,
          actorId: session.user.id,
          agreementId: id,
          inquiryId: refreshedAgreement.inquiryId || refreshedAgreement["inquiryId"] || undefined,
        })
      }

      if (status === "ACTIVE") {
        notifyAgreementAccepted(refreshedInitiatorId, receiverName, id, threadLink).catch(() => {})
        notifyAgreementActivated(refreshedInitiatorId, id, threadLink).catch(() => {})
        notifyAgreementActivated(refreshedReceiverId, id, threadLink).catch(() => {})
      } else if (status === "COMPLETED") {
        notifyAgreementCompleted(refreshedInitiatorId, id, threadLink).catch(() => {})
        notifyAgreementCompleted(refreshedReceiverId, id, threadLink).catch(() => {})
      } else if (status === "DISPUTED") {
        const otherId = session.user.id === refreshedInitiatorId ? refreshedReceiverId : refreshedInitiatorId
        const fromName = session.user.id === refreshedInitiatorId ? initiatorName : receiverName
        notifyAgreementDisputed(otherId, fromName, id, threadLink).catch(() => {})
        notifyAdminsAgreementDisputed(id, fromName).catch(() => {})
      }
    }

    if (hasContentUpdate && action !== "REQUEST_MODIFICATION" && !status) {
      const targetUserId = session.user.id === refreshedInitiatorId ? refreshedReceiverId : refreshedInitiatorId
      const fromName = session.user.id === refreshedInitiatorId ? initiatorName : receiverName
      await logAgreementThreadEvent({
        agreementId: id,
        actorId: session.user.id,
        status: refreshedAgreement.status,
        eventType: "MODIFICATION_REQUESTED",
        messageContactId: refreshedAgreement.messageContactId || refreshedAgreement["messageContactId"] || null,
        productId: refreshedAgreement.productId || refreshedAgreement["productId"] || null,
        inquiryId: refreshedAgreement.inquiryId || refreshedAgreement["inquiryId"] || null,
      })
      notifyAgreementModificationRequested(targetUserId, fromName, id, threadLink).catch(() => {})
    }

    const events = await getAgreementEvents(id)
    const revisions = await getAgreementRevisions(id)
    const latestModificationRequest = await getLatestModificationRequest(id)
    return NextResponse.json({
      ...formatAgreement(refreshedAgreement, session.user.id),
      events,
      revisions,
      latestModificationRequest,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update agreement" }, { status: 500 })
  }
}
