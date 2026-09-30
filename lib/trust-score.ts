/**
 * Trust Score system for PrintMarket NG.
 * Combines verification, profile quality, agreement behavior, responsiveness, and dispute history
 * into a clear, explainable trust summary. New users are not over-penalized; verified and
 * complete profiles earn a reasonable score; disputes and escalations reduce score meaningfully.
 */

export const TRUST_WEIGHTS = {
  verification: 30,
  agreementPerformance: 25,
  profileCompleteness: 15,
  responsiveness: 15,
  disputeHistory: 10,
  activityRecency: 5,
} as const

export type TrustLevel = "Excellent" | "Strong" | "Moderate" | "Limited"

export type FactorLabel = "Strong" | "Good" | "Moderate" | "Limited" | "None"

export interface TrustScoreInput {
  // Verification (hard to fake, should carry strong weight)
  emailVerified: boolean
  identityVerified: boolean
  businessVerified: boolean
  enterpriseVerified: boolean
  hasCipponMembership: boolean
  companyWebsiteVerified: boolean // has companyWebsite and it's non-empty / checked
  hasCacVerification?: boolean

  // Profile completeness (0–1 or counts)
  hasCompanyName: boolean
  hasImage: boolean
  hasBio: boolean
  hasCompanyWebsite: boolean
  hasYearsInBusiness: boolean
  hasTeamSize: boolean
  hasLocation: boolean
  productCount: number

  // Agreement history (as this user: initiator or receiver)
  agreementsCreated: number
  agreementsCompleted: number
  agreementsActive: number
  completionRate: number // 0–1, of non-active/non-pending that are completed
  agreementsDisputed?: number
  agreementsCancelled?: number

  // Disputes (complaints on agreements involving this user)
  disputesRaised: number
  disputesEscalated: number
  disputesResolved: number

  // Responsiveness (vendor: inquiries to them)
  inquiriesReceived: number
  inquiriesResponded: number // status moved from NEW
  unansweredInquiries: number
  averageResponseHours?: number | null
  unreadInquiryCount?: number

  // Activity / recency
  accountAgeDays: number
  hasRecentActivity: boolean // e.g. activity in last 30 days
  productCountLast90Days: number
  lastActiveAt?: Date | string | null
  lastListingCreatedAt?: Date | string | null
  lastInquiryAt?: Date | string | null
}

export interface FactorBreakdown {
  verification: { score: number; label: FactorLabel; explanation: string }
  agreementPerformance: { score: number; label: FactorLabel; explanation: string }
  profileCompleteness: { score: number; label: FactorLabel; explanation: string }
  responsiveness: { score: number; label: FactorLabel; explanation: string }
  disputeHistory: { score: number; label: FactorLabel; explanation: string }
  activityRecency: { score: number; label: FactorLabel; explanation: string }
}

