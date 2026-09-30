"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  FileText,
  Eye,
  Users,
  Settings,
  AlertTriangle,
} from "lucide-react"
import { format } from "date-fns"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { loginWithCallback } from "@/lib/auth-urls"
import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"
import { canManageOwnDemonstrations } from "@/lib/user-roles"

export default function MyDemoRequestsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role && !canManageOwnDemonstrations(session.user.role)) {
      router.replace("/dashboard")
      return
    }
    if (status === "authenticated") {
      fetchRequests()
    } else if (status === "unauthenticated") {
      router.replace(loginWithCallback("/demo-access/my-requests"))
    }
  }, [status, router, session?.user?.role])

  const fetchRequests = async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const response = await fetch("/api/demo-access/my-requests", { cache: "no-store" })
      const data = await response.json()
      
      if (data.success) {
        setRequests(data.data || [])
      } else {
        throw new Error(data.error || "Failed to fetch requests")
      }
    } catch (error: any) {
      console.error("Error fetching requests:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load your demo access requests",
        variant: "destructive",
      })
      setLoadError(error.message || "Failed to load your demo access requests")
    } finally {
      setIsLoading(false)
    }
  }

  const getLifecycleStatus = (request: any): string => {
    const reqStatus = String(request.status ?? "").trim().toUpperCase()
    const demoIdRaw = request.demoId ?? request.demoid
    const hasDemo = demoIdRaw != null && String(demoIdRaw).trim() !== ""
    const rawDemoStatus = request.demoStatus ?? request.demostatus ?? request.linkedDemoStatus
    const demoStatus =
      rawDemoStatus != null && String(rawDemoStatus).trim() !== ""
        ? String(rawDemoStatus).trim().toUpperCase()
        : null

    if (reqStatus === "REJECTED") return "REJECTED"
    if (reqStatus === "PENDING") return "SUBMITTED"

    // Programming row (DemoClass) is the source of truth once it exists
    if (hasDemo && demoStatus) {
      if (demoStatus === "SCHEDULED" || demoStatus === "LIVE" || demoStatus === "COMPLETED") return demoStatus
      if (demoStatus === "SUBMITTED") return "SUBMITTED"
      if (demoStatus === "UNDER_REVIEW") return "UNDER_REVIEW"
      if (demoStatus === "APPROVED") return "APPROVED"
      if (demoStatus === "REJECTED") return "REJECTED"
      if (demoStatus === "PENDING") return "SUBMITTED"
      if (demoStatus === "DRAFT") return "AWAITING_FINAL_SETUP"
    }

    // Approved access but no linked DemoClass yet (or status not loaded): host must finish setup
    if (reqStatus === "APPROVED" && !hasDemo) return "AWAITING_FINAL_SETUP"
    // Linked row exists but status missing from API — avoid showing "Approved" for a draft
    if (reqStatus === "APPROVED" && hasDemo && !demoStatus) return "SUBMITTED"

    if (reqStatus === "APPROVED") return "APPROVED"
    return "SUBMITTED"
  }

  const getStatusBadge = (lifecycleStatus: string) => {
    switch (lifecycleStatus) {
      case "SUBMITTED":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="mr-1 h-3 w-3" />
            Submitted
          </Badge>
        )
      case "UNDER_REVIEW":
        return <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100">Under review</Badge>
      case "APPROVED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "AWAITING_FINAL_SETUP":
        return (
          <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Awaiting final setup
          </Badge>
        )
      case "SCHEDULED":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Scheduled</Badge>
      case "LIVE":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Live</Badge>
      case "COMPLETED":
        return <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-200">Completed</Badge>
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return <Badge>{lifecycleStatus}</Badge>
    }
  }

  const activeRequestsCount = requests.filter((r) => {
    const s = String(r.status || "").toUpperCase()
    return s === "PENDING" || s === "APPROVED"
  }).length
  const canCreateNew = activeRequestsCount < 2
  const requestsWithLifecycle = useMemo(
    () => requests.map((request) => ({ ...request, lifecycleStatus: getLifecycleStatus(request) })),
    [requests]
  )

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session || !session.user?.role || !canManageOwnDemonstrations(session.user.role)) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background py-10">
          <div className="container mx-auto">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/demo-access/my-requests">My Demo Requests</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Weekly demonstration dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Application-first flow: request, approval, setup, scheduling, live, completion.
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  asChild 
                  size="lg" 
                  className="gap-2 bg-primary hover:bg-primary/90 text-white"
                  disabled={!canCreateNew}
                >
                  <a href={WEEKLY_DEMO_APPLICATION_HREF}>
                    <Plus className="h-4 w-4" />
                    New application
                  </a>
                </Button>
              </div>
            </div>
            {!canCreateNew && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> You currently have {activeRequestsCount} active request(s). 
                  You can only have 2 active requests at a time. Please wait for your current requests to be processed before creating a new one.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="container py-8">
          {loadError ? (
            <Card className="mb-4 border-destructive/40">
              <CardContent className="py-5 text-sm">
                <p className="font-medium text-foreground">Could not load requests</p>
                <p className="mt-1 text-muted-foreground">{loadError}</p>
              </CardContent>
            </Card>
          ) : null}
          {requests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your first weekly demonstration application.
                </p>
                <Button 
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={!canCreateNew}
                >
                  <a href={WEEKLY_DEMO_APPLICATION_HREF}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create first application
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requestsWithLifecycle.map((request) => (
                <Card key={request.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{request.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {request.description.length > 200 
                            ? `${request.description.substring(0, 200)}...` 
                            : request.description}
                        </CardDescription>
                      </div>
                      <div className="ml-4">
                        {getStatusBadge(request.lifecycleStatus)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground mb-1">Requested</p>
                        <p className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {request.requestedAt 
                            ? format(new Date(request.requestedAt), "PPP 'at' p")
                            : "N/A"}
                        </p>
                      </div>
                      {request.preferredDate && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Preferred week/date</p>
                          <p className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(request.preferredDate), "PPP")}
                          </p>
                        </div>
                      )}
                      {request.assignedDate && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Assigned Date</p>
                          <p className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {format(new Date(request.assignedDate), "PPP")}
                          </p>
                        </div>
                      )}
                      {request.approvedAt && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Approved</p>
                          <p className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {format(new Date(request.approvedAt), "PPP 'at' p")}
                          </p>
                        </div>
                      )}
                      {request.rejectedAt && (
                        <div>
                          <p className="font-medium text-muted-foreground mb-1">Rejected</p>
                          <p className="flex items-center gap-1">
                            <XCircle className="h-3 w-3" />
                            {format(new Date(request.rejectedAt), "PPP 'at' p")}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                      {!request.demoId ? (
                        <>
                          <Button asChild variant="outline">
                            <a href="/demo-access/apply">View application</a>
                          </Button>
                          {request.lifecycleStatus === "AWAITING_FINAL_SETUP" ? (
                            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                              <a href="/featured-demonstration/new">Continue setup</a>
                            </Button>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <Button asChild variant="outline">
                            <a href={`/demonstrations/${request.demoId}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View demo
                            </a>
                          </Button>
                          <Button asChild variant="outline">
                            <a href={`/demonstrations/${request.demoId}/leads`}>
                              <Users className="mr-2 h-4 w-4" />
                              View leads
                            </a>
                          </Button>
                          <Button asChild variant="outline">
                            <a href={`/demonstrations/${request.demoId}/edit`}>
                              <Settings className="mr-2 h-4 w-4" />
                              Manage demo
                            </a>
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
