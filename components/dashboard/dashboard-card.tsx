import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const cardRadius = "rounded-xl"
const cardBorder = "border border-border shadow-sm"

export interface DashboardCardProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function DashboardCard({
  title,
  description,
  action,
  children,
  footer,
  className,
}: DashboardCardProps) {
  return (
    <Card className={cn(cardRadius, cardBorder, className)}>
      {(title || description || action) && (
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 pb-2">
          <div className="space-y-1.5">
            {title && <CardTitle className="text-base">{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </CardHeader>
      )}
      <CardContent className={title || description || action ? "pt-0" : undefined}>
        {children}
      </CardContent>
      {footer && <CardFooter className="border-t pt-4">{footer}</CardFooter>}
    </Card>
  )
}

export { cardRadius, cardBorder }
