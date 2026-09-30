"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, FileText, Presentation, MessageCircle } from "lucide-react"

const panels = [
  {
    title: "My Listings",
    description: "Manage your advertised products and services",
    href: "/dashboard/listings",
    icon: Package,
    cta: "Manage listings",
  },
  {
    title: "Active Agreements",
    description: "View and manage agreements with partners",
    href: "/agreements",
    icon: FileText,
    cta: "View agreements",
  },
  {
    title: "Demonstrations",
    description: "Host or register for demos",
    href: "/demonstrations",
    icon: Presentation,
    cta: "Go to demonstrations",
  },
  {
    title: "Forum Activity",
    description: "Join industry discussions",
    href: "/forum",
    icon: MessageCircle,
    cta: "Go to forum",
  },
]

export function ManagementPanels() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {panels.map((panel) => {
        const Icon = panel.icon
        return (
          <Card key={panel.href} className="rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span className="rounded-lg bg-muted/80 p-2">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                </span>
                {panel.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">{panel.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" className="w-full" size="sm">
                <Link href={panel.href}>{panel.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
