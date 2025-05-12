"use client"

import { useState } from "react"
import { MessageList } from "@/components/messaging/message-list"
import { MessageInput } from "@/components/messaging/message-input"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  senderName: string
  senderImage: string | null
}

interface MessageDetailProps {
  contactId: string
  messages: Message[]
  contact: {
    name: string
    image?: string
    email: string
    companyName?: string
  }
}

export function MessageDetail({ contactId, messages, contact }: MessageDetailProps) {
  const router = useRouter()

  const handleCreateAgreement = () => {
    router.push(`/agreements/new?recipient=${contactId}&name=${encodeURIComponent(contact.name)}`)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-md">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
            {contact.image ? (
              <img
                src={contact.image || "/placeholder.svg"}
                alt={contact.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                {contact.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h2 className="font-semibold">{contact.name}</h2>
            <p className="text-sm text-gray-500">{contact.companyName || contact.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateAgreement}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Create Agreement
        </Button>
      </div>

      <MessageList messages={messages} currentUserId="currentUser" />

      <MessageInput receiverId={contactId} senderId="currentUser" />
    </div>
  )
} 