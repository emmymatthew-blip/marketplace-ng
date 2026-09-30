"use client"

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface DashboardKpiCardProps {
  title: string
  value: React.ReactNode
  subtitle?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  className?: string
}

export function DashboardKpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: DashboardKpiCardProps) {
  return (
    <Card className={cn("rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md", className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <span className="rounded-lg bg-muted/80 p-2">
            <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {(subtitle || trendLabel) && (
          <div className="mt-1.5 flex items-center gap-2">
            {trend === "up" && <TrendingUp className="h-3.5 w-3.5 text-emerald-600" aria-hidden />}
            {trend === "down" && <TrendingDown className="h-3.5 w-3.5 text-amber-600" aria-hidden />}
            <p className="text-xs text-muted-foreground">
              {trendLabel ?? subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
