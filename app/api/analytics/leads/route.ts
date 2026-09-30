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

    const vendorId = session.user.id
    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") ?? "30d"
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")
    const { from, to } = parseCustomRange(fromParam, toParam) ?? getDateRange(range)

    const [recentInquiries, statusDistribution, byCountry, byProduct] = await Promise.all([
      prisma.inquiry.findMany({
        where: { vendorId, createdAt: { gte: from, lte: to } },
        include: {
          product: { select: { id: true, title: true } },
          buyer: { select: { name: true, companyName: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      prisma.inquiry.groupBy({
        by: ["status"],
        where: { vendorId, createdAt: { gte: from, lte: to } },
        _count: { id: true },
      }),
      prisma.inquiry.groupBy({
        by: ["country"],
        where: { vendorId, country: { not: null }, createdAt: { gte: from, lte: to } },
        _count: { id: true },
      }),
      prisma.inquiry.groupBy({
        by: ["productId"],
        where: { vendorId, createdAt: { gte: from, lte: to } },
        _count: { id: true },
      }),
    ])

    const productIds = [...new Set(byProduct.map((b) => b.productId).filter(Boolean))] as string[]
    const products =
      productIds.length > 0
        ? await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, title: true, categoryId: true },
          })
        : []
    const productMap = Object.fromEntries(products.map((p) => [p.id, p.title]))
    const categoryIds = [...new Set(products.map((p) => p.categoryId).filter(Boolean))] as string[]
    const categories =
      categoryIds.length > 0
        ? await prisma.productCategory.findMany({
            where: { id: { in: categoryIds } },
            select: { id: true, name: true },
          })
        : []
    const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.name]))

    const topCategories = byProduct
      .map((b) => ({
        category: productMap[b.productId!] ? categoryMap[products.find((p) => p.id === b.productId)?.categoryId!] ?? "Other" : "Other",
        count: b._count.id,
      }))
      .reduce((acc, { category, count }) => {
        const name = category ?? "Other"
        acc[name] = (acc[name] ?? 0) + count
        return acc
      }, {} as Record<string, number>)

    const topCategoriesList = Object.entries(topCategories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    return NextResponse.json({
      recentInquiries: recentInquiries.map((i) => ({
        id: i.id,
        productTitle: i.product?.title,
        companyName: i.buyer?.companyName ?? i.buyer?.name,
        country: i.country,
        status: i.status,
        createdAt: i.createdAt,
      })),
      statusDistribution: statusDistribution.map((s) => ({ status: s.status, count: s._count.id })),
      topCountries: byCountry
        .filter((c) => c.country)
        .map((c) => ({ country: c.country!, count: c._count.id }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topCategories: topCategoriesList,
      dateRange: { from: from.toISOString(), to: to.toISOString() },
    })
  } catch {
    return NextResponse.json({ error: "Failed to load leads analytics" }, { status: 500 })
  }
}
