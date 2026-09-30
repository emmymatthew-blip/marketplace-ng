import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface DashboardStatCardProps {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon?: LucideIcon
  className?: string
}

export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
}: DashboardStatCardProps) {
  return (
    <Card className={cn("rounded-xl border border-border shadow-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  )
}
