import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const demoId = searchParams.get("demoId")
    if (!demoId) {
      return NextResponse.json({ error: "demoId is required" }, { status: 400 })
    }

    const rows = await query<any>(
      `SELECT r.id, r.status::text AS status, r."changesJson", r.reason, r."reviewNote", r."reviewedAt", r."createdAt",
              u.id AS "requestedById", u.name AS "requestedByName", u.email AS "requestedByEmail"
       FROM "DemoUpdateRequest" r
       JOIN "User" u ON u.id = r."requestedById"
       WHERE r."demoId" = ?
       ORDER BY r."createdAt" DESC`,
      [demoId]
    )

    return NextResponse.json({ success: true, data: rows || [] })
  } catch (error) {
    console.error("Error loading demo update requests:", error)
    return NextResponse.json({ error: "Failed to load update requests" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = (await req.json()) as {
      requestId?: string
      action?: "approve" | "reject"
      reviewNote?: string
    }
    if (!body.requestId || !body.action || !["approve", "reject"].includes(body.action)) {
      return NextResponse.json({ error: "requestId and action are required" }, { status: 400 })
    }

    const rows = await query<any>(
      `SELECT id, "demoId", status::text AS status, "changesJson"
       FROM "DemoUpdateRequest"
       WHERE id = ?
       LIMIT 1`,
      [body.requestId]
    )
    if (!rows?.length) {
      return NextResponse.json({ error: "Update request not found" }, { status: 404 })
    }
    const reqRow = rows[0]
    if (reqRow.status !== "PENDING") {
      return NextResponse.json({ error: "Request already reviewed" }, { status: 400 })
    }

    if (body.action === "approve") {
      let parsed: Record<string, unknown> = {}
      try {
        parsed = JSON.parse(reqRow.changesJson || "{}")
      } catch {
        parsed = {}
      }
      const currentRows = await query<any>(`SELECT * FROM "DemoClass" WHERE id = ? LIMIT 1`, [reqRow.demoId])
      if (!currentRows?.length) {
        return NextResponse.json({ error: "Demo not found" }, { status: 404 })
      }
      const current = currentRows[0]
      const next = {
        title: parsed.title ?? current.title,
        description: parsed.description ?? current.description,
        videoUrl: parsed.videoUrl === undefined ? current.videoUrl : parsed.videoUrl,
        metadata: parsed.metadata === undefined ? current.metadata : parsed.metadata,
        category: parsed.category ?? current.category,
        schedule: parsed.schedule ?? current.schedule,
        price: parsed.price ?? current.price,
        isPaid: parsed.isPaid ?? current.isPaid,
      }

      await query(
        `UPDATE "DemoClass"
         SET title = ?, description = ?, "videoUrl" = ?, metadata = ?, category = ?, schedule = ?, price = ?, "isPaid" = ?, "updatedAt" = NOW()
         WHERE id = ?`,
        [
          next.title,
          next.description,
          next.videoUrl,
          next.metadata,
          next.category,
          next.schedule,
          next.price,
          next.isPaid,
          reqRow.demoId,
        ]
      )
    }

    await query(
      `UPDATE "DemoUpdateRequest"
       SET status = ?::"DemoUpdateRequestStatus",
           "reviewedById" = ?,
           "reviewNote" = ?,
           "reviewedAt" = NOW(),
           "updatedAt" = NOW()
       WHERE id = ?`,
      [body.action === "approve" ? "APPROVED" : "REJECTED", session.user.id, body.reviewNote || null, body.requestId]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reviewing demo update request:", error)
    return NextResponse.json({ error: "Failed to review update request" }, { status: 500 })
  }
}
