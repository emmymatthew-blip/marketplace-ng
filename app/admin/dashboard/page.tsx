"use client"

import { useSession } from "next-auth/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AdminDashboardSkeleton,
  AdminEmptyState,
  AdminErrorState,
  AdminKpiCard,
  AdminPageContainer,
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
} from "@/components/admin/admin-page"
import { AdminConfirmDialog } from "@/components/admin/admin-confirm"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Star,
  Tag,
  Users,
  XCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

function mondayOfWeek(d: Date): string {
  const x = new Date(d)
  const day = x.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  x.setDate(x.getDate() + diff)
  x.setHours(0, 0, 0, 0)
  return x.toISOString().slice(0, 10)
}

type WeeklySlot = { id: string; title: string; featuredWeekStart: string; status: string }

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    pendingDemos: 0,
    pendingDemoAccessRequests: 0,
    pendingVerificationCenter: 0,
    disputedAgreements: 0,
  })
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [pendingDemos, setPendingDemos] = useState<any[]>([])
  const [pendingDemoAccess, setPendingDemoAccess] = useState<any[]>([])
  const [disputedAgreements, setDisputedAgreements] = useState<any[]>([])
  const [weeklySlots, setWeeklySlots] = useState<WeeklySlot[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [pendingReject, setPendingReject] = useState<
    null | { kind: "user"; userId: string; cipponId: string | null } | { kind: "demo"; demoId: string; title?: string }
  >(null)

  const thisWeekKey = useMemo(() => mondayOfWeek(new Date()), [])

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setLoadError(false)
      const [statsRes, verificationsRes, demosRes, demoAccessRes, disputesRes, weeklyRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/pending-verifications"),
        fetch("/api/admin/pending-demos"),
        fetch("/api/admin/demo-access"),
        fetch("/api/admin/disputed-agreements"),
        fetch("/api/admin/demos/weekly?weeks=12", { cache: "no-store" }),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats({
          totalUsers: statsData.totalUsers ?? 0,
          pendingVerifications: statsData.pendingVerifications ?? 0,
          pendingDemos: statsData.pendingDemos ?? 0,
          pendingDemoAccessRequests: statsData.pendingDemoAccessRequests ?? 0,
          pendingVerificationCenter: statsData.pendingVerificationCenter ?? 0,
          disputedAgreements: statsData.disputedAgreements ?? 0,
        })
      }

      if (verificationsRes.ok) {
        setPendingVerifications(await verificationsRes.json())
      }

      if (demosRes.ok) {
        setPendingDemos(await demosRes.json())
      }

      if (demoAccessRes.ok) {
        const demoAccessData = await demoAccessRes.json()
        if (demoAccessData.success) {
          const pendingRequests = (demoAccessData.data || []).filter((req: any) => req.status === "PENDING")
          setPendingDemoAccess(pendingRequests)
        }
      }

      if (disputesRes.ok) {
        setDisputedAgreements(await disputesRes.json())
      }

      if (weeklyRes.ok) {
        const w = await weeklyRes.json()
        const occ: WeeklySlot[] = (w.occupiedWeeks || []).map((s: any) => ({
          id: s.id,
          title: s.title,
          featuredWeekStart: s.featuredWeekStart?.slice?.(0, 10) || s.featuredWeekStart,
          status: s.status,
        }))
        setWeeklySlots(occ)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoadError(true)
      toast({
        title: "Unable to load dashboard",
        description: "Check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchDashboardData()
    }
  }, [status, session?.user?.role, fetchDashboardData])

  const thisWeekFeatured = weeklySlots.filter((s) => s.featuredWeekStart === thisWeekKey)
  const upcomingFeatured = weeklySlots.filter((s) => s.featuredWeekStart > thisWeekKey).slice(0, 5)

  /** Lightweight “what needs eyes” feed from existing queue payloads (no extra API). */
  const activityPulse = useMemo(() => {
    type Pulse = { id: string; title: string; meta: string; href: string; tone: "warning" | "danger" | "default" }
    const items: Pulse[] = []
    pendingDemoAccess.slice(0, 2).forEach((r: any) => {
      items.push({
        id: `da-${r.id}`,
        title: r.title || "Demo application",
        meta: [r.name, r.companyName].filter(Boolean).join(" · ") || r.email || "Applicant",
        href: "/admin/demo-access",
        tone: "warning",
      })
    })
    pendingVerifications.slice(0, 2).forEach((u: any) => {
      items.push({
        id: `cv-${u.id}`,
        title: "CIPPON membership review",
        meta: u.name || u.email,
        href: "/admin/dashboard",
        tone: "default",
      })
    })
    disputedAgreements.slice(0, 2).forEach((a: any) => {
      items.push({
        id: `dp-${a.id}`,
        title: a.title?.slice(0, 60) || "Disputed agreement",
        meta: `${a.initiator?.name ?? "?"} ↔ ${a.receiver?.name ?? "?"}`,
        href: `/agreements/${a.id}`,
        tone: "danger",
      })
    })
    pendingDemos.slice(0, 1).forEach((d: any) => {
      items.push({
        id: `dm-${d.id}`,
        title: d.title || "Demonstration",
        meta: `Host: ${d.manufacturer?.name ?? "—"}`,
        href: "/admin/dashboard",
        tone: "default",
      })
    })
    return items.slice(0, 6)
  }, [pendingDemoAccess, pendingVerifications, disputedAgreements, pendingDemos])

  const handleVerifyUser = async (userId: string, cipponId: string | null) => {
    try {
      setActionLoading(`verify-${userId}`)
      const response = await fetch("/api/admin/verify-printer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cipponId: cipponId || "",
          isVerified: true,
        }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "User verified successfully" })
        fetchDashboardData()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to verify user")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify user",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectUser = async (userId: string, cipponId: string | null) => {
    try {
      setActionLoading(`reject-${userId}`)
      const response = await fetch("/api/admin/verify-printer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cipponId: cipponId || "",
          isVerified: false,
        }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "User verification rejected" })
        fetchDashboardData()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to reject user")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject user",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleApproveDemo = async (demoId: string) => {
    try {
      setActionLoading(`approve-${demoId}`)
      const response = await fetch("/api/admin/approve-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoId, status: "APPROVED" }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Demonstration approved successfully" })
        fetchDashboardData()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to approve demonstration")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve demonstration",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectDemo = async (demoId: string) => {
    try {
      setActionLoading(`reject-${demoId}`)
      const response = await fetch("/api/admin/approve-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoId, status: "REJECTED" }),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Demonstration rejected" })
        fetchDashboardData()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to reject demonstration")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject demonstration",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  if (loading) {
    return (
      <AdminPageContainer>
        <AdminDashboardSkeleton />
      </AdminPageContainer>
    )
  }

  if (loadError) {
    return (
      <AdminPageContainer>
        <AdminPageHeader
          title="Operations center"
          description="Platform health, queues, and curated demonstrations."
          breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Overview" }]}
        />
        <AdminErrorState
          title="Could not load dashboard"
          description="One or more data sources failed. Retry to refresh operations data."
          onRetry={() => void fetchDashboardData()}
        />
      </AdminPageContainer>
    )
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Operations center"
        description="Platform health, queues, and curated demonstrations — prioritize what needs attention next."
        breadcrumbs={[{ label: "Admin", href: "/admin/dashboard" }, { label: "Overview" }]}
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={() => fetchDashboardData()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <AdminKpiCard title="Total users" value={stats.totalUsers} hint="Registered accounts" icon={Users} />
        <AdminKpiCard
          title="CIPPON queue"
          value={stats.pendingVerifications}
          hint="Membership verification"
          icon={ShieldCheck}
          variant={stats.pendingVerifications > 0 ? "warning" : "default"}
        />
        <AdminKpiCard
          title="Verification center"
          value={stats.pendingVerificationCenter}
          hint="ID & business reviews"
          icon={CheckCircle}
          href="/admin/verifications"
          variant={stats.pendingVerificationCenter > 0 ? "accent" : "default"}
        />
        <AdminKpiCard
          title="Demo applications"
          value={stats.pendingDemoAccessRequests || pendingDemoAccess.length}
          hint="Featured demo access"
          icon={Star}
          href="/admin/demo-access"
          variant={(stats.pendingDemoAccessRequests || pendingDemoAccess.length) > 0 ? "warning" : "default"}
        />
        <AdminKpiCard
          title="Demos to approve"
          value={stats.pendingDemos}
          hint="Lifecycle PENDING"
          icon={FileText}
        />
        <AdminKpiCard
          title="Open disputes"
          value={stats.disputedAgreements}
          hint="Agreement conflicts"
          icon={AlertTriangle}
          href="/agreements"
          variant={stats.disputedAgreements > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSectionCard
          title="Featured week snapshot"
          description={`Week of ${new Date(thisWeekKey).toLocaleDateString(undefined, { dateStyle: "medium" })}`}
          headerAction={
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/featured-demos">Manage schedule</Link>
            </Button>
          }
        >
          <div className="space-y-3 p-4">
            {thisWeekFeatured.length === 0 ? (
              <p className="text-sm text-muted-foreground">No demonstration assigned to this week yet.</p>
            ) : (
              <ul className="space-y-2">
                {thisWeekFeatured.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-sm">
                    <span className="min-w-0 font-medium">{s.title}</span>
                    <AdminStatusBadge variant="lifecycle" label={s.status} />
                  </li>
                ))}
              </ul>
            )}
            {upcomingFeatured.length > 0 && (
              <div className="border-t border-border/60 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Upcoming slots</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {upcomingFeatured.map((s) => (
                    <li key={`${s.id}-${s.featuredWeekStart}`}>
                      {new Date(s.featuredWeekStart).toLocaleDateString()} — {s.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </AdminSectionCard>

        <AdminSectionCard
          title="Trust & risk"
          description="Verification backlog and dispute exposure"
          headerAction={
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/verifications">Open queue</Link>
            </Button>
          }
        >
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Verification center</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{stats.pendingVerificationCenter}</p>
              <p className="mt-1 text-xs text-muted-foreground">Structured document reviews</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">CIPPON pending</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{stats.pendingVerifications}</p>
              <p className="mt-1 text-xs text-muted-foreground">Printer membership checks</p>
            </div>
            <div className="rounded-xl border border-destructive/15 bg-destructive/[0.03] p-4 sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-destructive/90">Active disputes</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-destructive">{stats.disputedAgreements}</p>
              <Button asChild variant="link" className="mt-2 h-auto p-0 text-sm">
                <Link href="/agreements">Review agreements hub →</Link>
              </Button>
            </div>
          </div>
        </AdminSectionCard>
      </div>

      <AdminSectionCard
        title="Activity pulse"
        description="Recent items across queues that typically need operator attention."
        headerAction={
          <Button asChild variant="ghost" size="sm" className="gap-1 text-muted-foreground">
            <Link href="/admin/verifications">
              Verification center <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      >
        {activityPulse.length === 0 ? (
          <div className="p-6">
            <AdminEmptyState
              title="Queues are clear"
              description="No pending demos, CIPPON reviews, or disputes in the current snapshot."
            />
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {activityPulse.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40 sm:items-center sm:gap-4"
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-background sm:mt-0",
                      item.tone === "danger" && "border-destructive/25 bg-destructive/[0.06]",
                      item.tone === "warning" && "border-amber-200/80 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20"
                    )}
                  >
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.meta}</p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AdminSectionCard>

      <AdminSectionCard
        title="Action queues"
        description="Weekly demonstration applications, CIPPON checks, demo lifecycle, and disputes"
        headerAction={
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/demo-access">All applications</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/featured-demos">Featured ops</Link>
            </Button>
          </div>
        }
      >
        <Tabs defaultValue="demo-access" className="w-full">
          <div className="border-b border-border/60 px-4 pt-2">
            <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
              <TabsTrigger value="demo-access" className="rounded-lg data-[state=active]:bg-primary/10">
                Demo applications
              </TabsTrigger>
              <TabsTrigger value="verifications" className="rounded-lg data-[state=active]:bg-primary/10">
                CIPPON verifications
              </TabsTrigger>
              <TabsTrigger value="demos" className="rounded-lg data-[state=active]:bg-primary/10">
                Pending demos
              </TabsTrigger>
              <TabsTrigger value="disputes" className="rounded-lg data-[state=active]:bg-primary/10">
                Disputes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="demo-access" className="m-0 p-4">
            {pendingDemoAccess.length === 0 ? (
              <AdminEmptyState
                title="No pending demo applications"
                description="New featured demonstration requests will appear here."
                action={{ label: "View all statuses", href: "/admin/demo-access" }}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-muted-foreground">
                    {pendingDemoAccess.length} pending request{pendingDemoAccess.length !== 1 ? "s" : ""}
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/admin/demo-access">Open queue</Link>
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {pendingDemoAccess.slice(0, 6).map((request) => (
                    <Card key={request.id} className="border-border/80 shadow-sm">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base">{request.name || "Unknown user"}</CardTitle>
                          <Badge className="shrink-0 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        </div>
                        <CardDescription>
                          {request.email} {request.companyName && `• ${request.companyName}`}
                        </CardDescription>
                        {request.title && (
                          <p className="mt-2 text-sm font-medium text-foreground">{request.title}</p>
                        )}
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        {request.requestedAt && (
                          <p>Requested {new Date(request.requestedAt).toLocaleDateString()}</p>
                        )}
                      </CardContent>
                      <CardFooter className="justify-end border-t border-border/60 bg-muted/10">
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/admin/demo-access">Review</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="verifications" className="m-0 p-4">
            {pendingVerifications.length === 0 ? (
              <AdminEmptyState title="No pending CIPPON verifications" description="All membership checks are clear." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pendingVerifications.map((user) => (
                  <Card key={user.id} className="border-border/80 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between gap-2">
                        <CardTitle className="text-base">{user.name}</CardTitle>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                      <CardDescription>{user.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-medium">
                        CIPPON ID: {user.cipponMembershipNumber || user.cipponLicenseNumber || "N/A"}
                      </p>
                      <p className="text-muted-foreground">Submitted {new Date(user.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t border-border/60 bg-muted/10">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setPendingReject({
                            kind: "user",
                            userId: user.id,
                            cipponId: user.cipponMembershipNumber || user.cipponLicenseNumber,
                          })
                        }
                        disabled={actionLoading === `reject-${user.id}`}
                      >
                        {actionLoading === `reject-${user.id}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyUser(user.id, user.cipponMembershipNumber || user.cipponLicenseNumber)}
                        disabled={actionLoading === `verify-${user.id}`}
                      >
                        {actionLoading === `verify-${user.id}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Verify
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="demos" className="m-0 p-4">
            {pendingDemos.length === 0 ? (
              <AdminEmptyState title="No pending demonstrations" description="Submitted demos awaiting approval will show here." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pendingDemos.map((demo) => (
                  <Card key={demo.id} className="border-border/80 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between gap-2">
                        <CardTitle className="text-base">{demo.title}</CardTitle>
                        <Badge variant="outline">₦{demo.price}</Badge>
                      </div>
                      <CardDescription>Host: {demo.manufacturer?.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-medium">Scheduled: {demo.schedule}</p>
                      <p className="text-muted-foreground">Submitted {demo.submittedAt}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t border-border/60 bg-muted/10">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setPendingReject({ kind: "demo", demoId: demo.id, title: demo.title })}
                        disabled={actionLoading === `reject-${demo.id}`}
                      >
                        {actionLoading === `reject-${demo.id}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="mr-2 h-4 w-4" />
                        )}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApproveDemo(demo.id)}
                        disabled={actionLoading === `approve-${demo.id}`}
                      >
                        {actionLoading === `approve-${demo.id}` ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Approve
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="disputes" className="m-0 p-4">
            {disputedAgreements.length === 0 ? (
              <AdminEmptyState title="No active disputes" description="Disputed agreements will surface here with context." />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {disputedAgreements.map((agreement) => (
                  <Card key={agreement.id} className="border-destructive/20 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between gap-2">
                        <CardTitle className="text-base line-clamp-2">{agreement.title}</CardTitle>
                        <Badge variant="destructive">Disputed</Badge>
                      </div>
                      <CardDescription>
                        {agreement.initiator?.name} ↔ {agreement.receiver?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="line-clamp-3">{agreement.reason}</p>
                      <p className="mt-2">Updated {agreement.disputedAt}</p>
                    </CardContent>
                    <CardFooter className="justify-end gap-2 border-t border-border/60 bg-muted/10">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/agreements/${agreement.id}`}>Open agreement</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/agreements/${agreement.id}/dispute`}>Dispute detail</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </AdminSectionCard>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Button asChild variant="outline" className="h-auto justify-start gap-2 py-4">
          <Link href="/admin/categories">
            <Tag className="h-4 w-4 shrink-0" />
            Categories
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start gap-2 py-4">
          <Link href="/admin/migrations">
            <Database className="h-4 w-4 shrink-0" />
            Migrations
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start gap-2 py-4">
          <Link href="/admin/demo-access/dates">
            <Clock className="h-4 w-4 shrink-0" />
            Demo dates
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start gap-2 py-4">
          <Link href="/dashboard">
            <Users className="h-4 w-4 shrink-0" />
            User dashboard
          </Link>
        </Button>
      </div>

      <AdminConfirmDialog
        open={pendingReject !== null}
        onOpenChange={(open) => !open && setPendingReject(null)}
        title={
          pendingReject?.kind === "demo"
            ? "Reject this demonstration?"
            : "Reject CIPPON verification?"
        }
        description={
          pendingReject?.kind === "demo"
            ? `“${pendingReject.title || "This demo"}” will be marked rejected and removed from the approval queue.`
            : "The member will not be verified as a CIPPON printer. They can resubmit if your process allows."
        }
        confirmLabel={pendingReject?.kind === "demo" ? "Reject demonstration" : "Reject verification"}
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (!pendingReject) return
          if (pendingReject.kind === "user") {
            await handleRejectUser(pendingReject.userId, pendingReject.cipponId)
          } else {
            await handleRejectDemo(pendingReject.demoId)
          }
        }}
      />
    </AdminPageContainer>
  )
}
