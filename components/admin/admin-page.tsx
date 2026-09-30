import Link from "next/link"
import { ChevronRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export type AdminBreadcrumb = { label: string; href?: string }

/** Standard outer wrapper for all admin pages — consistent padding and vertical rhythm */
export function AdminPageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1400px] space-y-6 px-3 pb-8 sm:space-y-8 sm:px-0", className)}>{children}</div>
  )
}

export function AdminPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: {
  title: string
  description?: string
  breadcrumbs?: AdminBreadcrumb[]
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-4 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div className="min-w-0 flex-1 space-y-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex flex-wrap items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {breadcrumbs.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-50" />}
                {item.href ? (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

export function AdminKpiCard({
  title,
  value,
  hint,
  icon: Icon,
  href,
  variant = "default",
}: {
  title: string
  value: React.ReactNode
  hint?: string
  icon?: React.ComponentType<{ className?: string }>
  href?: string
  variant?: "default" | "accent" | "warning" | "danger"
}) {
  const ring =
    variant === "accent"
      ? "border-primary/25 bg-primary/[0.04]"
      : variant === "warning"
        ? "border-amber-200/80 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20"
        : variant === "danger"
          ? "border-destructive/20 bg-destructive/[0.04]"
          : "border-border/80 bg-card"

  const inner = (
    <Card className={cn("rounded-xl shadow-sm transition-shadow", ring, href && "hover:shadow-md cursor-pointer h-full")}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground/80" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tabular-nums tracking-tight">{value}</div>
        {hint && <p className="mt-1 text-xs text-muted-foreground leading-snug">{hint}</p>}
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {inner}
      </Link>
    )
  }
  return inner
}

export function AdminSectionCard({
  title,
  description,
  children,
  className,
  headerAction,
}: {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}) {
  return (
    <Card className={cn("overflow-hidden rounded-xl border-border/80 shadow-sm", className)}>
      <CardHeader className="border-b border-border/60 bg-muted/20 py-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && <CardDescription className="mt-1">{description}</CardDescription>}
          </div>
          {headerAction}
        </div>
      </CardHeader>
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  )
}

export function AdminEmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: { label: string; href: string }
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-12 text-center sm:px-6 sm:py-14",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>}
      {action && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}

/** API or load failure — consistent retry affordance */
export function AdminErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
}: {
  title?: string
  description: string
  onRetry?: () => void
  retryLabel?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/25 bg-destructive/[0.04] px-4 py-10 text-center sm:px-6 sm:py-12">
      <AlertCircle className="mb-2 h-8 w-8 text-destructive/80" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

export function AdminToolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/80 bg-muted/25 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:min-h-[52px]",
        className
      )}
    >
      {children}
    </div>
  )
}

/** Shared base for all admin status pills — single visual language */
export const adminStatusBadgeBase =
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold tracking-tight leading-none"

const lifecycleBadgeStyles: Record<string, string> = {
  PENDING: "border-amber-200 bg-amber-100/90 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  SUBMITTED: "border-slate-200 bg-slate-100/90 text-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200",
  UNDER_REVIEW: "border-amber-200 bg-amber-100/90 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  APPROVED: "border-sky-200 bg-sky-100/90 text-sky-950 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
  SCHEDULED: "border-primary/30 bg-primary/10 text-primary",
  LIVE: "border-emerald-200 bg-emerald-100/90 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  COMPLETED: "border-border bg-muted text-muted-foreground",
  DISPUTED: "border-destructive/35 bg-destructive/10 text-destructive",
  ESCALATED: "border-orange-200 bg-orange-100/90 text-orange-950 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-100",
  RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
  ACTIVE: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100",
  INACTIVE: "border-border bg-muted text-muted-foreground",
  REJECTED: "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100",
}

const verificationTypeStyles: Record<string, string> = {
  IDENTITY: "border-violet-200 bg-violet-100/90 text-violet-950 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  BUSINESS: "border-blue-200 bg-blue-100/90 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  ENTERPRISE: "border-indigo-200 bg-indigo-100/90 text-indigo-950 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-100",
}

/** Demo access application status (PENDING / APPROVED / REJECTED) */
export function AdminDemoAccessStatusBadge({ status }: { status: string }) {
  const s = (status || "UNKNOWN").toUpperCase()
  const map: Record<string, string> = {
    APPROVED:
      "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100",
    PENDING:
      "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
    REJECTED: "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100",
    NOT_APPLIED: "border-border bg-muted text-muted-foreground",
  }
  const label =
    s === "NOT_APPLIED" || s === "UNKNOWN" ? "Not applied" : s.charAt(0) + s.slice(1).toLowerCase()
  return (
    <span className={cn(adminStatusBadgeBase, map[s] ?? map.NOT_APPLIED)}>{label}</span>
  )
}

/** Consistent status / lifecycle labels across admin first-pass pages */
export function AdminStatusBadge({
  variant,
  label,
  className,
}: {
  variant: "lifecycle" | "verification" | "pending" | "neutral"
  label: string
  className?: string
}) {
  const key = label?.toUpperCase?.().replace(/\s+/g, "_") ?? ""
  let styles = adminStatusBadgeBase
  if (variant === "lifecycle") {
    styles = cn(styles, lifecycleBadgeStyles[key] ?? "border-border bg-muted text-foreground")
  } else if (variant === "verification") {
    styles = cn(styles, verificationTypeStyles[key] ?? "border-border bg-muted text-foreground")
  } else if (variant === "pending") {
    styles = cn(
      styles,
      "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100"
    )
  } else {
    styles = cn(styles, "border-border bg-background text-muted-foreground")
  }
  const display = label.replace(/_/g, " ")
  return <span className={cn(styles, className)}>{display}</span>
}

/** Skeleton layout for operations dashboard initial load */
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-border/60 pb-6">
        <Skeleton className="h-3 w-48" />
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/80">
            <CardHeader className="pb-2">
              <Skeleton className="h-3 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

/** Row-based list shell (table-like) for review workflows — use `lg:grid-cols-12` on each row with matching col-spans */
export function AdminReviewList({
  columns,
  children,
  className,
}: {
  columns: { label: string; className?: string }[]
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm ring-1 ring-border/40", className)}>
      <div className="hidden gap-4 border-b border-border/60 bg-muted/40 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid lg:grid-cols-12">
        {columns.map((col) => (
          <div key={col.label} className={col.className}>
            {col.label}
          </div>
        ))}
      </div>
      <div className="divide-y divide-border/60">{children}</div>
    </div>
  )
}
