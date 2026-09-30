"use client"

import { useEffect, useState, type FormEvent, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Paperclip, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const INQUIRY_SUGGESTIONS = [
  "Ask about price",
  "Request quotation",
  "Ask about shipping",
  "Request specifications",
  "Ask for demonstration",
]

interface MessageInputProps {
  receiverId: string
  senderId: string
  productId?: string
  productTitle?: string
  placeholder?: string
  showSuggestionChips?: boolean
  prefillText?: string
  prefillToken?: number
  textareaId?: string
  onMessageSent: (message: {
    id: string
    content: string
    senderId: string
    receiverId: string
    isRead: boolean
    createdAt: string
    senderName: string
    senderImage: string | null
    productId?: string
  }) => void
}

interface FileAttachment {
  file: File
  preview: string
}

export function MessageInput({
  receiverId,
  senderId,
  productId,
  productTitle,
  placeholder,
  showSuggestionChips = false,
  prefillText,
  prefillToken,
  textareaId,
  onMessageSent,
}: MessageInputProps) {
  const resolvedPlaceholder =
    placeholder ??
    (productTitle
      ? `Message about "${productTitle}"...`
      : "Type a message...")
  const { data: session } = useSession()
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attachments, setAttachments] = useState<FileAttachment[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (prefillText) {
      setMessage(prefillText)
    }
  }, [prefillText, prefillToken])
  
  // Use session user ID if available, otherwise use provided senderId
  const actualSenderId = (session?.user as any)?.id || senderId

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newAttachments = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setAttachments(prev => [...prev, ...newAttachments])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev]
      URL.revokeObjectURL(newAttachments[index].preview)
      newAttachments.splice(index, 1)
      return newAttachments
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!message.trim() && attachments.length === 0) return

    setIsSubmitting(true)

    try {
      // Create FormData to send message
      const formData = new FormData()
      formData.append("content", message)
      formData.append("senderId", actualSenderId)
      formData.append("receiverId", receiverId)
      if (productId) {
        formData.append("productId", productId)
      }
      
      // Add attachments if any
      attachments.forEach(attachment => {
        formData.append("files", attachment.file)
      })

      // Send message to API
      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send message")
      }

      const savedMessage = await response.json()

      // Format message for UI
      const messageForUI = {
        id: savedMessage.id,
        content: savedMessage.content,
        senderId: savedMessage.senderId,
        receiverId: savedMessage.receiverId,
        isRead: savedMessage.isRead,
        createdAt: savedMessage.createdAt,
        senderName: savedMessage.senderName || "You",
        senderImage: savedMessage.senderImage,
        productId: savedMessage.productId,
        product: savedMessage.product,
      }

      // Add message to the UI through parent component
      onMessageSent(messageForUI)

      // Show success toast
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })

      // Clear form
      setMessage("")
      setAttachments([])
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      {showSuggestionChips && (
        <div className="flex flex-wrap gap-1.5">
          {INQUIRY_SUGGESTIONS.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => setMessage((prev) => (prev ? `${prev}\n\n${text}` : text))}
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {text}
            </button>
          ))}
        </div>
      )}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((attachment, index) => (
            <div key={index} className="relative group">
              {attachment.file.type.startsWith("image/") ? (
                <img
                  src={attachment.preview}
                  alt="attachment preview"
                  className="h-20 w-20 object-cover rounded border"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded border">
                  <span className="text-sm text-gray-500">{attachment.file.name}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-12 w-12 md:h-10 md:w-10 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-6 w-6 md:h-5 md:w-5" />
        </Button>
        <div className="flex-1">
          <textarea
            id={textareaId}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={resolvedPlaceholder}
            aria-label="Message input"
            className="w-full border border-input rounded-lg bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none min-h-[48px] md:min-h-[40px]"
            style={{
              maxHeight: "150px",
              height: "auto",
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = "auto"
              target.style.height = `${Math.min(target.scrollHeight, 150)}px`
            }}
            disabled={isSubmitting}
          />
        </div>
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 md:h-10 md:w-10 flex-shrink-0 bg-primary hover:bg-primary/90 text-white"
          disabled={isSubmitting || (!message.trim() && attachments.length === 0)}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-6 w-6 md:h-5 md:w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <Send className="h-6 w-6 md:h-5 md:w-5" />
          )}
        </Button>
      </form>
    </div>
  )
}
