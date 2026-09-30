"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { InboxSidebar } from "@/components/messaging/inbox-sidebar"

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`)
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardShell className="flex flex-col !min-h-0">
      {/* Cap height so the workspace never grows past viewport; only thread and list scroll internally */}
      <div className="flex w-full flex-1 min-h-0 overflow-hidden max-h-[calc(100vh-5.5rem)]">
        <aside className="hidden h-full min-h-0 w-[340px] min-w-[340px] shrink-0 flex-col border-r border-border bg-card md:flex md:sticky md:top-0 md:self-start">
          <InboxSidebar />
        </aside>
        <section className="flex-1 min-h-0 flex flex-col overflow-hidden">
          {children}
        </section>
      </div>
    </DashboardShell>
  )
}
