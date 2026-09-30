"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react"
import { cn } from "@/lib/utils"

const CHIP_VISIBLE_MAX = 10
const SEARCH_DEBOUNCE_MS = 300

interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  parentId?: string
  children?: ProductCategory[]
  productCount?: number
  isActive: boolean
  sortOrder: number
}

interface ProductCategoryFilterProps {
  categories: ProductCategory[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
  onSearchChange?: (search: string) => void
  className?: string
}

function nodeMatchesTerm(node: ProductCategory, term: string): boolean {
  const t = term.toLowerCase().trim()
  if (!t) return true
  const nameMatch = node.name.toLowerCase().includes(t)
  const descMatch = !!node.description?.toLowerCase().includes(t)
  return nameMatch || descMatch
}

/** Recursively filter tree: keep node if it matches OR any child matches; children are pruned to matching subtree. */
function filterCategoryTree(
  categories: ProductCategory[],
  term: string
): ProductCategory[] {
  const t = term.toLowerCase().trim()
  if (!t) return categories

  const result: ProductCategory[] = []
  for (const cat of categories) {
    const filteredChildren =
      cat.children && cat.children.length > 0
        ? filterCategoryTree(cat.children, term)
        : []
    const selfMatch = nodeMatchesTerm(cat, term)
    const childMatch = filteredChildren.length > 0
    if (selfMatch || childMatch) {
      result.push({
        ...cat,
        children: filteredChildren,
      })
    }
  }
  return result
}

/** Collect all category ids in tree (for auto-expand when search is active). */
function collectCategoryIds(categories: ProductCategory[]): Set<string> {
  const ids = new Set<string>()
  function walk(nodes: ProductCategory[]) {
    for (const n of nodes) {
      ids.add(n.id)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(categories)
  return ids
}

export function ProductCategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  onSearchChange,
  className,
}: ProductCategoryFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const filteredTree = useMemo(
    () => filterCategoryTree(categories, searchTerm),
    [categories, searchTerm]
  )

  const autoExpandedIds = useMemo(
    () => (searchTerm.trim() ? collectCategoryIds(filteredTree) : new Set<string>()),
    [searchTerm, filteredTree]
  )

  const isSearchActive = searchTerm.trim().length > 0
  const effectiveExpanded = isSearchActive ? autoExpandedIds : expandedCategories

  useEffect(() => {
    if (!onSearchChange) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearchChange(searchTerm)
      debounceRef.current = null
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchTerm, onSearchChange])

  const toggleCategory = (categoryId: string) => {
    if (isSearchActive) return
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const renderCategory = (category: ProductCategory, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = hasChildren && effectiveExpanded.has(category.id)
    const isSelected = selectedCategory === category.id

    return (
      <div key={category.id} className="space-y-1">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg transition-colors",
            "min-h-9",
            isSelected
              ? "bg-primary text-white"
              : "hover:bg-muted"
          )}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                toggleCategory(category.id)
              }}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse category" : "Expand category"}
              className="shrink-0 p-1 rounded hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <span className="w-5 shrink-0" aria-hidden />
          )}
          <button
            type="button"
            onClick={() => onCategorySelect(category.id)}
            className="flex flex-1 items-center gap-2 rounded py-2 pr-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="truncate">{category.name}</span>
            {category.productCount !== undefined && (
              <Badge
                variant="secondary"
                className="ml-auto shrink-0 bg-blue-500 text-white border-0"
              >
                {category.productCount}
              </Badge>
            )}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const isAllSelected = selectedCategory == null || selectedCategory === ""

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Product Categories
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search categories"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg transition-colors min-h-9",
            isAllSelected ? "bg-primary text-white" : "hover:bg-muted"
          )}
        >
          <span className="w-5 shrink-0" aria-hidden />
          <button
            type="button"
            onClick={() => onCategorySelect("")}
            className="flex flex-1 items-center gap-2 rounded py-2 pr-2 text-left text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            All Categories
          </button>
        </div>

        {filteredTree.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">
            No categories found
          </div>
        ) : (
          <div className="space-y-1">
            {filteredTree.map((category) => renderCategory(category, 0))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/** Flatten tree to list for chips (breadth-first so top-level first). */
function flattenCategories(categories: ProductCategory[]): ProductCategory[] {
  const out: ProductCategory[] = []
  function walk(nodes: ProductCategory[]) {
    for (const n of nodes) {
      out.push(n)
      if (n.children?.length) walk(n.children)
    }
  }
  walk(categories)
  return out
}

export function ProductCategoryChips({
  categories,
  selectedCategory,
  onCategorySelect,
  className,
}: {
  categories: ProductCategory[]
  selectedCategory?: string
  onCategorySelect: (categoryId: string) => void
  className?: string
}) {
  const flat = useMemo(() => flattenCategories(categories), [categories])
  const visible = flat.slice(0, CHIP_VISIBLE_MAX)
  const more = flat.slice(CHIP_VISIBLE_MAX)
  const isAllSelected = selectedCategory == null || selectedCategory === ""

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant={isAllSelected ? "default" : "outline"}
        size="sm"
        onClick={() => onCategorySelect("")}
        className="shrink-0"
      >
        All
      </Button>
      {visible.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(category.id)}
          className="flex items-center gap-2 shrink-0"
        >
          {category.name}
          {category.productCount !== undefined && (
            <Badge
              variant="secondary"
              className="ml-1 border-0 bg-blue-500 text-white text-xs"
            >
              {category.productCount}
            </Badge>
          )}
        </Button>
      ))}
      {more.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0 gap-1">
              <MoreHorizontal className="h-4 w-4" />
              More ({more.length})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[min(80vh,400px)] overflow-y-auto">
            {more.map((category) => (
              <DropdownMenuItem
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
              >
                <span className="truncate">{category.name}</span>
                {category.productCount !== undefined && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {category.productCount}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
