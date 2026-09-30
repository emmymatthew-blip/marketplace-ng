"use client"

import { LucideIcon, Inbox } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PipelineColumnEmptyProps {
  icon?: LucideIcon
  message: string
  className?: string
}

export function PipelineColumnEmpty({
  icon: Icon = Inbox,
  message,
  className,
}: PipelineColumnEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/10 px-4 py-8 text-center min-h-[120px]",
        className
      )}
      role="status"
    >
      <Icon className="h-8 w-8 text-muted-foreground/70 mb-2" aria-hidden />
      <p className="text-sm text-muted-foreground leading-snug max-w-[200px]">{message}</p>
    </div>
  )
}
