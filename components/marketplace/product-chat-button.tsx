"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { MessageSquare, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MessageList } from "@/components/messaging/message-list"
import { MessageInput } from "@/components/messaging/message-input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { LoginModal } from "@/components/auth/login-modal"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ProductChatButtonProps {
  sellerId: string
  sellerName: string
  sellerImage?: string | null
  productId: string
  productTitle: string
  companyName?: string | null
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
  product?: {
    id: string
    title: string
    images: string[]
  }
}

export function ProductChatButton({
  sellerId,
  sellerName,
  sellerImage,
  productId,
  productTitle,
  companyName,
}: ProductChatButtonProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [fetchError, setFetchError] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)

  // Fetch messages when chat opens
  useEffect(() => {
    if (isOpen && session?.user?.id) {
      fetchMessages()
    }
  }, [isOpen, session, sellerId])

  const fetchMessages = async () => {
    if (!session?.user?.id) return

    setIsLoading(true)
    setFetchError(false)
    try {
      const response = await fetch(`/api/messages?contactId=${sellerId}`)

      if (!response.ok) {
        let errorMessage = "Failed to load messages"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      const formattedMessages = (Array.isArray(data) ? data : []).map((msg: any) => ({
        id: msg.id,
        content: msg.content,
        senderId: msg.sender?.id || msg.senderId,
        receiverId: msg.receiver?.id || msg.receiverId,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
        senderName: msg.sender?.name || msg.senderName || "Unknown",
        senderImage: msg.sender?.image || msg.senderImage,
        productId: msg.product?.id || msg.productId,
        product: msg.product,
      }))

      formattedMessages.sort((a: Message, b: Message) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )

      setMessages(formattedMessages)
    } catch {
      setMessages([])
      setFetchError(true)
      toast({
        title: "Could not load messages",
        description: "Check your connection and try again.",
        variant: "destructive",
        action: (
          <Button variant="outline" size="sm" onClick={() => fetchMessages()}>
            Retry
          </Button>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChat = () => {
    if (!session) {
      setShowLoginModal(true)
      return
    }
    setIsOpen(true)
  }

  const handleCloseChat = () => {
    setIsOpen(false)
  }

  const handleMessageSent = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage])
    // Scroll to bottom is handled by MessageList component
  }

  const currentUserId = (session?.user as any)?.id || ""
  const isOwner = currentUserId === sellerId

  if (isOwner) {
    return null
  }

  return (
    <>
      {/* Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {isOpen && (
          <Card
            className={cn(
              "shadow-2xl border-2 flex flex-col overflow-hidden",
              "w-full max-w-[calc(100vw-2rem)] max-h-[80vh] h-[500px] sm:w-[380px] sm:max-h-[500px]"
            )}
          >
            <CardHeader className="px-4 py-3 border-b flex-shrink-0 bg-primary text-white">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 border-2 border-white shrink-0">
                    <AvatarImage src={sellerImage || undefined} alt={sellerName} />
                    <AvatarFallback className="bg-primary-foreground text-primary text-xs">
                      {sellerName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate text-white">{sellerName}</CardTitle>
                    <p className="text-xs text-white/80 truncate">{companyName || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-white hover:bg-white/20 text-xs"
                    asChild
                  >
                    <Link href={`/messages/${sellerId}?productId=${productId}`}>
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View full
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseChat}
                    className="h-7 w-7 text-white hover:bg-white/20"
                    aria-label="Close chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="flex-1 overflow-hidden flex flex-col bg-white">
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : fetchError ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2">
                  <p className="text-sm text-muted-foreground text-center">Messages could not be loaded.</p>
                  <Button variant="outline" size="sm" onClick={() => fetchMessages()}>
                    Retry
                  </Button>
                </div>
              ) : (
                <>
                  <MessageList
                    messages={messages}
                    currentUserId={currentUserId}
                    scrollContainerRef={scrollContainerRef}
                  />
                  <div className="border-t p-3 flex-shrink-0 bg-gray-50">
                    <MessageInput
                      receiverId={sellerId}
                      senderId={currentUserId}
                      productId={productId}
                      productTitle={productTitle}
                      onMessageSent={handleMessageSent}
                    />
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Chat Button */}
        <Button
          onClick={handleOpenChat}
          size="lg"
          className={`rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90 text-white overflow-hidden relative flex items-center gap-2 px-4 py-3 h-auto ${isOpen ? 'hidden' : ''}`}
        >
          {sellerImage ? (
            <div className="relative h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={sellerImage}
                alt={sellerName}
                fill
                className="object-cover"
              />
            </div>
          ) : companyName ? (
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold">
                {companyName[0]?.toUpperCase() || sellerName[0]?.toUpperCase()}
              </span>
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
          )}
          <span className="font-medium whitespace-nowrap">Chat</span>
          <span className="sr-only">Contact company</span>
        </Button>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        callbackUrl={`/marketplace/product/${productId}`}
      />
    </>
  )
}
