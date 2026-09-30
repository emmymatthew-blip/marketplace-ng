"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login?callbackUrl=/dashboard")
    if (status === "authenticated" && (session?.user as { role?: string })?.role === "ADMIN") {
      redirect("/admin/dashboard")
    }
  }, [status, session])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }
  if (!session) return null

  return <DashboardShell>{children}</DashboardShell>
}
