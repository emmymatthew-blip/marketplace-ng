import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: string
  title: string
  subtitle?: string
  time: string
  href?: string
  isUnread?: boolean
}

export interface ActivityFeedCardProps {
  title: string
  description?: string
  items: ActivityItem[]
  emptyMessage?: string
  viewAllHref?: string
  viewAllLabel?: string
  icon?: LucideIcon
  className?: string
}

export function ActivityFeedCard({
  title,
  description,
  items,
  emptyMessage = "No activity yet",
  viewAllHref,
  viewAllLabel = "View all",
  icon: Icon,
  className,
}: ActivityFeedCardProps) {
  return (
    <Card className={cn("rounded-xl border border-border bg-card shadow-sm", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground mb-1.5" aria-hidden />}
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {viewAllHref && items.length > 0 && (
          <Button variant="ghost" size="sm" className="text-xs shrink-0" asChild>
            <Link href={viewAllHref}>{viewAllLabel}</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">{emptyMessage}</p>
        ) : (
          <ul className="space-y-0 divide-y divide-border">
            {items.slice(0, 5).map((item) => (
              <li key={item.id}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col gap-0.5 py-3 px-0 -mx-0 rounded-lg transition-colors hover:bg-muted/50",
                      item.isUnread && "bg-muted/30"
                    )}
                  >
                    <span className={cn("text-sm font-medium", item.isUnread && "font-semibold")}>{item.title}</span>
                    {item.subtitle && <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>}
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-0.5 py-3">
                    <span className={cn("text-sm font-medium", item.isUnread && "font-semibold")}>{item.title}</span>
                    {item.subtitle && <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>}
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
