"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  FileText,
  Presentation,
  BarChart3,
  Shield,
  Settings,
  Building2,
  Inbox,
} from "lucide-react"

export const dashboardNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/listings", label: "Listings", icon: Package },
  { href: "/dashboard/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/agreements", label: "Agreements", icon: FileText },
  { href: "/demonstrations", label: "Demonstrations", icon: Presentation },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/verification", label: "Verification", icon: Shield },
  { href: "/settings", label: "Settings", icon: Settings },
] as const

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="Control center">
      {dashboardNavItems.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href)
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-white"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

import { DASHBOARD_NAVBAR_HEIGHT } from "@/components/dashboard/constants"

/** Desktop-only fixed sidebar; mobile uses Sheet in DashboardShell */
export function DashboardSidebar() {
  return (
    <aside
      className="hidden md:flex fixed left-0 z-40 w-64 flex-col border-r border-border bg-card overflow-y-auto"
      style={{
        top: DASHBOARD_NAVBAR_HEIGHT,
        height: `calc(100vh - ${DASHBOARD_NAVBAR_HEIGHT})`,
      }}
      aria-label="Dashboard navigation"
    >
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
        <Building2 className="h-6 w-6 text-primary" />
        <span className="font-semibold">Control Center</span>
      </div>
      <NavLinks />
    </aside>
  )
}
