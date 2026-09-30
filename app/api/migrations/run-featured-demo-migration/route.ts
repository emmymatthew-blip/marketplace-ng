import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function POST() {
  try {
    console.log("🔄 Running migration: add_featured_demo_images...")

    // Add headerImage column
    console.log("  Adding headerImage column...")
    await query(`
      ALTER TABLE "DemoClass" 
      ADD COLUMN IF NOT EXISTS "headerImage" TEXT
    `)
    console.log("  ✅ headerImage column added")

    // Add advertImage column
    console.log("  Adding advertImage column...")
    await query(`
      ALTER TABLE "DemoClass" 
      ADD COLUMN IF NOT EXISTS "advertImage" TEXT
    `)
    console.log("  ✅ advertImage column added")

    // Try to add comments (may fail on some PostgreSQL setups, but that's okay)
    try {
      await query(`
        COMMENT ON COLUMN "DemoClass"."headerImage" IS 'Header image for the demonstration detail page'
      `)
      await query(`
        COMMENT ON COLUMN "DemoClass"."advertImage" IS 'Advertisement image for homepage Featured Live Demo section'
      `)
      console.log("  ✅ Column comments added")
    } catch (commentError) {
      console.log("  ⚠️  Could not add column comments (this is optional)")
    }

    return NextResponse.json({
      success: true,
      message: "Migration completed successfully. Added headerImage and advertImage columns to DemoClass table.",
    })
  } catch (error: any) {
    console.error("❌ Migration failed:", error)
    return NextResponse.json(
      {
        error: error?.message || "Failed to run migration",
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined,
      },
      { status: 500 }
    )
  }
}
