"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"
import {
  Eye,
  Inbox,
  FileCheck,
  TrendingUp,
  Calendar,
  User,
  LayoutList,
  Globe,
  Lightbulb,
  Target,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardPageContainer, DashboardHeader, DashboardEmptyState } from "@/components/dashboard"

const DATE_RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
] as const

type DashboardData = {
  kpis: {
    totalViews: number
    totalInquiries: number
    activeAgreements: number
    conversionRate: number
    demoRegistrations: number
    profileViews: number
  }
  funnel: {
    listingViews: number
    productDetailVisits: number
    inquiries: number
    conversations: number
    agreementsCreated: number
    agreementsCompleted: number
  }
  viewsOverTime: { date: string; views: number }[]
  leadsOverTime: { date: string; leads: number }[]
  agreementConversionOverTime: { date: string; created: number; completed: number }[]
  topListings: { productId: string; title: string; views: number; inquiries: number; conversion: number }[]
  audienceByCountry: { country: string; count: number }[]
  insights: string[]
  dateRange: { from: string; to: string }
} | null

type ListingsRow = {
  productId: string
  product: string
  views: number
  uniqueViews: number
  inquiries: number
  agreements: number
  conversion: number
  lastActivity: string
}

type LeadsData = {
  recentInquiries: { id: string; productTitle: string | null; companyName: string | null; country: string | null; status: string; createdAt: string }[]
  statusDistribution: { status: string; count: number }[]
  topCountries: { country: string; count: number }[]
  topCategories: { name: string; count: number }[]
  dateRange: { from: string; to: string }
} | null

type AgreementsData = {
  summary: { offersSent: number; accepted: number; active: number; completed: number; disputed: number }
  byStatus: { status: string; count: number }[]
  conversionByProduct: { productId: string; title: string; count: number }[]
  dateRange: { from: string; to: string }
} | null

type AudienceData = {
  audienceByCountry: { country: string; count: number }[]
  profileViews: number
  listingViews: number
  demoViews: number
  dateRange: { from: string; to: string }
} | null

const viewsChartConfig: ChartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
}
const leadsChartConfig: ChartConfig = {
  leads: { label: "Leads", color: "hsl(var(--chart-2))" },
}
const agreementChartConfig: ChartConfig = {
  created: { label: "Created", color: "hsl(var(--chart-1))" },
  completed: { label: "Completed", color: "hsl(var(--chart-2))" },
}
const topListingsChartConfig: ChartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
  inquiries: { label: "Inquiries", color: "hsl(var(--chart-2))" },
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined })
}

