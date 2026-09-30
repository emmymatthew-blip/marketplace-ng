import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

async function ensureNotificationsTable() {
  await query(
    `CREATE TABLE IF NOT EXISTS "Notification" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      link TEXT,
      "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
      metadata TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
    )`,
    []
  )
}

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await ensureNotificationsTable()
    await query(
      `UPDATE "Notification" SET "isRead" = TRUE WHERE id = ? AND "userId" = ?`,
      [id, session.user.id]
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to mark notification as read" }, { status: 500 })
  }
}
