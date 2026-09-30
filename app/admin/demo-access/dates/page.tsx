"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AdminErrorState,
  AdminPageContainer,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
  AdminToolbar,
} from "@/components/admin/admin-page"
import { AdminConfirmDialog } from "@/components/admin/admin-confirm"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Calendar as CalendarIcon, X, Clock, RefreshCw, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

type AvailableDate = {
  id: string
  date: string
  time?: string | null
  isAvailable?: boolean
  assignedTo?: string | null
  createdAt?: string
}

export default function AvailableDemoDatesPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [availableDates, setAvailableDates] = useState<AvailableDate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [weeklyLoading, setWeeklyLoading] = useState(true)
  const [occupiedWeeks, setOccupiedWeeks] = useState<{ id: string; title: string; featuredWeekStart: string }[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [slotToRemoveId, setSlotToRemoveId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchDates()
      fetchWeekly()
    }
  }, [session, status])

  const fetchWeekly = async () => {
    try {
      setWeeklyLoading(true)
      const res = await fetch("/api/admin/demos/weekly?weeks=12", { cache: "no-store" })
      const data = await res.json()
      if (res.ok) {
        setOccupiedWeeks((data.occupiedWeeks || []).map((w: { id: string; title: string; featuredWeekStart: string }) => w))
      }
    } catch {
      setOccupiedWeeks([])
    } finally {
      setWeeklyLoading(false)
    }
  }

  const fetchDates = async () => {
    try {
      setIsLoading(true)
      setLoadError(false)
      const response = await fetch("/api/admin/available-demo-dates")
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load available dates")
      }
      setAvailableDates(data.data || [])
    } catch (error) {
      console.error("Error fetching dates:", error)
      setLoadError(true)
      setAvailableDates([])
    } finally {
      setIsLoading(false)
    }
  }

  const slotSummary = useMemo(() => {
    const open = availableDates.filter((d) => d.isAvailable !== false).length
    const assigned = availableDates.length - open
    return { open, assigned, total: availableDates.length }
  }, [availableDates])

  const handleAddDate = async () => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/available-demo-dates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          time: time || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to add date")
      }

      toast({
        title: "Success",
        description: "Available date added successfully",
      })

      setSelectedDate(undefined)
      setTime("")
      setIsDialogOpen(false)
      fetchDates()
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add date",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteDate = async (dateId: string) => {
    try {
      const response = await fetch(`/api/admin/available-demo-dates?id=${dateId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete date")
      }

      toast({
        title: "Success",
        description: "Date removed successfully",
      })

      fetchDates()
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete date",
        variant: "destructive",
      })
    } finally {
      setSlotToRemoveId(null)
    }
  }

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <Skeleton className="h-28 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </AdminPageContainer>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Demo access date pool"
        description="Manage concrete calendar slots offered when approving featured demonstration applications. Weekly featured programming is scheduled separately."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Demonstrations" },
          { label: "Demo dates" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/featured-demos">
                <Sparkles className="mr-2 h-4 w-4" />
                Featured weeks
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => { fetchDates(); fetchWeekly() }} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add slot
            </Button>
          </div>
        }
      />

      <div className="rounded-lg border border-primary/15 bg-primary/[0.04] px-4 py-3 text-sm">
        <p className="font-medium text-foreground">How this fits the model</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          These entries are <span className="font-medium text-foreground">assignable slots</span> for demo access approvals.
          <span className="font-medium"> Curated weekly featured demonstrations</span> use Monday-start weeks on the Featured &amp; weekly page — both work together in operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pool size</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{slotSummary.total}</p>
          <p className="text-xs text-muted-foreground">Slots configured</p>
        </div>
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/30 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-900 dark:text-emerald-100">{slotSummary.open}</p>
        </div>
        <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Assigned / used</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{slotSummary.assigned}</p>
        </div>
      </div>

      <AdminSectionCard
        title="Featured week occupancy (snapshot)"
        description="Monday-start weeks with a scheduled featured demonstration — for alignment with the date pool."
        headerAction={
          weeklyLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <span className="text-xs text-muted-foreground">{occupiedWeeks.length} booked week(s)</span>
          )
        }
      >
        <div className="p-4">
          {weeklyLoading ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : occupiedWeeks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No occupied featured weeks in the current window.</p>
          ) : (
            <ul className="space-y-2">
              {occupiedWeeks.slice(0, 8).map((w) => (
                <li
                  key={`${w.id}-${w.featuredWeekStart}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs">{w.featuredWeekStart}</span>
                  <span className="min-w-0 flex-1 font-medium">{w.title}</span>
                </li>
              ))}
            </ul>
          )}
          <Button variant="link" className="mt-2 h-auto px-0 text-sm" asChild>
            <Link href="/admin/featured-demos">Manage featured programming →</Link>
          </Button>
        </div>
      </AdminSectionCard>

      <AdminToolbar>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{availableDates.length}</span> slot
          {availableDates.length === 1 ? "" : "s"} in list
        </p>
      </AdminToolbar>

      {loadError && !isLoading ? (
        <AdminErrorState
          title="Could not load date pool"
          description="Calendar slots could not be fetched. Retry or check your connection."
          onRetry={() => void fetchDates()}
        />
      ) : isLoading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : availableDates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/15 px-6 py-14 text-center">
          <CalendarIcon className="mb-3 h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-sm font-medium text-foreground">No slots in the pool</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Add calendar dates so approvers can optionally assign them when granting demo access.
          </p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add first slot
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {availableDates.map((date) => (
            <Card key={date.id} className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="p-0">
                <div className="border-b border-border/60 bg-muted/20 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold leading-tight">
                        {format(new Date(date.date), "EEEE, MMM d, yyyy")}
                      </p>
                      {date.time ? (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {date.time}
                        </p>
                      ) : null}
                    </div>
                    {date.isAvailable !== false ? (
                      <AdminStatusBadge variant="neutral" label="Available" />
                    ) : (
                      <Badge variant="secondary">Assigned</Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2 px-4 py-3 text-xs text-muted-foreground">
                  {date.assignedTo ? <p className="text-foreground">Linked to approval workflow</p> : null}
                  {date.createdAt ? <p>Created {format(new Date(date.createdAt), "PP")}</p> : null}
                </div>
                <Separator />
                <div className="p-3">
                  <Button
                    onClick={() => setSlotToRemoveId(date.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove slot
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add pool slot</DialogTitle>
            <DialogDescription>
              Publish a date (and optional time) for assignment during demo access approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time (optional)</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddDate} disabled={!selectedDate || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add slot
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false)
                  setSelectedDate(undefined)
                  setTime("")
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={slotToRemoveId !== null}
        onOpenChange={(open) => !open && setSlotToRemoveId(null)}
        title="Remove this slot?"
        description="Deleting removes the calendar offer from the pool. Approved assignments may still reference it in history — only remove if you intend to stop offering this time."
        confirmLabel="Remove slot"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (!slotToRemoveId) return
          await handleDeleteDate(slotToRemoveId)
        }}
      />
    </AdminPageContainer>
  )
}
