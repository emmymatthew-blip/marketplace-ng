import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const availableDates = await query(
      `SELECT 
        id, date, time, "isAvailable", "assignedTo", "createdBy", "createdAt", "updatedAt"
       FROM "AvailableDemoDate"
       WHERE "isAvailable" = true
         AND ("assignedTo" IS NULL OR "assignedTo" = '')
       ORDER BY date ASC`
    )

    return NextResponse.json({
      success: true,
      data: availableDates || [],
    })
  } catch (error: any) {
    console.error("Error fetching available demo dates:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch available dates" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { date, time } = body

    if (!date) {
      return NextResponse.json(
        { error: "Date is required" },
        { status: 400 }
      )
    }

    // Check if date already exists
    const existing = await query(
      `SELECT id FROM "AvailableDemoDate" WHERE date = ?`,
      [new Date(date)]
    )

    if (existing && (existing as any[]).length > 0) {
      return NextResponse.json(
        { error: "This date is already in the system" },
        { status: 400 }
      )
    }

    const dateId = `date_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    await query(
      `INSERT INTO "AvailableDemoDate" (id, date, time, "isAvailable", "createdBy", "createdAt", "updatedAt")
       VALUES (?, ?, ?, true, ?, NOW(), NOW())`,
      [dateId, new Date(date), time || null, session.user.id]
    )

    return NextResponse.json({
      success: true,
      message: "Available date added successfully",
    })
  } catch (error: any) {
    console.error("Error adding available demo date:", error)
    return NextResponse.json(
      { error: error.message || "Failed to add available date" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const dateId = searchParams.get("id")

    if (!dateId) {
      return NextResponse.json(
        { error: "Date ID is required" },
        { status: 400 }
      )
    }

    await query(
      `DELETE FROM "AvailableDemoDate" WHERE id = ?`,
      [dateId]
    )

    return NextResponse.json({
      success: true,
      message: "Date removed successfully",
    })
  } catch (error: any) {
    console.error("Error deleting available demo date:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete date" },
      { status: 500 }
    )
  }
}
