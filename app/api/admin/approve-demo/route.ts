import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Define validation schema
const approveSchema = z.object({
  demoId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
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
        status,
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

    return NextResponse.json(updatedDemo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error approving demo:", error)
    return NextResponse.json({ error: "Failed to approve demonstration class" }, { status: 500 })
  }
}
