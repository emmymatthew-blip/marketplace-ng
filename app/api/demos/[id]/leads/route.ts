import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(_req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const demoId = context.params.id
    const demoRows = await query<any>(
      `SELECT d.id, d.title, d.status, d."isFeatured", d."featuredWeekStart", d."viewCount", d."registrationCount", d."manufacturerId"
       FROM "DemoClass" d
       WHERE d.id = ?
       LIMIT 1`,
      [demoId]
    )

    if (!demoRows.length) {
      return NextResponse.json({ error: "Demo not found" }, { status: 404 })
    }

    const demo = demoRows[0]
    const canAccess = session.user.role === "ADMIN" || demo.manufacturerId === session.user.id
    if (!canAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const leads = await query<any>(
      `SELECT id, "userId", email, name, "companyName", phone, message, source, "createdAt"
       FROM "DemoRegistration"
       WHERE "demoId" = ?
       ORDER BY "createdAt" DESC`,
      [demoId]
    )

    const conversionRows = await query<any>(
      `SELECT COUNT(*)::int AS count
       FROM "AnalyticsEvent"
       WHERE "demoId" = ?
         AND "eventType" = 'demo_conversion'`,
      [demoId]
    )

    const conversionCount = Number(conversionRows?.[0]?.count || 0)

    return NextResponse.json({
      demo: {
        id: demo.id,
        title: demo.title,
        status: demo.status,
        isFeatured: Boolean(demo.isFeatured),
        featuredWeekStart: demo.featuredWeekStart,
      },
      metrics: {
        views: Number(demo.viewCount || 0),
        registrations: Number(demo.registrationCount || 0),
        conversions: conversionCount,
      },
      leads,
    })
  } catch (error) {
    console.error("Error loading demo leads:", error)
    return NextResponse.json({ error: "Failed to load demo leads" }, { status: 500 })
  }
}

