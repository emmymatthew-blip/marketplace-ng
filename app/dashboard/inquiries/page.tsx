"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InquiryCard, type InquiryCardData } from "@/components/inquiry/inquiry-card"
import { PipelineColumnEmpty } from "@/components/inquiry/pipeline-column-empty"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DashboardPageContainer,
  DashboardHeader,
  DashboardEmptyState,
  DashboardKpiCard,
  type FilterOption,
} from "@/components/dashboard"
import {
  Inbox,
  MessageSquare,
  PlusCircle,
  Search,
  TrendingUp,
  Handshake,
  FileCheck,
  CheckCircle2,
  Info,
  ArrowUpDown,
  KanbanSquare,
  List,
  CalendarRange,
  TimerReset,
  ArrowRightCircle,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

const PIPELINE_COLUMNS = [
  {
    key: "NEW",
    title: "New",
    helperText: "Fresh inquiries awaiting response",
    emptyMessage: "No new inquiries yet. New leads will appear here when partners contact you from your listings.",
  },
  {
    key: "CONTACTED",
    title: "Contacted",
    helperText: "You've replied; follow up as needed",
    emptyMessage: "Leads you've replied to will appear here.",
  },
  {
    key: "NEGOTIATING",
    title: "Negotiating",
    helperText: "Active discussions in progress",
    emptyMessage: "Leads in active discussion will appear here.",
  },
  {
    key: "AGREEMENT_CREATED",
    title: "Agreement Stage",
    helperText: "Agreement created; track in Agreements",
    emptyMessage: "Once an agreement is created from an inquiry, it will appear here.",
  },
  {
    key: "CLOSED",
    title: "Closed",
    helperText: "Completed or closed leads",
    emptyMessage: "Closed or completed leads will appear here.",
  },
] as const

type PipelineKey = (typeof PIPELINE_COLUMNS)[number]["key"]

function getInquiryCounts(inquiries: InquiryCardData[]): Record<PipelineKey, number> {
  const counts = {} as Record<PipelineKey, number>
  PIPELINE_COLUMNS.forEach((col) => {
    counts[col.key] = inquiries.filter((i) => i.status === col.key).length
  })
  return counts
}

function getNewThisWeekCount(inquiries: InquiryCardData[]): number {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return inquiries.filter((i) => {
    const created = new Date(i.createdAt).getTime()
    return created >= weekAgo.getTime() && i.status === "NEW"
  }).length
}

function getAwaitingResponseCount(inquiries: InquiryCardData[]): number {
  return inquiries.filter((i) => i.status === "NEW").length
}

function getUniqueListingCount(inquiries: InquiryCardData[]): number {
  const ids = new Set(inquiries.map((i) => i.product?.id).filter(Boolean))
  return ids.size
}

function filterInquiries(
  inquiries: InquiryCardData[],
  search: string,
  statusFilter: string,
  listingFilter: string,
  dateFilter: string,
  sortOrder: string
): InquiryCardData[] {
  let result = inquiries
  const q = search.trim().toLowerCase()
  if (q) {
    result = result.filter(
      (i) =>
        (i.product?.title ?? "").toLowerCase().includes(q) ||
        (i.buyer?.companyName ?? "").toLowerCase().includes(q) ||
        (i.buyer?.name ?? "").toLowerCase().includes(q) ||
        (i.companyName ?? "").toLowerCase().includes(q)
    )
  }
  if (statusFilter && statusFilter !== "ALL") {
    result = result.filter((i) => i.status === statusFilter)
  }
  if (listingFilter && listingFilter !== "ALL") {
    result = result.filter((i) => i.product?.id === listingFilter)
  }
  if (dateFilter && dateFilter !== "ALL") {
    const now = new Date()
    const days = dateFilter === "7D" ? 7 : dateFilter === "30D" ? 30 : 90
    const minDate = new Date(now)
    minDate.setDate(now.getDate() - days)
    result = result.filter((i) => new Date(i.createdAt).getTime() >= minDate.getTime())
  }
  result = [...result].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime()
    const bTime = new Date(b.createdAt).getTime()
    return sortOrder === "OLDEST" ? aTime - bTime : bTime - aTime
  })
  return result
}

