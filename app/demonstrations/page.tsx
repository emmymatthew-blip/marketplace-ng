"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { AlertCircle, CalendarClock, Info, Sparkles, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DemoCard } from "@/components/demonstrations/demo-card"
import {
  DemoFilter,
  DEMO_FILTER_DEFAULT,
  type DemoFilterValues,
} from "@/components/demonstrations/demo-filter"
import { DemonstrationDiscoveryToolbar, type SortBy } from "@/components/demonstrations/demonstration-discovery-toolbar"
import { FeaturedLiveDemo } from "@/components/featured-live-demo"
import {
  DashboardPageContainer,
  DashboardHeader,
  DashboardEmptyState,
} from "@/components/dashboard"
import { loginWithCallback } from "@/lib/auth-urls"
import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"
import { mapApiDemoToHubDemo, type HubDemo } from "@/lib/normalizers/demo"
import { Skeleton } from "@/components/ui/skeleton"

const categories = ["Finishing", "Software", "Press Equipment", "Consumables", "UV", "Textile"]

function applyDiscoveryFilters(demos: HubDemo[], filters: DemoFilterValues, sortBy: SortBy): HubDemo[] {
  let result = demos.filter((demo) => {
    if (
      filters.search &&
      !demo.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !demo.description.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }

    if (filters.category !== "all" && demo.category.toLowerCase() !== filters.category) {
      return false
    }

    if (filters.verifiedOnly && !demo.manufacturer.isVerified) {
      return false
    }

    if (filters.region !== "all") {
      const loc = (demo.location || "").toLowerCase()
      const isLocal = loc.includes("nigeria") || loc.includes("lagos") || loc.includes("abuja")
      if (filters.region === "local" && !isLocal) return false
      if (filters.region === "international" && isLocal) return false
    }

    return true
  })

  const sorted = [...result]
  if (sortBy === "featured") {
    sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
  } else if (sortBy === "newest") {
    sorted.sort((a, b) => b.id.localeCompare(a.id))
  } else {
    sorted.sort((a, b) => {
      const ta = a.scheduledAt ? new Date(a.scheduledAt).getTime() : 0
      const tb = b.scheduledAt ? new Date(b.scheduledAt).getTime() : 0
      return ta - tb
    })
  }

  return sorted
}

