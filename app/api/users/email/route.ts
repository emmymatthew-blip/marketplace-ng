import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { neon } from "@neondatabase/serverless"
import { DATABASE_URL } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { email } = body

    // Check if email is already in use
    const sql = neon(DATABASE_URL)
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email} AND id != ${session.user.id}
    `

    if (existingUser.length > 0) {
      return new NextResponse("Email already in use", { status: 400 })
    }

    await sql`
      UPDATE users
      SET 
        email = ${email},
        "updatedAt" = NOW()
      WHERE id = ${session.user.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[EMAIL_UPDATE_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
