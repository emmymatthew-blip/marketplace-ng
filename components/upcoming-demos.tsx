"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar, ArrowRight } from "lucide-react"
import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"

type ApiDemo = {
  id: string
  title: string
  schedule: string
  category?: string
  manufacturer?: { name?: string | null; companyName?: string | null }
}

/**
 * Curated weekly programme: upcoming approved demonstrations from GET /api/demos (not on-demand library content).
 */
export function UpcomingDemos() {
  const [demos, setDemos] = useState<ApiDemo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/demos", { cache: "no-store" })
        const data = await res.json().catch(() => [])
        if (!cancelled && Array.isArray(data)) {
          setDemos(data.slice(0, 3))
        }
      } catch {
        if (!cancelled) setDemos([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl bg-slate-800/80" />
        ))}
      </div>
    )
  }

  if (!demos.length) {
    return (
      <Card className="border-white/10 bg-slate-800/50">
        <CardHeader>
          <CardTitle className="text-white">Upcoming weekly demonstrations</CardTitle>
          <CardDescription className="text-white/70">
            No approved sessions in the public pipeline yet. Browse the full programme or apply to host a weekly slot.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/demonstrations">Weekly programme</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Link href={WEEKLY_DEMO_APPLICATION_HREF}>Apply to host</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {demos.map((d) => {
        const when = d.schedule ? new Date(d.schedule) : null
        const host = d.manufacturer?.companyName || d.manufacturer?.name || "Host"
        return (
          <Card key={d.id} className="border-white/10 bg-slate-800/50 transition-colors hover:bg-slate-800/70">
            <CardHeader className="pb-2">
              <CardTitle className="line-clamp-2 text-lg text-white">{d.title}</CardTitle>
              <CardDescription className="text-white/70">{host}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Calendar className="h-4 w-4 shrink-0 text-brand-light-blue" />
                {when && !Number.isNaN(when.getTime()) ? format(when, "MMM d, yyyy · h:mm a") : "—"}
              </div>
              {d.category ? (
                <p className="text-xs uppercase tracking-wide text-white/50">{d.category}</p>
              ) : null}
              <Button asChild size="sm" className="w-full bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary text-white">
                <Link href={`/demonstrations/${d.id}`}>
                  View session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
