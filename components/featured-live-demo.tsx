"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Calendar, Clock, ExternalLink, LayoutGrid, MessageCircle, Star, Users, Video } from "lucide-react"
import { format } from "date-fns"
import { loginWithCallback } from "@/lib/auth-urls"

const PLACEHOLDER_RATING = 4.8

// Platform display names (avoid “live” wording that implies multiple simultaneous streams)
const platformNames = {
  zoom: "Zoom",
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
}

// Platform URL display format
const formatPlatformUrl = (platform: string, url: string) => {
  switch (platform) {
    case "zoom":
      return "Join link shared after registration"
    case "instagram":
      return url ? `Hosted on ${url}` : "Connection details after registration"
    default:
      return url
  }
}

function parseDurationMinutes(raw: string): number {
  const n = parseInt(String(raw).replace(/\D/g, ""), 10)
  return Number.isFinite(n) && n > 0 ? n : 60
}

type SpotlightPhase = "upcoming" | "live" | "ended"

function getSpotlightPhase(
  start: Date,
  durationMins: number,
  now: Date
): { phase: SpotlightPhase; primaryLabel: string; secondaryHint?: string } {
  const startMs = start.getTime()
  const endMs = startMs + durationMins * 60 * 1000
  const t = now.getTime()
  if (Number.isNaN(startMs)) {
    return { phase: "upcoming", primaryLabel: "Starting soon" }
  }
  if (t < startMs) {
    const diff = startMs - t
    const days = Math.floor(diff / 86400000)
    if (days >= 1) {
      return {
        phase: "upcoming",
        primaryLabel: `Starting in ${days} day${days === 1 ? "" : "s"}`,
        secondaryHint: "One weekly spotlight — curated and exclusive.",
      }
    }
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff / 60000) % 60)
    if (hours >= 1) {
      return { phase: "upcoming", primaryLabel: `Starting in ${hours}h ${mins}m` }
    }
    return {
      phase: "upcoming",
      primaryLabel: `Starting in ${mins} minute${mins === 1 ? "" : "s"}`,
    }
  }
  if (t < endMs) {
    return {
      phase: "live",
      primaryLabel: "Happening now",
      secondaryHint: "This week’s featured spotlight is in session.",
    }
  }
  return {
    phase: "ended",
    primaryLabel: "Session concluded",
    secondaryHint: "This week’s spotlight has ended; browse upcoming sessions below.",
  }
}

type FeaturedApiDemo = {
  id: string
  title: string
  description: string
  schedule: string
  manufacturerId?: string | null
  maxAttendees?: number | null
  registrationCount?: number | null
  headerImage?: string | null
  advertImage?: string | null
  metadata?: string | null
  manufacturerName?: string | null
  manufacturerCompanyName?: string | null
  manufacturerImage?: string | null
  manufacturerIsVerified?: boolean
}

