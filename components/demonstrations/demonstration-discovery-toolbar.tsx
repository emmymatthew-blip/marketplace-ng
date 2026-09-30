"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type SortBy = "soonest" | "newest" | "featured"

type Props = {
  sortBy: SortBy
  onSortChange: (v: SortBy) => void
  className?: string
}

/** Sort order for approved upcoming weekly sessions (filters live in DemoFilter). */
export function DemonstrationDiscoveryToolbar({ sortBy, onSortChange, className }: Props) {
  return (
    <div className={cn("flex flex-col items-stretch gap-2 sm:flex-row sm:items-end sm:justify-end", className)}>
      <div className="space-y-1.5 w-full sm:max-w-[260px]">
        <Label htmlFor="demo-sort" className="text-xs text-muted-foreground">
          Sort upcoming sessions
        </Label>
        <Select value={sortBy} onValueChange={(v) => onSortChange(v as SortBy)}>
          <SelectTrigger id="demo-sort" className="h-9 w-full border-border/80 bg-background/80 shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soonest">Soonest session first</SelectItem>
            <SelectItem value="newest">Recently added</SelectItem>
            <SelectItem value="featured">Featured first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
