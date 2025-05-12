import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { messageIds } = await request.json()

    if (!messageIds || !Array.isArray(messageIds) || !messageIds.length) {
      return NextResponse.json({ error: "Missing or invalid messageIds" }, { status: 400 })
    }

    // Get current user ID
    const userResult = await db.query(`SELECT id FROM users WHERE email = $1`, [session.user.email])

    if (!userResult.rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userResult.rows[0].id

    // Mark messages as read (only if the current user is the receiver)
    await db.query(
      `UPDATE messages
       SET "isRead" = TRUE
       WHERE id = ANY($1::uuid[])
       AND "receiverId" = $2
       AND "isRead" = FALSE`,
      [messageIds, userId],
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
