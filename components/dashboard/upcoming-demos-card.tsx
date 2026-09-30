"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Presentation } from "lucide-react"

interface DemoItem {
  id: string
  title: string
  date: string
  time?: string
}

interface UpcomingDemosCardProps {
  demos?: DemoItem[]
}

export function UpcomingDemosCard({ demos = [] }: UpcomingDemosCardProps) {
  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="rounded-lg bg-muted/80 p-2"><Presentation className="h-4 w-4 text-muted-foreground" aria-hidden /></span>
          Upcoming demonstrations
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/demonstrations">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {demos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-muted-foreground">
            <Calendar className="h-10 w-10 mb-2 opacity-50" />
            <p>No upcoming demos</p>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link href="/demonstrations">Browse demonstrations</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {demos.slice(0, 4).map((demo) => (
              <li key={demo.id} className="flex items-start gap-3 text-sm">
                <div className="rounded bg-primary/10 p-2 shrink-0">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/demonstrations/${demo.id}`} className="font-medium hover:underline truncate block">
                    {demo.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{demo.date}{demo.time ? ` · ${demo.time}` : ""}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
