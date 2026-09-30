import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { parseDemoApplicationPayload } from "@/lib/demo-application-payload"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, preferredDate, preferredDateId, applicationPayload: rawPayload } = body

    if (!title || title.trim().length < 10) {
      return NextResponse.json(
        { error: "Title must be at least 10 characters" },
        { status: 400 }
      )
    }

    if (!description || description.trim().length < 50) {
      return NextResponse.json(
        { error: "Full description must be at least 50 characters" },
        { status: 400 }
      )
    }

    if (rawPayload === undefined || rawPayload === null) {
      return NextResponse.json(
        { error: "Application details are required" },
        { status: 400 }
      )
    }

    const parsed = parseDemoApplicationPayload(rawPayload)
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const applicationPayloadJson = parsed.json

    // Enforce: users can only have 2 active requests at a time (PENDING or APPROVED)
    const activeCountResult = await query<{ count: string }>(
      `SELECT COUNT(*)::text as count
       FROM "DemoAccessRequest"
       WHERE "userId" = ?
         AND status IN (
           'PENDING'::"DemoAccessRequestStatus",
           'APPROVED'::"DemoAccessRequestStatus"
         )`,
      [session.user.id]
    )

    const activeCount =
      activeCountResult && activeCountResult.length > 0
        ? Number(activeCountResult[0].count || 0)
        : 0

    if (activeCount >= 2) {
      return NextResponse.json(
        {
          error:
            "You can only have 2 active demonstration applications at a time. Please wait for your current applications to be processed.",
        },
        { status: 400 }
      )
    }

    if (preferredDateId || preferredDate) {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

      const reserveWhere = preferredDateId ? `id = ?` : `DATE(date) = DATE(?)`

      const reserveParam = preferredDateId ? preferredDateId : new Date(preferredDate)

      const rows = await query<{
        id: string
        date: unknown
        time: string | null
        requestId: string
      }>(
        `WITH reserved AS (
           UPDATE "AvailableDemoDate"
           SET "isAvailable" = false,
               "assignedTo" = ?,
               "updatedAt" = NOW()
           WHERE "isAvailable" = true
             AND (${reserveWhere})
           RETURNING id, date, time
         ), inserted AS (
           INSERT INTO "DemoAccessRequest"
             (id, "userId", title, description, "applicationPayload", status, "preferredDate", "assignedDateId", "requestedAt", "createdAt", "updatedAt")
           SELECT
             ?, ?, ?, ?, ?, 'PENDING'::"DemoAccessRequestStatus", reserved.date, reserved.id, NOW(), NOW(), NOW()
           FROM reserved
           RETURNING id
         )
         SELECT reserved.id, reserved.date, reserved.time, inserted.id as "requestId"
         FROM reserved, inserted`,
        [session.user.id, reserveParam, requestId, session.user.id, title.trim(), description.trim(), applicationPayloadJson]
      )

      if (!rows || rows.length === 0) {
        const existingSlot = await query<{ assignedTo: string | null }>(
          preferredDateId
            ? `SELECT "assignedTo" FROM "AvailableDemoDate" WHERE id = ? LIMIT 1`
            : `SELECT "assignedTo" FROM "AvailableDemoDate" WHERE DATE(date) = DATE(?) LIMIT 1`,
          [reserveParam]
        )

        const assignedTo =
          existingSlot && existingSlot.length > 0 ? existingSlot[0].assignedTo : null

        if (assignedTo && assignedTo === session.user.id) {
          return NextResponse.json(
            {
              error:
                "You already have an application linked to this date — your slot is reserved. You can’t submit a second application for the same day. If your access is approved, complete your featured demonstration listing instead of re-applying.",
              code: "SLOT_ALREADY_OWNED",
            },
            { status: 400 }
          )
        }

        return NextResponse.json(
          { error: "This available slot has already been requested. Please pick another date." },
          { status: 400 }
        )
      }

      return NextResponse.json({
        success: true,
        message: "Demonstration application submitted successfully",
      })
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    const preferredDateValue = preferredDate ? new Date(preferredDate) : null

    await query(
      `INSERT INTO "DemoAccessRequest"
       (id, "userId", title, description, "applicationPayload", status, "preferredDate", "assignedDateId", "requestedAt", "createdAt", "updatedAt")
       VALUES (?, ?, ?, ?, ?, 'PENDING'::"DemoAccessRequestStatus", ?, NULL, NOW(), NOW(), NOW())`,
      [requestId, session.user.id, title.trim(), description.trim(), applicationPayloadJson, preferredDateValue]
    )

    return NextResponse.json({
      success: true,
      message: "Demonstration application submitted successfully",
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit application"
    console.error("Error submitting demo access application:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
