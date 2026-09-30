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

    const userId = session.user.id
    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") ?? "30d"
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const { from, to } = parseCustomRange(fromParam, toParam) ?? getDateRange(range)

    const where = {
      OR: [{ initiatorId: userId }, { receiverId: userId }],
      createdAt: { gte: from, lte: to },
    }

    const [byStatus, totalOffers, totalAccepted, totalActive, totalCompleted, totalDisputed] = await Promise.all([
      prisma.agreement.groupBy({
        by: ["status"],
        where,
        _count: { id: true },
      }),
      prisma.agreement.count({ where }),
      prisma.agreement.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.agreement.count({
        where: {
          OR: [{ initiatorId: userId }, { receiverId: userId }],
          status: "ACTIVE",
        },
      }),
      prisma.agreement.count({
        where: {
          OR: [{ initiatorId: userId }, { receiverId: userId }],
          status: "COMPLETED",
          updatedAt: { gte: from, lte: to },
        },
      }),
      prisma.agreement.count({
        where: {
          OR: [{ initiatorId: userId }, { receiverId: userId }],
          status: "DISPUTED",
        },
      }),
    ])

    const inquiriesWithAgreement = await prisma.inquiry.findMany({
      where: { vendorId: userId, status: "AGREEMENT_CREATED", agreementId: { not: null }, createdAt: { gte: from, lte: to } },
      select: { productId: true },
    })
    const productIds = [...new Set(inquiriesWithAgreement.map((i) => i.productId).filter(Boolean))] as string[]
    const productCounts = productIds.length
      ? await prisma.product.findMany({
          where: { id: { in: productIds }, ownerId: userId },
          select: { id: true, title: true },
        })
      : []
    const productMap = Object.fromEntries(productCounts.map((p) => [p.id, p.title]))
    const agg = inquiriesWithAgreement.reduce((acc, i) => {
      if (!i.productId) return acc
      acc[i.productId] = (acc[i.productId] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)
    const agreementConversionByProduct = Object.entries(agg)
      .map(([productId, count]) => ({ productId, title: productMap[productId] ?? "Unknown", count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15)

    return NextResponse.json({
      summary: {
        offersSent: totalOffers,
        accepted: totalAccepted,
        active: totalActive,
        completed: totalCompleted,
        disputed: totalDisputed,
      },
      byStatus: byStatus.map((s) => ({ status: s.status, count: s._count.id })),
      conversionByProduct: agreementConversionByProduct,
      dateRange: { from: from.toISOString(), to: to.toISOString() },
    })
  } catch {
    return NextResponse.json({ error: "Failed to load agreements analytics" }, { status: 500 })
  }
}
