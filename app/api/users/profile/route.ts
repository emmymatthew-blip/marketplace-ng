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
    const { name, companyName, phone, location, bio } = body

    const sql = neon(DATABASE_URL)

    await sql`
      UPDATE users
      SET 
        name = ${name},
        "companyName" = ${companyName || null},
        phone = ${phone || null},
        location = ${location || null},
        bio = ${bio || null},
        "updatedAt" = NOW()
      WHERE id = ${session.user.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