export default function DashboardInquiriesPage() {
  const { data: session } = useSession()
  const [inquiries, setInquiries] = useState<InquiryCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [listingFilter, setListingFilter] = useState("ALL")
  const [dateFilter, setDateFilter] = useState("ALL")
  const [sortOrder, setSortOrder] = useState("NEWEST")
  const [viewMode, setViewMode] = useState<"pipeline" | "list">("pipeline")

  const fetchInquiries = () => {
    const userId = (session?.user as any)?.id
    if (!userId) return
    setLoading(true)
    fetch("/api/inquiries?role=vendor")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setInquiries(Array.isArray(data) ? data : [])
      })
      .catch(() => setInquiries([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInquiries()
  }, [session?.user?.id])

  const filteredInquiries = useMemo(
    () => filterInquiries(inquiries, search, statusFilter, listingFilter, dateFilter, sortOrder),
    [inquiries, search, statusFilter, listingFilter, dateFilter, sortOrder]
  )

  const byStatus = useMemo(() => {
    const acc = {} as Record<PipelineKey, InquiryCardData[]>
    PIPELINE_COLUMNS.forEach((col) => {
      acc[col.key] = filteredInquiries.filter((i) => i.status === col.key)
    })
    return acc
  }, [filteredInquiries])

  const counts = useMemo(() => getInquiryCounts(filteredInquiries), [filteredInquiries])
  const newThisWeek = useMemo(() => getNewThisWeekCount(inquiries), [inquiries])
  const awaitingResponse = useMemo(() => getAwaitingResponseCount(filteredInquiries), [filteredInquiries])
  const agreementStageCount = counts.AGREEMENT_CREATED
  const uniqueListings = useMemo(() => getUniqueListingCount(filteredInquiries), [filteredInquiries])
  const topListing = useMemo(() => {
    const listingCounts = new Map<string, { title: string; count: number }>()
    filteredInquiries.forEach((inquiry) => {
      if (!inquiry.product?.id) return
      const existing = listingCounts.get(inquiry.product.id)
      listingCounts.set(inquiry.product.id, {
        title: inquiry.product.title ?? "Listing",
        count: (existing?.count ?? 0) + 1,
      })
    })
    return Array.from(listingCounts.values()).sort((a, b) => b.count - a.count)[0] ?? null
  }, [filteredInquiries])

  const listingOptions = useMemo((): FilterOption[] => {
    const seen = new Set<string>()
    const options: FilterOption[] = [{ value: "ALL", label: "All listings" }]
    inquiries.forEach((i) => {
      if (i.product?.id && !seen.has(i.product.id)) {
        seen.add(i.product.id)
        options.push({ value: i.product.id, label: (i.product.title ?? "Listing").slice(0, 40) + (i.product.title && i.product.title.length > 40 ? "…" : "") })
      }
    })
    return options
  }, [inquiries])

  const statusOptions: FilterOption[] = [
    { value: "ALL", label: "All statuses" },
    ...PIPELINE_COLUMNS.map((col) => ({ value: col.key, label: col.title })),
  ]
  const dateOptions: FilterOption[] = [
    { value: "ALL", label: "Any date" },
    { value: "7D", label: "Last 7 days" },
    { value: "30D", label: "Last 30 days" },
    { value: "90D", label: "Last 90 days" },
  ]
  const sortOptions: FilterOption[] = [
    { value: "NEWEST", label: "Newest first" },
    { value: "OLDEST", label: "Oldest first" },
  ]

  const totalInquiries = inquiries.length
  const hasFilteredResults = filteredInquiries.length > 0

  return (
    <DashboardPageContainer className="space-y-6">
      <DashboardHeader
        title="Lead Center"
        description="Manage incoming business opportunities from your listings, prioritize replies, and move qualified inquiries toward negotiation and agreement."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/messages">
                <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                View Messages
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/marketplace/my-products/new">
                <PlusCircle className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                Create Listing
              </Link>
            </Button>
          </div>
        }
      />

      {loading ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[88px] rounded-xl border border-border" />
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <Skeleton className="h-9 flex-1 max-w-sm" />
            <Skeleton className="h-9 w-[180px]" />
            <Skeleton className="h-9 w-[180px]" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-2xl rounded-lg" />
            <Card className="rounded-xl border border-border min-h-[320px]">
              <CardHeader className="pb-2 space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </>
      ) : totalInquiries === 0 ? (
        <DashboardEmptyState
          icon={Inbox}
          title="No inquiries yet"
          description="When partners contact you from your listings, inquiries will appear here. Create and publish listings to start receiving leads."
          secondaryHint="Share your listing links or encourage visitors to use “Request quote” on your product pages."
          action={
            <Button asChild>
              <Link href="/marketplace/my-products/new">Create listing</Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* KPI summary row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <DashboardKpiCard
              title="Total inquiries"
              value={filteredInquiries.length}
              icon={Inbox}
              subtitle={totalInquiries !== filteredInquiries.length ? `of ${totalInquiries} total` : undefined}
            />
            <DashboardKpiCard
              title="New this week"
              value={newThisWeek}
              icon={TrendingUp}
              subtitle="Fresh opportunities to qualify"
            />
            <DashboardKpiCard
              title="Negotiating"
              value={counts.NEGOTIATING}
              icon={Handshake}
              subtitle="Active commercial discussions"
            />
            <DashboardKpiCard
              title="Agreement stage"
              value={agreementStageCount}
              icon={FileCheck}
              subtitle="Closer to conversion"
            />
            <DashboardKpiCard
              title="Closed"
              value={counts.CLOSED}
              icon={CheckCircle2}
              subtitle="Won or resolved opportunities"
            />
          </div>

          {/* Context / insight strip */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0 text-muted-foreground/80" aria-hidden />
            <span>
              <strong className="text-foreground font-medium">{filteredInquiries.length}</strong> inquiry{filteredInquiries.length !== 1 ? "ies" : ""} across{" "}
              <strong className="text-foreground font-medium">{uniqueListings}</strong> listing{uniqueListings !== 1 ? "s" : ""}.
            </span>
            {awaitingResponse > 0 && (
              <span className="lg:ml-auto">
                <strong className="text-foreground font-medium">{awaitingResponse}</strong> awaiting your response.
              </span>
            )}
            {agreementStageCount > 0 && (
              <span>
                <strong className="text-foreground font-medium">{agreementStageCount}</strong> in agreement stage.
              </span>
            )}
            {topListing && (
              <span>
                <strong className="text-foreground font-medium">{topListing.title}</strong> is generating the most lead activity.
              </span>
            )}
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium">
              Listing → Inquiry → Conversation → Agreement
            </span>
          </div>

          {/* Toolbar */}
          <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardContent className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                <div className="relative flex-1 w-full xl:max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    type="search"
                    placeholder="Search by company or listing…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9"
                    aria-label="Search inquiries"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-center">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full xl:w-[180px] h-9" aria-label="Filter by status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={listingFilter} onValueChange={setListingFilter}>
                    <SelectTrigger className="w-full xl:w-[220px] h-9" aria-label="Filter by listing">
                      <SelectValue placeholder="Listing" />
                    </SelectTrigger>
                    <SelectContent>
                      {listingOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full xl:w-[170px] h-9" aria-label="Filter by date">
                      <CalendarRange className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full xl:w-[170px] h-9" aria-label="Sort inquiries">
                      <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Sort order" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Review incoming leads, open conversations quickly, and move serious opportunities into agreement stage.
                </p>
                <div className="hidden lg:inline-flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1">
                  <Button
                    type="button"
                    variant={viewMode === "pipeline" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("pipeline")}
                  >
                    <KanbanSquare className="mr-1.5 h-4 w-4" />
                    By stage
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="mr-1.5 h-4 w-4" />
                    Table
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {!hasFilteredResults ? (
            <DashboardEmptyState
              icon={Search}
              title="No matching inquiries"
              description="No matching inquiries. Try broadening your search or clearing one or more filters."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("")
                    setStatusFilter("ALL")
                    setListingFilter("ALL")
                    setDateFilter("ALL")
                    setSortOrder("NEWEST")
                  }}
                >
                  <TimerReset className="mr-1.5 h-4 w-4" />
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              {viewMode === "pipeline" ? (
                <Tabs defaultValue={PIPELINE_COLUMNS[0].key} className="w-full">
                  <TabsList className="w-full h-auto flex flex-wrap sm:flex-nowrap gap-1 p-1 bg-muted/30 justify-start overflow-x-auto">
                    {PIPELINE_COLUMNS.map((col) => {
                      const count = (byStatus[col.key] ?? []).length
                      return (
                        <TabsTrigger
                          key={col.key}
                          value={col.key}
                          className="shrink-0 data-[state=active]:bg-background data-[state=active]:shadow-sm px-3"
                        >
                          <span className="whitespace-nowrap">{col.title}</span>
                          <span className="ml-1.5 rounded-full bg-muted px-1.5 text-[10px] font-medium tabular-nums data-[state=active]:bg-primary/10">
                            {count}
                          </span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                  {PIPELINE_COLUMNS.map((col) => {
                    const columnInquiries = byStatus[col.key] ?? []
                    const count = columnInquiries.length
                    return (
                      <TabsContent key={col.key} value={col.key} className="mt-4 focus-visible:outline-none">
                        <Card className="rounded-xl border border-border bg-card shadow-sm">
                          <CardHeader className="pb-2 border-b border-border/50 bg-muted/10 rounded-t-xl">
                            <div className="flex items-center justify-between gap-2">
                              <CardTitle className="text-base font-semibold">{col.title}</CardTitle>
                              <span className="flex h-7 min-w-[28px] items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-semibold text-primary">
                                {count}
                              </span>
                            </div>
                            <CardDescription className="text-sm mt-1">{col.helperText}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-4">
                            {count === 0 ? (
                              <PipelineColumnEmpty message={col.emptyMessage} />
                            ) : (
                              columnInquiries.map((inquiry) => (
                                <InquiryCard
                                  key={inquiry.id}
                                  inquiry={inquiry}
                                  refetch={fetchInquiries}
                                  variant="list"
                                />
                              ))
                            )}
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )
                  })}
                </Tabs>
              ) : (
                <Card className="hidden lg:block rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                  <CardHeader className="border-b border-border/60 bg-muted/10">
                    <CardTitle className="text-base">Inquiry list view</CardTitle>
                    <CardDescription>Scan opportunities quickly and take action without leaving the page.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sender / Company</TableHead>
                          <TableHead>Related listing</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Latest activity</TableHead>
                          <TableHead>Date received</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInquiries.map((inquiry) => {
                          const buyerId = inquiry.buyer?.id
                          const statusLabel =
                            inquiry.status === "AGREEMENT_CREATED"
                              ? "Agreement stage"
                              : PIPELINE_COLUMNS.find((col) => col.key === inquiry.status)?.title ?? inquiry.status
                          const latestActivity =
                            inquiry.agreementId || inquiry.status === "AGREEMENT_CREATED"
                              ? "Agreement created"
                              : inquiry.status === "NEGOTIATING"
                                ? "Negotiating"
                                : inquiry.status === "CONTACTED"
                                  ? "Conversation opened"
                                  : inquiry.status === "CLOSED"
                                    ? "Closed"
                                    : "Awaiting response"
                          return (
                            <TableRow key={inquiry.id}>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-foreground">
                                    {inquiry.buyer?.companyName || inquiry.companyName || inquiry.buyer?.name || "Unknown company"}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {inquiry.country || "Location not provided"}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Link href={`/marketplace/product/${inquiry.product?.id}`} className="font-medium hover:underline">
                                  {inquiry.product?.title ?? "Listing"}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary" className="text-xs">
                                  {statusLabel}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{latestActivity}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(inquiry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-2">
                                  {buyerId && (
                                    <Button size="sm" variant="outline" asChild>
                                      <Link href={`/messages/${buyerId}?productId=${inquiry.product?.id}`}>
                                        Open conversation
                                      </Link>
                                    </Button>
                                  )}
                                  {inquiry.status !== "NEGOTIATING" &&
                                    inquiry.status !== "CLOSED" &&
                                    inquiry.status !== "LOST" &&
                                    inquiry.status !== "AGREEMENT_CREATED" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={async () => {
                                          await fetch(`/api/inquiries/${inquiry.id}`, {
                                            method: "PATCH",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ status: "NEGOTIATING" }),
                                          }).catch(() => {})
                                          fetchInquiries()
                                        }}
                                      >
                                        <ArrowRightCircle className="mr-1.5 h-4 w-4" />
                                        Negotiate
                                      </Button>
                                    )}
                                  {!inquiry.agreementId && buyerId ? (
                                    <Button size="sm" variant="outline" asChild>
                                      <Link href={`/agreements/new?recipient=${buyerId}&product=${inquiry.product?.id}&inquiryId=${inquiry.id}`}>
                                        Create Agreement
                                      </Link>
                                    </Button>
                                  ) : inquiry.agreementId ? (
                                    <Button size="sm" variant="outline" asChild>
                                      <Link href={`/agreements/${inquiry.agreementId}`}>View Agreement</Link>
                                    </Button>
                                  ) : null}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </DashboardPageContainer>
  )
}
