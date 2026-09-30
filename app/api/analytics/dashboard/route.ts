import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getDateRange, parseCustomRange } from "@/lib/analytics"

export interface AnalyticsDashboardResponse {
  kpis: {
    totalViews: number
    totalInquiries: number
    activeAgreements: number
    conversionRate: number
    demoRegistrations: number
    profileViews: number
  }
  funnel: {
    listingViews: number
    productDetailVisits: number
    inquiries: number
    conversations: number
    agreementsCreated: number
    agreementsCompleted: number
  }
  viewsOverTime: { date: string; views: number }[]
  leadsOverTime: { date: string; leads: number }[]
  agreementConversionOverTime: { date: string; created: number; completed: number }[]
  topListings: { productId: string; title: string; views: number; inquiries: number; conversion: number }[]
  audienceByCountry: { country: string; count: number }[]
  insights: string[]
  dateRange: { from: string; to: string }
}

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

    const { from, to } =
      parseCustomRange(fromParam, toParam) ?? getDateRange(range)

    const fromStr = from.toISOString()
    const toStr = to.toISOString()

    const eventWhere = {
      ownerId,
      createdAt: { gte: from, lte: to },
    }

    const [
      productDetailViews,
      productViews,
      profileViews,
      inquiryEvents,
      messageEvents,
      agreementCreatedEvents,
      agreementCompletedEvents,
      demoRegistrationEvents,
      eventsByDay,
      inquiryEventsByDay,
      agreementCreatedByDay,
      agreementCompletedByDay,
      productViewCounts,
      countryCounts,
      inquiryCountByProduct,
      agreementCountByProduct,
    ] = await Promise.all([
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "product_detail_view" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "product_view" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "vendor_profile_view" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "inquiry_created" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "message_sent" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "agreement_created" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "agreement_completed" },
      }),
      prisma.analyticsEvent.count({
        where: { ...eventWhere, eventType: "demo_registration" },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["createdAt"],
        where: {
          ...eventWhere,
          eventType: { in: ["product_detail_view", "product_view"] },
        },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["createdAt"],
        where: { ...eventWhere, eventType: "inquiry_created" },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["createdAt"],
        where: { ...eventWhere, eventType: "agreement_created" },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["createdAt"],
        where: { ...eventWhere, eventType: "agreement_completed" },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["productId"],
        where: {
          ...eventWhere,
          productId: { not: null },
          eventType: "product_detail_view",
        },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["country"],
        where: { ...eventWhere, country: { not: null } },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["productId"],
        where: { ...eventWhere, eventType: "inquiry_created", productId: { not: null } },
        _count: { id: true },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["productId"],
        where: { ...eventWhere, eventType: "agreement_created", productId: { not: null } },
        _count: { id: true },
      }),
    ])

    const totalViews = productDetailViews + productViews
    const inquiriesFromDb = await prisma.inquiry.count({
      where: { vendorId: ownerId, createdAt: { gte: from, lte: to } },
    })
    const inquiries = inquiryEvents > 0 ? inquiryEvents : inquiriesFromDb
    const activeAgreements = await prisma.agreement.count({
      where: {
        OR: [{ initiatorId: ownerId }, { receiverId: ownerId }],
        status: "ACTIVE",
      },
    })
    const totalAgreements = await prisma.agreement.count({
      where: {
        OR: [{ initiatorId: ownerId }, { receiverId: ownerId }],
        createdAt: { gte: from, lte: to },
      },
    })
    const conversionRate =
      inquiries > 0 ? Math.round(((agreementCreatedEvents || totalAgreements) / inquiries) * 100) : 0

    const productIds = new Set([
      ...productViewCounts.map((p) => p.productId).filter(Boolean),
      ...inquiryCountByProduct.map((p) => p.productId).filter(Boolean),
      ...agreementCountByProduct.map((p) => p.productId).filter(Boolean),
    ]) as Set<string>
    const products =
      productIds.size > 0
        ? await prisma.product.findMany({
            where: { id: { in: [...productIds] }, ownerId },
            select: { id: true, title: true },
          })
        : []
    const productMap = Object.fromEntries(products.map((p) => [p.id, p.title]))
    const viewsByProduct = Object.fromEntries(productViewCounts.map((p) => [p.productId!, p._count.id]))
    const inqByProduct = Object.fromEntries(inquiryCountByProduct.map((p) => [p.productId!, p._count.id]))
    const agrByProduct = Object.fromEntries(agreementCountByProduct.map((p) => [p.productId!, p._count.id]))

    const topListings = products.slice(0, 10).map((p) => {
      const views = viewsByProduct[p.id] ?? 0
      const inq = inqByProduct[p.id] ?? 0
      const agr = agrByProduct[p.id] ?? 0
      const conversion = inq > 0 ? Math.round((agr / inq) * 100) : 0
      return {
        productId: p.id,
        title: productMap[p.id] ?? p.title,
        views,
        inquiries: inq,
        conversion,
      }
    })

    const bucketByDay = (groups: { createdAt: Date; _count: { id: number } }[], eventTypeFilter?: string) => {
      const map = new Map<string, number>()
      const d = new Date(from)
      while (d <= to) {
        map.set(d.toISOString().slice(0, 10), 0)
        d.setDate(d.getDate() + 1)
      }
      groups.forEach((g) => {
        const day = g.createdAt.toISOString().slice(0, 10)
        map.set(day, (map.get(day) ?? 0) + g._count.id)
      })
      return [...map.entries()].map(([date, views]) => ({ date, views })).sort((a, b) => a.date.localeCompare(b.date))
    }

    const viewsOverTime = bucketByDay(eventsByDay)
    const leadsOverTime = bucketByDay(inquiryEventsByDay).map((d) => ({ date: d.date, leads: d.views }))
    const createdByDayMap = new Map<string, number>()
    agreementCreatedByDay.forEach((g) => {
      const day = g.createdAt.toISOString().slice(0, 10)
      createdByDayMap.set(day, (createdByDayMap.get(day) ?? 0) + g._count.id)
    })
    const completedByDayMap = new Map<string, number>()
    agreementCompletedByDay.forEach((g) => {
      const day = g.createdAt.toISOString().slice(0, 10)
      completedByDayMap.set(day, (completedByDayMap.get(day) ?? 0) + g._count.id)
    })
    const allDays = new Set([...createdByDayMap.keys(), ...completedByDayMap.keys(), ...viewsOverTime.map((v) => v.date)])
    const agreementConversionOverTime = [...allDays]
      .sort()
      .map((date) => ({
        date,
        created: createdByDayMap.get(date) ?? 0,
        completed: completedByDayMap.get(date) ?? 0,
      }))
    const audienceByCountry = countryCounts
      .filter((c) => c.country)
      .map((c) => ({ country: c.country!, count: c._count.id }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)

    const insights: string[] = []
    topListings.forEach((l) => {
      if (l.views >= 10 && l.inquiries === 0) {
        insights.push(`"${l.title}" has high views but no inquiries — consider a clearer call-to-action or pricing hint.`)
      } else if (l.views >= 5 && l.inquiries > 0 && l.conversion === 0) {
        insights.push(`"${l.title}" gets inquiries but no agreements yet — follow up on leads to improve conversion.`)
      }
    })
    if (insights.length < 3) {
      insights.push("Verified companies gain more trust from visitors — complete business verification in Settings.")
      insights.push("Add product video to listings to improve engagement and inquiry conversion.")
    }

    const response: AnalyticsDashboardResponse = {
      kpis: {
        totalViews: totalViews,
        totalInquiries: inquiries,
        activeAgreements,
        conversionRate,
        demoRegistrations: demoRegistrationEvents,
        profileViews: profileViews,
      },
      funnel: {
        listingViews: productViews,
        productDetailVisits: productDetailViews,
        inquiries,
        conversations: messageEvents,
        agreementsCreated: agreementCreatedEvents,
        agreementsCompleted: agreementCompletedEvents,
      },
      viewsOverTime,
      leadsOverTime,
      agreementConversionOverTime,
      topListings,
      audienceByCountry,
      insights: insights.slice(0, 5),
      dateRange: { from: fromStr, to: toStr },
    }

    return NextResponse.json(response)
  } catch (e) {
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 })
  }
}
