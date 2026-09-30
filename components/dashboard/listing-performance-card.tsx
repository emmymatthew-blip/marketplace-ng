"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp } from "lucide-react"

interface ListingPerformanceItem {
  id: string
  title: string
  views: number
  inquiries: number
  trend?: "up" | "down" | "same"
}

interface ListingPerformanceCardProps {
  items?: ListingPerformanceItem[]
}

export function ListingPerformanceCard({ items = [] }: ListingPerformanceCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="rounded-lg bg-muted/80 p-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden />
          </span>
          Listing performance
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/listings">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="rounded-full bg-muted/80 p-4">
              <BarChart3 className="h-8 w-8 text-muted-foreground" aria-hidden />
            </span>
            <p className="mt-3 text-sm font-medium">No listing data yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Publish a listing to see performance here</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/marketplace/my-products/new">Create listing</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1 mr-2">{item.title}</span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-muted-foreground">{item.views} views</span>
                  <span className="text-muted-foreground">{item.inquiries} inq.</span>
                  {item.trend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
