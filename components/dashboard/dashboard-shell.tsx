"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { MainNav } from "@/components/main-nav"
import { DashboardSidebar, NavLinks } from "@/components/dashboard/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Building2, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { DASHBOARD_NAVBAR_HEIGHT } from "@/components/dashboard/constants"

export interface DashboardShellProps {
  children: React.ReactNode
  /** Optional class for the main content area */
  className?: string
  /**
   * When true, guests see a full-width marketing-style shell (no Control Center sidebar).
   * Signed-in users still get the full app shell (sidebar + mobile drawer).
   */
  publicBrowsing?: boolean
}

export function DashboardShell({ children, className, publicBrowsing }: DashboardShellProps) {
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const showAppSidebar = !publicBrowsing || Boolean(session)

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      {/* Fixed top navbar – stays visible on scroll */}
      <header
        className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{ height: DASHBOARD_NAVBAR_HEIGHT }}
      >
        <div className="container flex h-full items-center justify-between">
          <MainNav
            embedded
            leftSlot={
              showAppSidebar ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 md:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open dashboard menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              ) : null
            }
          />
        </div>
      </header>

      {/* Mobile sidebar drawer */}
      {showAppSidebar ? (
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="border-b border-border p-4 text-left">
              <SheetTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Control Center
              </SheetTitle>
            </SheetHeader>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      ) : null}

      {/* Fixed sidebar (desktop only; mobile uses Sheet above) */}
      {showAppSidebar ? <DashboardSidebar /> : null}

      {/* Content area: offset by navbar height; on desktop also by sidebar width when shell visible */}
      <div
        className={cn("flex flex-1 min-h-0 flex-col", showAppSidebar && "md:ml-64")}
        style={{ paddingTop: DASHBOARD_NAVBAR_HEIGHT, minHeight: `calc(100vh - ${DASHBOARD_NAVBAR_HEIGHT})` }}
      >
        <main
          className={cn("flex-1 min-w-0 min-h-0 overflow-y-auto", className)}
          aria-label="Main content"
        >
          <div className="mx-auto max-w-[1400px] w-full flex-1 flex flex-col min-h-0 px-4 py-6 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
