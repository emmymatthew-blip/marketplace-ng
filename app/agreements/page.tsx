"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AgreementsDashboard, type AgreementCardItem } from "@/components/dashboard/agreements-dashboard"
import { DashboardPageContainer, DashboardHeader, DashboardEmptyState } from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Inbox, MessageSquare, Search } from "lucide-react"

function formatTimeline(createdAt: string, updatedAt?: string) {
  try {
    const created = new Date(createdAt)
    const updated = updatedAt ? new Date(updatedAt) : null
    const now = new Date()
    const diffMs = (updated || created).getTime() - now.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return "Today"
    if (diffDays === -1) return "Yesterday"
    if (diffDays > -7 && diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return (updated || created).toLocaleDateString()
  } catch {
    return "—"
  }
}

function mapApiToCardItem(agreement: any, currentUserId: string): AgreementCardItem {
  const counterparty =
    agreement.initiator?.id === currentUserId ? agreement.receiver : agreement.initiator
  const name = counterparty?.name ?? "Unknown"
  const status =
    agreement.status === "PROPOSED" ? "PENDING" : (agreement.status as AgreementCardItem["status"])
  const title = agreement.title || `Agreement with ${name}`
  return {
    id: agreement.id,
    title,
    counterparty: name,
    productRef: agreement.product?.title || undefined,
    status,
    timeline: formatTimeline(agreement.createdAt, agreement.updatedAt),
    updatedAt: agreement.updatedAt,
  }
}

export default function AgreementsPage() {
  const { data: session, status } = useSession()
  const [agreements, setAgreements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/agreements")
    }
  }, [status])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/agreements")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch agreements")
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setAgreements(Array.isArray(data) ? data : [])
      })
      .catch((e) => {
        if (!cancelled) setError(e.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [status, session?.user?.id])

  if (status === "loading") {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="Agreements" description="Review and manage business agreements." />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      </DashboardPageContainer>
    )
  }

  if (!session) return null

  const currentUserId = (session.user as any).id
  const cardItems = agreements.map((a) => mapApiToCardItem(a, currentUserId))
  const active = cardItems.filter((a) => a.status === "ACTIVE")
  const pending = cardItems.filter((a) => a.status === "PENDING")
  const completed = cardItems.filter((a) => a.status === "COMPLETED")
  const disputed = cardItems.filter((a) => a.status === "DISPUTED")

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title="Agreements"
        description="Manage pending, active, completed, and disputed agreements after terms have been discussed in messages or inquiries."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/messages">
                <MessageSquare className="mr-1.5 h-4 w-4" aria-hidden />
                Start from conversation
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/inquiries">
                <Inbox className="mr-1.5 h-4 w-4" aria-hidden />
                Create from inquiry
              </Link>
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Agreements are optional and usually follow a conversation or inquiry once both parties begin discussing terms. Platform mediation applies when an agreement exists.
      </div>

      {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full rounded-lg" />
                <div className="grid gap-4 md:grid-cols-2">
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-32 rounded-xl" />
                  <Skeleton className="h-32 rounded-xl" />
                </div>
              </div>
            ) : cardItems.length === 0 ? (
              <DashboardEmptyState
                icon={FileText}
                title="No agreements yet"
                description="Agreements are usually created after you start a conversation or inquiry with a company."
                secondaryHint="Use Messages or Inquiries to open a context-aware agreement draft with the right recipient and listing already attached."
                action={
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button asChild>
                      <Link href="/messages">Go to Messages</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/dashboard/inquiries">View Inquiries</Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href="/marketplace">
                        <Search className="mr-1.5 h-4 w-4" aria-hidden />
                        Browse Listings
                      </Link>
                    </Button>
                  </div>
                }
              />
            ) : (
              <AgreementsDashboard
                active={active}
                pending={pending}
                completed={completed}
                disputed={disputed}
              />
            )}
    </DashboardPageContainer>
  )
}
