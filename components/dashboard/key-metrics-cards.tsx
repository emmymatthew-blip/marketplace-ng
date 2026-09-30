"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MessageSquare, FileText, UserPlus, Users } from "lucide-react"

export interface KeyMetrics {
  productViews: number
  inquiriesReceived: number
  activeAgreements: number
  demoRegistrations: number
  profileVisits: number
}

const defaultMetrics: KeyMetrics = {
  productViews: 0,
  inquiriesReceived: 0,
  activeAgreements: 0,
  demoRegistrations: 0,
  profileVisits: 0,
}

const metricsConfig = [
  {
    key: "productViews" as const,
    label: "Product Views",
    description: "Listing views this period",
    icon: Eye,
  },
  {
    key: "inquiriesReceived" as const,
    label: "Inquiries Received",
    description: "New messages & quote requests",
    icon: MessageSquare,
  },
  {
    key: "activeAgreements" as const,
    label: "Active Agreements",
    description: "In progress",
    icon: FileText,
  },
  {
    key: "demoRegistrations" as const,
    label: "Demo Registrations",
    description: "Upcoming demos",
    icon: UserPlus,
  },
  {
    key: "profileVisits" as const,
    label: "Profile Visits",
    description: "Company profile views",
    icon: Users,
  },
]

interface KeyMetricsCardsProps {
  metrics?: Partial<KeyMetrics>
}

export function KeyMetricsCards({ metrics = {} }: KeyMetricsCardsProps) {
  const m = { ...defaultMetrics, ...metrics }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metricsConfig.map(({ key, label, description, icon: Icon }) => (
        <Card key={key} className="rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="rounded-lg bg-muted/80 p-2">
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{m[key]}</div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