export interface TrustScoreDetails {
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

export interface TrustScoreResult {
  score: number
  level: TrustLevel
  breakdown: FactorBreakdown
  positiveSignals: string[]
  riskSignals: string[]
  details?: TrustScoreDetails
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function clampScore(value: number, min = 0, max = 100): number {
  return clamp(value, min, max)
}

export function safePercentage(numerator: number, denominator: number): number {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return 0
  }
  return numerator / denominator
}

function factorLabel(score: number): FactorLabel {
  if (score >= 80) return "Strong"
  if (score >= 60) return "Good"
  if (score >= 40) return "Moderate"
  if (score >= 20) return "Limited"
  return "None"
}

export function getTrustLevel(score: number): TrustLevel {
  if (score >= 80) return "Excellent"
  if (score >= 60) return "Strong"
  if (score >= 40) return "Moderate"
  return "Limited"
}

/**
 * Verification: 0–100. Email + identity + business + enterprise + CIPPON + website.
 * New users can still get points for each verification they have.
 */
function scoreVerification(input: TrustScoreInput): { score: number; explanation: string } {
  let score = 0
  const parts: string[] = []
  if (input.emailVerified) {
    score += 15
    parts.push("email verified")
  }
  if (input.identityVerified) {
    score += 25
    parts.push("identity verified")
  }
  if (input.businessVerified) {
    score += 25
    parts.push("business verified")
  }
  if (input.enterpriseVerified) {
    score += 20
    parts.push("enterprise verified")
  }
  if (input.hasCipponMembership) {
    score += 25
    parts.push("CIPPON membership")
  }
  if (input.hasCacVerification) {
    score += 15
    parts.push("CAC registration verified")
  }
  if (input.companyWebsiteVerified) {
    score += 10
    parts.push("company website")
  }
  const capped = Math.min(100, score)
  const explanation =
    parts.length > 0
      ? `Verification: ${parts.join(", ")}.`
      : "No verification on file. Verification strengthens trust."
  return { score: capped, explanation }
}

/**
 * Agreement performance: completion rate and volume. Don't punish new users with no agreements.
 */
function scoreAgreementPerformance(input: TrustScoreInput): { score: number; explanation: string } {
  const total = input.agreementsCreated
  if (total === 0) {
    return {
      score: 60,
      explanation: "No agreement history yet. Score reflects neutral standing.",
    }
  }
  let score = 40
  if (input.completionRate >= 0.9) score += 40
  else if (input.completionRate >= 0.7) score += 30
  else if (input.completionRate >= 0.5) score += 20
  else if (input.completionRate > 0) score += 10
  if (input.agreementsCompleted >= 5) score += 20
  else if (input.agreementsCompleted >= 1) score += 10
  const disputed = input.agreementsDisputed ?? 0
  const cancelled = input.agreementsCancelled ?? 0
  if (disputed > 0 || cancelled > 0) {
    // Disputed and cancelled agreements indicate friction in execution; cap the total penalty.
    const penalty = Math.min(25, disputed * 10 + cancelled * 5)
    score -= penalty
  }
  const capped = clamp(score, 0, 100)
  const explanation =
    `${input.agreementsCompleted} completed, ${input.agreementsCreated} created. ` +
    (input.completionRate > 0 ? `Completion rate ${Math.round(input.completionRate * 100)}%.` : "No completed agreements yet.")
  return { score: capped, explanation }
}

/**
 * Profile completeness: optional fields filled. New users can score well with a complete profile.
 */
function scoreProfileCompleteness(input: TrustScoreInput): { score: number; explanation: string } {
  let score = 0
  const parts: string[] = []
  if (input.hasCompanyName) {
    score += 15
    parts.push("company name")
  }
  if (input.hasImage) {
    score += 15
    parts.push("logo/image")
  }
  if (input.hasBio) {
    score += 15
    parts.push("bio")
  }
  if (input.hasCompanyWebsite) {
    score += 15
    parts.push("website")
  }
  if (input.hasYearsInBusiness) {
    score += 10
    parts.push("years in business")
  }
  if (input.hasTeamSize) {
    score += 10
    parts.push("team size")
  }
  if (input.hasLocation) {
    score += 10
    parts.push("location")
  }
  if (input.productCount > 0) {
    score += Math.min(10, input.productCount * 2)
    parts.push(`${input.productCount} listing(s)`)
  }
  const capped = clamp(score, 0, 100)
  const explanation =
    parts.length > 0 ? `Profile has: ${parts.join(", ")}.` : "Profile is minimal. Adding details can improve trust."
  return { score: capped, explanation }
}

/**
 * Responsiveness: inquiry response rate. Don't punish if no inquiries.
 */
function scoreResponsiveness(input: TrustScoreInput): { score: number; explanation: string } {
  if (input.inquiriesReceived === 0) {
    return { score: 70, explanation: "No inquiries received yet. Neutral responsiveness." }
  }
  const rate = safePercentage(input.inquiriesResponded, input.inquiriesReceived)
  let score = rate * 80

  const unanswered = Math.max(
    input.unansweredInquiries,
    input.unreadInquiryCount != null ? input.unreadInquiryCount : 0
  )
  if (unanswered > 0) {
    score -= Math.min(20, unanswered * 5)
  }

  if (input.averageResponseHours != null && Number.isFinite(input.averageResponseHours)) {
    const hrs = input.averageResponseHours
    if (hrs <= 4) score += 10
    else if (hrs <= 24) score += 5
    else if (hrs >= 48) score -= 10
  }

  const capped = clamp(score, 0, 100)
  const explanation =
    `${input.inquiriesResponded}/${input.inquiriesReceived} inquiries responded to.` +
    (unanswered > 0 ? ` ${unanswered} unanswered.` : "")
  return { score: capped, explanation }
}

/**
 * Dispute history: disputes and escalations reduce score. Resolved is better than escalated.
 */
function scoreDisputeHistory(input: TrustScoreInput): { score: number; explanation: string } {
  const total = input.disputesRaised + input.disputesResolved
  if (total === 0 && input.disputesEscalated === 0) {
    return { score: 100, explanation: "No dispute history. Low risk." }
  }
  let score = 100
  // Each dispute slightly reduces the factor score, escalations have a stronger impact.
  score -= input.disputesRaised * 10
  score -= input.disputesEscalated * 30
  if (input.disputesResolved > 0) score += Math.min(15, input.disputesResolved * 5)
  // If any dispute has been escalated to the platform, cap this factor so it cannot appear "Strong".
  if (input.disputesEscalated > 0) {
    score = Math.min(score, 40)
  }
  const capped = clamp(score, 0, 100)
  const parts: string[] = []
  if (input.disputesRaised > 0) parts.push(`${input.disputesRaised} dispute(s) raised`)
  if (input.disputesEscalated > 0) parts.push(`${input.disputesEscalated} escalated`)
  if (input.disputesResolved > 0) parts.push(`${input.disputesResolved} resolved`)
  const explanation = parts.length > 0 ? parts.join(". ") : "No disputes."
  return { score: capped, explanation }
}

/**
 * Activity recency: account age and recent activity. New users get a baseline.
 */
function scoreActivityRecency(input: TrustScoreInput): { score: number; explanation: string } {
  const isRecent = (value?: Date | string | null, days = 30): boolean => {
    if (!value) return false
    const ts = value instanceof Date ? value.getTime() : new Date(value).getTime()
    if (!Number.isFinite(ts)) return false
    const diff = Date.now() - ts
    return diff <= days * 24 * 60 * 60 * 1000
  }

  const hasRecentFromDates =
    isRecent(input.lastActiveAt, 30) ||
    isRecent(input.lastListingCreatedAt, 30) ||
    isRecent(input.lastInquiryAt, 30)
  const effectiveRecentActivity = input.hasRecentActivity || hasRecentFromDates

  let score = 50
  if (input.accountAgeDays >= 365) score += 25
  else if (input.accountAgeDays >= 90) score += 15
  else if (input.accountAgeDays >= 30) score += 10
  if (effectiveRecentActivity) score += 25
  if (input.productCountLast90Days > 0) score += 10
  const capped = clamp(score, 0, 100)
  const explanation =
    input.accountAgeDays >= 30
      ? `Account active ${Math.round(input.accountAgeDays / 30)} months. ${
          effectiveRecentActivity ? "Recent activity." : ""
        }`
      : "New account."
  return { score: capped, explanation }
}

function buildPositiveSignals(input: TrustScoreInput): string[] {
  const signals: string[] = []
  if (input.businessVerified) signals.push("Business verified")
  else if (input.identityVerified) signals.push("Identity verified")

  if (input.hasCipponMembership) signals.push("CIPPON member")
  if (input.hasCacVerification) signals.push("CAC registration on file")

  if (input.agreementsCompleted >= 1) {
    signals.push(`${input.agreementsCompleted} agreement(s) completed`)
  }
  if (input.completionRate >= 0.85 && input.agreementsCreated >= 3) {
    signals.push("Strong agreement completion history")
  }

  const responseRate = safePercentage(input.inquiriesResponded, input.inquiriesReceived)
  if (input.inquiriesReceived > 0 && responseRate >= 0.8) {
    signals.push("Responds consistently to inquiries")
  }

  if (
    input.hasCompanyName &&
    input.hasImage &&
    input.hasBio &&
    input.hasCompanyWebsite &&
    input.hasLocation
  ) {
    signals.push("Complete company profile")
  }

  if (input.productCount >= 3) {
    signals.push("Active listings on the platform")
  }

  if (input.disputesRaised === 0 && input.disputesEscalated === 0) {
    signals.push("No dispute history on the platform")
  } else if (input.disputesEscalated === 0 && input.disputesRaised > 0) {
    signals.push("Disputes raised but resolved without escalation")
  }

  if (input.productCountLast90Days > 0 || input.hasRecentActivity) {
    signals.push("Recent activity on PrintMarket NG")
  }

  return signals
}

function buildRiskSignals(input: TrustScoreInput): string[] {
  const risks: string[] = []

  if (input.agreementsCreated < 3 && input.agreementsCompleted === 0) {
    risks.push("Limited agreement history on PrintMarket NG")
  }

  if (!input.hasCompanyName || !input.hasBio || !input.hasCompanyWebsite) {
    risks.push("Incomplete company profile")
  }

  const responseRate = safePercentage(input.inquiriesResponded, input.inquiriesReceived)
  if (input.inquiriesReceived > 0 && responseRate < 0.5) {
    risks.push("Slow or inconsistent inquiry response")
  }
  if (input.unansweredInquiries > 2) {
    risks.push("Several unanswered inquiries")
  }

  if (input.disputesEscalated > 0) {
    risks.push("One or more disputes escalated to the platform")
  } else if (input.disputesRaised > 0) {
    risks.push("Disputes have been raised in past agreements")
  }

  if (!input.identityVerified && !input.businessVerified && input.agreementsCreated > 0) {
    risks.push("Agreement history without verification")
  }

  if (input.completionRate < 0.5 && input.agreementsCreated >= 3) {
    risks.push("Low agreement completion rate")
  }

  if (!input.hasRecentActivity && input.accountAgeDays > 60) {
    risks.push("Limited recent platform activity")
  }

  return risks
}

export function getTrustBreakdown(input: TrustScoreInput): FactorBreakdown {
  const v = scoreVerification(input)
  const a = scoreAgreementPerformance(input)
  const p = scoreProfileCompleteness(input)
  const r = scoreResponsiveness(input)
  const d = scoreDisputeHistory(input)
  const ac = scoreActivityRecency(input)

  return {
    verification: { score: v.score, label: factorLabel(v.score), explanation: v.explanation },
    agreementPerformance: { score: a.score, label: factorLabel(a.score), explanation: a.explanation },
    profileCompleteness: { score: p.score, label: factorLabel(p.score), explanation: p.explanation },
    responsiveness: { score: r.score, label: factorLabel(r.score), explanation: r.explanation },
    disputeHistory: { score: d.score, label: factorLabel(d.score), explanation: d.explanation },
    activityRecency: { score: ac.score, label: factorLabel(ac.score), explanation: ac.explanation },
  }
}

export function computeTrustScore(input: TrustScoreInput): TrustScoreResult {
  const v = scoreVerification(input)
  const a = scoreAgreementPerformance(input)
  const p = scoreProfileCompleteness(input)
  const r = scoreResponsiveness(input)
  const d = scoreDisputeHistory(input)
  const ac = scoreActivityRecency(input)

  const totalWeight =
    TRUST_WEIGHTS.verification +
    TRUST_WEIGHTS.agreementPerformance +
    TRUST_WEIGHTS.profileCompleteness +
    TRUST_WEIGHTS.responsiveness +
    TRUST_WEIGHTS.disputeHistory +
    TRUST_WEIGHTS.activityRecency

  const weightedScore =
    (v.score * TRUST_WEIGHTS.verification +
      a.score * TRUST_WEIGHTS.agreementPerformance +
      p.score * TRUST_WEIGHTS.profileCompleteness +
      r.score * TRUST_WEIGHTS.responsiveness +
      d.score * TRUST_WEIGHTS.disputeHistory +
      ac.score * TRUST_WEIGHTS.activityRecency) /
    totalWeight

  const score = Math.round(clampScore(weightedScore, 0, 100))
  const level = getTrustLevel(score)

  const breakdown: FactorBreakdown = {
    verification: { score: v.score, label: factorLabel(v.score), explanation: v.explanation },
    agreementPerformance: { score: a.score, label: factorLabel(a.score), explanation: a.explanation },
    profileCompleteness: { score: p.score, label: factorLabel(p.score), explanation: p.explanation },
    responsiveness: { score: r.score, label: factorLabel(r.score), explanation: r.explanation },
    disputeHistory: { score: d.score, label: factorLabel(d.score), explanation: d.explanation },
    activityRecency: { score: ac.score, label: factorLabel(ac.score), explanation: ac.explanation },
  }

  const positiveSignals = buildPositiveSignals(input)
  const riskSignals = buildRiskSignals(input)

  const details: TrustScoreDetails = {
    accountAgeDays: input.accountAgeDays,
    agreementsCompleted: input.agreementsCompleted,
    agreementsCreated: input.agreementsCreated,
    completionRate: Math.round(input.completionRate * 100),
    disputesRaised: input.disputesRaised,
    disputesEscalated: input.disputesEscalated,
    disputesResolved: input.disputesResolved,
    inquiriesReceived: input.inquiriesReceived,
    inquiriesResponded: input.inquiriesResponded,
    productCount: input.productCount,
    emailVerified: input.emailVerified,
    identityVerified: input.identityVerified,
    businessVerified: input.businessVerified,
    enterpriseVerified: input.enterpriseVerified,
    hasCipponMembership: input.hasCipponMembership,
    companyWebsiteVerified: input.companyWebsiteVerified,
  }

  return {
    score,
    level,
    breakdown,
    positiveSignals,
    riskSignals,
    details,
  }
}

// Public alias with the more descriptive name expected by UI / APIs.
export const calculateTrustScore = computeTrustScore
