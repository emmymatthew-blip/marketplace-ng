"use client"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"

/**
 * Public discovery: browsing demonstrations does not require auth.
 * Action CTAs (register, message, apply) use loginWithCallback where needed.
 */
export default function DemonstrationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardShell publicBrowsing>{children}</DashboardShell>
}
