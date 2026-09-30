"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
}

export interface DashboardFilterBarProps {
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  filters?: { key: string; label: string; options: FilterOption[]; value?: string; onValueChange?: (value: string) => void }[]
  actions?: React.ReactNode
  className?: string
}

export function DashboardFilterBar({
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  filters = [],
  actions,
  className,
}: DashboardFilterBarProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-3", className)}>
      <div className="relative flex-1 w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue ?? ""}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="pl-9 h-9"
          aria-label="Search"
        />
      </div>
      {filters.map((f) => (
        <Select key={f.key} value={f.value} onValueChange={f.onValueChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-9" aria-label={f.label}>
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>
  )
}
