import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import {
  notifyVerificationApproved,
  notifyVerificationRejected,
  notifyVerificationMoreInfo,
} from "@/lib/notifications"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { verificationId, action, notes } = body
    if (!verificationId || !action || !["APPROVED", "REJECTED", "REQUEST_INFO"].includes(action)) {
      return NextResponse.json(
        { error: "verificationId and action (APPROVED, REJECTED, or REQUEST_INFO) required" },
        { status: 400 }
      )
    }

    const rows = await query(
      `SELECT id, "userId", "verificationType" FROM "UserVerification" WHERE id = ? AND status = 'PENDING'`,
      [verificationId]
    ) as any[]
    if (!rows?.length) {
      return NextResponse.json({ error: "Verification request not found or already reviewed" }, { status: 404 })
    }
    const row = rows[0]
    const userId = row.userId ?? row["userId"]
    const verificationType = row.verificationType ?? row["verificationType"]

    await query(
      `UPDATE "UserVerification" SET status = ?, "reviewedAt" = NOW(), "reviewedBy" = ?, notes = ?, "updatedAt" = NOW() WHERE id = ?`,
      [action, session.user.id, notes ?? null, verificationId]
    )

    if (action === "APPROVED") {
      const levelField =
        verificationType === "IDENTITY"
          ? "identityVerified"
          : verificationType === "BUSINESS"
            ? "businessVerified"
            : "enterpriseVerified"
      await query(
        `UPDATE "User" SET "${levelField}" = TRUE, "verificationLevel" = GREATEST("verificationLevel", ?), "isVerified" = TRUE, "updatedAt" = NOW() WHERE id = ?`,
        [verificationType === "IDENTITY" ? 2 : verificationType === "BUSINESS" ? 3 : 4, userId]
      )
      notifyVerificationApproved(userId).catch(() => {})
    } else if (action === "REJECTED") {
      notifyVerificationRejected(userId, notes ?? undefined).catch(() => {})
    } else if (action === "REQUEST_INFO") {
      notifyVerificationMoreInfo(userId).catch(() => {})
    }

    return NextResponse.json({ success: true, action })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Review failed" },
      { status: 500 }
    )
  }
}
