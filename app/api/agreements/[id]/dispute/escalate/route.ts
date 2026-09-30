import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import { notifyAdminsAgreementDisputed } from "@/lib/notifications"

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
      `SELECT c.id, c.status FROM "Complaint" c WHERE c."agreementId" = ? ORDER BY c."createdAt" DESC LIMIT 1`,
      [agreementId]
    )) as any[]
    const complaint = complaintRows[0]
    if (!complaint) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 })
    }
    if (!["DISPUTED", "UNDER_REVIEW"].includes(complaint.status)) {
      return NextResponse.json({ error: "Dispute cannot be escalated in its current state" }, { status: 400 })
    }

    await query(
      `UPDATE "Complaint" SET status = 'ESCALATED', "updatedAt" = NOW() WHERE id = ?`,
      [complaint.id]
    )

    await ensureAgreementThreadSupport()
    await logAgreementThreadEvent({
      agreementId,
      actorId: session.user.id,
      status: "DISPUTED",
      eventType: "DISPUTE_ESCALATED",
      messageContactId: agreement.messageContactId ?? null,
      productId: agreement.productId ?? null,
      inquiryId: agreement.inquiryId ?? null,
    })

    const fromName = (session.user as { name?: string }).name ?? "A user"
    notifyAdminsAgreementDisputed(agreementId, fromName).catch(() => {})

    return NextResponse.json({ message: "Dispute escalated to platform" })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
