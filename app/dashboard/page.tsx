"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { KeyMetricsCards } from "@/components/dashboard/key-metrics-cards"
import { RecentActivityPanel } from "@/components/dashboard/recent-activity-panel"
import { ListingPerformanceCard } from "@/components/dashboard/listing-performance-card"
import { UpcomingDemosCard } from "@/components/dashboard/upcoming-demos-card"
import { VerificationStatusCard } from "@/components/dashboard/verification-status-card"
import { ProfileStrengthCard } from "@/components/dashboard/profile-strength-card"
import { DashboardPageContainer, DashboardHeader, DashboardSection, InsightCard } from "@/components/dashboard"
import { WelcomeModal, hasSeenWelcomeModal } from "@/components/dashboard/welcome-modal"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Inbox, ShieldCheck } from "lucide-react"

const mockMessages = [
  {
    id: "1",
    senderName: "John Doe",
    preview: "Interested in your digital printing services...",
    time: "2h ago",
    isRead: false,
  },
  {
    id: "2",
    senderName: "Jane Smith",
    preview: "Thank you for your proposal...",
    time: "Yesterday",
    isRead: true,
  },
]

const mockInquiries = [
  { id: "1", from: "Acme Corp", product: "Offset Press", time: "1d ago" },
]

const mockAgreementUpdates = [
  { id: "1", title: "Digital Printing Services", counterparty: "PrintTech", status: "Active", time: "3d ago" },
]

const mockListingPerformance = [
  { id: "1", title: "Heidelberg Speedmaster", views: 124, inquiries: 8, trend: "up" as const },
  { id: "2", title: "Epson SureColor S80600", views: 89, inquiries: 5, trend: "up" as const },
]

