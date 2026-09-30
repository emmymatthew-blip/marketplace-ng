"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  AlertCircle,
  BarChart3,
  Calendar,
  ChevronRight,
  Database,
  FileText,
  Handshake,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  UserCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> }
type NavGroup = { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Operations", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
    ],
  },
  {
    label: "Verifications",
    items: [{ href: "/admin/verifications", label: "Verification queue", icon: ShieldCheck }],
  },
  {
    label: "Demonstrations",
    items: [
      { href: "/admin/featured-demos", label: "Featured & weekly", icon: Sparkles },
      { href: "/admin/demo-access", label: "Demo applications", icon: UserCircle },
      { href: "/admin/demo-access/dates", label: "Demo dates", icon: Calendar },
    ],
  },
  {
    label: "Agreements & disputes",
    items: [
      { href: "/admin/disputes", label: "Disputes queue", icon: AlertCircle },
      { href: "/agreements", label: "Agreements hub", icon: Handshake },
    ],
  },
  {
    label: "Platform data",
    items: [{ href: "/admin/categories", label: "Categories", icon: Tag }],
  },
  {
    label: "System",
    items: [{ href: "/admin/migrations", label: "Migrations", icon: Database }],
  },
]

const ALL_NAV_HREFS = navGroups.flatMap((g) => g.items.map((i) => i.href)).sort((a, b) => b.length - a.length)

function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true
  if (!pathname.startsWith(href + "/")) return false
  return !ALL_NAV_HREFS.some(
    (h) => h !== href && h.startsWith(href + "/") && (pathname === h || pathname.startsWith(h + "/"))
  )
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary/12 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="truncate">{item.label}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-primary opacity-80" />}
    </Link>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-background via-background to-muted/25">
        <Sidebar className="border-r border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <SidebarHeader className="border-b border-border/60 px-4 py-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2 rounded-lg px-1 py-0.5 transition-opacity hover:opacity-90">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div className="min-w-0 text-left">
                <p className="truncate text-sm font-semibold tracking-tight">PrintMarket NG</p>
                <p className="truncate text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Admin</p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-2 py-3">
            <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
              <div className="space-y-6 pb-4">
                {navGroups.map((group) => (
                  <div key={group.label}>
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/90">{group.label}</p>
                    <nav className="flex flex-col gap-0.5">
                      {group.items.map((item) => (
                        <NavLink key={item.href} item={item} active={isNavItemActive(pathname, item.href)} />
                      ))}
                    </nav>
                  </div>
                ))}
                <Separator className="my-2 opacity-60" />
                <div className="px-1">
                  <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/90">Front office</p>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                  >
                    <FileText className="h-4 w-4" />
                    User dashboard
                  </Link>
                  <Link
                    href="/"
                    className="mt-0.5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
                  >
                    Home
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="border-t border-border/60 p-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
              <p className="truncate text-xs font-medium text-foreground">{session?.user?.name || "Admin"}</p>
              <p className="truncate text-[11px] text-muted-foreground">{session?.user?.email}</p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 w-full gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="overflow-x-hidden">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
            <SidebarTrigger className="h-9 w-9 shrink-0" />
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold uppercase tracking-widest text-muted-foreground">Platform operations</p>
              <p className="truncate text-sm font-medium text-foreground">PrintMarket NG Admin</p>
            </div>
          </header>
          <div className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
