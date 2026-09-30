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

    // Only admins can access disputed agreements
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can access disputed agreements" }, { status: 403 })
    }

    // Get disputed agreements with related data
    const disputedAgreements = await prisma.agreement.findMany({
      where: {
        status: "DISPUTED",
      },
      include: {
        initiator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        complaints: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get the most recent complaint
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    // Format the response
    const formattedAgreements = disputedAgreements.map((agreement) => ({
      id: agreement.id,
      title: agreement.terms.substring(0, 50) + (agreement.terms.length > 50 ? "..." : ""),
      initiator: {
        id: agreement.initiator.id,
        name: agreement.initiator.name || "Unknown",
      },
      receiver: {
        id: agreement.receiver.id,
        name: agreement.receiver.name || "Unknown",
      },
      disputedAt: agreement.updatedAt.toISOString().split("T")[0],
      reason: agreement.complaints[0]?.description || agreement.notes || "No reason provided",
    }))

    return NextResponse.json(formattedAgreements)
  } catch (error) {
    console.error("Error fetching disputed agreements:", error)
    return NextResponse.json({ error: "Failed to fetch disputed agreements" }, { status: 500 })
  }
}
