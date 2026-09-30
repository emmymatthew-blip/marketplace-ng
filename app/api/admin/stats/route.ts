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

    // Only admins can access stats
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can access statistics" }, { status: 403 })
    }

    // Get all statistics
    const [
      totalUsers,
      pendingVerifications,
      pendingDemos,
      disputedAgreements,
      pendingDemoAccessRequests,
      pendingVerificationCenter,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          hasCipponMembership: true,
          isVerified: false,
        },
      }),

      prisma.demoClass.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.agreement.count({
        where: {
          status: "DISPUTED",
        },
      }),

      prisma.demoAccessRequest.count({
        where: { status: "PENDING" },
      }),

      prisma.userVerification.count({
        where: { status: "PENDING" },
      }),
    ])

    return NextResponse.json({
      totalUsers,
      pendingVerifications,
      pendingDemos,
      disputedAgreements,
      pendingDemoAccessRequests,
      pendingVerificationCenter,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
