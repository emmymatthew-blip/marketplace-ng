import { NextResponse } from "next/server"

import { query } from "@/lib/db"
import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"
import { PUBLIC_LISTING_DEMO_STATUSES } from "@/lib/normalizers/demo"

/**
 * GET — Public curated weekly pipeline: approved / scheduled / live / completed demonstrations.
 * Creation is not via this API; hosts apply through the weekly application flow.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const manufacturerId = searchParams.get("manufacturerId")
    const statusParam = searchParams.get("status")

    /**
     * Use raw SQL + `status::text` so filtering works even when Prisma Client’s
     * generated `DemoStatus` enum lags `schema.prisma` or the DB migration history.
     */
    const statusList = statusParam
      ? [statusParam]
      : [...PUBLIC_LISTING_DEMO_STATUSES]

    const statusPlaceholders = statusList.map(() => "?").join(", ")
    const conditions = [`d.status::text IN (${statusPlaceholders})`]
    const sqlParams: unknown[] = [...statusList]

    if (category) {
      conditions.push("d.category = ?")
      sqlParams.push(category)
    }
    if (manufacturerId) {
      conditions.push('d."manufacturerId" = ?')
      sqlParams.push(manufacturerId)
    }

    const rows = await query<Record<string, unknown>>(
      `SELECT
        d.id,
        d.title,
        d.description,
        d."videoUrl",
        d.schedule,
        d.price,
        d."isPaid",
        d.status,
        d."manufacturerId",
        d.category,
        d.location,
        d."maxAttendees",
        d.metadata,
        d."headerImage",
        d."advertImage",
        d."featuredWeekStart",
        d."isFeatured",
        d."featuredAt",
        d."viewCount",
        d."registrationCount",
        d."createdAt",
        d."updatedAt",
        u.id AS mf_id,
        u.name AS mf_name,
        u."companyName" AS mf_company_name,
        u.image AS mf_image,
        u."isVerified" AS mf_is_verified
      FROM "DemoClass" d
      INNER JOIN "User" u ON d."manufacturerId" = u.id
      WHERE ${conditions.join(" AND ")}
      ORDER BY d.schedule ASC`,
      sqlParams
    )

    const g = (row: Record<string, unknown>, ...keys: string[]) => {
      for (const k of keys) {
        if (k in row && row[k] !== undefined) return row[k]
      }
      return undefined
    }

    const demos = rows.map((r) => ({
      id: g(r, "id"),
      title: g(r, "title"),
      description: g(r, "description"),
      videoUrl: g(r, "videoUrl", "videourl") ?? null,
      schedule: g(r, "schedule"),
      price: g(r, "price"),
      isPaid: g(r, "isPaid", "ispaid"),
      status: g(r, "status"),
      manufacturerId: g(r, "manufacturerId", "manufacturerid"),
      category: g(r, "category"),
      location: g(r, "location"),
      maxAttendees: g(r, "maxAttendees", "maxattendees") ?? null,
      metadata: g(r, "metadata"),
      headerImage: g(r, "headerImage", "headerimage") ?? null,
      advertImage: g(r, "advertImage", "advertimage") ?? null,
      featuredWeekStart: g(r, "featuredWeekStart", "featuredweekstart") ?? null,
      isFeatured: Boolean(g(r, "isFeatured", "isfeatured")),
      featuredAt: g(r, "featuredAt", "featuredat") ?? null,
      viewCount: Number(g(r, "viewCount", "viewcount") ?? 0),
      registrationCount: Number(g(r, "registrationCount", "registrationcount") ?? 0),
      createdAt: g(r, "createdAt", "createdat"),
      updatedAt: g(r, "updatedAt", "updatedat"),
      manufacturer: {
        id: g(r, "mf_id"),
        name: g(r, "mf_name"),
        companyName: g(r, "mf_company_name"),
        image: g(r, "mf_image"),
        isVerified: g(r, "mf_is_verified"),
      },
    }))

    return NextResponse.json(demos)
  } catch (error) {
    console.error("Error fetching demos:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      {
        error: "Failed to fetch demos",
        ...(process.env.NODE_ENV === "development" ? { details: message } : {}),
      },
      { status: 500 }
    )
  }
}

/** POST disabled — use `/demo-access/apply` then `/featured-demonstration/new` after approval. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Demonstrations are part of the curated weekly programme only. Submit a demonstration application, then complete scheduling after approval.",
      code: "USE_WEEKLY_APPLICATION_FLOW",
      applyPath: WEEKLY_DEMO_APPLICATION_HREF,
    },
    { status: 403 }
  )
}
