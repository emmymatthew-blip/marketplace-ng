import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = context.params

    const demo = await prisma.demoClass.findUnique({
      where: { id },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            image: true,
            isVerified: true,
            location: true,
          },
        },
      },
    })

    if (!demo) {
      return NextResponse.json({ error: "Demonstration not found" }, { status: 404 })
    }

    const pendingRows = await query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM "DemoUpdateRequest"
       WHERE "demoId" = ?
         AND status = 'PENDING'::"DemoUpdateRequestStatus"`,
      [id]
    )
    const pendingUpdateCount = Number(pendingRows?.[0]?.count || 0)

    return NextResponse.json({
      ...demo,
      hasPendingUpdateRequest: pendingUpdateCount > 0,
      pendingUpdateCount,
    })
  } catch (error) {
    console.error("Error fetching demo:", error)
    return NextResponse.json({ error: "Failed to fetch demonstration" }, { status: 500 })
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = context.params
    const payload = (await req.json()) as {
      title?: string
      description?: string
      category?: string
      schedule?: string
      price?: number
      isPaid?: boolean
      videoUrl?: string | null
      metadata?: string | null
      reason?: string
    }

    const demoRows = await query<{
      id: string
      manufacturerId: string
      status: string
      title: string
      description: string
      category: string
      schedule: string
      price: number
      isPaid: boolean
      videoUrl: string | null
      metadata: string | null
    }>(
      `SELECT id, "manufacturerId", status::text AS status, title, description, category, schedule::text AS schedule,
              price, "isPaid", "videoUrl", metadata
       FROM "DemoClass"
       WHERE id = ?
       LIMIT 1`,
      [id]
    )
    if (!demoRows?.length) {
      return NextResponse.json({ error: "Demonstration not found" }, { status: 404 })
    }
    const current = demoRows[0]
    if (current.manufacturerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const criticalKeys: Array<keyof typeof payload> = ["title", "description", "videoUrl", "metadata"]
    const status = current.status.toUpperCase()

    // LIVE is fully locked for non-admin edits.
    if (status === "LIVE") {
      return NextResponse.json(
        { error: "Live demonstrations are locked. Contact admin for any changes." },
        { status: 403 }
      )
    }

    // Before approval: free edits.
    if (status === "DRAFT" || status === "SUBMITTED" || status === "UNDER_REVIEW" || status === "PENDING") {
      const next = {
        title: payload.title ?? current.title,
        description: payload.description ?? current.description,
        category: payload.category ?? current.category,
        schedule: payload.schedule ?? current.schedule,
        price: payload.price ?? current.price,
        isPaid: payload.isPaid ?? current.isPaid,
        videoUrl: payload.videoUrl === undefined ? current.videoUrl : payload.videoUrl,
        metadata: payload.metadata === undefined ? current.metadata : payload.metadata,
      }
      await query(
        `UPDATE "DemoClass"
         SET title = ?, description = ?, category = ?, schedule = ?, price = ?, "isPaid" = ?,
             "videoUrl" = ?, metadata = ?, "updatedAt" = NOW()
         WHERE id = ?`,
        [
          next.title,
          next.description,
          next.category,
          next.schedule,
          next.price,
          next.isPaid,
          next.videoUrl,
          next.metadata,
          id,
        ]
      )
      return NextResponse.json({ success: true, mode: "DIRECT_UPDATE" })
    }

    // Approved/scheduled/completed: change-request workflow.
    const requested: Record<string, unknown> = {}
    for (const key of criticalKeys) {
      const nextValue = payload[key]
      if (nextValue !== undefined && nextValue !== (current as any)[key]) {
        requested[key] = nextValue
      }
    }
    // Optional flexible fields can still be requested for admin review.
    for (const key of ["category", "schedule", "price", "isPaid"] as const) {
      const nextValue = payload[key]
      if (nextValue !== undefined && nextValue !== (current as any)[key]) {
        requested[key] = nextValue
      }
    }

    if (Object.keys(requested).length === 0) {
      return NextResponse.json(
        { error: "No changes detected to submit for review." },
        { status: 400 }
      )
    }

    const pending = await query<{ id: string }>(
      `SELECT id
       FROM "DemoUpdateRequest"
       WHERE "demoId" = ?
         AND status = 'PENDING'::"DemoUpdateRequestStatus"
       LIMIT 1`,
      [id]
    )
    if (pending?.length) {
      return NextResponse.json(
        { error: "You already have a pending change request for this demonstration." },
        { status: 400 }
      )
    }

    await query(
      `INSERT INTO "DemoUpdateRequest"
        (id, "demoId", "requestedById", status, "changesJson", reason, "createdAt", "updatedAt")
       VALUES (?, ?, ?, 'PENDING'::"DemoUpdateRequestStatus", ?, ?, NOW(), NOW())`,
      [
        `dur_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        id,
        session.user.id,
        JSON.stringify(requested),
        payload.reason || null,
      ]
    )

    return NextResponse.json({
      success: true,
      mode: "REQUEST_CREATED",
      message: "Changes submitted for admin review.",
    })
  } catch (error) {
    console.error("Error updating demo:", error)
    return NextResponse.json({ error: "Failed to update demonstration" }, { status: 500 })
  }
}

