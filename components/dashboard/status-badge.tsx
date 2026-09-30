import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusVariant =
  | "default"
  | "secondary"
  | "outline"
  | "success"
  | "warning"
  | "destructive"
  | "muted"

const statusVariantMap: Record<string, StatusVariant> = {
  active: "default",
  ACTIVE: "default",
  completed: "success",
  COMPLETED: "success",
  pending: "secondary",
  PENDING: "secondary",
  PROPOSED: "secondary",
  new: "secondary",
  NEW: "secondary",
  contacted: "outline",
  CONTACTED: "outline",
  negotiating: "outline",
  NEGOTIATING: "outline",
  agreement_created: "default",
  AGREEMENT_CREATED: "default",
  closed: "muted",
  CLOSED: "muted",
  lost: "destructive",
  LOST: "destructive",
  disputed: "destructive",
  DISPUTED: "destructive",
  paused: "warning",
  approved: "success",
  APPROVED: "success",
  rejected: "destructive",
  REJECTED: "destructive",
  request_info: "warning",
  REQUEST_INFO: "warning",
  "not started": "muted",
  "NOT_STARTED": "muted",
  "in progress": "outline",
  "IN_PROGRESS": "outline",
  submitted: "secondary",
  SUBMITTED: "secondary",
  "under review": "warning",
  "UNDER_REVIEW": "warning",
  "more information required": "warning",
  "MORE_INFO_REQUIRED": "warning",
  REQUEST_INFO: "warning",
  verified: "success",
  VERIFIED: "success",
  enterprise_verified: "default",
  ENTERPRISE_VERIFIED: "default",
  unverified: "muted",
  UNVERIFIED: "muted",
}

const variantClasses: Record<StatusVariant, string> = {
  default: "bg-primary/10 text-primary border-0",
  secondary: "bg-muted text-muted-foreground border-0",
  outline: "border border-border bg-background",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-0",
  destructive: "bg-destructive/10 text-destructive border-0",
  muted: "bg-muted text-muted-foreground border-0",
}

export interface StatusBadgeProps {
  status: string
  variant?: StatusVariant
  className?: string
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const resolvedVariant = variant ?? statusVariantMap[status] ?? "secondary"
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Badge
      variant={resolvedVariant === "default" || resolvedVariant === "secondary" ? resolvedVariant : "outline"}
      className={cn(
        "font-medium capitalize",
        variantClasses[resolvedVariant],
        className
      )}
    >
      {label}
    </Badge>
  )
}
