"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { StatusBadge } from "@/components/dashboard/status-badge"

export interface AgreementCardItem {
  id: string
  title: string
  counterparty: string
  productRef?: string
  status: "ACTIVE" | "PENDING" | "COMPLETED" | "DISPUTED"
  timeline: string
  updatedAt?: string
}

interface AgreementsDashboardProps {
  active?: AgreementCardItem[]
  pending?: AgreementCardItem[]
  completed?: AgreementCardItem[]
  disputed?: AgreementCardItem[]
}

function AgreementCard({ item }: { item: AgreementCardItem }) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">
            <Link href={`/agreements/${item.id}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded">
              {item.title}
            </Link>
          </CardTitle>
          <StatusBadge status={item.status} className="shrink-0" />
        </div>
        <CardDescription>
          With {item.counterparty}
          {item.productRef && ` · ${item.productRef}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground">Last update: {item.timeline}</p>
        <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
          <Link href={`/agreements/${item.id}`}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function TabEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export function AgreementsDashboard({
  active = [],
  pending = [],
  completed = [],
  disputed = [],
}: AgreementsDashboardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="rounded-lg bg-muted/80 p-2">
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden />
          </span>
          Agreements by status
        </CardTitle>
        <CardDescription>Active, pending, completed, and disputed</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-1 p-1">
            <TabsTrigger value="active" className="text-sm">Active ({active.length})</TabsTrigger>
            <TabsTrigger value="pending" className="text-sm">Pending ({pending.length})</TabsTrigger>
            <TabsTrigger value="completed" className="text-sm">Completed ({completed.length})</TabsTrigger>
            <TabsTrigger value="disputed" className="text-sm">Disputed ({disputed.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {active.length === 0 ? (
                <TabEmpty message="No active agreements." />
              ) : (
                active.map((item) => <AgreementCard key={item.id} item={item} />)
              )}
            </div>
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {pending.length === 0 ? (
                <TabEmpty message="No pending agreements." />
              ) : (
                pending.map((item) => <AgreementCard key={item.id} item={item} />)
              )}
            </div>
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {completed.length === 0 ? (
                <TabEmpty message="No completed agreements." />
              ) : (
                completed.map((item) => <AgreementCard key={item.id} item={item} />)
              )}
            </div>
          </TabsContent>
          <TabsContent value="disputed" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {disputed.length === 0 ? (
                <TabEmpty message="No disputed agreements." />
              ) : (
                disputed.map((item) => <AgreementCard key={item.id} item={item} />)
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
