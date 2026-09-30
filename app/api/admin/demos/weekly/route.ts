import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

function getWeekStart(date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const weeks = Math.max(1, Math.min(24, Number(searchParams.get("weeks") || 12)))
    const start = getWeekStart()
    const end = addDays(start, weeks * 7)

    const demos = await query<any>(
      `SELECT d.id, d.title, d.description, d.status, d.schedule, d.category, d."manufacturerId", d."isFeatured", d."featuredWeekStart",
              d."sourceRequestId",
              r.title as "requestTitle",
              r.description as "requestDescription",
              r."applicationPayload",
              r."preferredDate",
              r."assignedDate",
              r."assignedDateId",
              r."requestedAt" as "requestRequestedAt",
              d."viewCount", d."registrationCount",
              u.name as "manufacturerName", u."companyName" as "manufacturerCompanyName", u."isVerified" as "manufacturerIsVerified"
       FROM "DemoClass" d
       JOIN "User" u ON d."manufacturerId" = u.id
       LEFT JOIN "DemoAccessRequest" r ON r.id = d."sourceRequestId"
       WHERE d.status IN ('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','SCHEDULED','LIVE','COMPLETED','PENDING')
       ORDER BY d."createdAt" DESC
       LIMIT 500`
    )

    const occupied = await query<any>(
      `SELECT d.id, d.title, d.status, d."featuredWeekStart",
              u.name as "manufacturerName", u."companyName" as "manufacturerCompanyName"
       FROM "DemoClass" d
       JOIN "User" u ON d."manufacturerId" = u.id
       WHERE d."isFeatured" = TRUE
         AND d."featuredWeekStart" >= ?
         AND d."featuredWeekStart" < ?
       ORDER BY d."featuredWeekStart" ASC`,
      [start.toISOString(), end.toISOString()]
    )

    return NextResponse.json({
      demos,
      occupiedWeeks: occupied,
      range: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error loading weekly demo admin data:", error)
    return NextResponse.json({ error: "Failed to load weekly demo data" }, { status: 500 })
  }
}

