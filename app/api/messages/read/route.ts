import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const userId = (session?.user as any)?.id

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const messageIds = body?.messageIds

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: "Missing or invalid messageIds" }, { status: 400 })
    }

    const placeholders = messageIds.map((_, i) => `?`).join(",")
    await query(
      `UPDATE "messages"
       SET "isRead" = TRUE
       WHERE id IN (${placeholders})
       AND "receiverId" = ?
       AND "isRead" = FALSE`,
      [...messageIds, userId]
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
