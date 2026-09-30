import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can access pending demos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can access pending demos" }, { status: 403 })
    }

    // Get pending demos
    const pendingDemos = await prisma.demoClass.findMany({
      where: {
        OR: [
          { status: "PENDING" },
          // Prisma enum in generated client may lag `schema.prisma`; keep runtime values aligned
          { status: "SUBMITTED" as any },
          { status: "UNDER_REVIEW" as any },
        ],
      },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Format the response
    const formattedDemos = pendingDemos.map((demo) => ({
      id: demo.id,
      title: demo.title,
      manufacturer: {
        id: demo.manufacturer.id,
        name: demo.manufacturer.name || demo.manufacturer.companyName || "Unknown",
      },
      schedule: demo.schedule.toISOString().split("T")[0],
      price: `₦${demo.price.toLocaleString()}`,
      submittedAt: demo.createdAt.toISOString().split("T")[0],
    }))

    return NextResponse.json(formattedDemos)
  } catch (error) {
    console.error("Error fetching pending demos:", error)
    return NextResponse.json({ error: "Failed to fetch pending demos" }, { status: 500 })
  }
}
