import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { neon } from "@neondatabase/serverless"
import { DATABASE_URL } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    const sql = neon(DATABASE_URL)

    // Get current password hash
    const user = await sql`
      SELECT password FROM users WHERE id = ${session.user.id}
    `

    if (user.length === 0) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user[0].password)

    if (!isPasswordValid) {
      return new NextResponse("Current password is incorrect", { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await sql`
      UPDATE users
      SET 
        password = ${hashedPassword},
        "updatedAt" = NOW()
      WHERE id = ${session.user.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PASSWORD_UPDATE_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
