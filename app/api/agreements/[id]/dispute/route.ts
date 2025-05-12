import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

const disputeSchema = z.object({
  reason: z.string(),
  description: z.string().min(20).max(1000),
  evidence: z.string().optional(),
  proposedResolution: z.string().min(20).max(500),
})

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get agreement to verify user is a party to it
    // This would be replaced with actual database query
    const agreement = {
      id: params.id,
      initiatorId: "user-123",
      receiverId: "user-456",
      status: "ACTIVE",
    }

    // Check if user is part of the agreement
    if (agreement.initiatorId !== session.user.id && agreement.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to file a dispute for this agreement" },
        { status: 403 },
      )
    }

    // Check if agreement is in a status that can be disputed
    if (agreement.status !== "ACTIVE") {
      return NextResponse.json({ error: "Cannot dispute an agreement that is not active" }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = disputeSchema.parse(body)

    // In a real implementation, this would:
    // 1. Create a dispute record in the database
    // 2. Update the agreement status to DISPUTED
    // 3. Create an agreement event for the dispute
    // 4. Notify the other party

    // For now, we'll just return a success response
    return NextResponse.json(
      {
        message: "Dispute filed successfully",
        disputeId: "dispute-" + Date.now(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error filing dispute:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
