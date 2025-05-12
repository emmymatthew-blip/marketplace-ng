import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from "@/lib/db"

// Define validation schema
const verifySchema = z.object({
  userId: z.string(),
  cipponId: z.string(),
  isVerified: z.boolean(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can verify printers
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can verify printers" }, { status: 403 })
    }

    const body = await req.json()
    const { userId, cipponId, isVerified } = verifySchema.parse(body)

    // Check if user exists and is a printer
    const users = await query("SELECT * FROM users WHERE id = ?", [userId])

    if (!users || (users as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = (users as any[])[0]

    if (user.role !== "PRINTER") {
      return NextResponse.json({ error: "User is not a printer" }, { status: 400 })
    }

    // Update user verification status
    await query("UPDATE users SET isVerified = ?, cipponId = ? WHERE id = ?", [isVerified, cipponId, userId])

    // Fetch the updated user
    const updatedUsers = await query("SELECT id, name, email, role, isVerified, cipponId FROM users WHERE id = ?", [
      userId,
    ])

    const updatedUser = (updatedUsers as any[])[0]

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error verifying printer:", error)
    return NextResponse.json({ error: "Failed to verify printer" }, { status: 500 })
  }
}
