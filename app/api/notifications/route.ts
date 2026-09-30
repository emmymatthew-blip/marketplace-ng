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

function parseMetadata(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "string") return null
  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return null
  }
}

function serializeCreatedAt(value: unknown): string | null {
  if (value == null) return null
  if (value instanceof Date) return value.toISOString()
  let str = String(value).trim()
  if (!str) return null
  // If DB returns timestamp without timezone (e.g. "2025-01-15 12:30:00.123"), treat as UTC so client shows correct time
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(str) && !str.endsWith("Z") && !/[-+]\d{2}:?\d{2}$/.test(str)) {
    str = str.replace(" ", "T") + (str.includes(".") ? "" : ".000") + "Z"
  }
  const parsed = new Date(str)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50)
    const offset = Number(searchParams.get("offset")) || 0
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    await ensureNotificationsTable()

    const notifications = (await query(
      `SELECT id, type, title, body, link, "isRead", metadata, "createdAt"
       FROM "Notification"
       WHERE "userId" = ? ${unreadOnly ? `AND "isRead" = FALSE` : ""}
       ORDER BY "createdAt" DESC
       LIMIT ? OFFSET ?`,
      [session.user.id, limit, offset]
    )) as Array<Record<string, unknown>>

    const unreadRows = (await query(
      `SELECT COUNT(*)::int AS count
       FROM "Notification"
       WHERE "userId" = ? AND "isRead" = FALSE`,
      [session.user.id]
    )) as Array<{ count: number }>
    const unreadCount = Number(unreadRows[0]?.count ?? 0)

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        link: n.link,
        isRead: n.isRead,
        metadata: parseMetadata(n.metadata),
        createdAt: serializeCreatedAt(n.createdAt),
      })),
      unreadCount,
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    if (body.action === "read-all") {
      await ensureNotificationsTable()
      await query(
        `UPDATE "Notification" SET "isRead" = TRUE WHERE "userId" = ?`,
        [session.user.id]
      )
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
  }
}
