import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { notifyDemoAccessApproved, notifyDemoAccessRejected } from "@/lib/notifications"
import {
  extractRelatedListingId,
  getApplicationPayloadRaw,
  indexProductTitlesById,
  parseApplicationPayloadObject,
} from "@/lib/demo-access-related-listing"

async function ensureLinkedDraftDemo(requestId: string): Promise<void> {
  const rows = await query<{
    id: string
    userId: string
    title: string
    description: string
    preferredDate: string | null
    assignedDate: string | null
    applicationPayload: string | null
    companyName: string | null
  }>(
    `SELECT r.id, r."userId", r.title, r.description, r."preferredDate", r."assignedDate", r."applicationPayload",
            u."companyName"
     FROM "DemoAccessRequest" r
     INNER JOIN "User" u ON u.id = r."userId"
     WHERE r.id = ?
     LIMIT 1`,
    [requestId]
  )
  if (!rows?.length) return
  const req = rows[0]

  const existing = await query<{ id: string }>(
    `SELECT id FROM "DemoClass" WHERE "sourceRequestId" = ? LIMIT 1`,
    [requestId]
  )
  if (existing?.length) return

  let payloadCategory: string | undefined
  let payloadMaxAttendees: number | undefined
  let payloadCoverImage: string | undefined
  try {
    if (req.applicationPayload) {
      const p = JSON.parse(req.applicationPayload) as Record<string, unknown>
      payloadCategory = typeof p.category === "string" && p.category.trim() ? p.category.trim() : undefined
      payloadMaxAttendees = Number.isFinite(Number(p.maxAttendees)) ? Number(p.maxAttendees) : undefined
      payloadCoverImage =
        typeof p.coverImageUrl === "string" && p.coverImageUrl.trim() ? p.coverImageUrl.trim() : undefined
    }
  } catch {
    // If payload is invalid, fallback to base request fields.
  }

  const seedScheduleIso = req.assignedDate || req.preferredDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const scheduleDate = new Date(seedScheduleIso)
  const safeSchedule = Number.isNaN(scheduleDate.getTime()) ? new Date() : scheduleDate

  // Keep this hidden from public roster until host finalizes details.
  await query(
    `INSERT INTO "DemoClass"
      (id, title, description, schedule, price, "isPaid", status, "manufacturerId", category, "maxAttendees", "headerImage", "sourceRequestId", "createdAt", "updatedAt")
     VALUES (?, ?, ?, ?, ?, ?, 'DRAFT'::"DemoStatus", ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      `demo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
      req.title || "Weekly demonstration (awaiting host completion)",
      req.description || "Approved application awaiting host completion.",
      safeSchedule.toISOString(),
      0,
      false,
      req.userId,
      payloadCategory || req.companyName || "Featured Live Demo",
      payloadMaxAttendees || 50,
      payloadCoverImage || null,
      req.id,
    ]
  )
}

