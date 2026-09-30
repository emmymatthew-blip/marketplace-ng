"use client"

import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { AlertTriangle, ExternalLink, Loader2, RefreshCw, Scale } from "lucide-react"

import {
  AdminEmptyState,
  AdminErrorState,
  AdminPageContainer,
  AdminPageHeader,
  AdminReviewList,
  AdminToolbar,
} from "@/components/admin/admin-page"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

type DisputeRow = {
  id: string
  title: string
  initiator: { id: string; name: string }
  receiver: { id: string; name: string }
  disputedAt: string
  reason: string
}

const columns = [
  { label: "Agreement", className: "lg:col-span-4" },
  { label: "Parties", className: "lg:col-span-3" },
  { label: "Summary", className: "lg:col-span-3" },
  { label: "Actions", className: "lg:col-span-2 lg:text-right" },
]

export default function AdminDisputesPage() {
  const { data: session, status } = useSession()
  const [rows, setRows] = useState<DisputeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const res = await fetch("/api/admin/disputed-agreements", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load")
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setLoadError(true)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") load()
  }, [status, session?.user?.role, load])

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <Skeleton className="h-28 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </AdminPageContainer>
    )
  }

  if (!session || session.user?.role !== "ADMIN") return null

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Disputes queue"
        description="Open agreement conflicts requiring review, mediation, or escalation. Use agreement and dispute detail views for full history."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Agreements & disputes" },
          { label: "Disputes" },
        ]}
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="rounded-lg border border-destructive/20 bg-destructive/[0.04] px-4 py-3 text-sm">
        <p className="flex items-center gap-2 font-medium text-destructive">
          <Scale className="h-4 w-4 shrink-0" />
          Risk & compliance
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Disputes may involve commercial terms, delivery, or trust issues. Document outcomes in the agreement dispute flow
          before closing items on the platform side.
        </p>
      </div>

      <AdminToolbar>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{rows.length}</span> open dispute{rows.length === 1 ? "" : "s"}
        </p>
      </AdminToolbar>

      {loadError && !loading ? (
        <AdminErrorState
          title="Could not load disputes"
          description="The disputes queue could not be fetched. Check your connection and try again."
          onRetry={() => void load()}
        />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <AdminEmptyState
          title="No active disputes"
          description="When agreements move to disputed status, they will appear here with party context."
          action={{ label: "Browse agreements hub", href: "/agreements" }}
        />
      ) : (
        <AdminReviewList columns={columns}>
          {rows.map((row) => (
            <div
              key={row.id}
              className="grid gap-4 p-4 transition-colors hover:bg-muted/20 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Agreement</p>
                <p className="font-medium leading-snug text-foreground">{row.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">Updated {row.disputedAt}</p>
                <Badge variant="destructive" className="mt-2">
                  Disputed
                </Badge>
              </div>
              <div className="lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Parties</p>
                <p className="text-sm">
                  <span className="font-medium">{row.initiator?.name}</span>
                  <span className="text-muted-foreground"> vs </span>
                  <span className="font-medium">{row.receiver?.name}</span>
                </p>
              </div>
              <div className="lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Summary</p>
                <p className="line-clamp-3 text-sm text-muted-foreground">{row.reason}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:col-span-2 lg:justify-end">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/agreements/${row.id}`}>
                    Agreement
                    <ExternalLink className="ml-1 h-3 w-3 opacity-60" />
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/agreements/${row.id}/dispute`}>
                    Dispute workspace
                    <AlertTriangle className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </AdminReviewList>
      )}
    </AdminPageContainer>
  )
}