function UpcomingPipelineSection({
  demos,
  session,
  emptyTitle,
  emptyDescription,
}: {
  demos: HubDemo[]
  session: ReturnType<typeof useSession>["data"]
  emptyTitle: string
  emptyDescription: string
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
          <Video className="h-5 w-5 text-sky-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">Upcoming weekly demonstrations</h2>
          <p className="text-sm text-muted-foreground">
            Approved, scheduled sessions — register interest before the live time. This week’s editorial spotlight is
            shown above; the list below is the broader approved weekly programme (not an on-demand library).
          </p>
        </div>
      </div>
      {demos.length === 0 ? (
        <DashboardEmptyState icon={Video} title={emptyTitle} description={emptyDescription} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demos.map((demo) => (
            <DemoCard
              key={demo.id}
              demo={demo}
              isOwner={session?.user?.id === demo.manufacturer.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ApplyToHostSection({ loggedIn }: { loggedIn: boolean }) {
  return (
    <Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-primary/5 via-background to-muted/40">
      <CardContent className="space-y-4 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Apply to host a weekly demonstration</h2>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              PrintMarket NG runs a <span className="font-medium text-foreground">curated weekly programme only</span>
              : one featured slot per week, application and approval before scheduling, then a live session window.
              Evergreen product video stays on your listings — this path is for{" "}
              <span className="font-medium text-foreground">scheduled weekly spotlight sessions</span>, not a recorded
              library.
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Weekly featured placement is competitive — not every application is accepted.</li>
              <li>All submissions go through approval before they appear publicly.</li>
              <li>We prioritise verified hosts and clear commercial relevance.</li>
            </ul>
          </div>
          <CalendarClock className="hidden h-12 w-12 shrink-0 text-primary/40 sm:block" aria-hidden />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={loggedIn ? WEEKLY_DEMO_APPLICATION_HREF : loginWithCallback(WEEKLY_DEMO_APPLICATION_HREF)}>
              Apply to host a demonstration
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/pricing">How featured placement works</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function DemonstrationsContent() {
  const { data: session } = useSession()
  const [filters, setFilters] = useState<DemoFilterValues>(DEMO_FILTER_DEFAULT)
  const [sortBy, setSortBy] = useState<SortBy>("soonest")
  const [hubDemos, setHubDemos] = useState<HubDemo[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState<string | null>(null)

  const loadDemos = useCallback(async () => {
    setListLoading(true)
    setListError(null)
    try {
      const res = await fetch("/api/demos", { cache: "no-store" })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "Failed to load demonstrations")
      }
      if (!Array.isArray(data)) {
        throw new Error("Invalid demonstrations response")
      }
      setHubDemos(data.map((row: Record<string, unknown>) => mapApiDemoToHubDemo(row)))
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load demonstrations")
      setHubDemos([])
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadDemos()
  }, [loadDemos])

  const filteredDemos = useMemo(
    () => applyDiscoveryFilters(hubDemos, filters, sortBy),
    [hubDemos, filters, sortBy]
  )

  return (
    <DashboardPageContainer className="space-y-8">
      <DashboardHeader
        title="Weekly demonstration programme"
        description="One featured demonstration per week, plus upcoming approved scheduled sessions. Product video belongs on your listings."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="default">
              <Link href={session ? WEEKLY_DEMO_APPLICATION_HREF : loginWithCallback(WEEKLY_DEMO_APPLICATION_HREF)}>
                Apply to host
              </Link>
            </Button>
            {session && (
              <Button asChild size="sm" variant="outline">
                <Link href="/demo-access/my-requests">My demo requests</Link>
              </Button>
            )}
          </div>
        }
      />

      <Card className="border-primary/20 bg-muted/30 shadow-none">
        <CardContent className="flex gap-3 p-4 sm:items-start">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Info className="h-4 w-4" />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium leading-snug">Single weekly spotlight</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Only one demonstration is featured per week.</span> Slots are
              limited; hosts apply and are approved before appearing. Session timing and status for that spotlight are
              shown on the card below — no separate “live” feed. Deeper product video stays on your product pages.
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">This week’s featured demonstration</h2>
            <p className="text-sm text-muted-foreground">
              Our single editorial weekly spotlight — one slot, assigned by admins.
            </p>
          </div>
          <Sparkles className="hidden h-5 w-5 text-amber-500 sm:block" aria-hidden />
        </div>
        <FeaturedLiveDemo />
      </section>

      <section id="discover" className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Upcoming approved demonstrations
          </p>
          <DemoFilter categories={categories} value={filters} onFilterChange={setFilters} />
          <DemonstrationDiscoveryToolbar
            className="mt-5 border-t border-border/50 pt-4"
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {listError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/[0.06] px-6 py-12 text-center">
            <AlertCircle className="h-10 w-10 text-destructive/80" />
            <p className="text-sm font-medium text-foreground">Could not load demonstrations</p>
            <p className="max-w-md text-sm text-muted-foreground">{listError}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => void loadDemos()}>
              Try again
            </Button>
          </div>
        ) : listLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <UpcomingPipelineSection
            demos={filteredDemos}
            session={session}
            emptyTitle="No sessions match your filters"
            emptyDescription="Try adjusting search, category, or region. New approved slots appear as hosts are cleared."
          />
        )}
      </section>

      <ApplyToHostSection loggedIn={Boolean(session)} />
    </DashboardPageContainer>
  )
}

export default function DemonstrationsPage() {
  return <DemonstrationsContent />
}
