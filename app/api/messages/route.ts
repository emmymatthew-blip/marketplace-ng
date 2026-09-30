import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { writeFile } from "fs/promises"
import { join } from "path"

import { authOptions } from "@/lib/auth"
import { getAgreementThreadEvents } from "@/lib/agreement-thread-events"
import { query } from "@/lib/db"
import { trackEvent } from "@/lib/analytics"
import { notifyMessageReceived } from "@/lib/notifications"

// Define validation schema
const messageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
  receiverId: z.string(),
  productId: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure messages table exists
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS "messages" (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          "senderId" TEXT NOT NULL,
          "receiverId" TEXT NOT NULL,
          "isRead" BOOLEAN DEFAULT FALSE,
          "productId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"(id) ON DELETE CASCADE,
          CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"(id) ON DELETE CASCADE,
          CONSTRAINT "messages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE SET NULL
        )
      `)
    } catch {
      // Table may already exist
    }

    const { searchParams } = new URL(req.url)
    const userId = session.user.id
    const contactId = searchParams.get("contactId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const before = searchParams.get("before")
    const after = searchParams.get("after")
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 50)

    let sql = `
      SELECT m.*, 
        s.name as "senderName", s.image as "senderImage",
        r.name as "receiverName", r.image as "receiverImage",
        p.id as "productId", p.title as "productTitle", p.images as "productImages"
      FROM "messages" m
      JOIN "User" s ON m."senderId" = s.id
      JOIN "User" r ON m."receiverId" = r.id
      LEFT JOIN "Product" p ON m."productId" = p.id
      WHERE 
    `

    const params: any[] = []

    if (contactId) {
      // Get messages between the current user and the specified contact
      sql += `((m."senderId" = ? AND m."receiverId" = ?) OR (m."senderId" = ? AND m."receiverId" = ?))`
      params.push(userId, contactId, contactId, userId)
    } else {
      // Get all messages for the current user
      sql += `m."senderId" = ? OR m."receiverId" = ?`
      params.push(userId, userId)
    }

    if (unreadOnly) {
      sql += ` AND m."isRead" = FALSE AND m."receiverId" = ?`
      params.push(userId)
    }

    if (contactId && before) {
      sql += ` AND m."createdAt" < ?`
      params.push(before)
    }

    if (contactId && after) {
      sql += ` AND m."createdAt" > ?`
      params.push(after)
    }

    if (contactId && after) {
      sql += ` ORDER BY m."createdAt" ASC LIMIT ?`
      params.push(limit)
    } else if (contactId) {
      sql += ` ORDER BY m."createdAt" DESC LIMIT ?`
      params.push(limit + 1)
    } else {
      sql += ` ORDER BY m."createdAt" DESC`
    }

    const rows = (await query(sql, params)) as any[]

    function parseProductImages(val: unknown): string[] {
      if (val == null) return []
      if (Array.isArray(val)) return val
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val)
          return Array.isArray(parsed) ? parsed : []
        } catch {
          return []
        }
      }
      return []
    }

    const normalizedRows =
      contactId && !after
        ? rows.slice(0, limit).reverse()
        : rows

    const formattedMessages = normalizedRows.map((message) => {
      const productIdVal = message.productId ?? message["productId"]
      return {
        id: message.id,
        content: message.content,
        senderId: message.senderId ?? message["senderId"],
        receiverId: message.receiverId ?? message["receiverId"],
        sender: {
          id: message.senderId ?? message["senderId"],
          name: message.senderName ?? message["senderName"],
          image: message.senderImage ?? message["senderImage"],
        },
        receiver: {
          id: message.receiverId ?? message["receiverId"],
          name: message.receiverName ?? message["receiverName"],
          image: message.receiverImage ?? message["receiverImage"],
        },
        productId: productIdVal ?? undefined,
        product: productIdVal
          ? {
              id: productIdVal,
              title: message.productTitle ?? message["productTitle"] ?? "",
              images: parseProductImages(message.productImages ?? message["productImages"]),
            }
          : undefined,
        isRead: Boolean(message.isRead ?? message["isRead"]),
        createdAt: message.createdAt ?? message["createdAt"],
        isSentByMe: (message.senderId ?? message["senderId"]) === userId,
      }
    })

    if (contactId) {
      const events = await getAgreementThreadEvents(userId, contactId)
      const hasMore = !after && rows.length > limit
      const nextCursor =
        !after && formattedMessages.length > 0
          ? formattedMessages[0]?.createdAt ?? null
          : null

      return NextResponse.json({
        messages: formattedMessages,
        events,
        hasMore,
        nextCursor,
      })
    }

    return NextResponse.json(formattedMessages)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const content = formData.get("content") as string
    const receiverId = formData.get("receiverId") as string
    const productId = formData.get("productId") as string || null
    const senderId = formData.get("senderId") as string
    const files = formData.getAll("files") as File[]

    const attachments = []

    // Handle file uploads
    if (files.length > 0) {
      for (const file of files) {
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const fileId = uuidv4()
        const fileExt = file.name.split(".").pop()
        const filename = `${fileId}.${fileExt}`

        // Save file to uploads directory
        const uploadDir = join(process.cwd(), "public", "uploads")
        const filePath = join(uploadDir, filename)
        await writeFile(filePath, buffer)

        // Store file metadata
        attachments.push({
          id: fileId,
          url: `/uploads/${filename}`,
          filename: file.name,
          type: file.type
        })
      }
    }

    // Validate that senderId matches session user
    if (senderId !== session.user.id) {
      return NextResponse.json({ error: "Sender ID must match authenticated user" }, { status: 403 })
    }

    const messageId = uuidv4()
    const createdAt = new Date()

    // Ensure messages table exists before inserting
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS "messages" (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          "senderId" TEXT NOT NULL,
          "receiverId" TEXT NOT NULL,
          "isRead" BOOLEAN DEFAULT FALSE,
          "productId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"(id) ON DELETE CASCADE,
          CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"(id) ON DELETE CASCADE,
          CONSTRAINT "messages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE SET NULL
        )
      `)
    } catch {
      // Table may already exist
    }

    // Save message to database
    await query(
      `INSERT INTO "messages" (id, content, "senderId", "receiverId", "productId", "isRead", "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [messageId, content, senderId, receiverId, productId || null, false, createdAt]
    )

    await trackEvent({
      eventType: "message_sent",
      ownerId: receiverId,
      actorId: senderId,
      productId: productId || undefined,
    })

    const senderName = (await query('SELECT name FROM "User" WHERE id = ?', [senderId]) as any[])?.[0]?.name ?? "Someone"
    notifyMessageReceived(receiverId, senderName, `/messages/${receiverId}${productId ? `?productId=${productId}` : ""}`).catch(() => {})

    // Fetch the created message with sender/receiver info
    const result = await query(
      `SELECT m.*, 
        s.name as "senderName", s.image as "senderImage",
        r.name as "receiverName", r.image as "receiverImage",
        p.id as "productId", p.title as "productTitle", p.images as "productImages"
      FROM "messages" m
      JOIN "User" s ON m."senderId" = s.id
      JOIN "User" r ON m."receiverId" = r.id
      LEFT JOIN "Product" p ON m."productId" = p.id
      WHERE m.id = ?`,
      [messageId]
    )

    const savedMessage = (result as any[])[0]

    // Format the message response
    const message = {
      id: savedMessage.id,
      content: savedMessage.content,
      senderId: savedMessage.senderId || savedMessage["senderId"],
      receiverId: savedMessage.receiverId || savedMessage["receiverId"],
      productId: savedMessage.productId || savedMessage["productId"],
      isRead: Boolean(savedMessage.isRead || savedMessage["isRead"]),
      createdAt: savedMessage.createdAt || savedMessage["createdAt"],
      senderName: savedMessage.senderName || savedMessage["senderName"],
      senderImage: savedMessage.senderImage || savedMessage["senderImage"],
      receiverName: savedMessage.receiverName || savedMessage["receiverName"],
      receiverImage: savedMessage.receiverImage || savedMessage["receiverImage"],
      product: (savedMessage.productId || savedMessage["productId"]) ? {
        id: savedMessage.productId || savedMessage["productId"],
        title: savedMessage.productTitle || savedMessage["productTitle"],
        images: (savedMessage.productImages || savedMessage["productImages"]) ? JSON.parse(savedMessage.productImages || savedMessage["productImages"]) : []
      } : undefined,
      attachments
    }

    return NextResponse.json(message, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create message" }, { status: 500 })
  }
}
