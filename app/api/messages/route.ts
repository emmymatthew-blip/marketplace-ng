import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from "@/lib/db"

// Define validation schema
const messageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
  receiverId: z.string(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const userId = session.user.id
    const contactId = searchParams.get("contactId")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    let sql = `
      SELECT m.*, 
        s.name as senderName, s.image as senderImage,
        r.name as receiverName, r.image as receiverImage
      FROM messages m
      JOIN users s ON m.senderId = s.id
      JOIN users r ON m.receiverId = r.id
      WHERE 
    `

    const params: any[] = []

    if (contactId) {
      // Get messages between the current user and the specified contact
      sql += `(m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?)`
      params.push(userId, contactId, contactId, userId)
    } else {
      // Get all messages for the current user
      sql += `m.senderId = ? OR m.receiverId = ?`
      params.push(userId, userId)
    }

    if (unreadOnly) {
      sql += ` AND m.isRead = FALSE AND m.receiverId = ?`
      params.push(userId)
    }

    sql += ` ORDER BY m.createdAt DESC`

    const messages = await query(sql, params)

    // Format the messages
    const formattedMessages = (messages as any[]).map((message) => ({
      id: message.id,
      content: message.content,
      sender: {
        id: message.senderId,
        name: message.senderName,
        image: message.senderImage,
      },
      receiver: {
        id: message.receiverId,
        name: message.receiverName,
        image: message.receiverImage,
      },
      isRead: Boolean(message.isRead),
      createdAt: message.createdAt,
      isSentByMe: message.senderId === userId,
    }))

    return NextResponse.json(formattedMessages)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content, receiverId } = messageSchema.parse(body)

    // Check if receiver exists
    const users = await query("SELECT * FROM users WHERE id = ?", [receiverId])

    if (!users || (users as any[]).length === 0) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    const messageId = uuidv4()

    // Create message
    await query(
      `INSERT INTO messages (id, content, senderId, receiverId) 
       VALUES (?, ?, ?, ?)`,
      [messageId, content, session.user.id, receiverId],
    )

    // Fetch the created message with user details
    const sql = `
      SELECT m.*, 
        s.name as senderName, s.image as senderImage,
        r.name as receiverName, r.image as receiverImage
      FROM messages m
      JOIN users s ON m.senderId = s.id
      JOIN users r ON m.receiverId = r.id
      WHERE m.id = ?
    `

    const messages = await query(sql, [messageId])
    const message = (messages as any[])[0]

    // Format the message
    const formattedMessage = {
      id: message.id,
      content: message.content,
      sender: {
        id: message.senderId,
        name: message.senderName,
        image: message.senderImage,
      },
      receiver: {
        id: message.receiverId,
        name: message.receiverName,
        image: message.receiverImage,
      },
      isRead: Boolean(message.isRead),
      createdAt: message.createdAt,
      isSentByMe: true,
    }

    return NextResponse.json(formattedMessage, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
