import { LucideIcon, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DashboardEmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  secondaryHint?: string
  action?: React.ReactNode
  className?: string
}

export function DashboardEmptyState({
  icon: Icon = Inbox,
  title,
  description,
  secondaryHint,
  action,
  className,
}: DashboardEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-14 text-center",
        className
      )}
      role="status"
      aria-label={title}
    >
      <div className="rounded-full bg-muted/80 p-5">
        <Icon className="h-10 w-10 text-muted-foreground" aria-hidden />
      </div>
      <h3 className="mt-5 text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-muted-foreground leading-relaxed">{description}</p>
      )}
      {secondaryHint && (
        <p className="mt-1 text-xs text-muted-foreground/80 max-w-xs">{secondaryHint}</p>
      )}
      {action && <div className="mt-6 flex flex-col items-center gap-2">{action}</div>}
    </div>
  )
}
