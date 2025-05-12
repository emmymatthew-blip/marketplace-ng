"use client"

import { useEffect, useRef } from "react"
import { format } from "date-fns"

type Message = {
  id: string
  content: string
  senderId: string
  receiverId: string
  isRead: boolean
  createdAt: string
  senderName: string
  senderImage: string | null
}

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (!messages.length) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <p className="text-gray-500 text-center">No messages yet. Start the conversation by sending a message below.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId
          const messageDate = new Date(message.createdAt)

          return (
            <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden mr-2 flex-shrink-0">
                  {message.senderImage ? (
                    <img
                      src={message.senderImage || "/placeholder.svg"}
                      alt={message.senderName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                      {message.senderName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-lg p-3 ${
                  isCurrentUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <div className={`text-xs mt-1 ${isCurrentUser ? "text-blue-200" : "text-gray-500"}`}>
                  {format(messageDate, "h:mm a")}
                  {isCurrentUser && <span className="ml-2">{message.isRead ? "Read" : "Delivered"}</span>}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
