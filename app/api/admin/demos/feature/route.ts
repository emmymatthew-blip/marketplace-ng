import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

const payloadSchema = z.object({
  demoId: z.string(),
  weekStart: z.string().optional(), // ISO date
  lifecycleStatus: z
    .enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SCHEDULED", "LIVE", "COMPLETED", "REJECTED"])
    .optional(),
  featured: z.boolean().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = payloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { demoId, weekStart, lifecycleStatus, featured } = parsed.data
    const shouldFeature = featured === true
    const shouldUnfeature = featured === false
    const hasWeekStart = Boolean(weekStart)
    const weekDate = hasWeekStart ? new Date(weekStart as string) : null
    if (hasWeekStart && (!weekDate || Number.isNaN(weekDate.getTime()))) {
      return NextResponse.json({ error: "Invalid weekStart date" }, { status: 400 })
    }
    if (shouldFeature && !weekDate) {
      return NextResponse.json({ error: "weekStart is required when featuring a demo" }, { status: 400 })
    }

    const result = await db.transaction(async (client) => {
      const existing = await db.clientQuery<{ id: string; isFeatured: boolean; featuredWeekStart: string | null }>(
        client,
        'SELECT id, "isFeatured", "featuredWeekStart" FROM "DemoClass" WHERE id = ? LIMIT 1',
        [demoId]
      )
      if (!existing.length) {
        throw new Error("Demonstration not found")
      }

      if (shouldFeature) {
        const conflict = await db.clientQuery<{ id: string }>(
          client,
          `SELECT id FROM "DemoClass"
           WHERE "isFeatured" = TRUE
             AND "featuredWeekStart" = ?
             AND id != ?
           LIMIT 1`,
          [weekDate!.toISOString(), demoId]
        )
        if (conflict.length) {
          throw new Error("A featured demo is already assigned for this week")
        }
      }

      const current = existing[0]
      const isFeatured = shouldFeature ? true : shouldUnfeature ? false : current.isFeatured
      const featuredWeekStart = shouldFeature
        ? weekDate!.toISOString()
        : shouldUnfeature
          ? null
          : hasWeekStart
            ? weekDate!.toISOString()
            : current.featuredWeekStart
      const nextLifecycle =
        lifecycleStatus ?? (shouldFeature ? "SCHEDULED" : shouldUnfeature ? "APPROVED" : undefined)

      const updated = await db.clientQuery<any>(
        client,
        `UPDATE "DemoClass"
         SET status = COALESCE(?, status), "isFeatured" = ?, "featuredWeekStart" = ?, "featuredAt" = CASE WHEN ? THEN COALESCE("featuredAt", NOW()) ELSE NULL END,
             "updatedAt" = NOW()
         WHERE id = ?
         RETURNING *`,
        [nextLifecycle, isFeatured, featuredWeekStart, isFeatured, demoId]
      )
      return updated[0]
    })

    return NextResponse.json({ success: true, demo: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to feature demo"
    const status = message.includes("already assigned") || message.includes("not found") ? 400 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

