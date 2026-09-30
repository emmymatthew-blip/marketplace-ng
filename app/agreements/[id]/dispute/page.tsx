"use client"

import { use, useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { DisputeForm } from "@/components/agreements/dispute-form"
import { DisputeResponseForm } from "@/components/agreements/dispute-response-form"
import { DisputeGuidelines } from "@/components/agreements/dispute-guidelines"
import { DashboardPageContainer, DashboardHeader } from "@/components/dashboard"
import { ArrowLeft, Package, FileText, AlertTriangle, MessageSquare, CheckCircle2, ShieldAlert, Clock } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AgreementSummary {
  id: string
  title: string
  status: string
  createdAt: string
  updatedAt: string
  product?: { id: string; title: string } | null
  initiator: { name: string; companyName?: string }
  receiver: { name: string; companyName?: string }
  isInitiator: boolean
}

interface DisputeSummary {
  id: string
  title: string
  description: string
  status: string
  evidence: string[]
  proposedResolution: string | null
  resolutionNote: string | null
  raisedBy: string
  raisedAt: string
  initiatorConfirmedResolutionAt: string | null
  receiverConfirmedResolutionAt: string | null
  timeline: Array<{
    id: string
    type: string
    message: string | null
    evidence: string[]
    proposedResolution: string | null
    createdAt: string
    userName: string
  }>
  canRespond: boolean
  canConfirmResolution: boolean
  canEscalate: boolean
  agreementInitiatorId: string
  agreementReceiverId: string
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
  } catch {
    return iso
  }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
  } catch {
    return iso
  }
}

function getStatusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    DISPUTED: { label: "Disputed", className: "bg-amber-100 text-amber-800 border-amber-200" },
    UNDER_REVIEW: { label: "Under review", className: "bg-blue-100 text-blue-800 border-blue-200" },
    RESOLVED: { label: "Resolved", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    ESCALATED: { label: "Escalated", className: "bg-rose-100 text-rose-800 border-rose-200" },
    CLOSED: { label: "Closed", className: "bg-muted text-muted-foreground" },
  }
  const s = map[status] ?? { label: status, className: "bg-muted" }
  return <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.className}`}>{s.label}</span>
}

export default function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: session, status } = useSession()
  const router = useRouter()
  const [agreement, setAgreement] = useState<AgreementSummary | null>(null)
  const [dispute, setDispute] = useState<DisputeSummary | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [resolveNote, setResolveNote] = useState("")
  const [resolving, setResolving] = useState(false)
  const [escalating, setEscalating] = useState(false)
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false)

  const refreshDispute = useCallback(() => {
    if (agreement?.status !== "DISPUTED" && agreement?.status !== "RESOLVED") return
    fetch(`/api/agreements/${id}/dispute`)
      .then((res) => res.json())
      .then((data) => setDispute(data.dispute ?? null))
      .catch(() => setDispute(null))
  }, [id, agreement?.status])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/agreements/${id}/dispute`)}`)
      return
    }
    if (status !== "authenticated" || !session?.user?.id) return

    let cancelled = false
    fetch(`/api/agreements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load agreement")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setAgreement({
          id: data.id,
          title: data.title || "Agreement",
          status: data.status,
          createdAt: data.createdAt ?? "",
          updatedAt: data.updatedAt ?? "",
          product: data.product ?? null,
    initiator: {
            name: data.initiator?.name ?? "Unknown",
            companyName: data.initiator?.companyName,
    },
    receiver: {
            name: data.receiver?.name ?? "Unknown",
            companyName: data.receiver?.companyName,
          },
          isInitiator: data.isInitiator ?? false,
        })
        setError(null)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message ?? "Failed to load agreement")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id, status, session?.user?.id, router])

  useEffect(() => {
    if (!agreement || (agreement.status !== "DISPUTED" && agreement.status !== "RESOLVED")) {
      setDispute(agreement?.status === "DISPUTED" ? null : undefined)
      return
    }
    let cancelled = false
    fetch(`/api/agreements/${id}/dispute`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setDispute(data.dispute ?? null)
      })
      .catch(() => { if (!cancelled) setDispute(null) })
    return () => { cancelled = true }
  }, [id, agreement?.status])

  const handleResolve = async () => {
    if (resolving) return
    setResolving(true)
    try {
      const res = await fetch(`/api/agreements/${id}/dispute/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolutionNote: resolveNote || undefined }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error((data as { error?: string }).error ?? "Failed to confirm resolution")
      toast({ title: data.bothConfirmed ? "Dispute resolved" : "Confirmation recorded", description: data.bothConfirmed ? "Both parties have confirmed. The dispute is resolved." : "Your confirmation has been recorded." })
      refreshDispute()
      if (data.bothConfirmed) {
        setAgreement((a) => (a ? { ...a, status: "RESOLVED" } : null))
      }
      setResolveNote("")
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Something went wrong.", variant: "destructive" })
    } finally {
      setResolving(false)
    }
  }

  const handleEscalateClick = () => setEscalateDialogOpen(true)

  const handleEscalateConfirm = async () => {
    if (escalating) return
    setEscalating(true)
    setEscalateDialogOpen(false)
    try {
      const res = await fetch(`/api/agreements/${id}/dispute/escalate`, { method: "POST" })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? "Failed to escalate")
      }
      toast({ title: "Dispute escalated", description: "Platform administrators have been notified." })
      refreshDispute()
      setDispute((d) => (d ? { ...d, status: "ESCALATED" } : d))
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Something went wrong.", variant: "destructive" })
    } finally {
      setEscalating(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="File a dispute" description="Loading agreement…" />
        <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/20" />
      </DashboardPageContainer>
    )
  }

  if (!session) return null

  if (error || !agreement) {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="Dispute" description="Details" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error ?? "Agreement not found"}
        </div>
        <Button variant="outline" asChild className="mt-4">
          <Link href={`/agreements/${id}`}>Back to agreement</Link>
        </Button>
      </DashboardPageContainer>
    )
  }

  const otherParty = agreement.isInitiator ? agreement.receiver : agreement.initiator
  const canFileDispute = agreement.status === "ACTIVE"
  const alreadyDisputed = agreement.status === "DISPUTED" || agreement.status === "RESOLVED"

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title="Dispute"
        description={agreement.title}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Agreements", href: "/agreements" },
          { label: "Agreement", href: `/agreements/${id}` },
          { label: "Dispute" },
        ]}
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/agreements/${id}`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
              Back to agreement
            </Link>
          </Button>
        }
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Agreement summary
          </CardTitle>
          <CardDescription>Context for this dispute</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Title</p>
              <p className="font-medium">{agreement.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">{agreement.status.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(agreement.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Counterparty</p>
              <p className="font-medium">
                {otherParty.name}
                {otherParty.companyName ? ` (${otherParty.companyName})` : ""}
              </p>
            </div>
          </div>
          {agreement.product && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Related listing:</span>
              <Link href={`/marketplace/product/${agreement.product.id}`} className="text-sm font-medium text-primary hover:underline">
                {agreement.product.title}
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {alreadyDisputed && dispute !== undefined && (
        <>
          {dispute ? (
            <>
              <Card className="mb-6 border-l-4 border-l-amber-500">
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2">Dispute summary</CardTitle>
                    {getStatusBadge(dispute.status)}
                  </div>
                  <CardDescription>
                    Raised by {dispute.raisedBy} on {formatDate(dispute.raisedAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reason</p>
                    <p className="font-medium capitalize">{dispute.title.replace(/_/g, " ")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="whitespace-pre-wrap text-sm">{dispute.description}</p>
                  </div>
                  {dispute.proposedResolution && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Proposed resolution</p>
                      <p className="whitespace-pre-wrap text-sm">{dispute.proposedResolution}</p>
                    </div>
                  )}
                  {dispute.evidence && dispute.evidence.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Evidence</p>
                      <ul className="list-inside list-disc text-sm">
                        {dispute.evidence.map((url, i) => (
                          <li key={i}>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              Evidence {i + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {dispute.status === "RESOLVED" && dispute.resolutionNote && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm font-medium text-muted-foreground">Resolution note</p>
                      <p className="whitespace-pre-wrap text-sm">{dispute.resolutionNote}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {dispute.timeline.length > 0 && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Dispute timeline
                    </CardTitle>
                    <CardDescription>Responses and activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {dispute.timeline.map((item) => (
                        <li key={item.id} className="flex gap-3 border-l-2 border-border pl-4">
                          <div className="flex-1 space-y-1">
                            <p className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)} · {item.userName}</p>
                            {item.type === "PROPOSAL" && <p className="text-xs font-medium text-primary">Proposed resolution</p>}
                            {item.message && <p className="whitespace-pre-wrap text-sm">{item.message}</p>}
                            {item.proposedResolution && <p className="text-sm italic">{item.proposedResolution}</p>}
                            {item.evidence && item.evidence.length > 0 && (
                              <ul className="text-sm">
                                {item.evidence.map((url, i) => (
                                  <li key={i}>
                                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Evidence link</a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {["DISPUTED", "UNDER_REVIEW"].includes(dispute.status) && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      {dispute.canRespond ? "Submit a response" : "Resolution options"}
                    </CardTitle>
                    <CardDescription>
                      {dispute.canRespond
                        ? "Add your response, evidence, or proposed resolution. Both parties can work toward a resolution."
                        : "Confirm resolution or escalate to the platform."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {dispute.canRespond && (
                      <DisputeResponseForm agreementId={id} onSuccess={refreshDispute} />
                    )}
                    <div className="flex flex-wrap items-end gap-4 border-t pt-4">
                      {dispute.canConfirmResolution && (
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">Resolution note (optional)</label>
                          <Textarea
                            placeholder="Brief note on how the dispute was resolved"
                            value={resolveNote}
                            onChange={(e) => setResolveNote(e.target.value)}
                            className="min-h-[60px] max-w-md"
                          />
                          <Button onClick={handleResolve} disabled={resolving}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {resolving ? "Processing…" : "Resolve dispute (I confirm resolution)"}
                          </Button>
                        </div>
                      )}
                      {dispute.canEscalate && (
                        <>
                          <Button variant="outline" onClick={handleEscalateClick} disabled={escalating}>
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            {escalating ? "Escalating…" : "Escalate to platform"}
                          </Button>
                          <AlertDialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Escalate to platform?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will notify platform administrators. They may contact both parties to help resolve the dispute. You can still continue to communicate with the other party in the meantime.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handleEscalateConfirm()
                                  }}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Escalate
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {dispute.status === "ESCALATED" && (
                <Card className="mb-6 border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20">
                  <CardContent className="flex items-start gap-3 pt-6">
                    <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">This dispute has been escalated to the platform.</p>
                      <p className="text-sm text-muted-foreground mt-1">Administrators have been notified and may contact you.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : alreadyDisputed && dispute === null && (
            <Card className="mb-6 border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
              <CardContent className="flex items-start gap-3 pt-6">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">A dispute has been filed for this agreement.</p>
                  <p className="text-sm text-muted-foreground mt-1">Dispute details are loading or the record could not be found.</p>
                  <Button variant="outline" size="sm" asChild className="mt-3">
                    <Link href={`/agreements/${id}`}>View agreement</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {canFileDispute && (
            <Card>
              <CardHeader>
                <CardTitle>File a dispute</CardTitle>
                <CardDescription>
                  Provide the reason, description, evidence, and proposed resolution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DisputeForm agreementId={id} />
              </CardContent>
            </Card>
          )}
              </div>
              <div>
                <DisputeGuidelines />
              </div>
            </div>
    </DashboardPageContainer>
    )
}
