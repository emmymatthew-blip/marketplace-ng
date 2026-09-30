/**
 * Shared verification contract for /api/verification/status and UI.
 */

export type MethodKey = "cac" | "cippon" | "governmentId" | "businessRegistration" | "corporateEmail" | "website"

export type MethodStatusValue = "NONE" | "PENDING" | "APPROVED" | "REJECTED" | "REQUEST_INFO"

export type VerificationSubmission = {
  id: string
  verificationType: string
  documentType: string | null
  status: string
  submittedAt: string | null
  metadata: Record<string, unknown> | null
}

export type VerificationStatusPayload = {
  verificationLevel: number
  identityVerified: boolean
  businessVerified: boolean
  enterpriseVerified: boolean
  isVerified: boolean
  submissions: VerificationSubmission[]
  methodStatuses: Record<MethodKey, MethodStatusValue>
}

const DOC_TO_METHOD: Record<string, MethodKey> = {
  GOVERNMENT_ID: "governmentId",
  CAC_REGISTRATION: "cac",
  CIPPON_MEMBERSHIP: "cippon",
  BUSINESS_REGISTRATION: "businessRegistration",
  CORPORATE_EMAIL: "corporateEmail",
  COMPANY_WEBSITE: "website",
}

function latestSubmissionForDocType(
  submissions: VerificationSubmission[],
  documentType: string
): VerificationSubmission | null {
  const matches = submissions.filter((s) => s.documentType === documentType)
  if (!matches.length) return null
  return [...matches].sort((a, b) => {
    const ta = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
    const tb = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
    return tb - ta
  })[0]
}

function statusToMethodValue(status: string | undefined): MethodStatusValue {
  const s = (status || "").toUpperCase()
  if (s === "APPROVED") return "APPROVED"
  if (s === "REJECTED") return "REJECTED"
  if (s === "REQUEST_INFO") return "REQUEST_INFO"
  if (s === "PENDING") return "PENDING"
  return "NONE"
}

/**
 * Build per-method statuses from submissions + user-level flags (admin-approved overrides).
 */
export function buildMethodStatuses(
  submissions: VerificationSubmission[],
  flags: {
    identityVerified: boolean
    businessVerified: boolean
    enterpriseVerified: boolean
  }
): Record<MethodKey, MethodStatusValue> {
  const out: Record<MethodKey, MethodStatusValue> = {
    cac: "NONE",
    cippon: "NONE",
    governmentId: "NONE",
    businessRegistration: "NONE",
    corporateEmail: "NONE",
    website: "NONE",
  }

  for (const key of Object.keys(DOC_TO_METHOD) as string[]) {
    const method = DOC_TO_METHOD[key]
    const latest = latestSubmissionForDocType(submissions, key)
    if (latest) {
      out[method] = statusToMethodValue(latest.status)
    }
  }

  if (flags.identityVerified) out.governmentId = "APPROVED"
  if (flags.businessVerified) {
    out.cac = out.cac === "NONE" || out.cac === "PENDING" ? "APPROVED" : out.cac
    out.businessRegistration = "APPROVED"
    out.corporateEmail = "APPROVED"
    out.website = "APPROVED"
  }
  if (flags.enterpriseVerified) {
    out.cippon = out.cippon === "NONE" || out.cippon === "PENDING" ? "APPROVED" : out.cippon
  }

  return out
}
