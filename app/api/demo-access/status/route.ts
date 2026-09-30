import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prefer deriving status from the user's actual request history (supports multiple requests)
    const counts = await query(
      `SELECT
         COALESCE(SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END), 0)  AS "pendingCount",
         COALESCE(SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END), 0) AS "approvedCount",
         COALESCE(SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END), 0) AS "rejectedCount",
         MAX("requestedAt") AS "lastRequestedAt",
         MAX("approvedAt")  AS "lastApprovedAt"
       FROM "DemoAccessRequest"
       WHERE "userId" = ?`,
      [session.user.id]
    )

    const row = counts && (counts as any[]).length > 0 ? (counts as any[])[0] : null
    const pendingCount = row ? Number(row.pendingCount || 0) : 0
    const approvedCount = row ? Number(row.approvedCount || 0) : 0
    const rejectedCount = row ? Number(row.rejectedCount || 0) : 0
    const activeCount = pendingCount + approvedCount

    let derivedStatus: "NOT_APPLIED" | "PENDING" | "APPROVED" | "REJECTED" = "NOT_APPLIED"
    if (approvedCount > 0) derivedStatus = "APPROVED"
    else if (pendingCount > 0) derivedStatus = "PENDING"
    else if (rejectedCount > 0) derivedStatus = "REJECTED"

    return NextResponse.json({
      status: derivedStatus,
      activeCount,
      pendingCount,
      approvedCount,
      rejectedCount,
      requestedAt: row?.lastRequestedAt || null,
      approvedAt: row?.lastApprovedAt || null,
    })
  } catch (error: any) {
    console.error("Error checking demo access status:", error)
    return NextResponse.json(
      { error: error.message || "Failed to check status" },
      { status: 500 }
    )
  }
}
