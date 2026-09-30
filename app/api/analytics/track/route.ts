import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"
import { trackEvent, type AnalyticsEventType } from "@/lib/analytics"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"

const trackSchema = z.object({
  eventType: z.enum([
    "product_view",
    "product_detail_view",
    "vendor_profile_view",
    "inquiry_created",
    "message_sent",
    "agreement_created",
    "agreement_accepted",
    "agreement_completed",
    "agreement_disputed",
    "demo_view",
    "demo_registration",
    "demo_conversion",
  ]),
  ownerId: z.string().optional(),
  productId: z.string().optional(),
  vendorId: z.string().optional(),
  agreementId: z.string().optional(),
  demoId: z.string().optional(),
  inquiryId: z.string().optional(),
  sessionId: z.string().optional(),
  country: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await req.json().catch(() => ({}))
    const parsed = trackSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const { eventType, productId, vendorId, agreementId, demoId, inquiryId, sessionId, country, metadata } = parsed.data
    let ownerId = parsed.data.ownerId

    if (!ownerId && productId) {
      const product = await prisma.product.findUnique({ where: { id: productId }, select: { ownerId: true } })
      ownerId = product?.ownerId ?? undefined
    }
    if (!ownerId && vendorId) ownerId = vendorId
    if (!ownerId && eventType === "vendor_profile_view" && vendorId) ownerId = vendorId
    if (!ownerId && eventType === "demo_view" && demoId) {
      const demo = await prisma.demoClass.findUnique({ where: { id: demoId }, select: { manufacturerId: true } })
      ownerId = demo?.manufacturerId ?? undefined
    }
    if (!ownerId && (eventType === "demo_registration" || eventType === "demo_conversion") && demoId) {
      const demo = await prisma.demoClass.findUnique({ where: { id: demoId }, select: { manufacturerId: true } })
      ownerId = demo?.manufacturerId ?? undefined
    }

    if (!ownerId) {
      return NextResponse.json({ error: "ownerId could not be determined" }, { status: 400 })
    }

    await trackEvent({
      eventType: eventType as AnalyticsEventType,
      ownerId,
      actorId: session?.user?.id ?? null,
      productId: productId ?? null,
      vendorId: vendorId ?? null,
      agreementId: agreementId ?? null,
      demoId: demoId ?? null,
      inquiryId: inquiryId ?? null,
      sessionId: sessionId ?? null,
      country: country ?? null,
      metadata: metadata ?? null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 })
  }
}
