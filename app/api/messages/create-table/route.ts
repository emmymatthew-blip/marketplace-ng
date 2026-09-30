import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST() {
  try {
    // Create messages table
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

    // Create indexes
    await query(`
      CREATE INDEX IF NOT EXISTS "messages_senderId_idx" ON "messages"("senderId")
    `).catch(() => {}) // Ignore if index already exists

    await query(`
      CREATE INDEX IF NOT EXISTS "messages_receiverId_idx" ON "messages"("receiverId")
    `).catch(() => {})

    await query(`
      CREATE INDEX IF NOT EXISTS "messages_createdAt_idx" ON "messages"("createdAt")
    `).catch(() => {})

    return NextResponse.json({ success: true, message: "Messages table created successfully" })
  } catch (error: any) {
    console.error("Error creating messages table:", error)
    return NextResponse.json({ 
      error: error?.message || "Failed to create messages table",
      details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 })
  }
}
