"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertTriangle, Shield, Loader2 } from "lucide-react"
import type { FactorLabel, TrustLevel } from "@/lib/trust-score"

export interface TrustScoreDetail {
  trustScore: number
  level: TrustLevel
  breakdown: {
    verification: { score: number; label: FactorLabel; explanation: string }
    agreementPerformance: { score: number; label: FactorLabel; explanation: string }
    profileCompleteness: { score: number; label: FactorLabel; explanation: string }
    responsiveness: { score: number; label: FactorLabel; explanation: string }
    disputeHistory: { score: number; label: FactorLabel; explanation: string }
    activityRecency: { score: number; label: FactorLabel; explanation: string }
  }
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

interface TrustScoreModalProps {
  userId: string
  userName?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: TrustScoreDetail | null
  onLoaded?: (data: TrustScoreDetail) => void
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
  Excellent: "text-emerald-600 bg-emerald-500/15 border-emerald-500/30",
  Strong: "text-green-600 bg-green-500/15 border-green-500/30",
  Moderate: "text-amber-600 bg-amber-500/15 border-amber-500/30",
  Limited: "text-rose-600 bg-rose-500/15 border-rose-500/30",
}

export function TrustScoreModal({
  userId,
  userName,
  open,
  onOpenChange,
  initialData,
  onLoaded,
}: TrustScoreModalProps) {
  const [data, setData] = useState<TrustScoreDetail | null>(initialData ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (initialData) {
      setData(initialData)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    fetch(`/api/users/${userId}/trustworthiness`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load")
        return res.json()
      })
      .then((json) => {
        const next = {
          trustScore: json.trustScore,
          level: json.level,
          breakdown: json.breakdown,
          positiveSignals: json.positiveSignals ?? [],
          riskSignals: json.riskSignals ?? [],
          details: json.details,
        }
        setData(next)
        onLoaded?.(next)
      })
      .catch(() => setError("Could not load trust score."))
      .finally(() => setLoading(false))
  }, [open, userId, initialData])

  const level = data?.level ? LEVEL_COLORS[data.level] : ""
  const displayName = userName || data?.details?.companyName || data?.details?.userName || "This user"
  const verification = data?.details

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Trust Score
          </DialogTitle>
          <DialogDescription>
            Trust summary for {displayName}. This combines verification, profile, agreements, responsiveness, and dispute history.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {!loading && !error && data && (
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold text-foreground">{data.trustScore}/100</p>
                  <Badge variant="outline" className={level}>
                    {data.level}
                  </Badge>
                </div>
                <Progress
                  value={data.trustScore}
                  className="h-2 w-56 max-w-full shrink-0"
                  indicatorClassName={
                    data.trustScore >= 70
                      ? "bg-emerald-500"
                      : data.trustScore >= 40
                        ? "bg-amber-500"
                        : "bg-rose-500"
                  }
                />
              </div>

              {verification && (
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {verification.emailVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Email verified
                    </Badge>
                  )}
                  {verification.identityVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Identity verified
                    </Badge>
                  )}
                  {verification.businessVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Business verified
                    </Badge>
                  )}
                  {verification.enterpriseVerified && (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-700">
                      Enterprise verified
                    </Badge>
                  )}
                  {verification.hasCipponMembership && (
                    <Badge variant="outline" className="border-sky-300 bg-sky-50 text-sky-700">
                      CIPPON member
                    </Badge>
                  )}
                  {verification.companyWebsiteVerified && (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      Website checked
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Factor breakdown</h4>
              <ul className="space-y-2">
                {Object.entries(data.breakdown).map(([key, value]) => (
                  <li key={key} className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-foreground">
                        {FACTOR_LABELS[key] ?? key}
                      </span>
                      <span className="text-muted-foreground">{value.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{value.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>

            {data.positiveSignals.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Positive signals
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {data.positiveSignals.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.riskSignals.length > 0 && (
              <div>
                <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Things to note
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {data.riskSignals.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-600">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/users/${userId}/trust`}>View full trust report</Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
