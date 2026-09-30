"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  AlertTriangle,
  FileText,
  RefreshCw,
  ShieldCheck,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"

import {
  AdminErrorState,
  AdminKpiCard,
  AdminPageContainer,
  AdminPageHeader,
  AdminSectionCard,
} from "@/components/admin/admin-page"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

type Stats = {
  totalUsers: number
  pendingVerifications: number
  pendingDemos: number
  disputedAgreements: number
  pendingDemoAccessRequests?: number
  pendingVerificationCenter?: number
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const res = await fetch("/api/admin/stats", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load metrics")
      setStats(data)
    } catch (e) {
      setLoadError(true)
      toast({
        title: "Unable to load metrics",
        description: e instanceof Error ? e.message : "Request failed",
        variant: "destructive",
      })
      setStats(null)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") load()
  }, [status, session?.user?.role, load])

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <Skeleton className="h-28 w-full max-w-2xl rounded-xl" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </AdminPageContainer>
    )
  }

  if (!session || session.user?.role !== "ADMIN") return null

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Platform analytics"
        description="Executive snapshot of queue depth and platform scale — sourced from live operational counts."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Overview" },
          { label: "Analytics" },
        ]}
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : loadError && !stats ? (
        <AdminErrorState
          title="Metrics unavailable"
          description="The stats service did not respond. Retry to load platform KPIs."
          onRetry={() => void load()}
        />
      ) : stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AdminKpiCard title="Registered users" value={stats.totalUsers} hint="All accounts" icon={Users} />
            <AdminKpiCard
              title="CIPPON queue"
              value={stats.pendingVerifications}
              hint="Membership pending"
              icon={ShieldCheck}
              variant={stats.pendingVerifications > 0 ? "warning" : "default"}
            />
            <AdminKpiCard
              title="Verification center"
              value={stats.pendingVerificationCenter ?? 0}
              hint="Document reviews"
              icon={TrendingUp}
              href="/admin/verifications"
              variant={(stats.pendingVerificationCenter ?? 0) > 0 ? "accent" : "default"}
            />
            <AdminKpiCard
              title="Demo applications"
              value={stats.pendingDemoAccessRequests ?? 0}
              hint="Featured access"
              icon={Star}
              href="/admin/demo-access"
              variant={(stats.pendingDemoAccessRequests ?? 0) > 0 ? "warning" : "default"}
            />
            <AdminKpiCard title="Pending demos" value={stats.pendingDemos} hint="Lifecycle review" icon={FileText} />
            <AdminKpiCard
              title="Open disputes"
              value={stats.disputedAgreements}
              hint="Agreements"
              icon={AlertTriangle}
              href="/admin/disputes"
              variant={stats.disputedAgreements > 0 ? "danger" : "default"}
            />
          </div>

          <AdminSectionCard
            title="Operational drill-down"
            description="Jump into the workflows that drive these numbers."
          >
            <div className="flex flex-wrap gap-2 p-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/dashboard">Operations center</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/featured-demos">Featured programming</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/verifications">Verification queue</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin/disputes">Disputes</Link>
              </Button>
            </div>
          </AdminSectionCard>
        </>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}
    </AdminPageContainer>
  )
}
