"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { AlertTriangle, Calendar, Eye, Loader2, RefreshCw, Search, Star, Users } from "lucide-react"

import {
  AdminEmptyState,
  AdminErrorState,
  AdminPageContainer,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
  AdminToolbar,
} from "@/components/admin/admin-page"
import { AdminConfirmDialog } from "@/components/admin/admin-confirm"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { DemoAccessApplicationReviewTabs } from "@/components/admin/demo-access-application-review-tabs"

function getMonday(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x
}

function addDays(date: Date, days: number): Date {
  const x = new Date(date)
  x.setDate(x.getDate() + days)
  return x
}

function weekKeyFrom(date: string | Date | null): string | null {
  if (!date) return null
  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return null
  return getMonday(d).toISOString().slice(0, 10)
}

type WeekSlotFilter = "all" | "this_week" | "next_week" | "upcoming"

function matchesWeekSlotFilter(
  featuredWeekStart: string | null | undefined,
  filter: WeekSlotFilter,
  thisWeekKey: string,
  nextWeekKey: string
): boolean {
  if (filter === "all") return true
  const wk = weekKeyFrom(featuredWeekStart ?? null)
  if (!wk) return false
  if (filter === "this_week") return wk === thisWeekKey
  if (filter === "next_week") return wk === nextWeekKey
  if (filter === "upcoming") return wk > nextWeekKey
  return true
}

type Demo = {
  id: string
  title: string
  description: string | null
  status: string
  category: string | null
  manufacturerId: string
  manufacturerName: string | null
  manufacturerCompanyName: string | null
  isFeatured: boolean
  featuredWeekStart: string | null
  sourceRequestId: string | null
  requestTitle: string | null
  requestDescription: string | null
  applicationPayload: string | null
  preferredDate: string | null
  assignedDate: string | null
  assignedDateId: string | null
  requestRequestedAt: string | null
  viewCount: number
  registrationCount: number
}

type OccupiedWeek = {
  id: string
  title: string
  status: string
  featuredWeekStart: string
  manufacturerName: string | null
  manufacturerCompanyName: string | null
}

const lifecycleOptions = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "SCHEDULED", "LIVE", "COMPLETED"]

function getLifecycleLabel(demo: Demo): string {
  if (demo.status === "DRAFT" && demo.sourceRequestId) {
    return "AWAITING_FINAL_SETUP"
  }
  return demo.status
}

