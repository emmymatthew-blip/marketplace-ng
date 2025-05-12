"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Filter, Calendar } from "lucide-react"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"

interface DemoFilterProps {
  categories: string[]
  onFilterChange: (filters: {
    search: string
    category: string
    date: Date | undefined
    showFreeOnly: boolean
  }) => void
}

export function DemoFilter({ categories, onFilterChange }: DemoFilterProps) {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [date, setDate] = useState<Date>()
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, category, date, showFreeOnly })
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value)
    onFilterChange({ search, category: value, date, showFreeOnly })
  }

  const handleDateChange = (value: Date | undefined) => {
    setDate(value)
    onFilterChange({ search, category, date: value, showFreeOnly })
  }

  const handleFreeOnlyChange = (checked: boolean) => {
    setShowFreeOnly(checked)
    onFilterChange({ search, category, date, showFreeOnly: checked })
  }

  const resetFilters = () => {
    setSearch("")
    setCategory("all")
    setDate(undefined)
    setShowFreeOnly(false)
    onFilterChange({ search: "", category: "all", date: undefined, showFreeOnly: false })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search demonstrations..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary"
          />
        </div>
        <div className="flex gap-4">
          <Select value={category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm border-gray-200 focus:border-primary">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[180px] justify-start bg-white/50 backdrop-blur-sm border-gray-200 hover:border-primary"
              >
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="free-only"
          checked={showFreeOnly}
          onCheckedChange={handleFreeOnlyChange}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="free-only" className="text-sm font-medium">
          Show free demonstrations only
        </Label>
      </div>
      <div className="flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Filter Options</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="free-only-popup" checked={showFreeOnly} onCheckedChange={handleFreeOnlyChange} />
                  <Label htmlFor="free-only-popup">Free demonstrations only</Label>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
