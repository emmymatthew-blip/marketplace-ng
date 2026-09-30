import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if message exists and belongs to the user
    const messages = await query('SELECT * FROM "messages" WHERE id = ? AND "receiverId" = ?', [params.id, session.user.id])

    if (!messages || (messages as any[]).length === 0) {
      return NextResponse.json(
        { error: "Message not found or you're not authorized to mark it as read" },
        { status: 404 },
      )
    }

    // Mark message as read
    await query('UPDATE "messages" SET "isRead" = TRUE WHERE id = ?', [params.id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking message as read:", error)
    return NextResponse.json({ error: "Failed to mark message as read" }, { status: 500 })
  }
}
