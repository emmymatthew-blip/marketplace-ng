import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    // Public endpoint - anyone can see available dates
    const availableDates = await query(
      `SELECT 
        id, date, time, "isAvailable"
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
