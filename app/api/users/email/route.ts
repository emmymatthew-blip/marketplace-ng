import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    // Check if email is already in use
    const existingUser = await query(
      'SELECT id FROM "User" WHERE email = ? AND id != ?',
      [email, session.user.id]
    )

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    await query(
      'UPDATE "User" SET email = ?, "updatedAt" = NOW() WHERE id = ?',
      [email, session.user.id]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[EMAIL_UPDATE_ERROR]", error)
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 })
  }
}