/** Demo access admin queue: one row per DemoAccessRequest (source of truth), joined with applicant profile. */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const applications = (await query(
      `SELECT 
        r.id,
        r."userId",
        r.title,
        r.description,
        r.status,
        r."applicationPayload",
        r."requestedAt",
        r."approvedAt",
        r."rejectedAt",
        r."preferredDate",
        r."assignedDate",
        r."assignedDateId",
        d.id AS "linkedDemoId",
        d.status::text AS "linkedDemoStatus",
        u.name, u.email, u."companyName",
        u.role, u."isVerified", u.phone, u.location, u."cityState", u.country,
        u.bio, u.image, u."companyWebsite", u."jobTitle",
        u."firstName", u."lastName", u."videoUrl", u."videoDescription",
        u.gallery, u.specialties, u."yearsInBusiness", u."teamSize",
        u.certifications, u."linkedinUrl", u."twitterUrl", u."satisfactionRate",
        u."hasCipponMembership", u."cipponMembershipType", u."cipponMembershipNumber",
        u."cipponLicenseNumber", u."createdAt" AS "userCreatedAt", u."updatedAt" AS "userUpdatedAt"
       FROM "DemoAccessRequest" r
       INNER JOIN "User" u ON u.id = r."userId"
       LEFT JOIN "DemoClass" d ON d."sourceRequestId" = r.id
       ORDER BY r."requestedAt" DESC`
    )) as Record<string, unknown>[]

    const listingIds = new Set<string>()
    for (const row of applications || []) {
      const payload = parseApplicationPayloadObject(getApplicationPayloadRaw(row))
      const lid = extractRelatedListingId(payload)
      if (lid) listingIds.add(lid)
    }

    let titleById: Record<string, string> = {}
    if (listingIds.size > 0) {
      const idList = Array.from(listingIds)
      const placeholders = idList.map(() => "?").join(", ")
      const products = (await query(
        `SELECT id, title FROM "Product" WHERE id IN (${placeholders})`,
        idList
      )) as Record<string, unknown>[]
      titleById = indexProductTitlesById(products || [])

      for (const lid of idList) {
        if (titleById[lid]) continue
        try {
          const one = (await query(`SELECT id, title FROM "Product" WHERE id = ? LIMIT 1`, [lid])) as Record<
            string,
            unknown
          >[]
          const row = one?.[0]
          if (row?.title != null && row.id != null) {
            titleById[String(row.id).trim()] = String(row.title).trim()
          }
        } catch {
          /* ignore */
        }
      }
    }

    const data = (applications || []).map((row) => {
      const payload = parseApplicationPayloadObject(getApplicationPayloadRaw(row))
      const lid = extractRelatedListingId(payload)
      const relatedListingProductTitle =
        lid && titleById[lid] ? titleById[lid] : null
      return { ...row, relatedListingProductTitle }
    })

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch applications"
    console.error("Error fetching demo access applications:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { requestId, action, dateId } = body as {
      requestId?: string
      action?: string
      dateId?: string | null
    }

    if (!requestId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid request: requestId and action (approve|reject) are required" },
        { status: 400 }
      )
    }

    const rows = await query<{
      id: string
      userId: string
      status: string
      assignedDateId: string | null
    }>(
      `SELECT id, "userId", status::text AS status, "assignedDateId"
       FROM "DemoAccessRequest"
       WHERE id = ?`,
      [requestId]
    )

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 })
    }

    const accessReq = rows[0]
    if (accessReq.status !== "PENDING") {
      return NextResponse.json(
        { error: "This application has already been processed" },
        { status: 400 }
      )
    }

    const userId = accessReq.userId

    const freeReservedSlot = async (slotId: string | null) => {
      if (!slotId) return
      await query(
        `UPDATE "AvailableDemoDate"
         SET "isAvailable" = true,
             "assignedTo" = NULL,
             "updatedAt" = NOW()
         WHERE id = ?`,
        [slotId]
      )
    }

    if (action === "approve") {
      if (dateId) {
        const slotRows = await query<{ id: string; date: Date }>(
          `SELECT id, date FROM "AvailableDemoDate"
           WHERE id = ?
             AND ("isAvailable" = true OR "assignedTo" = ?)`,
          [dateId, userId]
        )

        if (!slotRows || slotRows.length === 0) {
          return NextResponse.json(
            { error: "Selected date is not available or is assigned to someone else" },
            { status: 400 }
          )
        }

        if (accessReq.assignedDateId && accessReq.assignedDateId !== dateId) {
          await freeReservedSlot(accessReq.assignedDateId)
        }

        const assignedDate = slotRows[0].date

        await query(
          `UPDATE "AvailableDemoDate"
           SET "isAvailable" = false,
               "assignedTo" = ?,
               "updatedAt" = NOW()
           WHERE id = ?`,
          [userId, dateId]
        )

        await query(
          `UPDATE "DemoAccessRequest"
           SET status = 'APPROVED'::"DemoAccessRequestStatus",
               "approvedAt" = NOW(),
               "assignedDate" = ?,
               "assignedDateId" = ?,
               "updatedAt" = NOW()
           WHERE id = ?`,
          [assignedDate, dateId, requestId]
        )
      } else {
        await query(
          `UPDATE "DemoAccessRequest"
           SET status = 'APPROVED'::"DemoAccessRequestStatus",
               "approvedAt" = NOW(),
               "updatedAt" = NOW()
           WHERE id = ?`,
          [requestId]
        )
      }
      await ensureLinkedDraftDemo(requestId)
    } else {
      await freeReservedSlot(accessReq.assignedDateId)

      await query(
        `UPDATE "DemoAccessRequest"
         SET status = 'REJECTED'::"DemoAccessRequestStatus",
             "rejectedAt" = NOW(),
             "updatedAt" = NOW()
         WHERE id = ?`,
        [requestId]
      )
    }

    if (action === "approve") {
      notifyDemoAccessApproved(userId).catch(() => {})
    } else {
      notifyDemoAccessRejected(userId).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      message: `Demo access ${action === "approve" ? "approved" : "rejected"}`,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update demo access"
    console.error("Error updating demo access:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
