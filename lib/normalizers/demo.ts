import { format } from "date-fns"

/** Curated weekly pipeline only: lifecycle values shown on the public hub (excludes draft / review queue). */
export const PUBLIC_LISTING_DEMO_STATUSES = [
  "APPROVED",
  "SCHEDULED",
  "LIVE",
  "COMPLETED",
] as const

export type HubDemo = {
  id: string
  title: string
  description: string
  manufacturer: {
    id: string
    name: string
    image: string
    isVerified: boolean
  }
  date: string
  time: string
  location: string
  category: string
  price: string
  isPaid: boolean
  attendees: number
  maxAttendees: number
  isRegistered: boolean
  image: string
  videoUrl: string
  format: "LIVE" | "HYBRID"
  status: "UPCOMING"
  scheduledAt?: string
  isFeatured?: boolean
}

/**
 * Maps Prisma / GET /api/demos row (+ manufacturer include) to hub card shape.
 */
export function mapApiDemoToHubDemo(raw: Record<string, unknown>): HubDemo {
  const scheduleRaw = raw.schedule
  const schedule =
    scheduleRaw instanceof Date
      ? scheduleRaw
      : typeof scheduleRaw === "string"
        ? new Date(scheduleRaw)
        : new Date()

  const m = (raw.manufacturer || {}) as Record<string, unknown>
  const hostName = (m.companyName || m.name || "Host") as string
  const priceNum = typeof raw.price === "number" ? raw.price : Number(raw.price) || 0
  const isPaid = Boolean(raw.isPaid)

  const headerImage = (raw.headerImage as string | null | undefined) || undefined
  const metadata = raw.metadata as string | null | undefined
  let thumb = headerImage
  if (!thumb && metadata) {
    try {
      const meta = JSON.parse(metadata) as { gallery?: string[] }
      if (meta?.gallery?.length) thumb = meta.gallery[0]
    } catch {
      /* ignore */
    }
  }

  return {
    id: String(raw.id),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    manufacturer: {
      id: String(m.id ?? ""),
      name: hostName,
      image: (m.image as string | undefined) || "/images/Canon-pixma-2 1.png",
      isVerified: Boolean(m.isVerified),
    },
    date: Number.isNaN(schedule.getTime()) ? "—" : format(schedule, "MMM d, yyyy"),
    time: Number.isNaN(schedule.getTime()) ? "—" : format(schedule, "h:mm a"),
    location: (raw.location as string | undefined) || "—",
    category: String(raw.category ?? "General"),
    price: isPaid ? `₦${priceNum.toLocaleString()}` : "Free",
    isPaid,
    attendees: typeof raw.registrationCount === "number" ? raw.registrationCount : Number(raw.registrationCount) || 0,
    maxAttendees: typeof raw.maxAttendees === "number" ? raw.maxAttendees : raw.maxAttendees != null ? Number(raw.maxAttendees) : 0,
    isRegistered: false,
    image: thumb || "/images/Canon-pixma-2 1.png",
    videoUrl: (raw.videoUrl as string | undefined) || "",
    format: "LIVE",
    status: "UPCOMING",
    scheduledAt: Number.isNaN(schedule.getTime()) ? undefined : schedule.toISOString(),
    isFeatured: Boolean(raw.isFeatured),
  }
}
