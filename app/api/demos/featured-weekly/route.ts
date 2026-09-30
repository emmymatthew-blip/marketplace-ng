import { NextResponse } from "next/server"
import { query } from "@/lib/db"

/** This week’s single editorial featured demonstration (curated weekly model). */

function getWeekStart(date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const weekStartParam = searchParams.get("weekStart")
    const weekStart = weekStartParam ? new Date(weekStartParam) : getWeekStart()

    /** Compare calendar date only — avoids timezone mismatches on timestamptz vs ISO string equality */
    const weekDateStr = weekStart.toISOString().slice(0, 10)

    const rows = await query<any>(
      `SELECT d.*, u.name as "manufacturerName", u."companyName" as "manufacturerCompanyName",
              u.image as "manufacturerImage", u."isVerified" as "manufacturerIsVerified"
       FROM "DemoClass" d
       JOIN "User" u ON d."manufacturerId" = u.id
       WHERE d."isFeatured" = TRUE
         AND d."featuredWeekStart"::date = ?::date
       LIMIT 1`,
      [weekDateStr]
    )

    if (!rows.length) {
      return NextResponse.json({ featured: null, weekStart: weekStart.toISOString() })
    }

    return NextResponse.json({
      featured: rows[0],
      weekStart: weekStart.toISOString(),
    })
  } catch (error) {
    console.error("Error fetching weekly featured demo:", error)
    return NextResponse.json({ error: "Failed to fetch weekly featured demo" }, { status: 500 })
  }
}

