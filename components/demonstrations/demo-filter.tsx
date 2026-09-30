"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export type DemoFilterRegion = "all" | "local" | "international"

/** Curated weekly programme only: filters for the approved upcoming pipeline (not an on-demand library). */
export type DemoFilterValues = {
  search: string
  category: string
  region: DemoFilterRegion
  verifiedOnly: boolean
}

export const DEMO_FILTER_DEFAULT: DemoFilterValues = {
  search: "",
  category: "all",
  region: "all",
  verifiedOnly: false,
}

interface DemoFilterProps {
  categories: string[]
  value: DemoFilterValues
  onFilterChange: (filters: DemoFilterValues) => void
  className?: string
}

export function DemoFilter({ categories, value, onFilterChange, className }: DemoFilterProps) {
  const patch = (partial: Partial<DemoFilterValues>) => {
    onFilterChange({ ...value, ...partial })
  }

  const resetFilters = () => {
    onFilterChange(DEMO_FILTER_DEFAULT)
  }

  const hasActiveFilters =
    value.search.trim() !== "" ||
    value.category !== "all" ||
    value.region !== "all" ||
    value.verifiedOnly

  return (
    <div className={cn("space-y-4", className)}>
      {/* Row 1 — discovery */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,200px)_minmax(0,200px)]">
        <div className="min-w-0 space-y-1.5 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="demo-filter-search" className="text-xs font-medium text-muted-foreground">
            Search
          </Label>
          <div className="relative flex h-10 w-full items-center">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="demo-filter-search"
              placeholder="Search demonstrations, topics, or hosts…"
              value={value.search}
              onChange={(e) => patch({ search: e.target.value })}
              className={cn(
                "h-10 w-full border-border/80 bg-background/80 pl-9 pr-3 shadow-sm",
                "placeholder:text-muted-foreground/70 focus-visible:ring-1"
              )}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="demo-filter-category" className="text-xs font-medium text-muted-foreground">
            Category
          </Label>
          <Select value={value.category} onValueChange={(v) => patch({ category: v })}>
            <SelectTrigger id="demo-filter-category" className="h-10 border-border/80 bg-background/80 shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="demo-filter-region" className="text-xs font-medium text-muted-foreground">
            Region
          </Label>
          <Select value={value.region} onValueChange={(v) => patch({ region: v as DemoFilterRegion })}>
            <SelectTrigger id="demo-filter-region" className="h-10 border-border/80 bg-background/80 shadow-sm">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              <SelectItem value="local">Local (Nigeria)</SelectItem>
              <SelectItem value="international">International</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2 — trust + reset */}
      <div className="flex flex-col gap-3 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="demo-filter-verified"
            checked={value.verifiedOnly}
            onCheckedChange={(checked) => patch({ verifiedOnly: checked })}
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="demo-filter-verified" className="cursor-pointer text-sm font-medium leading-none">
            Verified demonstration hosts only
          </Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 border-dashed text-muted-foreground hover:text-foreground"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          Reset filters
        </Button>
      </div>
    </div>
  )
}
