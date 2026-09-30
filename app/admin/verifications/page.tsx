"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  AdminEmptyState,
  AdminErrorState,
  AdminPageContainer,
  AdminPageHeader,
  AdminReviewList,
  AdminStatusBadge,
  AdminToolbar,
} from "@/components/admin/admin-page"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2,
  ExternalLink,
  FileText,
  Building2,
  User,
} from "lucide-react"
interface VerificationItem {
  id: string
  userId: string
  verificationType: string
  documentUrl?: string
  documentType?: string
  status: string
  submittedAt: string
  notes?: string
  metadata?: { cacNumber?: string; cipponId?: string; companyWebsite?: string; corporateEmail?: string }
  userName: string
  userEmail: string
  userCompanyName?: string
  userImage?: string
}

const listColumns = [
  { label: "Submitted", className: "lg:col-span-2" },
  { label: "Subject & company", className: "lg:col-span-3" },
  { label: "Type & status", className: "lg:col-span-2" },
  { label: "Evidence & notes", className: "lg:col-span-3" },
  { label: "Actions", className: "lg:col-span-2 text-right" },
]

export default function AdminVerificationsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState<VerificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [loadError, setLoadError] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    setLoadError(false)
    try {
      const res = await fetch("/api/admin/verifications")
      const data = await res.json()
      if (!res.ok) throw new Error(typeof data?.error === "string" ? data.error : "Failed to load verifications")
      setRequests(Array.isArray(data) ? data : [])
    } catch {
      setLoadError(true)
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && (session?.user as { role?: string })?.role === "ADMIN") {
      fetchRequests()
    }
  }, [status, session?.user])

  const handleReview = async (verificationId: string, action: "APPROVED" | "REJECTED" | "REQUEST_INFO") => {
    setActionId(verificationId)
    try {
      const res = await fetch("/api/admin/verifications/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId, action, notes: notes[verificationId] || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? "Failed")
      toast({
        title: action === "APPROVED" ? "Approved" : action === "REJECTED" ? "Rejected" : "Request sent",
        description: `Verification ${action.toLowerCase().replace("_", " ")}.`,
      })
      setRequests((prev) => prev.filter((r) => r.id !== verificationId))
      setNotes((prev) => ({ ...prev, [verificationId]: "" }))
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Action failed",
        variant: "destructive",
      })
    } finally {
      setActionId(null)
    }
  }

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <div className="space-y-6">
          <Skeleton className="h-24 w-full max-w-2xl rounded-xl" />
          <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </AdminPageContainer>
    )
  }

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") return null

  const filtered = searchQuery.trim()
    ? requests.filter(
        (r) =>
          r.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.verificationType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.userCompanyName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : requests

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Verification center"
        description="Trust and compliance review for identity, business, and enterprise submissions. Approve, reject, or request more information with a clear audit trail."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Verifications" },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden rounded-md border border-border/80 bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground sm:inline">
              {filtered.length} pending
            </span>
            <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
              Refresh
            </Button>
          </div>
        }
      />

      <AdminToolbar>
        <div className="relative min-w-0 flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, email, company, or verification type…"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground lg:ml-auto">{filtered.length} in view</p>
      </AdminToolbar>

      {loadError && !loading ? (
        <AdminErrorState
          title="Could not load verifications"
          description="The verification queue could not be fetched. Retry or check your connection."
          onRetry={() => void fetchRequests()}
        />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <AdminEmptyState
          title={searchQuery ? "No matching requests" : "Queue is empty"}
          description={
            searchQuery
              ? "Try a different search term or clear the filter."
              : "New verification submissions will appear here for review."
          }
        />
      ) : (
        <AdminReviewList columns={listColumns}>
          {filtered.map((req) => (
            <div
              key={req.id}
              className="grid gap-4 p-4 transition-colors hover:bg-muted/20 lg:grid-cols-12 lg:items-start"
            >
              <div className="space-y-1 lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Submitted</p>
                <p className="text-sm font-medium text-foreground">
                  {req.submittedAt ? new Date(req.submittedAt).toLocaleString() : "—"}
                </p>
                <p className="text-xs text-muted-foreground">ID · {req.id.slice(0, 8)}…</p>
              </div>

              <div className="space-y-1 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Subject</p>
                <div className="flex items-start gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/30">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{req.userName ?? "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{req.userEmail}</p>
                    {req.userCompanyName ? (
                      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3 shrink-0" />
                        {req.userCompanyName}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:col-span-2 lg:flex-col lg:items-start">
                <p className="w-full text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Type</p>
                <AdminStatusBadge variant="verification" label={req.verificationType} />
                <AdminStatusBadge variant="pending" label={req.status || "PENDING"} />
              </div>

              <div className="space-y-2 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Evidence</p>
                {req.metadata && Object.keys(req.metadata).length > 0 ? (
                  <div className="rounded-lg border border-border/60 bg-muted/20 p-2 text-xs leading-relaxed">
                    {req.metadata.cacNumber && <p>CAC: {req.metadata.cacNumber}</p>}
                    {req.metadata.cipponId && <p>CIPPON: {req.metadata.cipponId}</p>}
                    {req.metadata.companyWebsite && <p>Web: {req.metadata.companyWebsite}</p>}
                    {req.metadata.corporateEmail && <p>Corporate email: {req.metadata.corporateEmail}</p>}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No structured metadata</p>
                )}
                {req.documentUrl ? (
                  <Button variant="outline" size="sm" className="h-8 gap-1.5" asChild>
                    <a href={req.documentUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-3.5 w-3.5" />
                      Open document
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </Button>
                ) : null}
                {req.documentType ? (
                  <p className="text-[11px] text-muted-foreground">Doc type: {req.documentType}</p>
                ) : null}
                <label className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  Reviewer notes
                </label>
                <Textarea
                  placeholder="Optional — visible on reject or request info…"
                  className="min-h-[64px] text-sm"
                  value={notes[req.id] ?? ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [req.id]: e.target.value }))}
                />
              </div>

              <div className="flex flex-wrap gap-2 lg:col-span-2 lg:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1"
                  disabled={actionId === req.id}
                  onClick={() => handleReview(req.id, "REQUEST_INFO")}
                >
                  {actionId === req.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                  Request info
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  disabled={actionId === req.id}
                  onClick={() => handleReview(req.id, "REJECTED")}
                >
                  {actionId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                  Reject
                </Button>
                <Button
                  size="sm"
                  className="gap-1"
                  disabled={actionId === req.id}
                  onClick={() => handleReview(req.id, "APPROVED")}
                >
                  {actionId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </AdminReviewList>
      )}

      <Card className="border-dashed border-border/80 bg-muted/10">
        <CardContent className="flex flex-col gap-2 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Need printer membership (CIPPON) checks? Use the operations dashboard tab.</span>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard">Open operations center</Link>
          </Button>
        </CardContent>
      </Card>
    </AdminPageContainer>
  )
}
