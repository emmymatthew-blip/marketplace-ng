import { prisma } from "./prisma"

export const ANALYTICS_EVENT_TYPES = [
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
] as const

export type AnalyticsEventType = (typeof ANALYTICS_EVENT_TYPES)[number]

export interface TrackEventPayload {
  eventType: AnalyticsEventType
  ownerId: string
  actorId?: string | null
  productId?: string | null
  vendorId?: string | null
  agreementId?: string | null
  demoId?: string | null
  inquiryId?: string | null
  sessionId?: string | null
  country?: string | null
  metadata?: Record<string, unknown> | null
}

export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: payload.eventType,
        ownerId: payload.ownerId,
        actorId: payload.actorId ?? undefined,
        productId: payload.productId ?? undefined,
        vendorId: payload.vendorId ?? undefined,
        agreementId: payload.agreementId ?? undefined,
        demoId: payload.demoId ?? undefined,
        inquiryId: payload.inquiryId ?? undefined,
        sessionId: payload.sessionId ?? undefined,
        country: payload.country ?? undefined,
        metadata: payload.metadata ? JSON.stringify(payload.metadata) : undefined,
      },
    })
  } catch {
    // Silently fail to avoid breaking main flows
  }
}

export function getDateRange(range: string): { from: Date; to: Date } {
  const to = new Date()
  const from = new Date()
  switch (range) {
    case "7d":
      from.setDate(from.getDate() - 7)
      break
    case "30d":
      from.setDate(from.getDate() - 30)
      break
    case "90d":
      from.setDate(from.getDate() - 90)
      break
    case "12m":
      from.setMonth(from.getMonth() - 12)
      break
    default:
      from.setDate(from.getDate() - 30)
  }
  return { from, to }
}

export function parseCustomRange(fromStr: string | null, toStr: string | null): { from: Date; to: Date } | null {
  if (!fromStr || !toStr) return null
  const from = new Date(fromStr)
  const to = new Date(toStr)
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) return null
  return { from, to }
}
