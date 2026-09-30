"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgreementDetail } from "@/components/agreements/agreement-detail"
import { AgreementStatusTimeline, type TimelineEvent } from "@/components/agreements/agreement-status-timeline"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Package, MessageSquare, FileText, ExternalLink } from "lucide-react"
import { DashboardPageContainer, DashboardHeader } from "@/components/dashboard"

type AgreementStatus =
  | "PROPOSED"
  | "MODIFICATION_REQUESTED"
  | "ACTIVE"
  | "COMPLETED"
  | "DISPUTED"
  | "RESOLVED"
  | "DECLINED"
  | "CANCELLED"

interface Agreement {
  id: string
  title: string
  status: AgreementStatus
  currentVersion?: number
  initiator: {
    id: string
    name: string
    image: string
    role: string
    isVerified: boolean
    companyName?: string
  }
  receiver: {
    id: string
    name: string
    image: string
    role: string
    isVerified: boolean
    companyName: string
  }
  terms: string
  notes: string
  startDate?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  isInitiator: boolean
  product?: { id: string; title: string; images?: string[] } | null
  messageContactId?: string | null
  inquiryId?: string | null
  sourceType?: string | null
  agreementValue?: string | null
}

interface AgreementDetailPageClientProps {
  id: string
}

function mapApiToAgreement(api: Record<string, unknown>, currentUserId: string): Agreement {
  const initiator = (api.initiator ?? {}) as Record<string, unknown>
  const receiver = (api.receiver ?? {}) as Record<string, unknown>
  const product = api.product as { id: string; title: string; images?: string[] } | null | undefined
  const terms = (api.terms as string) ?? ""
  const title =
    (api.title as string) ||
    (terms.length > 50 ? `${terms.slice(0, 50).trim()}…` : terms.trim()) ||
    "Agreement"
  return {
    id: api.id as string,
    title,
    status: api.status as AgreementStatus,
  initiator: {
      id: (initiator.id as string) ?? "",
      name: (initiator.name as string) ?? "Unknown",
      image: (initiator.image as string) ?? "/placeholder.svg?height=40&width=40",
      role: (initiator.role as string) ?? "",
      isVerified: Boolean(initiator.isVerified),
      companyName: (initiator.companyName as string) ?? undefined,
  },
  receiver: {
      id: (receiver.id as string) ?? "",
      name: (receiver.name as string) ?? "Unknown",
      image: (receiver.image as string) ?? "/placeholder.svg?height=40&width=40",
      role: (receiver.role as string) ?? "",
      isVerified: Boolean(receiver.isVerified),
      companyName: (receiver.companyName as string) ?? "",
    },
    terms,
    notes: (api.notes as string) ?? "",
    startDate: (api.startDate as string) ?? undefined,
    dueDate: (api.dueDate as string) ?? undefined,
    createdAt: (api.createdAt as string) ?? new Date().toISOString(),
    updatedAt: (api.updatedAt as string) ?? new Date().toISOString(),
    isInitiator: (api.isInitiator as boolean) ?? (initiator.id === currentUserId),
    product: product ?? null,
    messageContactId: (api.messageContactId as string | null) ?? null,
    inquiryId: (api.inquiryId as string | null) ?? null,
    sourceType: (api.sourceType as string | null) ?? null,
    agreementValue: (api.agreementValue as string | null) ?? null,
    currentVersion: (api.currentVersion as number) ?? undefined,
  }
}

interface RevisionItem {
  id: string
  version: number
  title: string | null
  changeSummary: string | null
  createdAt: string
  createdBy: string | null
}

interface ModificationRequestItem {
  id: string
  message: string
  createdAt: string
  requestedBy: string | null
}

function mapApiEventsToTimeline(events: Array<Record<string, unknown>>): TimelineEvent[] {
  return (events ?? []).map((e) => ({
    status: (e.status as TimelineEvent["status"]) ?? "PROPOSED",
    date: e.createdAt ? new Date(e.createdAt as string).toLocaleDateString() : "",
    actor: (e.actor as string | null) ?? null,
    eventType: (e.eventType as string | null) ?? null,
  }))
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "medium",
    })
  } catch {
    return iso
  }
}

