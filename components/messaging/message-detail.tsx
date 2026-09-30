"use client"

import { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { MessageList } from "@/components/messaging/message-list"
import type { AgreementThreadEvent } from "@/components/messaging/agreement-thread-card"
import { MessageInput } from "@/components/messaging/message-input"
import { ProductContextCard } from "@/components/messaging/product-context-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Shield, Package, MapPin, Building2, Send } from "lucide-react"
import { VerifiedBadge } from "@/components/verified-badge"
import { TrustScoreBadge } from "@/components/trust/trust-score-badge"
import { TrustScoreModal, type TrustScoreDetail } from "@/components/trust/trust-score-modal"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ProductContextSummary } from "@/components/messaging/product-context-card"

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

interface ApiThreadMessage {
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

interface MessageDetailProps {
  contactId: string
  initialMessages: Message[]
  initialEvents: AgreementThreadEvent[]
  initialHasMore: boolean
  initialNextCursor: string | null
  contact: Contact
  currentUserRole?: string
  productId?: string | null
  context?: string | null
}

const ALL_CONTEXTS_VALUE = "__all__"
const GENERAL_CONTEXT_VALUE = "__general__"

function mapApiMessageToMessage(api: ApiThreadMessage): Message {
  return {
    id: api.id,
    content: api.content,
    senderId: api.senderId ?? api.sender?.id ?? "",
    receiverId: api.receiverId ?? api.receiver?.id ?? "",
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

export function MessageDetail({
  contactId,
  initialMessages,
  initialEvents,
  initialHasMore,
  initialNextCursor,
  contact,
  currentUserRole,
  productId: urlProductId,
  context: urlContext,
}: MessageDetailProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [trustDetail, setTrustDetail] = useState<TrustScoreDetail | null>(null)
  const [trustModalOpen, setTrustModalOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [agreementEvents, setAgreementEvents] = useState<AgreementThreadEvent[]>(initialEvents)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor)
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadingAgreementId, setLoadingAgreementId] = useState<string | null>(null)
  const [productInfo, setProductInfo] = useState<ProductContextSummary | null>(null)
  const [selectedContext, setSelectedContext] = useState<string>(
    urlProductId ??
      (urlContext === "general"
        ? GENERAL_CONTEXT_VALUE
        : urlContext === "all"
          ? ALL_CONTEXTS_VALUE
          : ALL_CONTEXTS_VALUE)
  )
  const [composerPrefill, setComposerPrefill] = useState("")
  const [composerPrefillToken, setComposerPrefillToken] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const preserveScrollRef = useRef<number | null>(null)
  const scrollBehaviorRef = useRef<"bottom" | "preserve" | null>("bottom")

  const currentUserId = (session?.user as any)?.id ?? ""

  const activeProductId =
    selectedContext !== ALL_CONTEXTS_VALUE && selectedContext !== GENERAL_CONTEXT_VALUE
      ? selectedContext
      : null

  const displayMessages = useMemo(() => {
    if (selectedContext === ALL_CONTEXTS_VALUE) return messages
    if (selectedContext === GENERAL_CONTEXT_VALUE) {
      return messages.filter((message) => !message.productId)
    }
    return messages.filter((message) => message.productId === selectedContext)
  }, [messages, selectedContext])

  const availableContexts = useMemo(() => {
    const byProductId = new Map<string, { id: string; title: string }>()

    for (const message of messages) {
      if (!message.productId) continue
      if (!byProductId.has(message.productId)) {
        byProductId.set(message.productId, {
          id: message.productId,
          title: message.product?.title ?? "Listing conversation",
        })
      }
    }

    if (urlProductId && !byProductId.has(urlProductId)) {
      byProductId.set(urlProductId, {
        id: urlProductId,
        title: productInfo?.title ?? "Current listing",
      })
    }

    return [
      { value: ALL_CONTEXTS_VALUE, label: "All Contexts" },
      { value: GENERAL_CONTEXT_VALUE, label: "General Conversation" },
      ...Array.from(byProductId.values()).map((item) => ({
        value: item.id,
        label: item.title,
      })),
    ]
  }, [messages, productInfo?.title, urlProductId])

  const isNearBottom = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return true
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight
    return distanceFromBottom < 120
  }, [])

  useEffect(() => {
    setMessages(initialMessages)
    setAgreementEvents(initialEvents)
    setHasMore(initialHasMore)
    setNextCursor(initialNextCursor)
    scrollBehaviorRef.current = "bottom"
  }, [initialMessages, initialEvents, initialHasMore, initialNextCursor, contactId])

