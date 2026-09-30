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

    const [products, viewCounts, inquiryCounts, agreementCounts] = await Promise.all([
      prisma.product.findMany({
        where: { ownerId },
        select: { id: true, title: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.analyticsEvent.groupBy({
        by: ["productId"],
        where: { ...eventWhere, eventType: "product_detail_view", productId: { not: null } },
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

    const viewsMap = Object.fromEntries(viewCounts.map((v) => [v.productId!, v._count.id]))
    const inqMap = Object.fromEntries(inquiryCounts.map((v) => [v.productId!, v._count.id]))
    const agrMap = Object.fromEntries(agreementCounts.map((v) => [v.productId!, v._count.id]))

    const uniqueViewCounts = await prisma.analyticsEvent.groupBy({
      by: ["productId", "actorId"],
      where: { ...eventWhere, eventType: "product_detail_view", productId: { not: null }, actorId: { not: null } },
    })
    const uniqueByProduct = new Map<string, Set<string>>()
    uniqueViewCounts.forEach((u) => {
      if (!u.productId || !u.actorId) return
      if (!uniqueByProduct.has(u.productId)) uniqueByProduct.set(u.productId, new Set())
      uniqueByProduct.get(u.productId)!.add(u.actorId)
    })

    const rows = products.map((p) => {
      const views = viewsMap[p.id] ?? 0
      const uniqueViews = uniqueByProduct.get(p.id)?.size ?? 0
      const inquiries = inqMap[p.id] ?? 0
      const agreements = agrMap[p.id] ?? 0
      const conversion = inquiries > 0 ? Math.round((agreements / inquiries) * 100) : 0
      return {
        productId: p.id,
        product: p.title,
        views,
        uniqueViews,
        inquiries,
        agreements,
        conversion,
        lastActivity: p.updatedAt,
      }
    })

    return NextResponse.json({ rows, dateRange: { from: from.toISOString(), to: to.toISOString() } })
  } catch {
    return NextResponse.json({ error: "Failed to load listings analytics" }, { status: 500 })
  }
}
