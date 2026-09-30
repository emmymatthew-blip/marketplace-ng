"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageDetail } from "@/components/messaging/message-detail"
import { Skeleton } from "@/components/ui/skeleton"

interface ApiMessage {
  id: string
  content: string
  senderId?: string
  receiverId?: string
  sender?: { id: string; name: string; image?: string | null }
  receiver?: { id: string; name: string; image?: string | null }
  productId?: string
  product?: { id: string; title: string; images?: string[] }
  isRead?: boolean
  createdAt: string
}

interface MessageThreadResponse {
  messages: ApiMessage[]
  events?: AgreementThreadEvent[]
  hasMore: boolean
  nextCursor: string | null
}

interface AgreementThreadEvent {
  id: string
  type: "agreement_event"
  agreementId: string
  agreementTitle?: string | null
  agreementStatus: string
  status: string
  eventType?: string | null
  createdAt: string
  actorId?: string | null
  actorName?: string | null
  initiatorId: string
  receiverId: string
  sourceType?: string | null
  productId?: string | null
  inquiryId?: string | null
  product?: { id: string; title: string; images: string[] } | null
}

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  senderName: string
  senderImage: string | null
  productId?: string
  product?: { id: string; title: string; images: string[] }
}

interface Contact {
    id: string
    name: string
    email: string
    image: string
    companyName: string
    isVerified: boolean
  location?: string
  productCount?: number
}

const defaultContact: Contact = {
  id: "",
  name: "Loading…",
  email: "",
      image: "/placeholder.svg",
  companyName: "",
  isVerified: false,
}

function mapApiMessageToMessage(api: ApiMessage, currentUserId: string): Message {
  const senderId = api.senderId ?? api.sender?.id ?? ""
  const receiverId = api.receiverId ?? api.receiver?.id ?? ""
  return {
    id: api.id,
    content: api.content,
    senderId,
    receiverId,
    isRead: Boolean(api.isRead),
    createdAt: api.createdAt,
    senderName: api.sender?.name ?? "Unknown",
    senderImage: api.sender?.image ?? null,
    productId: api.productId ?? api.product?.id,
    product: api.product
      ? {
          id: api.product.id,
          title: api.product.title ?? "",
          images: Array.isArray(api.product.images) ? api.product.images : [],
        }
      : undefined,
  }
}

export default function MessageThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: contactId } = use(params)
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [contact, setContact] = useState<Contact>(defaultContact)
  const [messages, setMessages] = useState<Message[]>([])
  const [events, setEvents] = useState<AgreementThreadEvent[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const productIdFromUrl = searchParams.get("productId")
  const contextFromUrl = searchParams.get("context")

  const currentUserId = (session?.user as any)?.id ?? ""

  const loadThread = useCallback(
    async (id: string) => {
      if (!currentUserId) return
      setLoading(true)
      try {
        const res = await fetch(`/api/messages?contactId=${id}&limit=20`)
        const data = (await res.json().catch(() => ({
          messages: [],
          hasMore: false,
          nextCursor: null,
        }))) as MessageThreadResponse
        const list = Array.isArray(data.messages) ? data.messages : []

        const mapped: Message[] = list.map((m: ApiMessage) =>
          mapApiMessageToMessage(m, currentUserId)
        )
        setMessages(mapped)
        setEvents(Array.isArray(data.events) ? data.events : [])
        setHasMore(Boolean(data.hasMore))
        setNextCursor(data.nextCursor ?? null)

        const other =
          list.length > 0
            ? list[0].senderId === currentUserId || list[0].sender?.id === currentUserId
              ? list[0].receiver ?? list[0]
              : list[0].sender ?? list[0]
            : null

        if (other && (other.id || other.receiverId || other.senderId)) {
          const oid = other.id ?? other.receiverId ?? other.senderId ?? id
          setContact({
            id: oid,
            name: other.name ?? "Unknown",
            email: other.email ?? "",
            image: other.image ?? "/placeholder.svg",
            companyName: other.companyName ?? "",
            isVerified: Boolean(other.isVerified),
          })
        } else {
          setContact({ ...defaultContact, id, name: "User" })
        }
        const vendorRes = await fetch(`/api/vendors/${id}`)
        if (vendorRes.ok) {
          const v = await vendorRes.json()
          setContact((prev) => ({
            ...prev,
            name: prev.name === "User" || prev.name === "Unknown" ? (v.name ?? v.companyName ?? prev.name) : prev.name,
            email: prev.email || (v.email ?? ""),
            image: prev.image === "/placeholder.svg" && v.image ? v.image : prev.image,
            companyName: prev.companyName || (v.companyName ?? ""),
            isVerified: prev.isVerified || Boolean(v.isVerified),
            location: v.location ?? v.cityState ?? v.country ?? undefined,
            productCount: typeof v.productCount === "number" ? v.productCount : undefined,
          }))
        }
        const unreadIds = list
          .filter(
            (m: ApiMessage) =>
              (m.receiverId ?? m.receiver?.id) === currentUserId && !m.isRead
          )
          .map((m: ApiMessage) => m.id)
        if (unreadIds.length > 0) {
          fetch("/api/messages/read", {
                      method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messageIds: unreadIds }),
          }).catch(() => {})
        }
      } catch {
        setMessages([])
        setContact({ ...defaultContact, id, name: "User" })
      } finally {
        setLoading(false)
      }
    },
    [currentUserId]
  )

  useEffect(() => {
    if (contactId && currentUserId) {
      loadThread(contactId)
    }
  }, [contactId, currentUserId, loadThread])

  const currentUserRole = (session?.user as any)?.role

  if (!contactId) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <Skeleton className="h-12 w-48" />
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2 md:hidden">
        <Button variant="ghost" size="icon" aria-label="Back to conversations" asChild>
          <Link href="/messages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          </Button>
        <span className="font-medium truncate text-foreground">{contact.companyName || contact.name}</span>
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-3/4 ml-auto" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <MessageDetail
            contactId={contactId}
            initialMessages={messages}
            initialHasMore={hasMore}
            initialNextCursor={nextCursor}
            initialEvents={events}
            contact={contact}
              currentUserRole={currentUserRole}
            productId={productIdFromUrl}
            context={contextFromUrl}
          />
        </div>
      )}
    </div>
  )
}
