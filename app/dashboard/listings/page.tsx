"use client"

import { useEffect, useState, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Pause, Megaphone, BarChart3, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DashboardPageContainer,
  DashboardHeader,
  DashboardCard,
  DashboardFilterBar,
  DashboardEmptyState,
  StatusBadge,
} from "@/components/dashboard"

interface ListingRow {
  id: string
  product: string
  category: string
  views: number
  inquiries: number
  status: "active" | "paused"
  lastUpdated: string
}

function formatLastUpdated(dateStr: string) {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 3600000) return "Just now"
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`
    if (diff < 172800000) return "Yesterday"
    const days = Math.floor(diff / 86400000)
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
  } catch {
    return "—"
  }
}

export default function DashboardListingsPage() {
  const { data: session } = useSession()
  const [listings, setListings] = useState<ListingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredListings = useMemo(() => {
    let out = listings
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      out = out.filter((r) => r.product.toLowerCase().includes(q) || r.category.toLowerCase().includes(q))
    }
    if (statusFilter !== "all") out = out.filter((r) => r.status === statusFilter)
    return out
  }, [listings, search, statusFilter])

  useEffect(() => {
    const userId = (session?.user as any)?.id
    if (!userId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch(`/api/products?ownerId=${userId}&limit=100`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res) => {
        if (cancelled) return
        const data = Array.isArray(res) ? res : res?.data ?? []
        setListings(
          data.map((p: any) => ({
            id: p.id,
            product: p.title ?? "Untitled",
            category: p.category?.name ?? p.categoryName ?? "—",
            views: (p as any).viewCount ?? 0,
            inquiries: (p as any).inquiryCount ?? 0,
            status: "active" as const,
            lastUpdated: formatLastUpdated(p.updatedAt ?? p.createdAt ?? ""),
          }))
        )
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [session?.user])

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title="Listings"
        description="Manage your advertised products and monitor performance."
        actions={
          <Button asChild size="sm">
            <Link href="/marketplace/my-products/new">
              <Plus className="h-4 w-4 mr-1.5" aria-hidden />
              Create listing
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        <DashboardFilterBar
          searchPlaceholder="Search listings…"
          searchValue={search}
          onSearchChange={setSearch}
          filters={[
            {
              key: "status",
              label: "Status",
              value: statusFilter,
              onValueChange: setStatusFilter,
              options: [
                { value: "all", label: "All statuses" },
                { value: "active", label: "Active" },
                { value: "paused", label: "Paused" },
              ],
            },
          ]}
        />

        <DashboardCard
          title="All listings"
          description="Views, inquiries, and last updated. Use the menu on each row to edit, pause, promote, or view analytics."
        >
          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <DashboardEmptyState
              icon={Package}
              title="No listings published yet"
              description="Create your first listing to showcase your products and start receiving inquiries from partners."
              secondaryHint="Listings appear in the marketplace and can be linked to inquiries and agreements."
              action={
                <Button asChild>
                  <Link href="/marketplace/my-products/new">Create listing</Link>
                </Button>
              }
            />
          ) : filteredListings.length === 0 ? (
            <DashboardEmptyState
              icon={Package}
              title="No listings match your filters"
              description="Try adjusting search or status filter."
              action={
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all") }}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Listing</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Inquiries</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-muted-foreground">Updated</TableHead>
                  <TableHead className="w-[52px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredListings.map((row) => (
                  <TableRow key={row.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <Link href={`/marketplace/my-products/${row.id}/edit`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded">
                        {row.product}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.category}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.views}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.inquiries}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{row.lastUpdated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Row actions">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/marketplace/my-products/${row.id}/edit`}>
                              <Pencil className="h-4 w-4 mr-2" aria-hidden />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="h-4 w-4 mr-2" aria-hidden />
                            Pause
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Megaphone className="h-4 w-4 mr-2" aria-hidden />
                            Promote
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/analytics?listing=${row.id}`}>
                              <BarChart3 className="h-4 w-4 mr-2" aria-hidden />
                              View analytics
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DashboardCard>
      </div>
    </DashboardPageContainer>
  )
}