export default function DashboardAnalyticsPage() {
  const [range, setRange] = useState<string>("30d")
  const [dashboard, setDashboard] = useState<DashboardData>(null)
  const [listings, setListings] = useState<{ rows: ListingsRow[] } | null>(null)
  const [leads, setLeads] = useState<LeadsData>(null)
  const [agreements, setAgreements] = useState<AgreementsData>(null)
  const [audience, setAudience] = useState<AudienceData>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState("overview")
  const [loadingTab, setLoadingTab] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/dashboard?range=${range}`)
      if (res.ok) setDashboard(await res.json())
      else setDashboard(null)
    } catch {
      setDashboard(null)
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  useEffect(() => {
    if (tab !== "listings") return
    setLoadingTab("listings")
    fetch(`/api/analytics/listings?range=${range}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setListings(data)
        setLoadingTab(null)
      })
      .catch(() => {
        setListings(null)
        setLoadingTab(null)
      })
  }, [tab, range])

  useEffect(() => {
    if (tab !== "leads") return
    setLoadingTab("leads")
    fetch(`/api/analytics/leads?range=${range}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setLeads(data)
        setLoadingTab(null)
      })
      .catch(() => {
        setLeads(null)
        setLoadingTab(null)
      })
  }, [tab, range])

  useEffect(() => {
    if (tab !== "agreements") return
    setLoadingTab("agreements")
    fetch(`/api/analytics/agreements?range=${range}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setAgreements(data)
        setLoadingTab(null)
      })
      .catch(() => {
        setAgreements(null)
        setLoadingTab(null)
      })
  }, [tab, range])

  useEffect(() => {
    if (tab !== "audience") return
    setLoadingTab("audience")
    fetch(`/api/analytics/audience?range=${range}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setAudience(data)
        setLoadingTab(null)
      })
      .catch(() => {
        setAudience(null)
        setLoadingTab(null)
      })
  }, [tab, range])

  return (
    <TooltipProvider>
      <DashboardPageContainer>
        <DashboardHeader
          title="Analytics & Performance"
          description="Visibility, leads, engagement, agreements, and audience insights."
          actions={
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />

        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-1 p-1">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="listings" className="text-sm">Listings</TabsTrigger>
            <TabsTrigger value="leads" className="text-sm">Leads</TabsTrigger>
            <TabsTrigger value="agreements" className="text-sm">Agreements</TabsTrigger>
            <TabsTrigger value="audience" className="text-sm">Audience</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-0">
            {loading ? (
              <OverviewSkeleton />
            ) : dashboard ? (
              <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                  <KPICard title="Total Views" value={dashboard.kpis.totalViews} icon={Eye} subtitle="Listing & profile views" />
                  <KPICard title="Total Inquiries" value={dashboard.kpis.totalInquiries} icon={Inbox} subtitle="Leads received" />
                  <KPICard title="Active Agreements" value={dashboard.kpis.activeAgreements} icon={FileCheck} subtitle="Currently active" />
                  <KPICard title="Conversion Rate" value={`${dashboard.kpis.conversionRate}%`} icon={TrendingUp} subtitle="Inquiry → agreement" />
                  <KPICard title="Demo Registrations" value={dashboard.kpis.demoRegistrations} icon={Calendar} subtitle="Demo sign-ups" />
                  <KPICard title="Profile Views" value={dashboard.kpis.profileViews} icon={User} subtitle="Vendor profile views" />
                </div>

                <Card className="rounded-xl border border-border shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="h-5 w-5" aria-hidden />
                      Conversion funnel
                    </CardTitle>
                    <CardDescription>From visibility to completed agreements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 md:gap-6 overflow-x-auto pb-2">
                      <FunnelStep label="Listing views" value={dashboard.funnel.listingViews} />
                      <FunnelStep label="Product detail visits" value={dashboard.funnel.productDetailVisits} />
                      <FunnelStep label="Inquiries" value={dashboard.funnel.inquiries} />
                      <FunnelStep label="Conversations" value={dashboard.funnel.conversations} />
                      <FunnelStep label="Agreements created" value={dashboard.funnel.agreementsCreated} />
                      <FunnelStep label="Agreements completed" value={dashboard.funnel.agreementsCompleted} />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Views over time</CardTitle>
                      <CardDescription>Listing and product detail views</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboard.viewsOverTime.length > 0 ? (
                        <ChartContainer config={viewsChartConfig} className="h-[280px] w-full">
                          <AreaChart data={dashboard.viewsOverTime} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(v) => formatDateShort(v)} />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="views" fill="var(--color-views)" fillOpacity={0.4} stroke="var(--color-views)" />
                          </AreaChart>
                        </ChartContainer>
                      ) : (
                        <EmptyChart message="No view data in this period" />
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Leads over time</CardTitle>
                      <CardDescription>Inquiries received</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboard.leadsOverTime.some((d) => d.leads > 0) ? (
                        <ChartContainer config={leadsChartConfig} className="h-[280px] w-full">
                          <AreaChart data={dashboard.leadsOverTime} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(v) => formatDateShort(v)} />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="leads" fill="var(--color-leads)" fillOpacity={0.4} stroke="var(--color-leads)" />
                          </AreaChart>
                        </ChartContainer>
                      ) : (
                        <EmptyChart message="No lead data in this period" />
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Agreement conversion over time</CardTitle>
                      <CardDescription>Created vs completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboard.agreementConversionOverTime.some((d) => d.created > 0 || d.completed > 0) ? (
                        <ChartContainer config={agreementChartConfig} className="h-[280px] w-full">
                          <BarChart data={dashboard.agreementConversionOverTime} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(v) => formatDateShort(v)} />
                            <YAxis tickLine={false} axisLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="created" fill="var(--color-created)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="completed" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ChartContainer>
                      ) : (
                        <EmptyChart message="No agreement data in this period" />
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top performing listings</CardTitle>
                      <CardDescription>By views and inquiries</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboard.topListings.length > 0 ? (
                        <ChartContainer config={topListingsChartConfig} className="h-[280px] w-full">
                          <BarChart
                            data={dashboard.topListings.slice(0, 5).map((l) => ({ name: l.title.length > 25 ? l.title.slice(0, 25) + "…" : l.title, views: l.views, inquiries: l.inquiries }))}
                            layout="vertical"
                            margin={{ left: 12, right: 12 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" tickLine={false} axisLine={false} />
                            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={140} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="views" fill="var(--color-views)" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="inquiries" fill="var(--color-inquiries)" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ChartContainer>
                      ) : (
                        <EmptyChart message="No listing data yet" />
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Audience by country</CardTitle>
                      <CardDescription>Where your visitors and leads are from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboard.audienceByCountry.length > 0 ? (
                        <ul className="space-y-2">
                          {dashboard.audienceByCountry.slice(0, 10).map((c) => (
                            <li key={c.country} className="flex justify-between text-sm">
                              <span>{c.country}</span>
                              <span className="font-medium">{c.count}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground py-8 text-center">No country data in this period</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Insights & recommendations
                      </CardTitle>
                      <CardDescription>Actions to improve performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboard.insights.length > 0 ? (
                        <ul className="space-y-3 text-sm">
                          {dashboard.insights.map((text, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{text}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No specific insights for this period. Keep adding listings and engaging with leads.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <DashboardEmptyState
                icon={BarChart3}
                title="Unable to load analytics"
                description="Try selecting a different date range or refresh the page. If the issue persists, check your connection."
                action={<Button variant="outline" onClick={() => window.location.reload()}>Refresh</Button>}
              />
            )}
          </TabsContent>

          <TabsContent value="listings" className="mt-0">
            {loadingTab === "listings" ? (
              <ListingsTableSkeleton />
            ) : listings?.rows?.length ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LayoutList className="h-5 w-5" />
                    Listings performance
                  </CardTitle>
                  <CardDescription>Views, unique views, inquiries, and conversion by product</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Unique views</TableHead>
                        <TableHead className="text-right">Inquiries</TableHead>
                        <TableHead className="text-right">Agreements</TableHead>
                        <TableHead className="text-right">Conversion %</TableHead>
                        <TableHead>Last activity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.rows.map((row) => (
                        <TableRow key={row.productId}>
                          <TableCell>
                            <Link href={`/marketplace/my-products/${row.productId}/edit`} className="font-medium hover:underline truncate max-w-[200px] block">
                              {row.product}
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">{row.views}</TableCell>
                          <TableCell className="text-right">{row.uniqueViews}</TableCell>
                          <TableCell className="text-right">{row.inquiries}</TableCell>
                          <TableCell className="text-right">{row.agreements}</TableCell>
                          <TableCell className="text-right">{row.conversion}%</TableCell>
                          <TableCell className="text-muted-foreground">{formatDateShort(row.lastActivity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <DashboardEmptyState
                icon={LayoutList}
                title="No listing performance data"
                description="Create listings and get traffic to see views, inquiries, and conversion here."
                secondaryHint="Analytics are tracked per listing once they receive views or inquiries."
                action={<Button asChild><Link href="/marketplace/my-products/new">Create listing</Link></Button>}
              />
            )}
          </TabsContent>

          <TabsContent value="leads" className="mt-0">
            {loadingTab === "leads" ? (
              <LeadsPanelSkeleton />
            ) : leads ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent inquiries</CardTitle>
                    <CardDescription>Latest leads from your listings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leads.recentInquiries.length > 0 ? (
                      <ul className="space-y-3">
                        {leads.recentInquiries.map((i) => (
                          <li key={i.id} className="flex items-center justify-between gap-2 text-sm border-b pb-2 last:border-0">
                            <div className="min-w-0">
                              <p className="font-medium truncate">{i.productTitle ?? "Product"}</p>
                              <p className="text-muted-foreground truncate">{i.companyName ?? "—"} {i.country ? `· ${i.country}` : ""}</p>
                            </div>
                            <Badge variant="secondary">{i.status}</Badge>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground py-6 text-center">No inquiries in this period</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Lead status distribution</CardTitle>
                    <CardDescription>Inquiry pipeline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leads.statusDistribution.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {leads.statusDistribution.map((s) => (
                          <Tooltip key={s.status}>
                            <TooltipTrigger asChild>
                              <Badge variant="outline">{s.status}: {s.count}</Badge>
                            </TooltipTrigger>
                            <TooltipContent>{s.count} inquiries in {s.status}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-6 text-center">No status data</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top countries</CardTitle>
                    <CardDescription>Leads by country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leads.topCountries.length > 0 ? (
                      <ul className="space-y-2">
                        {leads.topCountries.map((c) => (
                          <li key={c.country} className="flex justify-between text-sm">
                            <span>{c.country}</span>
                            <span className="font-medium">{c.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground py-6 text-center">No country data</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top categories</CardTitle>
                    <CardDescription>Leads by product category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leads.topCategories.length > 0 ? (
                      <ul className="space-y-2">
                        {leads.topCategories.map((c) => (
                          <li key={c.name} className="flex justify-between text-sm">
                            <span>{c.name}</span>
                            <span className="font-medium">{c.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground py-6 text-center">No category data</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">Failed to load leads analytics.</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="agreements" className="mt-0">
            {loadingTab === "agreements" ? (
              <AgreementsPanelSkeleton />
            ) : agreements ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-5">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Offers sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{agreements.summary.offersSent}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{agreements.summary.accepted}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{agreements.summary.active}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{agreements.summary.completed}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Disputed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{agreements.summary.disputed}</div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion by product</CardTitle>
                    <CardDescription>Agreements created per listing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {agreements.conversionByProduct.length > 0 ? (
                      <ul className="space-y-2">
                        {agreements.conversionByProduct.map((p) => (
                          <li key={p.productId} className="flex justify-between text-sm">
                            <span className="truncate max-w-[60%]">{p.title}</span>
                            <span className="font-medium">{p.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground py-6 text-center">No agreement data by product in this period</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">Failed to load agreements analytics.</CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="audience" className="mt-0">
            {loadingTab === "audience" ? (
              <AudiencePanelSkeleton />
            ) : audience ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Audience by country
                    </CardTitle>
                    <CardDescription>Geographic distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {audience.audienceByCountry.length > 0 ? (
                      <ul className="space-y-2">
                        {audience.audienceByCountry.map((c) => (
                          <li key={c.country} className="flex justify-between text-sm">
                            <span>{c.country}</span>
                            <span className="font-medium">{c.count}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground py-8 text-center">No country data in this period</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Visibility metrics</CardTitle>
                    <CardDescription>Profile, listing, and demo views</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex justify-between items-center">
                        <span className="text-muted-foreground">Profile views</span>
                        <span className="text-2xl font-bold">{audience.profileViews}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-muted-foreground">Listing views</span>
                        <span className="text-2xl font-bold">{audience.listingViews}</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-muted-foreground">Demo views</span>
                        <span className="text-2xl font-bold">{audience.demoViews}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">Failed to load audience analytics.</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DashboardPageContainer>
    </TooltipProvider>
  )
}

function KPICard({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  subtitle: string
}) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

function FunnelStep({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center min-w-[100px]">
      <span className="text-2xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-[280px] flex items-center justify-center text-muted-foreground text-sm">
      {message}
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
        <CardContent><Skeleton className="h-20 w-full" /></CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-[280px]" /></CardContent></Card>
        <Card><CardHeader><Skeleton className="h-6 w-32" /></CardHeader><CardContent><Skeleton className="h-[280px]" /></CardContent></Card>
      </div>
    </>
  )
}

function ListingsTableSkeleton() {
  return (
    <Card>
      <CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full mt-2" />
        ))}
      </CardContent>
    </Card>
  )
}

function LeadsPanelSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-48 mt-2" /></CardHeader>
          <CardContent><Skeleton className="h-32 w-full" /></CardContent>
        </Card>
      ))}
    </div>
  )
}

function AgreementsPanelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}><CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
        ))}
      </div>
      <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-40" /></CardContent></Card>
    </div>
  )
}

function AudiencePanelSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-48" /></CardContent></Card>
      <Card><CardHeader><Skeleton className="h-6 w-40" /></CardHeader><CardContent><Skeleton className="h-32" /></CardContent></Card>
    </div>
  )
}
