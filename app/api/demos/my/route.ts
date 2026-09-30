import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

/** Seller’s demonstrations in the curated weekly programme (same `DemoClass` rows as public hub). */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rows = await query<any>(
      `SELECT d.id, d.title, d.description, d.status, d.category, d.schedule, d."isFeatured", d."featuredWeekStart",
              d."viewCount", d."registrationCount", d."headerImage", d."manufacturerId", d."createdAt", d."updatedAt"
       FROM "DemoClass" d
       WHERE d."manufacturerId" = ?
       ORDER BY d."createdAt" DESC`,
      [userId]
    )

    return NextResponse.json({ demos: rows })
  } catch (error) {
    console.error("Error loading my demos:", error)
    return NextResponse.json({ error: "Failed to load demos" }, { status: 500 })
  }
}

