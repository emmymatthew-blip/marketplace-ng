import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Get current password hash
    const user = await query(
      'SELECT password FROM "User" WHERE id = ?',
      [session.user.id]
    )

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await query(
      'UPDATE "User" SET password = ?, "updatedAt" = NOW() WHERE id = ?',
      [hashedPassword, session.user.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PASSWORD_UPDATE_ERROR]", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
