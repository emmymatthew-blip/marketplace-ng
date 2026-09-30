import { LucideIcon, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface InsightCardProps {
  title?: string
  items: string[]
  icon?: LucideIcon
  className?: string
}

export function InsightCard({ title = "Insights & recommendations", items, icon: Icon = Lightbulb, className }: InsightCardProps) {
  return (
    <Card className={cn("rounded-xl border border-border bg-card shadow-sm", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="rounded-lg bg-primary/10 p-1.5">
            <Icon className="h-4 w-4 text-primary" aria-hidden />
          </span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No specific insights for this period. Keep engaging with leads and listings.</p>
        ) : (
          <ul className="space-y-2.5 text-sm">
            {items.map((text, i) => (
              <li key={i} className="flex gap-2 leading-relaxed">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
