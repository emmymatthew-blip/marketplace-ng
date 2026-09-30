import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const vendorId = session.user.id

    const [total, byStatus, agreementCount, topListings, countries] = await Promise.all([
      prisma.inquiry.count({ where: { vendorId } }),
      prisma.inquiry.groupBy({
        by: ["status"],
        where: { vendorId },
        _count: { id: true },
      }),
      prisma.inquiry.count({ where: { vendorId, status: "AGREEMENT_CREATED" } }),
      prisma.inquiry.groupBy({
        by: ["productId"],
        where: { vendorId },
        _count: { id: true },
        orderBy: { _count: { productId: "desc" } },
      }),
      prisma.inquiry.findMany({
        where: { vendorId, country: { not: null } },
        select: { country: true },
        distinct: ["country"],
      }),
    ])

    const statusCounts = byStatus.reduce((acc, s) => {
      acc[s.status] = s._count.id
      return acc
    }, {} as Record<string, number>)

    const productIds = topListings.slice(0, 10).map((t) => t.productId).filter(Boolean)
    const products = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, title: true },
        })
      : []
    const productMap = Object.fromEntries(products.map((p) => [p.id, p.title]))
    const topPerformingListings = topListings.slice(0, 10).map((t) => ({
      productId: t.productId,
      title: productMap[t.productId] ?? "Unknown",
      count: t._count.id,
    }))

    return NextResponse.json({
      total,
      byStatus: statusCounts,
      agreementConversionCount: agreementCount,
      conversionRate: total > 0 ? Math.round((agreementCount / total) * 100) : 0,
      topPerformingListings,
      countries: countries.map((c) => c.country).filter(Boolean),
    })
  } catch (error) {
    console.error("Error fetching inquiry stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
