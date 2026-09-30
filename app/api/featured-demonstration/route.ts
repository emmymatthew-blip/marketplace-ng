import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { isSeller } from "@/lib/user-roles"
import { z } from "zod"

const featuredDemoSchema = z.object({
  title: z.string().min(10, { message: "Title must be at least 10 characters" }),
  description: z.string().min(50, { message: "Description must be at least 50 characters" }),
  date: z.string().or(z.date()),
  time: z.string(),
  duration: z.string(),
  platform: z.enum(["zoom", "youtube", "instagram", "facebook"]),
  platformUrl: z.string().min(1),
  headerImage: z.string().url().optional().nullable(),
  advertImage: z.string().url().optional().nullable(),
  price: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only sellers can create featured demonstrations
    if (!isSeller(session.user.role)) {
      return NextResponse.json(
        { error: "Only sellers can create featured demonstrations" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validatedData = featuredDemoSchema.parse(body)

    // Combine date and time into a single DateTime
    // Handle both string and Date object formats
    let dateStr: string
    if (typeof validatedData.date === 'string') {
      dateStr = validatedData.date
    } else if (validatedData.date instanceof Date) {
      // Format date as YYYY-MM-DD
      const year = validatedData.date.getFullYear()
      const month = String(validatedData.date.getMonth() + 1).padStart(2, '0')
      const day = String(validatedData.date.getDate()).padStart(2, '0')
      dateStr = `${year}-${month}-${day}`
    } else {
      throw new Error("Invalid date format")
    }
    
    // Ensure time is in HH:MM format (add :00 if only hour is provided)
    const timeStr = validatedData.time.includes(':') 
      ? validatedData.time 
      : `${validatedData.time}:00`
    
    // Create datetime string in ISO format
    const dateTimeStr = `${dateStr}T${timeStr}:00`
    const dateTime = new Date(dateTimeStr)
    
    // Validate the date
    if (isNaN(dateTime.getTime())) {
      throw new Error(`Invalid date/time combination: ${dateTimeStr}`)
    }
    
    // Calculate price (default to 0 if not provided or "By Application")
    const price = validatedData.price && validatedData.price !== "By Application"
      ? parseFloat(validatedData.price)
      : 0

    const approvedSeed = await query<{ id: string; demoId: string | null }>(
      `SELECT r.id, d.id as "demoId"
       FROM "DemoAccessRequest" r
       LEFT JOIN "DemoClass" d ON d."sourceRequestId" = r.id
       WHERE r."userId" = ?
         AND r.status = 'APPROVED'::"DemoAccessRequestStatus"
       ORDER BY r."approvedAt" DESC NULLS LAST, r."requestedAt" DESC
       LIMIT 1`,
      [session.user.id]
    )

    const existingDemoId = approvedSeed?.[0]?.demoId || null
    const sourceRequestId = approvedSeed?.[0]?.id || null
    let demoId = existingDemoId || `demo_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

    if (existingDemoId) {
      await query(
        `UPDATE "DemoClass"
         SET title = ?,
             description = ?,
             schedule = ?,
             price = ?,
             "isPaid" = ?,
             status = CASE WHEN status = 'DRAFT'::"DemoStatus" THEN 'SUBMITTED'::"DemoStatus" ELSE status END,
             category = ?,
             "headerImage" = ?,
             "advertImage" = ?,
             "maxAttendees" = ?,
             "updatedAt" = NOW()
         WHERE id = ?`,
        [
          validatedData.title,
          validatedData.description,
          dateTime.toISOString(),
          price,
          price > 0,
          "Featured Live Demo",
          validatedData.headerImage || null,
          validatedData.advertImage || null,
          50,
          existingDemoId,
        ]
      )
    } else {
      await query(
        `INSERT INTO "DemoClass" (
          id, title, description, schedule, price, "isPaid", status, "manufacturerId", category,
          "headerImage", "advertImage", "maxAttendees", "sourceRequestId", "createdAt", "updatedAt"
        ) VALUES (?, ?, ?, ?, ?, ?, 'SUBMITTED'::"DemoStatus", ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          demoId,
          validatedData.title,
          validatedData.description,
          dateTime.toISOString(),
          price,
          price > 0,
          session.user.id,
          "Featured Live Demo",
          validatedData.headerImage || null,
          validatedData.advertImage || null,
          50,
          sourceRequestId,
        ]
      )
    }

    return NextResponse.json(
      {
        success: true,
        id: demoId,
        message: existingDemoId
          ? "Featured Live Demo details saved to your approved programming draft."
          : "Featured Live Demo request submitted successfully. It will be reviewed by an administrator.",
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating featured demonstration:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Failed to create featured demonstration" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") || "SCHEDULED,LIVE,APPROVED"
    const manufacturerId = searchParams.get("manufacturerId")
    const weekStart = searchParams.get("weekStart")

    let sql = `
      SELECT 
        d.*,
        u.id as "manufacturerId",
        u.name as "manufacturerName",
        u."companyName" as "manufacturerCompanyName",
        u.image as "manufacturerImage",
        u."isVerified" as "manufacturerIsVerified"
      FROM "DemoClass" d
      JOIN "User" u ON d."manufacturerId" = u.id
      WHERE d."isFeatured" = TRUE
    `
    
    const params: any[] = []

    if (status) {
      const statuses = status.split(",").map((s) => s.trim()).filter(Boolean)
      if (statuses.length > 1) {
        sql += ` AND d.status = ANY(?)`
        params.push(statuses)
      } else {
        sql += ` AND d.status = ?`
        params.push(statuses[0])
      }
    }

    if (manufacturerId) {
      sql += ` AND d."manufacturerId" = ?`
      params.push(manufacturerId)
    }

    if (weekStart) {
      sql += ` AND d."featuredWeekStart" = ?`
      params.push(new Date(weekStart).toISOString())
    }

    sql += ` ORDER BY d."featuredWeekStart" ASC, d.schedule ASC`

    const demos = await query(sql, params)

    return NextResponse.json({
      success: true,
      data: demos,
    })
  } catch (error: any) {
    console.error("Error fetching featured demonstrations:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured demonstrations" },
      { status: 500 }
    )
  }
}
