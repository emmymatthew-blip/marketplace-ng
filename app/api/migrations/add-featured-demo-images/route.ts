import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    // Only admins can run migrations
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Running migration: add_featured_demo_images")

    // Add headerImage column
    await query(`
      ALTER TABLE "DemoClass" 
      ADD COLUMN IF NOT EXISTS "headerImage" TEXT
    `)

    // Add advertImage column
    await query(`
      ALTER TABLE "DemoClass" 
      ADD COLUMN IF NOT EXISTS "advertImage" TEXT
    `)

    // Add comments (PostgreSQL supports comments)
    try {
      await query(`
        COMMENT ON COLUMN "DemoClass"."headerImage" IS 'Header image for the demonstration detail page'
      `)
      await query(`
        COMMENT ON COLUMN "DemoClass"."advertImage" IS 'Advertisement image for homepage Featured Live Demo section'
      `)
    } catch (commentError) {
      // Comments might fail if not supported, but that's okay
      console.log("Note: Could not add column comments (this is optional)")
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully. Added headerImage and advertImage columns to DemoClass table.",
    })
  } catch (error: any) {
    console.error("Error running migration:", error)
    return NextResponse.json(
      {
        error: error?.message || "Failed to run migration",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
