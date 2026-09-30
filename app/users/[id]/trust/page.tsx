"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Loader2,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import type { TrustLevel } from "@/lib/trust-score"

interface TrustScoreDetail {
  trustScore: number
  level: TrustLevel
  breakdown: Record<
    string,
    { score: number; label: string; explanation: string }
  >
  positiveSignals: string[]
  riskSignals: string[]
  details?: {
    userName?: string
    companyName?: string
    accountAgeDays?: number
    agreementsCompleted?: number
    agreementsCreated?: number
    completionRate?: number
    disputesRaised?: number
    disputesEscalated?: number
    disputesResolved?: number
    inquiriesReceived?: number
    inquiriesResponded?: number
    productCount?: number
    emailVerified?: boolean
    identityVerified?: boolean
    businessVerified?: boolean
    enterpriseVerified?: boolean
    hasCipponMembership?: boolean
    companyWebsiteVerified?: boolean
  }
}

const FACTOR_LABELS: Record<string, string> = {
  verification: "Verification",
  agreementPerformance: "Agreement history",
  profileCompleteness: "Profile completeness",
  responsiveness: "Response behaviour",
  disputeHistory: "Dispute history",
  activityRecency: "Activity",
}

const LEVEL_COLORS: Record<TrustLevel, string> = {
  Excellent: "text-emerald-600 border-emerald-200 bg-emerald-50",
  Strong: "text-green-600 border-green-200 bg-green-50",
  Moderate: "text-amber-600 border-amber-200 bg-amber-50",
  Limited: "text-rose-600 border-rose-200 bg-rose-50",
}

