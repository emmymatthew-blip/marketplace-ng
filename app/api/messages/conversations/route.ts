import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    const sql = `
      SELECT m.*,
        s.name as "senderName", s.image as "senderImage", s."companyName" as "senderCompanyName", s."isVerified" as "senderIsVerified",
        r.name as "receiverName", r.image as "receiverImage", r."companyName" as "receiverCompanyName", r."isVerified" as "receiverIsVerified",
        p.id as "productId", p.title as "productTitle", p.images as "productImages"
      FROM "messages" m
      JOIN "User" s ON m."senderId" = s.id
      JOIN "User" r ON m."receiverId" = r.id
      LEFT JOIN "Product" p ON m."productId" = p.id
      WHERE m."senderId" = ? OR m."receiverId" = ?
      ORDER BY m."createdAt" DESC
    `
    const rows = (await query(sql, [userId, userId])) as any[]

    const byContact = new Map<
      string,
      {
        contact: { id: string; name: string; image: string | null; companyName: string | null; isVerified: boolean }
        lastMessage: { content: string; createdAt: string; isRead: boolean; productTitle: string | null }
        unreadCount: number
      }
    >()

    for (const m of rows) {
      const otherId = m.senderId === userId ? m.receiverId : m.senderId
      const otherName = m.senderId === userId ? m.receiverName : m.senderName
      const otherImage = m.senderId === userId ? m.receiverImage : m.senderImage
      const otherCompanyName = m.senderId === userId ? m.receiverCompanyName : m.senderCompanyName
      const otherIsVerified = m.senderId === userId ? Boolean(m.receiverIsVerified) : Boolean(m.senderIsVerified)

      if (!byContact.has(otherId)) {
        byContact.set(otherId, {
          contact: { id: otherId, name: otherName || "Unknown", image: otherImage ?? null, companyName: otherCompanyName ?? null, isVerified: otherIsVerified },
          lastMessage: {
            content: m.content,
            createdAt: m.createdAt,
            isRead: Boolean(m.isRead),
            productTitle: m.productTitle ?? null,
          },
          unreadCount: 0,
        })
      }

      const conv = byContact.get(otherId)!
      if (m.receiverId === userId && !m.isRead) {
        conv.unreadCount += 1
      }
    }

    const conversations = Array.from(byContact.entries()).map(([contactId, data]) => ({
      id: contactId,
      contact: data.contact,
      lastMessage: data.lastMessage,
      unreadCount: data.unreadCount,
    }))

    conversations.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )

    return NextResponse.json(conversations)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch conversations" },
      { status: 500 }
    )
  }
}
