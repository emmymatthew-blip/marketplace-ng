import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getDateRange, parseCustomRange } from "@/lib/analytics"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const ownerId = session.user.id
    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") ?? "30d"
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const { from, to } = parseCustomRange(fromParam, toParam) ?? getDateRange(range)

    const eventWhere = { ownerId, createdAt: { gte: from, lte: to } }

    const [byCountry, profileViews, listingViews, demoViews] = await Promise.all([
      prisma.analyticsEvent.groupBy({
        by: ["country"],
        where: { ...eventWhere, country: { not: null } },
        _count: { id: true },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "vendor_profile_view" },
      }),
      prisma.analyticsEvent.count({
        where: {
          ...eventWhere,
          eventType: { in: ["product_view", "product_detail_view"] },
        },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "demo_view" },
      }),
    ])

    const audienceByCountry = byCountry
      .filter((c) => c.country)
      .map((c) => ({ country: c.country!, count: c._count.id }))
      .sort((a, b) => b.count - a.count)

    return NextResponse.json({
      audienceByCountry,
      profileViews,
      listingViews,
      demoViews,
      dateRange: { from: from.toISOString(), to: to.toISOString() },
    })
  } catch {
    return NextResponse.json({ error: "Failed to load audience analytics" }, { status: 500 })
  }
}
