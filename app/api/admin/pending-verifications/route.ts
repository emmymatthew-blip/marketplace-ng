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

    // Only admins can access pending verifications
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can access pending verifications" }, { status: 403 })
    }

    // Get users with CIPPON membership but not verified
    const pendingUsers = await prisma.user.findMany({
      where: {
        hasCipponMembership: true,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        cipponMembershipNumber: true,
        cipponLicenseNumber: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(pendingUsers)
  } catch (error) {
    console.error("Error fetching pending verifications:", error)
    return NextResponse.json({ error: "Failed to fetch pending verifications" }, { status: 500 })
  }
}