const mockUpcomingDemos = [
  { id: "1", title: "UV Printing Workshop", date: "Dec 15, 2025", time: "2:00 PM" },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const [showWelcomeModal, setShowWelcomeModal] = useState(false)
  const [metrics, setMetrics] = useState({
    productViews: 0,
    inquiriesReceived: 0,
    activeAgreements: 0,
    demoRegistrations: 0,
    profileVisits: 0,
  })
  const [listingPerformance, setListingPerformance] = useState<{ id: string; title: string; views: number; inquiries: number; trend?: "up" | "down" | "same" }[]>([])
  const [agreementUpdates, setAgreementUpdates] = useState<{ id: string; title: string; counterparty: string; status: string; time: string }[]>([])

  useEffect(() => {
    const userId = (session?.user as any)?.id
    if (!userId) return
    if (!hasSeenWelcomeModal(userId)) setShowWelcomeModal(true)
  }, [session?.user])

  useEffect(() => {
    const userId = (session?.user as any)?.id
    if (!userId) return
    let cancelled = false

    Promise.all([
      fetch(`/api/products?ownerId=${userId}&limit=50`).then((r) => (r.ok ? r.json() : { data: [] })),
      fetch("/api/agreements").then((r) => (r.ok ? r.json() : [])),
      fetch("/api/inquiries/stats").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([productsRes, agreements, inquiryStats]) => {
        if (cancelled) return
        const list = Array.isArray(productsRes) ? productsRes : productsRes?.data ?? []
        const agreeList = Array.isArray(agreements) ? agreements : []
        const activeCount = agreeList.filter((a: any) => a.status === "ACTIVE").length
        const inquiryTotal = inquiryStats?.total ?? 0
        setMetrics((m) => ({
          ...m,
          productViews: m.productViews || 0,
          inquiriesReceived: inquiryTotal,
          activeAgreements: activeCount,
          demoRegistrations: m.demoRegistrations || 0,
          profileVisits: m.profileVisits || 0,
        }))
        setListingPerformance(
          list.slice(0, 5).map((p: any) => ({
            id: p.id,
            title: p.title ?? "Untitled",
            views: (p as any).viewCount ?? 0,
            inquiries: (p as any).inquiryCount ?? 0,
            trend: "same" as const,
          }))
        )
        setAgreementUpdates(
          agreeList.slice(0, 3).map((a: any) => {
            const other = a.initiator?.id === userId ? a.receiver : a.initiator
            const name = other?.name ?? "Unknown"
            const title = a.terms?.slice(0, 40)?.trim() + (a.terms?.length > 40 ? "…" : "") || `Agreement with ${name}`
            return {
              id: a.id,
              title,
              counterparty: name,
              status: a.status,
              time: formatTime(a.updatedAt ?? a.createdAt),
            }
          })
        )
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [session?.user])

  function formatTime(dateStr: string) {
    try {
      const d = new Date(dateStr)
      const now = new Date()
      const diff = now.getTime() - d.getTime()
      if (diff < 86400000) return "Today"
      if (diff < 172800000) return "Yesterday"
      const days = Math.floor(diff / 86400000)
      return `${days}d ago`
    } catch {
      return "—"
    }
  }

  const verificationStatus = {
    emailVerified: !!(session?.user as any)?.email,
    businessVerified: !!(session?.user as any)?.isVerified,
    enterpriseVerified: false,
  }

  const profileStrengthItems = [
    { id: "logo", label: "Upload logo", done: !!(session?.user as any)?.image, href: "/profile" },
    { id: "description", label: "Complete company description", done: !!(session?.user as any)?.bio, href: "/profile" },
    { id: "verify", label: "Verify your business", done: !!(session?.user as any)?.businessVerified || !!(session?.user as any)?.isVerified, href: "/verification" },
  ]
  const profileStrength = Math.round(
    (profileStrengthItems.filter((i) => i.done).length / profileStrengthItems.length) * 100
  )

  const insightItems: string[] = []
  if (profileStrength < 100) insightItems.push("Complete your profile and verification to build trust with partners.")
  if (listingPerformance.length === 0) insightItems.push("Create your first listing to start receiving inquiries.")
  if (metrics.inquiriesReceived > 0 && agreementUpdates.length === 0) insightItems.push("Review open inquiries and turn leads into agreements.")
  if (insightItems.length === 0) insightItems.push("You're all set. Use the management panels below to stay on top of listings and agreements.")

  const userId = (session?.user as any)?.id

  return (
    <DashboardPageContainer className="space-y-8">
      {userId && (
        <WelcomeModal
          open={showWelcomeModal}
          onOpenChange={setShowWelcomeModal}
          userId={userId}
        />
      )}
      {!verificationStatus.businessVerified && (
        <div className="rounded-xl border border-border bg-muted/50 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            Complete verification to build trust and stand out on the platform.
          </p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/verification">Complete verification</Link>
          </Button>
        </div>
      )}
      <DashboardHeader
        title="Company Control Center"
        description={"Welcome back, " + (session?.user?.name ?? "there") + ". Your activity and key metrics."}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" asChild>
              <Link href="/marketplace/my-products/new">
                <Plus className="h-4 w-4 mr-1.5" aria-hidden />
                Create listing
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard/inquiries">
                <Inbox className="h-4 w-4 mr-1.5" aria-hidden />
                Review inquiries
              </Link>
            </Button>
            {profileStrength < 100 && (
              <Button size="sm" variant="outline" asChild>
                <Link href="/verification">
                  <ShieldCheck className="h-4 w-4 mr-1.5" aria-hidden />
                  Complete verification
                </Link>
              </Button>
            )}
          </div>
        }
      />

      <DashboardSection title="Key metrics">
        <KeyMetricsCards metrics={metrics} />
      </DashboardSection>

      <DashboardSection title="Recent activity">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 min-w-0">
            <RecentActivityPanel
              messages={mockMessages}
              inquiries={mockInquiries}
              agreementUpdates={agreementUpdates}
            />
          </div>
          <div className="lg:col-span-2 min-w-0 space-y-6">
            <ListingPerformanceCard items={listingPerformance.length > 0 ? listingPerformance : mockListingPerformance} />
            <div className="grid gap-6 sm:grid-cols-2">
              <UpcomingDemosCard demos={mockUpcomingDemos} />
              <VerificationStatusCard status={verificationStatus} />
            </div>
            <ProfileStrengthCard percentage={profileStrength} items={profileStrengthItems} />
          </div>
        </div>
      </DashboardSection>

      <DashboardSection title="Insights">
        <InsightCard items={insightItems} />
      </DashboardSection>
    </DashboardPageContainer>
  )
}
