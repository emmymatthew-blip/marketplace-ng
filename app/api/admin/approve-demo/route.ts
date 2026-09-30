import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notifyDemoApproved, notifyDemoRejected } from "@/lib/notifications"

// Define validation schema
const approveSchema = z.object({
  demoId: z.string(),
  status: z.enum(["APPROVED", "REJECTED", "UNDER_REVIEW"]),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can approve demos
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can approve demonstration classes" }, { status: 403 })
    }

    const body = await req.json()
    const { demoId, status } = approveSchema.parse(body)

    // Check if demo exists
    const demo = await prisma.demoClass.findUnique({
      where: {
        id: demoId,
      },
    })

    if (!demo) {
      return NextResponse.json({ error: "Demonstration class not found" }, { status: 404 })
    }

    // Update demo status
    const updatedDemo = await prisma.demoClass.update({
      where: {
        id: demoId,
      },
      data: {
        status: status as any,
      },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            image: true,
            isVerified: true,
          },
        },
      },
    })

    const manufacturerId = updatedDemo.manufacturerId
    const title = updatedDemo.title
    if (status === "APPROVED") {
      notifyDemoApproved(manufacturerId, title, demoId).catch(() => {})
    } else if (status === "REJECTED") {
      notifyDemoRejected(manufacturerId, title).catch(() => {})
    }

    return NextResponse.json(updatedDemo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error approving demo:", error)
    return NextResponse.json({ error: "Failed to approve demonstration class" }, { status: 500 })
  }
}
