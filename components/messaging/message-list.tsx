"use client"

import type { RefObject } from "react"
import { format } from "date-fns"
import { FileText, Image as ImageIcon } from "lucide-react"
import { AgreementThreadCard, type AgreementThreadEvent } from "@/components/messaging/agreement-thread-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"

type Message = {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  senderName: string
  senderImage: string | null
  productId?: string
  product?: {
    id: string
    title: string
    images: string[]
  }
  attachments?: {
    id: string
    url: string
    filename: string
    type: string
  }[]
}

interface MessageListProps {
  messages: Message[]
  agreementEvents?: AgreementThreadEvent[]
  currentUserId: string
  scrollContainerRef: RefObject<HTMLDivElement | null>
  hasMore?: boolean
  isLoadingMore?: boolean
  onLoadMore?: () => void
  showContextSeparators?: boolean
  onAcceptAgreement?: (agreementId: string) => void
  onRequestAgreementModification?: (agreementId: string) => void
  onDeclineAgreement?: (agreementId: string) => void
  onWithdrawAgreement?: (agreementId: string) => void
  loadingAgreementId?: string | null
}

export function MessageList({
  messages,
  agreementEvents = [],
  currentUserId,
  scrollContainerRef,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  showContextSeparators = false,
  onAcceptAgreement,
  onRequestAgreementModification,
  onDeclineAgreement,
  onWithdrawAgreement,
  loadingAgreementId = null,
}: MessageListProps) {
  const latestEventIdByAgreement = (() => {
    const byAgreement = new Map<string, { id: string; createdAt: string }>()
    for (const ev of agreementEvents) {
      const existing = byAgreement.get(ev.agreementId)
      const t = new Date(ev.createdAt).getTime()
      if (!existing || new Date(existing.createdAt).getTime() < t) {
        byAgreement.set(ev.agreementId, { id: ev.id, createdAt: ev.createdAt })
      }
    }
    const out: Record<string, string> = {}
    byAgreement.forEach((v, k) => {
      out[k] = v.id
    })
    return out
  })()

  const firstUnreadMessageId =
    messages.find((message) => message.receiverId === currentUserId && !message.isRead)?.id ?? null

  const threadItems = [...messages.map((message) => ({ kind: "message" as const, createdAt: message.createdAt, data: message })), ...agreementEvents.map((event) => ({ kind: "agreement_event" as const, createdAt: event.createdAt, data: event }))].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  if (!threadItems.length) {
    return (
      <div ref={scrollContainerRef} className="h-full min-h-0 overflow-y-auto p-6 flex items-center justify-center">
        <p className="text-sm text-muted-foreground text-center max-w-sm">
          No messages yet. Send a message below to start the conversation.
        </p>
      </div>
    )
  }

  return (
    <div ref={scrollContainerRef} className="h-full min-h-0 overflow-y-auto p-4">
      <div className="space-y-4">
        {hasMore && (
          <div className="flex justify-center pb-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading..." : "Load more messages"}
            </Button>
          </div>
        )}
        {threadItems.map((item, index) => {
          const previousItem = threadItems[index - 1]
          const currentContextId =
            item.data.productId ??
            (item.kind === "agreement_event" ? item.data.product?.id : undefined) ??
            "__general__"
          const previousContextId =
            previousItem?.data.productId ??
            (previousItem?.kind === "agreement_event" ? previousItem.data.product?.id : undefined) ??
            "__general__"
          const showContextMarker =
            showContextSeparators &&
            (index === 0 || currentContextId !== previousContextId)
          const markerProductTitle =
            item.kind === "agreement_event"
              ? item.data.product?.title ?? "This listing"
              : item.data.product?.title ?? "This listing"
          const markerProductImage =
            item.kind === "agreement_event"
              ? item.data.product?.images?.[0] ?? PLACEHOLDER_IMAGE
              : item.data.product?.images?.[0] ?? PLACEHOLDER_IMAGE

          return (
            <div key={item.kind === "agreement_event" ? `agreement-${item.data.id}` : item.data.id} className="space-y-3">
              {showContextMarker && (
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  {currentContextId !== "__general__" ? (
                    <Link
                      href={`/marketplace/product/${currentContextId}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted/50"
                    >
                      <img
                        src={markerProductImage}
                        alt=""
                        className="h-6 w-6 rounded object-cover shrink-0"
                      />
                      <span className="truncate max-w-[220px]">
                        Discussing: {markerProductTitle}
                      </span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground shadow-sm">
                      <span className="truncate max-w-[220px]">General Conversation</span>
                    </span>
                  )}
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              {item.kind === "message" && firstUnreadMessageId === item.data.id && (
                <div className="flex items-center gap-3 py-1">
                  <div className="h-px flex-1 bg-border" />
                  <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    New messages
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              )}
              {item.kind === "agreement_event" ? (
                <AgreementThreadCard
                  event={item.data}
                  currentUserId={currentUserId}
                  loadingAgreementId={loadingAgreementId}
                  isLatestForAgreement={
                    latestEventIdByAgreement[item.data.agreementId] === item.data.id
                  }
                  onAccept={onAcceptAgreement}
                  onRequestModification={onRequestAgreementModification}
                  onDecline={onDeclineAgreement}
                  onWithdraw={onWithdrawAgreement}
                />
              ) : (() => {
                const message = item.data
                const isCurrentUser = message.senderId === currentUserId
                const messageDate = new Date(message.createdAt)

                return (
                  <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-xl p-3 border ${
                        isCurrentUser
                          ? "bg-primary border-primary text-white"
                          : "bg-muted/50 text-foreground border-border"
                      }`}
                    >
                      {!isCurrentUser && (
                        <p className="text-sm font-medium mb-1">{message.senderName}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map((attachment) => (
                            <a
                              key={attachment.id}
                              href={attachment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center gap-2 p-2 rounded ${
                                isCurrentUser
                                  ? "bg-blue-700 hover:bg-blue-800 text-white"
                                  : "bg-muted hover:bg-muted/80"
                              }`}
                            >
                              {attachment.type.startsWith("image/") ? (
                                <div className="relative w-full max-w-[200px] sm:max-w-[250px]">
                                  <img
                                    src={attachment.url}
                                    alt={attachment.filename}
                                    className="max-h-32 w-full object-cover rounded"
                                  />
                                  <ImageIcon className="absolute top-1 right-1 h-4 w-4 text-white drop-shadow" />
                                </div>
                              ) : (
                                <>
                                  <FileText className="h-4 w-4 flex-shrink-0" />
                                  <span className="text-sm truncate max-w-[150px] sm:max-w-[200px]">
                                    {attachment.filename}
                                  </span>
                                </>
                              )}
                            </a>
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          isCurrentUser ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {format(messageDate, "p")}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )
        })}
      </div>
    </div>
  )
}
