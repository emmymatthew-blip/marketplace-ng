import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rows = (await query(
      `SELECT 
        r.id, r.title, r.description, r."applicationPayload", r.status::text AS status, r."preferredDate", r."assignedDate", 
        r."assignedDateId", r."requestedAt", r."approvedAt", r."rejectedAt",
        r."createdAt", r."updatedAt",
        (SELECT d2.id FROM "DemoClass" d2 WHERE d2."sourceRequestId" = r.id ORDER BY d2."updatedAt" DESC NULLS LAST LIMIT 1) AS "demoId",
        (SELECT d2.status::text FROM "DemoClass" d2 WHERE d2."sourceRequestId" = r.id ORDER BY d2."updatedAt" DESC NULLS LAST LIMIT 1) AS "demoStatus",
        (SELECT d2."featuredWeekStart" FROM "DemoClass" d2 WHERE d2."sourceRequestId" = r.id ORDER BY d2."updatedAt" DESC NULLS LAST LIMIT 1) AS "featuredWeekStart",
        (SELECT d2."isFeatured" FROM "DemoClass" d2 WHERE d2."sourceRequestId" = r.id ORDER BY d2."updatedAt" DESC NULLS LAST LIMIT 1) AS "isFeatured",
        (SELECT d2."viewCount" FROM "DemoClass" d2 WHERE d2."sourceRequestId" = r.id ORDER BY d2."updatedAt" DESC NULLS LAST LIMIT 1) AS "viewCount",
        (SELECT d2."registrationCount" FROM "DemoClass" d2 WHERE d2."sourceRequestId" = r.id ORDER BY d2."updatedAt" DESC NULLS LAST LIMIT 1) AS "registrationCount"
       FROM "DemoAccessRequest" r
       WHERE r."userId" = ?
       ORDER BY r."requestedAt" DESC`,
      [session.user.id]
    )) as Record<string, unknown>[]

    const data = (rows || []).map((row) => {
      const demoIdRaw = row.demoId ?? (row as Record<string, unknown>).demoid
      const demoStatusRaw = row.demoStatus ?? (row as Record<string, unknown>).demostatus
      const demoId =
        demoIdRaw != null && String(demoIdRaw).trim() !== "" ? String(demoIdRaw).trim() : null
      const demoStatus =
        demoStatusRaw != null && String(demoStatusRaw).trim() !== ""
          ? String(demoStatusRaw).trim()
          : null
      return { ...row, demoId, demoStatus }
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error("Error fetching user demo access requests:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch requests" },
      { status: 500 }
    )
  }
}