  useEffect(() => {
    if (urlProductId) {
      setSelectedContext(urlProductId)
      return
    }

    if (urlContext === "general") {
      setSelectedContext(GENERAL_CONTEXT_VALUE)
      return
    }

    setSelectedContext(ALL_CONTEXTS_VALUE)
  }, [urlProductId, urlContext, contactId])

  useLayoutEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    if (scrollBehaviorRef.current === "preserve" && preserveScrollRef.current !== null) {
      const previousHeight = preserveScrollRef.current
      const heightDiff = container.scrollHeight - previousHeight
      container.scrollTop += heightDiff
      preserveScrollRef.current = null
      scrollBehaviorRef.current = null
      return
    }
    if (scrollBehaviorRef.current === "bottom") {
      container.scrollTop = container.scrollHeight
      scrollBehaviorRef.current = null
    }
  }, [messages])

  const markMessagesAsRead = useCallback(
    async (items: Message[]) => {
      const unreadIds = items
        .filter((m) => m.receiverId === currentUserId && !m.isRead)
        .map((m) => m.id)
      if (unreadIds.length === 0) return
      fetch("/api/messages/read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds: unreadIds }),
      }).catch(() => {})
    },
    [currentUserId]
  )

  const loadOlderMessages = useCallback(async () => {
    if (!nextCursor || loadingMore) return
    const container = scrollContainerRef.current
    if (!container) return
    setLoadingMore(true)
    preserveScrollRef.current = container.scrollHeight
    scrollBehaviorRef.current = "preserve"
    try {
      const res = await fetch(
        `/api/messages?contactId=${contactId}&limit=20&before=${encodeURIComponent(nextCursor)}`
      )
      if (!res.ok) return
      const data = await res.json()
      const olderMessages = Array.isArray(data.messages) ? data.messages : []
      const normalizedOlder = olderMessages.map((m: ApiThreadMessage) => mapApiMessageToMessage(m))
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id))
        return [...normalizedOlder.filter((m) => !seen.has(m.id)), ...prev]
      })
      setHasMore(Boolean(data.hasMore))
      setNextCursor(data.nextCursor ?? null)
      setAgreementEvents(Array.isArray(data.events) ? data.events : [])
      markMessagesAsRead(normalizedOlder).catch(() => {})
    } catch {
      preserveScrollRef.current = null
      scrollBehaviorRef.current = null
    } finally {
      setLoadingMore(false)
    }
  }, [contactId, nextCursor, loadingMore, markMessagesAsRead])

  useEffect(() => {
    if (!contactId) return
    const interval = setInterval(async () => {
      const latest = messages[messages.length - 1]
      if (!latest?.createdAt) return
      try {
        const res = await fetch(
          `/api/messages?contactId=${contactId}&limit=20&after=${encodeURIComponent(latest.createdAt)}`
        )
        if (!res.ok) return
        const data = await res.json()
        const newerMessages = Array.isArray(data.messages)
          ? data.messages.map((m: ApiThreadMessage) => mapApiMessageToMessage(m))
          : []
        setAgreementEvents(Array.isArray(data.events) ? data.events : [])
        if (newerMessages.length === 0) return
        const shouldStickToBottom = isNearBottom()
        if (shouldStickToBottom) {
          scrollBehaviorRef.current = "bottom"
        }
        setMessages((prev) => {
          const seen = new Set(prev.map((m) => m.id))
          return [...prev, ...newerMessages.filter((m) => !seen.has(m.id))]
        })
        markMessagesAsRead(newerMessages).catch(() => {})
      } catch {
        // ignore polling failures
      }
    }, 8000)
    return () => clearInterval(interval)
  }, [contactId, messages, isNearBottom, markMessagesAsRead])

  useEffect(() => {
    if (activeProductId) {
      fetch(`/api/products/${activeProductId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) {
            const categoryName = data.category?.name ?? data.categoryName
            setProductInfo({
              id: data.id,
              title: data.title ?? "",
              images: Array.isArray(data.images) ? data.images : [],
              condition: data.condition,
              location: data.location,
              description: data.description,
              category: categoryName,
              vendorName: data.owner?.companyName ?? data.ownerCompanyName,
              ownerId: data.owner?.id,
            })
          }
        })
        .catch(() => {})
      return
    }
    setProductInfo(null)
  }, [activeProductId])

  const handleCreateAgreement = () => {
    const params = new URLSearchParams()
    params.set("recipient", contactId)
    params.set("name", contact.name)
    if (activeProductId) params.set("product", activeProductId)
    params.set("fromChat", contactId)
    router.push(`/agreements/new?${params.toString()}`)
  }

  const normalizedRole = String(currentUserRole ?? "").toUpperCase()
  const isActiveListingOwner = Boolean(activeProductId && productInfo?.ownerId === currentUserId)
  const isCompanySide =
    isActiveListingOwner ||
    ["MANUFACTURER", "COMMERCIAL_PRINTER", "PRINTER", "ADMIN"].includes(normalizedRole)

  const handleQuoteAction = () => {
    const draft = isCompanySide
      ? `Thank you for your interest${activeProductTitle ? ` in ${activeProductTitle}` : ""}. Here is our quotation and next steps:`
      : `Hello, I would like to request a quotation${activeProductTitle ? ` for ${activeProductTitle}` : ""}. Please share pricing, availability, and next steps.`

    setComposerPrefill(draft)
    setComposerPrefillToken((prev) => prev + 1)
  }

  const handleNewMessage = (newMessage: Message) => {
    scrollBehaviorRef.current = "bottom"
    setMessages((prev) => [...prev, newMessage])
  }

  const refreshAgreementEvents = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages?contactId=${contactId}&limit=1`)
      if (!response.ok) return
      const data = await response.json()
      setAgreementEvents(Array.isArray(data.events) ? data.events : [])
    } catch {
      // ignore refresh failures
    }
  }, [contactId])

  const handleAcceptAgreement = useCallback(
    async (agreementId: string) => {
      if (loadingAgreementId) return
      setLoadingAgreementId(agreementId)
      try {
        const response = await fetch(`/api/agreements/${agreementId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "ACTIVE" }),
        })
        if (response.ok) {
          await refreshAgreementEvents()
        }
      } finally {
        setLoadingAgreementId(null)
      }
    },
    [loadingAgreementId, refreshAgreementEvents]
  )

  const handleRequestAgreementModification = useCallback(
    async (agreementId: string) => {
      if (loadingAgreementId) return
      setLoadingAgreementId(agreementId)
      try {
        const response = await fetch(`/api/agreements/${agreementId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "REQUEST_MODIFICATION" }),
        })
        if (response.ok) {
          await refreshAgreementEvents()
        }
      } finally {
        setLoadingAgreementId(null)
      }
    },
    [loadingAgreementId, refreshAgreementEvents]
  )

  const handleDeclineAgreement = useCallback(
    async (agreementId: string) => {
      if (loadingAgreementId) return
      setLoadingAgreementId(agreementId)
      try {
        const response = await fetch(`/api/agreements/${agreementId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "DECLINE" }),
        })
        if (response.ok) {
          await refreshAgreementEvents()
        }
      } finally {
        setLoadingAgreementId(null)
      }
    },
    [loadingAgreementId, refreshAgreementEvents]
  )

  const handleWithdrawAgreement = useCallback(
    async (agreementId: string) => {
      if (loadingAgreementId) return
      setLoadingAgreementId(agreementId)
      try {
        const response = await fetch(`/api/agreements/${agreementId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "WITHDRAW" }),
        })
        if (response.ok) {
          await refreshAgreementEvents()
        }
      } finally {
        setLoadingAgreementId(null)
      }
    },
    [loadingAgreementId, refreshAgreementEvents]
  )

  const updateContextInUrl = (contextValue: string) => {
    const url = new URL(window.location.href)
    if (contextValue === ALL_CONTEXTS_VALUE || contextValue === GENERAL_CONTEXT_VALUE) {
      url.searchParams.delete("productId")
    } else {
      url.searchParams.set("productId", contextValue)
      url.searchParams.delete("context")
    }

    if (contextValue === GENERAL_CONTEXT_VALUE) {
      url.searchParams.set("context", "general")
    } else if (contextValue === ALL_CONTEXTS_VALUE) {
      url.searchParams.set("context", "all")
    } else {
      url.searchParams.delete("context")
    }
    router.replace(url.pathname + url.search)
  }

  const handleContextChange = (contextValue: string) => {
    setSelectedContext(contextValue)
    updateContextInUrl(contextValue)
  }

  const companyDisplayName = contact.companyName || contact.name
  const activeProductTitle = productInfo?.title
  const activeContextLabel =
    availableContexts.find((context) => context.value === selectedContext)?.label ??
    "All Contexts"

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col rounded-lg border border-border bg-card shadow-sm">
      <header className="sticky top-0 z-10 shrink-0 border-b border-border bg-background px-4 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
              {contact.image ? (
                  <img src={contact.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                    {companyDisplayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-foreground truncate">{companyDisplayName}</h2>
                  <VerifiedBadge verified={contact.isVerified} size="sm" showLabel={true} />
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-muted-foreground">
                  {contact.location && (
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                      {contact.location}
                    </span>
                  )}
                  {typeof contact.productCount === "number" && (
                    <span>{contact.productCount} listing{contact.productCount !== 1 ? "s" : ""}</span>
              )}
            </div>
                <Link
                  href={`/marketplace/vendor/${contactId}`}
                  className="text-xs font-medium text-primary hover:underline mt-0.5 inline-flex items-center gap-0.5"
                >
                  <Building2 className="h-3 w-3" aria-hidden />
                  View company profile
                </Link>
                <div className="mt-2 flex min-w-0 flex-col gap-1">
                  <label
                    htmlFor="conversation-context"
                    className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Conversation context
                  </label>
                  <select
                    id="conversation-context"
                    value={selectedContext}
                    onChange={(event) => handleContextChange(event.target.value)}
                    className="flex h-9 w-full max-w-[280px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {availableContexts.map((context) => (
                      <option key={context.value} value={context.value}>
                        {context.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Button size="sm" onClick={handleQuoteAction} className="gap-1.5 bg-primary hover:bg-primary/90 text-white">
                <Send className="h-3.5 w-3.5" aria-hidden />
                {isCompanySide ? "Send Quote" : "Request Quote"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCreateAgreement} className="gap-1.5">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                {isCompanySide ? "Propose Agreement" : "Create Agreement"}
              </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <div>
                      <TrustScoreBadge
                        score={trustDetail?.trustScore ?? null}
                        onClick={() => setTrustModalOpen(true)}
                    size="sm"
                        showLabel={true}
                      />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {trustDetail ? "View detailed trust report" : "Check trust score"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
              <TrustScoreModal
                userId={contactId}
                userName={companyDisplayName}
                open={trustModalOpen}
                onOpenChange={setTrustModalOpen}
                initialData={trustDetail}
                onLoaded={setTrustDetail}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-md border border-border bg-muted/40 px-2 py-1">
              Active context: {activeContextLabel}
            </span>
            {productInfo && activeProductId ? (
              <Link
                href={`/marketplace/product/${productInfo.id}`}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1.5 hover:bg-muted transition-colors w-fit"
              >
                <Package className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate max-w-[220px]">{productInfo.title}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </header>

      {productInfo && activeProductId && (
        <ProductContextCard
          product={productInfo}
          onDismiss={() => handleContextChange(GENERAL_CONTEXT_VALUE)}
          showDismiss
        />
      )}

      <div className="shrink-0 border-b border-border bg-muted/20 px-4 py-2">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Shield className="h-3.5 w-3.5 shrink-0" aria-hidden />
          PrintMarket NG can mediate disputes only when an agreement exists.
          <Button variant="link" size="sm" className="h-auto p-0 text-xs font-medium text-primary" onClick={handleCreateAgreement}>
            {isCompanySide ? "Propose Agreement" : "Create Agreement"}
          </Button>
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList
          messages={displayMessages}
          agreementEvents={agreementEvents.filter((event) => {
            if (selectedContext === ALL_CONTEXTS_VALUE) return true
            if (selectedContext === GENERAL_CONTEXT_VALUE) return !event.productId
            return event.productId === selectedContext
          })}
          currentUserId={currentUserId}
          scrollContainerRef={scrollContainerRef}
          hasMore={hasMore}
          isLoadingMore={loadingMore}
          onLoadMore={loadOlderMessages}
          showContextSeparators={selectedContext === ALL_CONTEXTS_VALUE}
          onAcceptAgreement={handleAcceptAgreement}
          onRequestAgreementModification={handleRequestAgreementModification}
          onDeclineAgreement={handleDeclineAgreement}
          onWithdrawAgreement={handleWithdrawAgreement}
          loadingAgreementId={loadingAgreementId}
        />
      </div>

      <div className="shrink-0 border-t border-border bg-background p-3 md:p-4 space-y-3">
        {activeProductId && productInfo && displayMessages.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              You are continuing this conversation under:
            </p>
            <Link
              href={`/marketplace/product/${productInfo.id}`}
              className="flex items-center gap-2 rounded-md border border-border bg-background p-2 hover:bg-muted/50 transition-colors"
            >
              {productInfo.images?.[0] ? (
                <img src={productInfo.images[0]} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded bg-muted shrink-0 flex items-center justify-center">
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <span className="text-sm font-medium truncate">{productInfo.title}</span>
                    </Link>
          </div>
        )}
        <MessageInput 
          receiverId={contactId} 
          senderId={currentUserId} 
          productId={activeProductId ?? undefined}
          productTitle={activeProductTitle}
          placeholder={
            activeProductTitle
              ? `Write a message about ${activeProductTitle}...`
              : "Write a message to this company..."
          }
          prefillText={composerPrefill}
          prefillToken={composerPrefillToken}
          textareaId="thread-message-input"
          onMessageSent={handleNewMessage}
          showSuggestionChips
        />
      </div>
    </div>
  )
} 
