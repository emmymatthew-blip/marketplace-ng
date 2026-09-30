import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { z } from "zod"
import { randomUUID } from "crypto"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { trackEvent } from "@/lib/analytics"

const registerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
})

interface RouteContext {
  params: {
    id: string
  }
}

export async function POST(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions)
    const demoId = context.params.id
    const body = await req.json().catch(() => ({}))
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration payload" }, { status: 400 })
    }

    const demoRows = await query<{ id: string; manufacturerId: string }>(
      'SELECT id, "manufacturerId" FROM "DemoClass" WHERE id = ? LIMIT 1',
      [demoId]
    )
    if (!demoRows.length) {
      return NextResponse.json({ error: "Demonstration not found" }, { status: 404 })
    }
    const demo = demoRows[0]

    const actorId = session?.user?.id ?? null
    const { name, email, companyName, phone, message, source } = parsed.data

    await query(
      `INSERT INTO "DemoRegistration"
       (id, "demoId", "userId", name, email, "companyName", phone, message, source, "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        randomUUID(),
        demoId,
        actorId,
        name ?? session?.user?.name ?? null,
        email ?? session?.user?.email ?? null,
        companyName ?? null,
        phone ?? null,
        message ?? null,
        source ?? "REGISTER_INTEREST",
      ]
    )

    await query(
      'UPDATE "DemoClass" SET "registrationCount" = COALESCE("registrationCount", 0) + 1, "updatedAt" = NOW() WHERE id = ?',
      [demoId]
    )

    await trackEvent({
      eventType: "demo_registration",
      ownerId: demo.manufacturerId,
      actorId,
      demoId,
      metadata: { source: source ?? "REGISTER_INTEREST" },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error registering demo interest:", error)
    return NextResponse.json({ error: "Failed to register interest" }, { status: 500 })
  }
}