export function FeaturedLiveDemo() {
  const { data: session } = useSession()
  const [liveDemo, setLiveDemo] = useState<FeaturedApiDemo | null>(null)
  const [featuredLoadError, setFeaturedLoadError] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadFeatured() {
      try {
        setFeaturedLoadError(false)
        const res = await fetch("/api/demos/featured-weekly", { cache: "no-store" })
        if (!res.ok) {
          if (!cancelled) {
            setFeaturedLoadError(true)
            setLiveDemo(null)
          }
          return
        }
        const data = await res.json()
        if (!cancelled) {
          setLiveDemo(data?.featured ?? null)
          if (!data?.featured) setFeaturedLoadError(false)
        }
      } catch {
        if (!cancelled) {
          setFeaturedLoadError(true)
          setLiveDemo(null)
        }
      }
    }
    loadFeatured()
    return () => {
      cancelled = true
    }
  }, [])

  const mergedDemo = useMemo(() => {
    if (!liveDemo) return null
    const when = new Date(liveDemo.schedule)
    let metadata: Record<string, any> = {}
    if (liveDemo.metadata) {
      try {
        metadata = JSON.parse(liveDemo.metadata)
      } catch {
        metadata = {}
      }
    }
    return {
      id: liveDemo.id,
      manufacturerId: liveDemo.manufacturerId ?? "",
      title: liveDemo.title,
      description: liveDemo.description,
      date: Number.isNaN(when.getTime()) ? new Date() : when,
      duration: String(metadata?.duration || "60"),
      maxAttendees: liveDemo.maxAttendees ?? 0,
      currentAttendees: liveDemo.registrationCount ?? 0,
      image: liveDemo.advertImage || liveDemo.headerImage || "/images/b7a4dab131.jpg",
      platform: metadata?.platform || "zoom",
      platformUrl: metadata?.platformUrl || "",
      manufacturer: {
        name: liveDemo.manufacturerCompanyName || liveDemo.manufacturerName || "Host",
        image: liveDemo.manufacturerImage || "/images/Canon-pixma-2 1.png",
        isVerified: Boolean(liveDemo.manufacturerIsVerified),
        rating: PLACEHOLDER_RATING,
      },
    }
  }, [liveDemo])

  const durationMins = useMemo(
    () => (mergedDemo ? parseDurationMinutes(mergedDemo.duration) : 60),
    [mergedDemo]
  )
  const spotlight = useMemo(
    () =>
      mergedDemo
        ? getSpotlightPhase(mergedDemo.date, durationMins, now)
        : { phase: "upcoming" as const, primaryLabel: "No spotlight", secondaryHint: undefined },
    [mergedDemo, durationMins, now]
  )

  if (!mergedDemo) {
    return (
      <Card className="overflow-hidden border-dashed border-border bg-muted/20">
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center md:flex-row md:items-start md:text-left">
          <div className="rounded-lg bg-muted p-3">
            <Video className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="max-w-xl space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {featuredLoadError ? "Could not load featured demonstration" : "No featured demonstration this week"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {featuredLoadError
                ? "Refresh the page or try again later. You can still browse the approved session list below."
                : "When an admin assigns the weekly spotlight, it will appear here. Browse upcoming sessions in the list below."}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/demonstrations#discover">Browse sessions</Link>
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  const registerDemoPath = `/demonstrations/${mergedDemo.id}?action=register`
  const registerHref = session ? registerDemoPath : loginWithCallback(registerDemoPath)
  const contactHostPath = `/messages?context=demo-${mergedDemo.id}`
  const contactHostHref = session ? contactHostPath : loginWithCallback(contactHostPath)

  return (
    <Card className="group overflow-hidden border-0">
      <div className="grid md:grid-cols-2 h-full">
        {/* Featured Image Side */}
        <div className="relative h-[300px] md:h-full min-h-[400px] overflow-hidden">
          <Image
            src={mergedDemo.image}
            alt={mergedDemo.title}
            fill
            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-900/20 to-slate-900 md:bg-gradient-to-b"></div>
        </div>

        {/* Content Side */}
        <div className="bg-slate-900 hover:bg-slate-900/90 transition-all duration-300 p-6 md:p-8 lg:p-10 flex flex-col relative">
          {/* Premium background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-800/90 opacity-75"></div>
          
          {/* Content wrapper */}
          <div className="relative z-10">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Badge
                className={
                  spotlight.phase === "upcoming"
                    ? "w-fit border-0 bg-sky-600/95 px-3 py-1 text-sm text-white"
                    : spotlight.phase === "live"
                      ? "w-fit border-0 bg-emerald-600/95 px-3 py-1 text-sm text-white"
                      : "w-fit border-0 bg-slate-600/95 px-3 py-1 text-sm text-white"
                }
              >
                {spotlight.primaryLabel}
              </Badge>
              {spotlight.secondaryHint ? (
                <span className="text-xs text-slate-400 sm:max-w-md">{spotlight.secondaryHint}</span>
              ) : null}
            </div>

            {/* Manufacturer Info */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-12 w-12 ring-2 ring-brand-light-blue">
                <AvatarImage src={mergedDemo.manufacturer.image} alt={mergedDemo.manufacturer.name} />
                <AvatarFallback>{mergedDemo.manufacturer.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-white text-lg">
                    {mergedDemo.manufacturer.name}
                  </span>
                  {mergedDemo.manufacturer.isVerified && (
                    <Badge className="bg-gradient-to-r from-brand-primary to-brand-pink text-white">
                      Verified Partner
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-brand-light-blue">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">
                    {mergedDemo.manufacturer.rating.toFixed(1)} Host rating
                  </span>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="space-y-6 flex-1">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white group-hover:text-brand-light-blue transition-colors">
                {mergedDemo.title}
              </h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {mergedDemo.description}
              </p>

              {/* Demo Details */}
              <div className="grid gap-4 pt-4">
                <div className="flex items-center gap-2 text-brand-light-blue">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {format(mergedDemo.date, "MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-brand-light-blue">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {format(mergedDemo.date, "h:mm a")} • {mergedDemo.duration} mins
                  </span>
                </div>
                <div className="flex items-center gap-2 text-brand-light-blue">
                  <Video className="h-5 w-5" />
                  <div className="space-y-1">
                    <span className="text-sm font-medium block">
                      Hosted via {platformNames[mergedDemo.platform as keyof typeof platformNames] ?? mergedDemo.platform}
                    </span>
                    <span className="text-sm text-brand-light-blue/80 block">
                      {formatPlatformUrl(mergedDemo.platform, mergedDemo.platformUrl)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-brand-light-blue">
                  <Users className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    {mergedDemo.currentAttendees}/{mergedDemo.maxAttendees} Registered
                  </span>
                </div>
                <div className="flex items-center gap-2 text-brand-light-blue">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Interactive Q&A Session Included
                  </span>
                </div>
              </div>

              {/* Primary + trust / follow-up CTAs */}
              <div className="flex flex-col gap-3 pt-6 mt-auto">
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary text-white hover:from-brand-primary/90 hover:via-brand-pink/90 hover:to-brand-secondary/90"
                    size="lg"
                  >
                    <Link href={`/demonstrations/${mergedDemo.id}`}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View demonstration
                    </Link>
                  </Button>
                  {spotlight.phase !== "ended" ? (
                    <Button asChild variant="secondary" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                      <Link href={registerHref}>Register interest</Link>
                    </Button>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {mergedDemo.manufacturerId ? (
                    <>
                      <Button asChild variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                        <Link href={`/marketplace/vendor/${mergedDemo.manufacturerId}`}>
                          <Building2 className="mr-1.5 h-4 w-4" />
                          View company
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                        <Link href={`/marketplace/vendor/${mergedDemo.manufacturerId}?tab=listings`}>
                          <LayoutGrid className="mr-1.5 h-4 w-4" />
                          Related listings
                        </Link>
                      </Button>
                    </>
                  ) : null}
                  <Button asChild variant="outline" size="sm" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                    <Link href={contactHostHref}>
                      <MessageCircle className="mr-1.5 h-4 w-4" />
                      Contact host
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 