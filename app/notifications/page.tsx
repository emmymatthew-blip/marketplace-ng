"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getNotificationIcon } from "@/components/notifications/notification-types"
import type { NotificationItem } from "@/components/notifications/notification-bell"
import { DashboardPageContainer, DashboardHeader } from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  if (sameDay) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/notifications")
      return
    }
    if (!session?.user?.id) return
    setLoading(true)
    fetch("/api/notifications?limit=50", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { notifications: [], unreadCount: 0 }))
      .then((data) => {
        setNotifications(data.notifications ?? [])
        setUnreadCount(data.unreadCount ?? 0)
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }, [session?.user?.id, status, router])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: "PATCH" })
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch {
      // ignore
    }
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read-all" }),
      })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  if (status === "loading" || !session) {
    return (
      <DashboardPageContainer>
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </DashboardPageContainer>
    )
  }

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title="Notifications"
        description="Your in-app notification history."
        actions={
          unreadCount > 0 ? (
            <Button variant="outline" size="sm" onClick={markAllRead} className="gap-1.5">
              <CheckCheck className="h-4 w-4" aria-hidden />
              Mark all as read
            </Button>
          ) : undefined
        }
      />
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card className="rounded-xl border border-border bg-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" aria-hidden />
            <CardTitle className="text-lg">No notifications</CardTitle>
            <CardDescription className="mt-1 text-center max-w-sm">
              When you receive messages, agreement updates, or verification results, they will appear here.
            </CardDescription>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-xl border border-border bg-card overflow-hidden">
          <ul className="divide-y divide-border">
            {notifications.map((n) => {
              const Icon = getNotificationIcon(n.type)
              return (
                <li key={n.id}>
                  {n.link ? (
                    <Link
                      href={n.link}
                      onClick={() => { if (!n.isRead) markAsRead(n.id) }}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                        !n.isRead && "bg-muted/30"
                      )}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1 text-left">
                        <p className={cn("text-sm font-medium", !n.isRead && "text-foreground")}>
                          {n.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors",
                        !n.isRead && "bg-muted/30"
                      )}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm font-medium", !n.isRead && "text-foreground")}>
                          {n.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                          {formatTime(n.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </DashboardPageContainer>
  )
}