export default function UserTrustPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [trustData, setTrustData] = useState<TrustScoreDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/users/${id}/trustworthiness`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load")
        return res.json()
      })
      .then((json) => {
        if (cancelled) return
        setTrustData({
          trustScore: json.trustScore,
          level: json.level,
          breakdown: json.breakdown,
          positiveSignals: json.positiveSignals ?? [],
          riskSignals: json.riskSignals ?? [],
          details: json.details,
        })
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load trust information.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col">
        <MainNav />
      <div className="flex-1 container pt-24 pb-12">
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-6 max-w-5xl">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-4 w-72" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-3 w-56" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        </div>
      </div>
        <Footer />
      </main>
    )
  }

  if (error || !trustData) {
    return (
      <main className="min-h-screen flex flex-col">
        <MainNav />
        <div className="flex-1 container py-16">
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-4" />
                <p className="text-destructive">{error ?? "Trust information not available."}</p>
                <Button variant="outline" className="mt-4" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  const levelStyle = LEVEL_COLORS[trustData.level]
  const details = trustData.details
  const displayName = details?.companyName || details?.userName || "This user"

  const levelExplanation: Record<TrustLevel, string> = {
    Excellent:
      "Highly reliable partner with a strong history on PrintMarket NG. Suitable for strategic, long-term relationships.",
    Strong:
      "Reliable partner with good agreement performance and profile signals. Suitable for most B2B work.",
    Moderate:
      "Some positive signals but limited or mixed history. Start with smaller projects and build trust over time.",
    Limited:
      "New or higher-risk account. Use extra caution, request clear agreements, and consider starting with low-risk orders.",
  }

  return (
    <main className="min-h-screen flex flex-col">
      <MainNav />
      <div className="flex-1 container pt-24 pb-16">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/marketplace/vendor/${id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trust Score Report</h1>
            <p className="text-sm text-muted-foreground mt-1">{displayName}</p>
          </div>
        </div>

        <div className="grid gap-6 max-w-3xl">
          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Trust Score Overview
              </CardTitle>
              <CardDescription>
                Combined view of verification, profile, agreement behaviour, responsiveness, and dispute history.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">{trustData.trustScore}/100</p>
                  <Badge variant="outline" className={levelStyle}>
                    {trustData.level}
                  </Badge>
                </div>
                <Progress
                  value={trustData.trustScore}
                  className="h-3 w-56 max-w-full"
                  indicatorClassName={
                    trustData.trustScore >= 70
                      ? "bg-emerald-500"
                      : trustData.trustScore >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {levelExplanation[trustData.level]}
              </p>
              {details && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {details.emailVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Email verified
                    </Badge>
                  )}
                  {details.identityVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Identity verified
                    </Badge>
                  )}
                  {details.businessVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Business verified
                    </Badge>
                  )}
                  {details.enterpriseVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Enterprise verified
                    </Badge>
                  )}
                  {details.hasCipponMembership && (
                    <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-700">
                      CIPPON member
                    </Badge>
                  )}
                  {details.companyWebsiteVerified && (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Website checked
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-xl shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle>Factor breakdown</CardTitle>
                <CardDescription>Why the score is what it is.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Object.entries(trustData.breakdown).map(([key, value]) => (
                    <li key={key} className="rounded-lg border border-border bg-muted/20 px-4 py-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {FACTOR_LABELS[key] ?? key}
                        </span>
                        <span className="text-muted-foreground">{value.label}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{value.explanation}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {trustData.details && (
              <Card className="rounded-xl shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Summary stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    {trustData.details.accountAgeDays != null && (
                      <>
                        <dt className="text-muted-foreground">Account age</dt>
                        <dd>{Math.round(trustData.details.accountAgeDays / 30)} months</dd>
                      </>
                    )}
                    {trustData.details.agreementsCompleted != null && (
                      <>
                        <dt className="text-muted-foreground">Agreements completed</dt>
                        <dd>{trustData.details.agreementsCompleted}</dd>
                      </>
                    )}
                    {trustData.details.completionRate != null && (
                      <>
                        <dt className="text-muted-foreground">Completion rate</dt>
                        <dd>{trustData.details.completionRate}%</dd>
                      </>
                    )}
                    {trustData.details.productCount != null && (
                      <>
                        <dt className="text-muted-foreground">Listings</dt>
                        <dd>{trustData.details.productCount}</dd>
                      </>
                    )}
                    {trustData.details.inquiriesReceived != null && (
                      <>
                        <dt className="text-muted-foreground">Inquiries responded</dt>
                        <dd>
                          {trustData.details.inquiriesResponded}/{trustData.details.inquiriesReceived}
                        </dd>
                      </>
                    )}
                    {trustData.details.disputesRaised != null && trustData.details.disputesRaised > 0 && (
                      <>
                        <dt className="text-muted-foreground">Disputes raised</dt>
                        <dd>{trustData.details.disputesRaised}</dd>
                      </>
                    )}
                  </dl>
                  {typeof trustData.details.disputesRaised === "number" &&
                    typeof trustData.details.disputesEscalated === "number" &&
                    typeof trustData.details.disputesResolved === "number" && (
                      <div
                        className={`mt-4 rounded-lg border px-3 py-2 text-xs ${
                          trustData.details.disputesEscalated
                            ? "border-amber-300 bg-amber-50 text-amber-900"
                            : "border-muted bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        <p className="font-medium text-foreground mb-1">Dispute history</p>
                        <p>
                          {trustData.details.disputesRaised} disputes raised ·{" "}
                          {trustData.details.disputesResolved} resolved ·{" "}
                          {trustData.details.disputesEscalated} escalated
                        </p>
                        {trustData.details.disputesEscalated ? (
                          <p className="mt-1">
                            Escalated disputes indicate higher risk. Review agreements and communication carefully
                            before proceeding.
                          </p>
                        ) : (
                          <p className="mt-1">No disputes escalated to the platform.</p>
                        )}
                      </div>
                    )}
                </CardContent>
              </Card>
            )}
          </div>

          {(trustData.positiveSignals.length > 0 || trustData.riskSignals.length > 0) && (
            <div className="grid gap-6 md:grid-cols-2">
              {trustData.positiveSignals.length > 0 && (
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Positive signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {trustData.positiveSignals.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-600">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {trustData.riskSignals.length > 0 && (
                <Card className="rounded-xl shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <AlertTriangle className="h-5 w-5" />
                      Things to note
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {trustData.riskSignals.map((s, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-600">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <Card className="rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">How to interpret this score</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="font-medium text-foreground">Excellent (85–100)</dt>
                  <dd className="text-muted-foreground">
                    Highly reliable partner with strong platform history. Suitable for strategic, long-term
                    relationships.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Strong (70–84)</dt>
                  <dd className="text-muted-foreground">
                    Reliable partner with good agreement performance. Suitable for most B2B work.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Moderate (50–69)</dt>
                  <dd className="text-muted-foreground">
                    Mixed or limited history. Start with smaller projects and build trust over time.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-foreground">Limited (0–49)</dt>
                  <dd className="text-muted-foreground">
                    New or higher-risk account. Use extra caution, insist on clear agreements, and consider starting
                    with low-risk orders.
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}
