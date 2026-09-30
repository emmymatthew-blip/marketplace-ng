/**
 * Derives a single UX status for a user from their DemoAccessRequest rows
 * (same rules as GET /api/demo-access/status).
 */
export type DemoAccessSummaryStatus = "NOT_APPLIED" | "PENDING" | "APPROVED" | "REJECTED"

export function deriveDemoAccessStatusFromRequests(
  rows: { status: string }[]
): DemoAccessSummaryStatus {
  if (!rows?.length) return "NOT_APPLIED"
  const approvedCount = rows.filter((r) => r.status === "APPROVED").length
  const pendingCount = rows.filter((r) => r.status === "PENDING").length
  const rejectedCount = rows.filter((r) => r.status === "REJECTED").length
  if (approvedCount > 0) return "APPROVED"
  if (pendingCount > 0) return "PENDING"
  if (rejectedCount > 0) return "REJECTED"
  return "NOT_APPLIED"
}