export function AgreementDetailPageClient({ id }: AgreementDetailPageClientProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [agreement, setAgreement] = useState<Agreement | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [revisions, setRevisions] = useState<RevisionItem[]>([])
  const [latestModificationRequest, setLatestModificationRequest] =
    useState<ModificationRequestItem | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/agreements/${id}`)}`)
    }
  }, [status, router, id])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id || !id) return
    const currentUserId = (session.user as { id?: string }).id ?? ""
    let cancelled = false
    fetch(`/api/agreements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load agreement")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        setAgreement(mapApiToAgreement(data, currentUserId))
        setTimelineEvents(mapApiEventsToTimeline(data.events ?? []))
        setRevisions((data.revisions ?? []) as RevisionItem[])
        setLatestModificationRequest((data.latestModificationRequest ?? null) as ModificationRequestItem | null)
        setFetchError(null)
      })
      .catch((e: Error) => {
        if (!cancelled) setFetchError(e.message ?? "Failed to load agreement")
      })
    return () => {
      cancelled = true
    }
  }, [id, status, session?.user?.id])

  const currentUserId = (session?.user as { id?: string } | undefined)?.id ?? ""

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/agreements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" }),
      })
      if (!response.ok) throw new Error("Failed to accept")
      const data = await response.json()
      setAgreement(mapApiToAgreement(data, currentUserId))
      setTimelineEvents(mapApiEventsToTimeline(data.events ?? []))
      setRevisions((data.revisions ?? []) as RevisionItem[])
      setLatestModificationRequest((data.latestModificationRequest ?? null) as ModificationRequestItem | null)
      toast({
        title: "Agreement accepted",
        description: "The agreement is now active.",
      })
    } catch {
      toast({
        title: "Failed to accept agreement",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = () => {
    router.push("/agreements")
  }

  const handleRequestModification = async (payload: { message: string; sections?: string[]; suggestedRevision?: string }) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/agreements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REQUEST_MODIFICATION",
          modificationMessage: payload.message || "Modification requested.",
          modificationMetadata:
            payload.sections?.length || payload.suggestedRevision
              ? JSON.stringify({
                  sections: payload.sections,
                  suggestedRevision: payload.suggestedRevision,
                })
              : undefined,
        }),
      })
      if (!response.ok) throw new Error("Failed to request modification")
      const data = await response.json()
      setAgreement(mapApiToAgreement(data, currentUserId))
      setTimelineEvents(mapApiEventsToTimeline(data.events ?? []))
      setRevisions((data.revisions ?? []) as RevisionItem[])
      setLatestModificationRequest((data.latestModificationRequest ?? null) as ModificationRequestItem | null)
      toast({
        title: "Modification requested",
        description: "The other party has been notified.",
      })
    } catch {
      toast({
        title: "Request failed",
        description: "Could not send modification request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRevise = () => {
    router.push(`/agreements/${id}/revise`)
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/agreements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DECLINE" }),
      })
      if (!response.ok) throw new Error("Failed to decline")
      toast({
        title: "Agreement declined",
        description: "You have declined this agreement.",
      })
      router.push("/agreements")
    } catch {
      toast({
        title: "Failed to decline",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/agreements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "WITHDRAW" }),
      })
      if (!response.ok) throw new Error("Failed to withdraw")
      toast({
        title: "Agreement withdrawn",
        description: "The agreement draft has been withdrawn.",
      })
      router.push("/agreements")
    } catch {
      toast({
        title: "Failed to withdraw",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/agreements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      })
      if (!response.ok) throw new Error("Failed to complete")
      const data = await response.json()
      setAgreement(mapApiToAgreement(data, currentUserId))
      setTimelineEvents(mapApiEventsToTimeline(data.events ?? []))
      setRevisions((data.revisions ?? []) as RevisionItem[])
      setLatestModificationRequest((data.latestModificationRequest ?? null) as ModificationRequestItem | null)
      toast({
        title: "Agreement completed",
        description: "The agreement has been marked as completed.",
      })
    } catch {
      toast({
        title: "Failed to complete agreement",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDispute = () => {
    router.push(`/agreements/${id}/dispute`)
  }

  if (status === "loading") {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="Agreement" description="Loading…" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/20" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/20" />
        </div>
      </DashboardPageContainer>
    )
  }

  if (!session) return null

  if (fetchError) {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="Agreement" description="Details" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/agreements">Back to agreements</Link>
        </Button>
      </DashboardPageContainer>
    )
  }

  if (!agreement) {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="Agreement" description="Loading…" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/20" />
          <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/20" />
        </div>
      </DashboardPageContainer>
    )
  }

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title={agreement.title}
        description={`With ${agreement.isInitiator ? agreement.receiver.name : agreement.initiator.name} · ${agreement.status.replace("_", " ")}`}
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Agreements", href: "/agreements" },
          { label: "Details" },
        ]}
        actions={
              <Button variant="ghost" size="sm" asChild>
                <Link href="/agreements">
              <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden />
              Back to agreements
            </Link>
          </Button>
        }
      />

      {/* Top summary: context cards */}
      <div className="mb-6 flex flex-wrap gap-4">
        {agreement.product && (
          <Card className="flex-1 min-w-[200px] max-w-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4" />
                Related listing
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-medium">{agreement.product.title}</p>
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <Link href={`/marketplace/product/${agreement.product.id}`}>
                  View listing <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        {agreement.messageContactId && (
          <Card className="flex-1 min-w-[200px] max-w-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4" />
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="link" className="h-auto p-0 text-sm" asChild>
                <Link
                  href={
                    agreement.product
                      ? `/messages/${agreement.messageContactId}?productId=${agreement.product.id}`
                      : `/messages/${agreement.messageContactId}`
                  }
                >
                  View conversation <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
        <Card className="min-w-[180px]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Key dates
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1 text-sm">
            <p>Created {formatDate(agreement.createdAt)}</p>
            {agreement.dueDate && <p>Due {agreement.dueDate}</p>}
            {agreement.agreementValue && <p className="font-medium">{agreement.agreementValue}</p>}
          </CardContent>
        </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
                <AgreementDetail
                  agreement={agreement}
            revisions={revisions}
            latestModificationRequest={latestModificationRequest}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onComplete={handleComplete}
                  onDispute={handleDispute}
            onRequestModification={handleRequestModification}
            onDecline={handleDecline}
            onWithdraw={handleWithdraw}
            onRevise={handleRevise}
                  isLoading={isLoading}
                />
              </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
              <CardDescription>Agreement history and status changes</CardDescription>
            </CardHeader>
            <CardContent>
                <AgreementStatusTimeline events={timelineEvents} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {agreement.messageContactId && (
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link
                    href={
                      agreement.product
                        ? `/messages/${agreement.messageContactId}?productId=${agreement.product.id}`
                        : `/messages/${agreement.messageContactId}`
                    }
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View conversation
                  </Link>
                </Button>
              )}
              {agreement.product && (
                <Button variant="outline" size="sm" className="justify-start" asChild>
                  <Link href={`/marketplace/product/${agreement.product.id}`}>
                    <Package className="mr-2 h-4 w-4" />
                    View listing
                  </Link>
                </Button>
              )}
              {agreement.status === "DISPUTED" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() => router.push(`/agreements/${id}/dispute`)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View dispute
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
    </div>
    </DashboardPageContainer>
  )
} 
