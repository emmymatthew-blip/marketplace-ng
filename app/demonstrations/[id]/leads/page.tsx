"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { BarChart3, CalendarClock, Download, Eye, Loader2, Star, Users } from "lucide-react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardPageContainer } from "@/components/dashboard/dashboard-page-container"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { loginWithCallback } from "@/lib/auth-urls"

type Lead = {
  id: string
  email: string
  name: string | null
  companyName: string | null
  phone: string | null
  message: string | null
  source: string | null
  createdAt: string
}

type Payload = {
  demo: {
    id: string
    title: string
    status: string
    isFeatured: boolean
    featuredWeekStart: string | null
  }
  metrics: {
    views: number
    registrations: number
    conversions: number
  }
  leads: Lead[]
}

export default function DemoLeadsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ id: string }>()
  const { toast } = useToast()
  const [payload, setPayload] = useState<Payload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated" && pathname) {
      router.replace(loginWithCallback(pathname))
    }
  }, [status, router, pathname])

  useEffect(() => {
    if (!params?.id || status !== "authenticated") return
    const run = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/demos/${params.id}/leads`, { cache: "no-store" })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load leads")
        setPayload(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load leads")
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [params?.id, status])

  const handleExportCsv = async () => {
    if (!params?.id) return
    try {
      setExporting(true)
      const res = await fetch(`/api/demos/${params.id}/leads/export`, { method: "GET", credentials: "include" })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || "Export failed")
      }
      const blob = await res.blob()
      const cd = res.headers.get("Content-Disposition")
      const match = cd?.match(/filename="([^"]+)"/)
      const filename = match?.[1] || `demo-leads-${params.id}.csv`
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      toast({ title: "Export ready", description: "CSV download started." })
    } catch (e) {
      toast({
        title: "Export failed",
        description: e instanceof Error ? e.message : "Could not export CSV.",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const conversionRate = useMemo(() => {
    const regs = payload?.metrics.registrations || 0
    const conv = payload?.metrics.conversions || 0
    if (!regs) return 0
    return Math.round((conv / regs) * 100)
  }, [payload])

  if (status === "loading" || loading) {
    return <div className="py-10 text-sm text-muted-foreground">Loading demo leads...</div>
  }

  if (status === "unauthenticated") {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Redirecting to sign in…
      </div>
    )
  }

  if (!session) return null

  if (error) {
    return <div className="py-10 text-sm text-destructive">{error}</div>
  }

  if (!payload) return null

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title={`Leads - ${payload.demo.title}`}
        description="Track registrations and basic demo performance in one operational view."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCsv} disabled={exporting}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export CSV
            </Button>
            <Badge variant="outline">{payload.demo.status}</Badge>
            {payload.demo.isFeatured && <Badge className="bg-amber-500 text-white"><Star className="mr-1 h-3 w-3" />Featured</Badge>}
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardDescription>Views</CardDescription><CardTitle className="text-2xl">{payload.metrics.views}</CardTitle></CardHeader><CardContent><Eye className="h-4 w-4 text-muted-foreground" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Registrations</CardDescription><CardTitle className="text-2xl">{payload.metrics.registrations}</CardTitle></CardHeader><CardContent><Users className="h-4 w-4 text-muted-foreground" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Conversions</CardDescription><CardTitle className="text-2xl">{payload.metrics.conversions}</CardTitle></CardHeader><CardContent><BarChart3 className="h-4 w-4 text-muted-foreground" /></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardDescription>Conversion Rate</CardDescription><CardTitle className="text-2xl">{conversionRate}%</CardTitle></CardHeader><CardContent><CalendarClock className="h-4 w-4 text-muted-foreground" /></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Captured Leads</CardTitle>
          <CardDescription>{payload.leads.length} registrations captured for this demonstration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {payload.leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No leads yet.</p>
          ) : (
            payload.leads.map((lead) => (
              <div key={lead.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{lead.name || "Unnamed lead"}</p>
                  <p className="text-xs text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground">{lead.email}{lead.companyName ? ` • ${lead.companyName}` : ""}</p>
                {lead.phone ? <p className="text-sm text-muted-foreground">{lead.phone}</p> : null}
                {lead.message ? <p className="mt-1 text-sm">{lead.message}</p> : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </DashboardPageContainer>
  )
}