export default function AdminFeaturedDemosPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [demos, setDemos] = useState<Demo[]>([])
  const [occupiedWeeks, setOccupiedWeeks] = useState<OccupiedWeek[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [weekSlotFilter, setWeekSlotFilter] = useState<WeekSlotFilter>("all")
  const [weekByDemo, setWeekByDemo] = useState<Record<string, string>>({})
  const [loadError, setLoadError] = useState(false)
  const [unfeatureTarget, setUnfeatureTarget] = useState<{ id: string; title: string } | null>(null)
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [updateRequests, setUpdateRequests] = useState<any[]>([])
  const [isLoadingUpdateRequests, setIsLoadingUpdateRequests] = useState(false)
  const [updateActionLoading, setUpdateActionLoading] = useState<string | null>(null)

  const { thisWeekKey, nextWeekKey } = useMemo(() => {
    const thisMonday = getMonday(new Date())
    const nextMonday = addDays(thisMonday, 7)
    return {
      thisWeekKey: thisMonday.toISOString().slice(0, 10),
      nextWeekKey: nextMonday.toISOString().slice(0, 10),
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") fetchData()
  }, [status, session])

  const fetchData = async () => {
    try {
      setLoading(true)
      setLoadError(false)
      const res = await fetch("/api/admin/demos/weekly?weeks=16", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load")
      setDemos(data.demos || [])
      setOccupiedWeeks(data.occupiedWeeks || [])
    } catch (error) {
      setLoadError(true)
      setDemos([])
      setOccupiedWeeks([])
    } finally {
      setLoading(false)
    }
  }

  const updateDemo = async (payload: Record<string, unknown>, successMessage: string, key: string) => {
    try {
      setActionLoading(key)
      const res = await fetch("/api/admin/demos/feature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Action failed")
      toast({ title: "Updated", description: successMessage })
      fetchData()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Action failed",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const weekOptions = Array.from({ length: 16 }).map((_, i) => {
    const now = new Date()
    const day = now.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    now.setDate(now.getDate() + diff + i * 7)
    now.setHours(0, 0, 0, 0)
    return now.toISOString().slice(0, 10)
  })

  const filteredDemos = useMemo(() => {
    return demos.filter((demo) => {
      const q = searchQuery.trim().toLowerCase()
      const passSearch =
        !q ||
        demo.title.toLowerCase().includes(q) ||
        (demo.manufacturerCompanyName || demo.manufacturerName || "").toLowerCase().includes(q)
      const lifecycleLabel = getLifecycleLabel(demo)
      const passStatus = statusFilter === "all" || demo.status === statusFilter || lifecycleLabel === statusFilter
      const passWeek = matchesWeekSlotFilter(demo.featuredWeekStart, weekSlotFilter, thisWeekKey, nextWeekKey)
      return passSearch && passStatus && passWeek
    })
  }, [demos, searchQuery, statusFilter, weekSlotFilter, thisWeekKey, nextWeekKey])

  const filteredOccupiedWeeks = useMemo(() => {
    return occupiedWeeks.filter((slot) =>
      matchesWeekSlotFilter(slot.featuredWeekStart, weekSlotFilter, thisWeekKey, nextWeekKey)
    )
  }, [occupiedWeeks, weekSlotFilter, thisWeekKey, nextWeekKey])

  const openDetailModal = async (demo: Demo) => {
    setSelectedDemo(demo)
    setIsReviewOpen(true)
    setIsLoadingProfile(true)
    setUserProfile(null)
    setIsLoadingUpdateRequests(true)
    setUpdateRequests([])
    try {
      const [userRes, updatesRes] = await Promise.all([
        fetch(`/api/admin/users/${demo.manufacturerId}`),
        fetch(`/api/admin/demos/update-requests?demoId=${encodeURIComponent(demo.id)}`),
      ])
      const userData = await userRes.json().catch(() => ({}))
      if (userRes.ok && userData.success) {
        setUserProfile(userData.data)
      }
      const updatesData = await updatesRes.json().catch(() => ({}))
      if (updatesRes.ok && updatesData.success) {
        setUpdateRequests(updatesData.data || [])
      }
    } catch (error) {
      // Keep modal usable even if profile load fails.
    } finally {
      setIsLoadingProfile(false)
      setIsLoadingUpdateRequests(false)
    }
  }

  const reviewUpdateRequest = async (requestId: string, action: "approve" | "reject") => {
    try {
      setUpdateActionLoading(`${action}-${requestId}`)
      const res = await fetch("/api/admin/demos/update-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Failed to review request")
      toast({
        title: action === "approve" ? "Update approved" : "Update rejected",
        description: action === "approve" ? "Changes applied to demonstration." : "Change request rejected.",
      })
      if (selectedDemo) {
        await openDetailModal(selectedDemo)
      } else {
        fetchData()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to review request",
        variant: "destructive",
      })
    } finally {
      setUpdateActionLoading(null)
    }
  }

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <div className="space-y-6">
          <Skeleton className="h-28 w-full max-w-3xl rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AdminPageContainer>
    )
  }

  if (!session || session.user?.role !== "ADMIN") return null

  if (loading) {
    return (
      <AdminPageContainer>
        <div className="space-y-6">
          <Skeleton className="h-28 w-full max-w-3xl rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      </AdminPageContainer>
    )
  }

  if (loadError) {
    return (
      <AdminPageContainer>
        <AdminPageHeader
          title="Featured demonstration programming"
          description="Curate the weekly spotlight: assign Monday-start weeks, resolve one-demo-per-week conflicts, and advance lifecycle from submission through completion."
          breadcrumbs={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Demonstrations" },
            { label: "Featured & weekly" },
          ]}
        />
        <AdminErrorState
          title="Could not load programming data"
          description="Weekly roster and slot data failed to load. Check your connection and try again."
          onRetry={() => void fetchData()}
        />
      </AdminPageContainer>
    )
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Featured demonstration programming"
        description="Curate the weekly spotlight: assign Monday-start weeks, resolve one-demo-per-week conflicts, and advance lifecycle from submission through completion."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Demonstrations" },
          { label: "Featured & weekly" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {demos.length} in roster
            </Badge>
            <Badge variant="outline" className="border-amber-200/80 bg-amber-50/60 font-normal dark:border-amber-900 dark:bg-amber-950/30">
              {occupiedWeeks.length} week{occupiedWeeks.length === 1 ? "" : "s"} booked
            </Badge>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fetchData()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Sync
            </Button>
          </div>
        }
      />

      <AdminToolbar>
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search demo title or host company…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All lifecycle states</SelectItem>
            <SelectItem value="AWAITING_FINAL_SETUP">Awaiting final setup</SelectItem>
            {lifecycleOptions.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex w-full flex-col gap-2 sm:w-auto">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Week window</span>
          <ToggleGroup
            type="single"
            value={weekSlotFilter}
            onValueChange={(v) => v && setWeekSlotFilter(v as WeekSlotFilter)}
            variant="outline"
            size="sm"
            className="justify-start"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="this_week">This week</ToggleGroupItem>
            <ToggleGroupItem value="next_week">Next</ToggleGroupItem>
            <ToggleGroupItem value="upcoming">Upcoming</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </AdminToolbar>

      <div className="rounded-lg border border-amber-200/70 bg-amber-50/40 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/25">
        <p className="flex items-center gap-2 font-medium text-amber-950 dark:text-amber-100">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Scheduling rules
        </p>
        <p className="mt-1 text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
          Only one demonstration may hold a given featured week. Conflicting weeks are blocked when assigning. Unassigned demos
          appear with week filter <span className="font-medium">All</span>. Upcoming = weeks after next Monday.
        </p>
      </div>

      <AdminSectionCard
        title="Occupied weekly slots"
        description={`This Monday ${thisWeekKey} · Next ${nextWeekKey}`}
      >
        <div className="p-4">
          {filteredOccupiedWeeks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {weekSlotFilter === "all"
                ? "No occupied slots in the loaded horizon."
                : "No occupied slots in this week range — widen the week window to see more."}
            </p>
          ) : (
            <ul className="space-y-2">
              {filteredOccupiedWeeks.map((slot) => (
                <li
                  key={`${slot.id}-${slot.featuredWeekStart}`}
                  className="flex flex-col gap-1 rounded-lg border border-border/70 bg-card px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {new Date(slot.featuredWeekStart).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-foreground">{slot.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {slot.manufacturerCompanyName || slot.manufacturerName || "Host"} ·{" "}
                      <AdminStatusBadge variant="lifecycle" label={slot.status} className="ml-1 align-middle" />
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AdminSectionCard>

      {demos.length === 0 ? (
        <AdminEmptyState title="No demonstrations loaded" description="Check API access or try refreshing the roster." />
      ) : filteredDemos.length === 0 ? (
        <Card className="border-border/80">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No demos match these filters. Set week window to <span className="font-medium text-foreground">All</span> or clear
            search.
          </CardContent>
        </Card>
      ) : (
        <AdminSectionCard
          title="Curation queue"
          description="Assign weeks, toggle featured visibility, advance lifecycle, and open public detail or leads."
          headerAction={
            <span className="text-xs text-muted-foreground">
              Showing {filteredDemos.length} of {demos.length}
            </span>
          }
        >
          <div className="divide-y divide-border/60">
            {filteredDemos.map((demo) => {
              const selectedWeek = weekByDemo[demo.id]
              const effectiveWeek = selectedWeek || demo.featuredWeekStart?.slice(0, 10) || ""
              const conflict = selectedWeek
                ? occupiedWeeks.find((w) => w.featuredWeekStart?.slice(0, 10) === selectedWeek && w.id !== demo.id)
                : null

              return (
                <div
                  key={demo.id}
                  className={cn(
                    "border-l-4 p-4 transition-colors hover:bg-muted/15",
                    conflict ? "border-l-destructive bg-destructive/[0.03]" : "border-l-transparent",
                    demo.isFeatured && !conflict && "border-l-amber-500/90"
                  )}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">{demo.title}</h3>
                        <AdminStatusBadge variant="lifecycle" label={getLifecycleLabel(demo)} />
                        {demo.status === "DRAFT" && demo.sourceRequestId ? (
                          <Badge variant="outline" className="border-blue-200/80 bg-blue-50/70 text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/35 dark:text-blue-200">
                            Needs host completion
                          </Badge>
                        ) : null}
                        {demo.isFeatured ? (
                          <Badge className="gap-1 bg-amber-500 text-white hover:bg-amber-500">
                            <Star className="h-3 w-3" />
                            Featured
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {demo.manufacturerCompanyName || demo.manufacturerName || "Unknown host"}
                        {demo.category ? ` · ${demo.category}` : ""}
                      </p>
                      {demo.preferredDate ? (
                        <p className="text-xs text-muted-foreground">
                          Preferred week/date: {new Date(demo.preferredDate).toLocaleDateString()}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => openDetailModal(demo)}>
                        <Eye className="mr-1.5 h-4 w-4" />
                        Detail
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/demonstrations/${demo.id}/leads`}>
                          <Users className="mr-1.5 h-4 w-4" />
                          Leads
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Views</p>
                      <p className="text-lg font-semibold tabular-nums">{demo.viewCount || 0}</p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Registrations</p>
                      <p className="text-lg font-semibold tabular-nums">{demo.registrationCount || 0}</p>
                    </div>
                    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Featured week</p>
                      <p className="text-lg font-semibold">
                        {demo.featuredWeekStart ? new Date(demo.featuredWeekStart).toLocaleDateString() : "Unassigned"}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4 bg-border/60" />

                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Weekly slot</p>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                      <div className="min-w-0 flex-1">
                        <Select
                          value={effectiveWeek || undefined}
                          onValueChange={(value) => setWeekByDemo((prev) => ({ ...prev, [demo.id]: value }))}
                        >
                          <SelectTrigger className="w-full lg:max-w-xs">
                            <SelectValue placeholder="Select Monday (week start)" />
                          </SelectTrigger>
                          <SelectContent>
                            {weekOptions.map((week) => {
                              const weekConflict = occupiedWeeks.find(
                                (w) => w.featuredWeekStart?.slice(0, 10) === week && w.id !== demo.id
                              )
                              return (
                                <SelectItem key={week} value={week} disabled={Boolean(weekConflict)}>
                                  {week}
                                  {weekConflict ? " · occupied" : ""}
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() =>
                            updateDemo(
                              {
                                demoId: demo.id,
                                weekStart: selectedWeek || demo.featuredWeekStart?.slice(0, 10),
                                featured: true,
                                lifecycleStatus: "SCHEDULED",
                              },
                              "Featured week assigned.",
                              `assign-${demo.id}`
                            )
                          }
                          disabled={Boolean(conflict) || actionLoading === `assign-${demo.id}`}
                        >
                          {actionLoading === `assign-${demo.id}` ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Calendar className="mr-2 h-4 w-4" />
                          )}
                          Assign week
                        </Button>
                        <Button
                          variant={demo.isFeatured ? "outline" : "secondary"}
                          onClick={() =>
                            demo.isFeatured
                              ? setUnfeatureTarget({ id: demo.id, title: demo.title })
                              : updateDemo(
                                  { demoId: demo.id, featured: true },
                                  "Marked as featured.",
                                  `toggle-${demo.id}`
                                )
                          }
                          disabled={actionLoading === `toggle-${demo.id}`}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {demo.isFeatured ? "Unfeature" : "Feature"}
                        </Button>
                      </div>
                    </div>

                    {conflict ? (
                      <div
                        role="alert"
                        className="flex gap-3 rounded-lg border-2 border-destructive/40 bg-destructive/10 px-3 py-3 text-sm dark:bg-destructive/15"
                      >
                        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                        <div>
                          <p className="font-semibold text-destructive">Week conflict</p>
                          <p className="mt-1 text-muted-foreground">
                            <span className="font-mono text-xs">{selectedWeek}</span> is already held by{" "}
                            <span className="font-medium text-foreground">&quot;{conflict.title}&quot;</span>. Choose another
                            Monday or reassign the other demo first.
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Lifecycle</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lifecycleOptions.map((state) => (
                        <Button
                          key={state}
                          size="sm"
                          variant={demo.status === state ? "default" : "outline"}
                          className={cn(
                            "h-8 text-xs font-medium",
                            demo.status === state && "pointer-events-none ring-2 ring-primary/20"
                          )}
                          onClick={() =>
                            updateDemo(
                              { demoId: demo.id, lifecycleStatus: state },
                              `Lifecycle: ${state.replace(/_/g, " ")}`,
                              `lifecycle-${demo.id}-${state}`
                            )
                          }
                          disabled={actionLoading === `lifecycle-${demo.id}-${state}`}
                        >
                          {actionLoading === `lifecycle-${demo.id}-${state}` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            state.replace(/_/g, " ")
                          )}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </AdminSectionCard>
      )}

      <AdminConfirmDialog
        open={unfeatureTarget !== null}
        onOpenChange={(open) => !open && setUnfeatureTarget(null)}
        title="Remove from featured?"
        description={
          unfeatureTarget
            ? `“${unfeatureTarget.title}” will no longer appear in the featured spotlight until you feature it again.`
            : ""
        }
        confirmLabel="Unfeature"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (!unfeatureTarget) return
          await updateDemo(
            { demoId: unfeatureTarget.id, featured: false },
            "Removed from featured.",
            `toggle-${unfeatureTarget.id}`
          )
        }}
      />

      <Dialog
        open={isReviewOpen}
        onOpenChange={(open) => {
          setIsReviewOpen(open)
          if (!open) {
            setSelectedDemo(null)
            setUserProfile(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Demo Request & User Profile Details</DialogTitle>
            <DialogDescription>
              Review linked request context and host profile without leaving programming.
            </DialogDescription>
          </DialogHeader>
          {!selectedDemo ? null : (
            <div className="space-y-6">
              {selectedDemo.sourceRequestId ? (
                <DemoAccessApplicationReviewTabs
                  title={selectedDemo.requestTitle || selectedDemo.title || ""}
                  description={selectedDemo.requestDescription || selectedDemo.description || ""}
                  applicationPayload={selectedDemo.applicationPayload}
                  requestedAt={selectedDemo.requestRequestedAt}
                  preferredDate={selectedDemo.preferredDate}
                  assignedDate={selectedDemo.assignedDate}
                  assignedDateId={selectedDemo.assignedDateId}
                  status={getLifecycleLabel(selectedDemo)}
                />
              ) : (
                <Card className="border-border/70">
                  <CardContent className="py-4 text-sm text-muted-foreground">
                    This demo is not linked to a `DemoAccessRequest` record. It may be a legacy or manually created demo.
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardContent className="py-4">
                  {isLoadingProfile ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading user profile…
                    </div>
                  ) : userProfile ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{userProfile.name || "Unknown user"}</p>
                        <p className="text-sm text-muted-foreground">{userProfile.email || "No email"}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {userProfile.companyName || "No company provided"} {userProfile.role ? `· ${userProfile.role}` : ""}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/users/${selectedDemo.manufacturerId}`}>Open full user review</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Could not load user profile.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Change requests</CardTitle>
                  <CardDescription>Controlled edits for approved weekly demonstrations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoadingUpdateRequests ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading update requests…
                    </div>
                  ) : updateRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No update requests for this demo.</p>
                  ) : (
                    updateRequests.map((req) => {
                      let changes: Record<string, unknown> = {}
                      try {
                        changes = JSON.parse(req.changesJson || "{}")
                      } catch {
                        changes = {}
                      }
                      return (
                        <div key={req.id} className="rounded-lg border p-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {req.requestedByName || req.requestedByEmail || "Host"} · {new Date(req.createdAt).toLocaleString()}
                            </p>
                            <Badge variant={req.status === "PENDING" ? "secondary" : "outline"}>{req.status}</Badge>
                          </div>
                          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                            {Object.entries(changes).map(([key, value]) => (
                              <p key={key}>
                                <span className="font-medium text-foreground">{key}:</span>{" "}
                                <span className="line-clamp-2">{String(value)}</span>
                              </p>
                            ))}
                            {Object.keys(changes).length === 0 ? <p>No parsed changes</p> : null}
                          </div>
                          {req.status === "PENDING" ? (
                            <div className="mt-3 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => reviewUpdateRequest(req.id, "approve")}
                                disabled={updateActionLoading === `approve-${req.id}` || Boolean(updateActionLoading)}
                              >
                                {updateActionLoading === `approve-${req.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Approve"}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => reviewUpdateRequest(req.id, "reject")}
                                disabled={updateActionLoading === `reject-${req.id}` || Boolean(updateActionLoading)}
                              >
                                {updateActionLoading === `reject-${req.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Reject"}
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  )
}
