"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { VerifiedBadge } from "@/components/verified-badge"
import { cn } from "@/lib/utils"

interface Conversation {
  id: string
  contact: { id: string; name: string; image: string | null; companyName: string | null; isVerified: boolean }
  lastMessage: { content: string; createdAt: string; isRead: boolean; productTitle: string | null }
  unreadCount: number
}

function formatConversationTime(createdAt: string): string {
  const d = new Date(createdAt)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (sameDay) return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export function InboxSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const productId = searchParams.get("productId")
  const currentId = pathname?.replace(/^\/messages\/?/, "").split("/")[0] || null

  useEffect(() => {
    setLoading(true)
    fetch("/api/messages/conversations")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setConversations(Array.isArray(data) ? data : []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = searchQuery.trim()
    ? conversations.filter(
        (c) =>
          c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.contact.companyName ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations

  return (
    <div className="flex h-full min-h-0 min-w-0 w-full flex-col border-r bg-card overflow-hidden">
      <div className="shrink-0 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            aria-label="Search conversations"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0 w-full">
        {loading ? (
          <div className="space-y-2 p-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-6 text-center" role="status">
            <span className="rounded-full bg-muted/80 p-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground" aria-hidden />
            </span>
            <p className="text-sm font-medium">
              {searchQuery.trim() ? "No matches" : "No conversations yet"}
            </p>
            <p className="text-xs text-muted-foreground max-w-[240px]">
              {searchQuery.trim() ? "Try a different search." : "Contact a company from a listing to start a thread."}
            </p>
          </div>
        ) : (
          <ul className="w-full space-y-0.5 p-2" role="list">
            {filtered.map((conv) => {
              const href = `/messages/${conv.id}${productId ? `?productId=${productId}` : ""}`
              const isSelected = currentId === conv.id
              return (
                <li key={conv.id}>
                  <Link
                    href={href}
                    className={cn(
                      "grid w-full min-w-0 grid-cols-[auto,minmax(0,1fr),auto] items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/80",
                      isSelected && "bg-muted"
                    )}
                  >
                    <div className="relative h-11 w-11 shrink-0">
                      <div className="h-full w-full overflow-hidden rounded-lg bg-muted">
                        {conv.contact.image ? (
                          <img
                            src={conv.contact.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                            {(conv.contact.companyName || conv.contact.name).charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-white">
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="truncate font-medium text-foreground">
                          {conv.contact.companyName || conv.contact.name}
                        </p>
                        <VerifiedBadge verified={conv.contact.isVerified} size="sm" showLabel={false} />
                      </div>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">
                        {conv.lastMessage.content}
                      </p>
                      {conv.lastMessage.productTitle && (
                        <p className="truncate text-[11px] text-muted-foreground/80 mt-0.5">
                          Re: {conv.lastMessage.productTitle}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">
                      {formatConversationTime(conv.lastMessage.createdAt)}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  )
}
