import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { randomUUID } from "crypto"
import { z } from "zod"
import { query } from "@/lib/db"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import { notifyAgreementDisputed } from "@/lib/notifications"

const respondSchema = z.object({
  message: z.string().min(1).max(2000),
  evidence: z.string().optional(),
  proposedResolution: z.string().max(500).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agreementId } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agreementRows = (await query(
      `SELECT a.id, a."initiatorId", a."receiverId", a."messageContactId", a."productId", a."inquiryId",
              i.name as "initiatorName", r.name as "receiverName"
       FROM "Agreement" a
       JOIN "User" i ON a."initiatorId" = i.id
       JOIN "User" r ON a."receiverId" = r.id
       WHERE a.id = ?`,
      [agreementId]
    )) as any[]
    const agreement = agreementRows[0]
    if (!agreement) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }
    if (agreement.initiatorId !== session.user.id && agreement.receiverId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const complaintRows = (await query(
      `SELECT c.id, c.status FROM "Complaint" c WHERE c."agreementId" = ? ORDER BY c."createdAt" DESC LIMIT 1`,
      [agreementId]
    )) as any[]
    const complaint = complaintRows[0]
    if (!complaint) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 })
    }
    if (!["DISPUTED", "UNDER_REVIEW"].includes(complaint.status)) {
      return NextResponse.json({ error: "Dispute is no longer accepting responses" }, { status: 400 })
    }

    const body = await request.json()
    const validated = respondSchema.parse(body)
    const responseId = randomUUID()
    const type = validated.proposedResolution ? "PROPOSAL" : validated.evidence ? "EVIDENCE" : "RESPONSE"

    await query(
      `INSERT INTO "DisputeResponse" (id, "complaintId", "userId", type, message, evidence, "proposedResolution", "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        responseId,
        complaint.id,
        session.user.id,
        type,
        validated.message,
        validated.evidence ?? null,
        validated.proposedResolution ?? null,
      ]
    )

    await query(
      `UPDATE "Complaint" SET status = 'UNDER_REVIEW', "updatedAt" = NOW() WHERE id = ?`,
      [complaint.id]
    )

    await ensureAgreementThreadSupport()
    await logAgreementThreadEvent({
      agreementId,
      actorId: session.user.id,
      status: "DISPUTED",
      eventType: "DISPUTE_RESPONSE_SUBMITTED",
      messageContactId: agreement.messageContactId ?? null,
      productId: agreement.productId ?? null,
      inquiryId: agreement.inquiryId ?? null,
    })

    const otherPartyId = session.user.id === agreement.initiatorId ? agreement.receiverId : agreement.initiatorId
    const fromName = session.user.id === agreement.initiatorId ? agreement.initiatorName ?? "A partner" : agreement.receiverName ?? "A partner"
    notifyAgreementDisputed(otherPartyId, fromName, agreementId).catch(() => {})

    return NextResponse.json({ message: "Response submitted", responseId }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
