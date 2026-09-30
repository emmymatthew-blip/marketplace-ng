import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { z } from "zod"
import { query } from "@/lib/db"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import { notifyAgreementResolved } from "@/lib/notifications"

const resolveSchema = z.object({
  resolutionNote: z.string().max(1000).optional(),
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
      `SELECT a.id, a."initiatorId", a."receiverId", a."messageContactId", a."productId", a."inquiryId"
       FROM "Agreement" a WHERE a.id = ?`,
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
      `SELECT c.id, c.status, c."initiatorConfirmedResolutionAt", c."receiverConfirmedResolutionAt"
       FROM "Complaint" c WHERE c."agreementId" = ? ORDER BY c."createdAt" DESC LIMIT 1`,
      [agreementId]
    )) as any[]
    const complaint = complaintRows[0]
    if (!complaint) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 })
    }
    if (!["DISPUTED", "UNDER_REVIEW"].includes(complaint.status)) {
      return NextResponse.json({ error: "Dispute cannot be resolved in its current state" }, { status: 400 })
    }

    const body = await request.json().catch(() => ({}))
    const { resolutionNote } = resolveSchema.parse(body)
    const isInitiator = agreement.initiatorId === session.user.id
    const now = new Date().toISOString()

    if (isInitiator) {
      await query(
        `UPDATE "Complaint" SET "initiatorConfirmedResolutionAt" = NOW(), "updatedAt" = NOW() WHERE id = ?`,
        [complaint.id]
      )
    } else {
      await query(
        `UPDATE "Complaint" SET "receiverConfirmedResolutionAt" = NOW(), "updatedAt" = NOW() WHERE id = ?`,
        [complaint.id]
      )
    }

    const updated = (await query(
      `SELECT "initiatorConfirmedResolutionAt", "receiverConfirmedResolutionAt" FROM "Complaint" WHERE id = ?`,
      [complaint.id]
    )) as any[]
    const row = updated[0]
    const bothConfirmed = !!(row?.initiatorConfirmedResolutionAt && row?.receiverConfirmedResolutionAt)

    if (bothConfirmed) {
      await query(
        `UPDATE "Complaint" SET status = 'RESOLVED', "resolutionNote" = ?, "updatedAt" = NOW() WHERE id = ?`,
        [resolutionNote ?? null, complaint.id]
      )
      await query(
        `UPDATE "Agreement" SET status = 'RESOLVED', "updatedAt" = NOW() WHERE id = ?`,
        [agreementId]
      )

      await ensureAgreementThreadSupport()
      await logAgreementThreadEvent({
        agreementId,
        actorId: session.user.id,
        status: "RESOLVED",
        eventType: "DISPUTE_RESOLVED",
        messageContactId: agreement.messageContactId ?? null,
        productId: agreement.productId ?? null,
        inquiryId: agreement.inquiryId ?? null,
      })

      const otherPartyId = agreement.initiatorId === session.user.id ? agreement.receiverId : agreement.initiatorId
      notifyAgreementResolved(otherPartyId, agreementId, `/agreements/${agreementId}`).catch(() => {})
    }

    return NextResponse.json({
      message: bothConfirmed ? "Dispute resolved" : "Resolution confirmation recorded",
      bothConfirmed,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
