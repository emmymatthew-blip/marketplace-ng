import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { randomUUID } from "crypto"
import { z } from "zod"
import { query } from "@/lib/db"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import {
  notifyAdminsAgreementDisputed,
  notifyAgreementDisputed,
} from "@/lib/notifications"

const disputeSchema = z.object({
  reason: z.string(),
  description: z.string().min(20).max(1000),
  evidence: z.string().optional(),
  proposedResolution: z.string().min(20).max(500),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agreementId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agreementRows = (await query(
      `SELECT a.id, a."initiatorId", a."receiverId" FROM "Agreement" a WHERE a.id = ?`,
      [agreementId]
    )) as Array<Record<string, string>>
    const agreement = agreementRows[0]
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }
    if (agreement.initiatorId !== session.user.id && agreement.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const complaintRows = (await query(
      `SELECT c.id, c.title, c.description, c.status, c."userId", c.evidence, c."proposedResolution",
              c."resolutionNote", c."initiatorConfirmedResolutionAt", c."receiverConfirmedResolutionAt",
              c."createdAt", u.name as "raisedByName", u."companyName" as "raisedByCompanyName"
       FROM "Complaint" c
       JOIN "User" u ON u.id = c."userId"
       WHERE c."agreementId" = ?
       ORDER BY c."createdAt" DESC LIMIT 1`,
      [agreementId]
    )) as any[]
    const complaint = complaintRows[0]
    if (!complaint) {
      return NextResponse.json({ dispute: null }, { status: 200 })
    }

    const responseRows = (await query(
      `SELECT r.id, r.type, r.message, r.evidence, r."proposedResolution", r."createdAt",
              u.name as "userName", u."companyName" as "userCompanyName"
       FROM "DisputeResponse" r
       JOIN "User" u ON u.id = r."userId"
       WHERE r."complaintId" = ?
       ORDER BY r."createdAt" ASC`,
      [complaint.id]
    )) as any[]

    const timeline = responseRows.map((row) => ({
      id: row.id,
      type: row.type,
      message: row.message ?? null,
      evidence: row.evidence ? (() => { try { return JSON.parse(row.evidence) } catch { return [] } })() : [],
      proposedResolution: row.proposedResolution ?? null,
      createdAt: row.createdAt,
      userName: row.userCompanyName ?? row.userName ?? "User",
    }))

    const isInitiator = agreement.initiatorId === session.user.id
    const initiatorConfirmed = !!complaint.initiatorConfirmedResolutionAt
    const receiverConfirmed = !!complaint.receiverConfirmedResolutionAt

    return NextResponse.json({
      dispute: {
        id: complaint.id,
        title: complaint.title,
        description: complaint.description,
        status: complaint.status,
        evidence: complaint.evidence ? (() => { try { return JSON.parse(complaint.evidence) } catch { return [] } })() : [],
        proposedResolution: complaint.proposedResolution ?? null,
        resolutionNote: complaint.resolutionNote ?? null,
        raisedBy: complaint.raisedByCompanyName ?? complaint.raisedByName ?? "User",
        raisedAt: complaint.createdAt,
        initiatorConfirmedResolutionAt: complaint.initiatorConfirmedResolutionAt ?? null,
        receiverConfirmedResolutionAt: complaint.receiverConfirmedResolutionAt ?? null,
        timeline,
        canRespond: ["DISPUTED", "UNDER_REVIEW"].includes(complaint.status),
        canConfirmResolution: ["DISPUTED", "UNDER_REVIEW"].includes(complaint.status) && !(isInitiator ? initiatorConfirmed : receiverConfirmed),
        canEscalate: ["DISPUTED", "UNDER_REVIEW"].includes(complaint.status),
        agreementInitiatorId: agreement.initiatorId,
        agreementReceiverId: agreement.receiverId,
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to load dispute" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: agreementId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agreementRows = (await query(
      `SELECT a.id, a.status, a."initiatorId", a."receiverId", a."messageContactId", a."productId", a."inquiryId",
              i.name as "initiatorName", r.name as "receiverName"
       FROM "Agreement" a
       JOIN "User" i ON a."initiatorId" = i.id
       JOIN "User" r ON a."receiverId" = r.id
       WHERE a.id = ?`,
      [agreementId]
    )) as Array<Record<string, string>>

    const agreement = agreementRows[0]
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    if (agreement.initiatorId !== session.user.id && agreement.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to file a dispute for this agreement" },
        { status: 403 },
      )
    }

    if (agreement.status !== "ACTIVE") {
      return NextResponse.json({ error: "Cannot dispute an agreement that is not active" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = disputeSchema.parse(body)
    const complaintId = randomUUID()
    const evidence = validatedData.evidence ?? null

    await query(
      `INSERT INTO "Complaint" (
        id, title, description, status, "userId", "agreementId", evidence, "proposedResolution", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, 'DISPUTED', ?, ?, ?, ?, NOW(), NOW())`,
      [
        complaintId,
        validatedData.reason,
        validatedData.description,
        session.user.id,
        agreementId,
        evidence,
        validatedData.proposedResolution,
      ]
    )

    await query(
      `UPDATE "Agreement" SET status = 'DISPUTED', "updatedAt" = NOW() WHERE id = ?`,
      [agreementId]
    )

    await ensureAgreementThreadSupport()
    await logAgreementThreadEvent({
      agreementId,
      actorId: session.user.id,
      status: "DISPUTED",
      eventType: "DISPUTE_OPENED",
      messageContactId: agreement.messageContactId ?? null,
      productId: agreement.productId ?? null,
      inquiryId: agreement.inquiryId ?? null,
    })

    const otherPartyId = session.user.id === agreement.initiatorId ? agreement.receiverId : agreement.initiatorId
    const fromName =
      session.user.id === agreement.initiatorId
        ? agreement.initiatorName ?? "A partner"
        : agreement.receiverName ?? "A partner"

    notifyAgreementDisputed(otherPartyId, fromName, agreementId).catch(() => {})
    notifyAdminsAgreementDisputed(agreementId, fromName).catch(() => {})

    return NextResponse.json(
      {
        message: "Dispute filed successfully",
        disputeId: complaintId,
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
