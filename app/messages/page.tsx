"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect, useSearchParams } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ContactList } from "@/components/messaging/contact-list"
import { MessageList } from "@/components/messaging/message-list"
import { MessageInput } from "@/components/messaging/message-input"
import { MessageSquare } from "lucide-react"
import { Footer } from "@/components/footer"

interface Contact {
  id: string
  name: string
  image?: string
  lastMessage?: string
  unreadCount?: number
  lastActive?: string
}

interface Message {
  id: string
  content: string
  sender: {
    id: string
    name: string
    image?: string
  }
  receiver: {
    id: string
    name: string
    image?: string
  }
  isRead: boolean
  createdAt: string
  isSentByMe: boolean
}

// Mock data - would be fetched from API in production
const mockContacts: Contact[] = [
  {
    id: "user1",
    name: "John Doe",
    image: "/placeholder.svg?height=32&width=32",
    lastMessage: "Hello, how are you?",
    unreadCount: 2,
    lastActive: "2 hours ago",
  },
  {
    id: "user2",
    name: "Jane Smith",
    image: "/placeholder.svg?height=32&width=32",
    lastMessage: "Can we discuss the printing project?",
    unreadCount: 0,
    lastActive: "1 day ago",
  },
  {
    id: "user3",
    name: "Michael Johnson",
    image: "/placeholder.svg?height=32&width=32",
    lastMessage: "I've sent you the design files.",
    unreadCount: 1,
    lastActive: "3 hours ago",
  },
]

const mockMessages: Record<string, Message[]> = {
  user1: [
    {
      id: "msg1",
      content: "Hello, how are you?",
      sender: {
        id: "user1",
        name: "John Doe",
        image: "/placeholder.svg?height=32&width=32",
      },
      receiver: {
        id: "currentUser",
        name: "Current User",
        image: "/placeholder.svg?height=32&width=32",
      },
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isSentByMe: false,
    },
    {
      id: "msg2",
      content: "I'm interested in your printing services.",
      sender: {
        id: "user1",
        name: "John Doe",
        image: "/placeholder.svg?height=32&width=32",
      },
      receiver: {
        id: "currentUser",
        name: "Current User",
        image: "/placeholder.svg?height=32&width=32",
      },
      isRead: false,
      createdAt: new Date(Date.now() - 3500000).toISOString(),
      isSentByMe: false,
    },
  ],
  user2: [
    {
      id: "msg3",
      content: "Can we discuss the printing project?",
      sender: {
        id: "user2",
        name: "Jane Smith",
        image: "/placeholder.svg?height=32&width=32",
      },
      receiver: {
        id: "currentUser",
        name: "Current User",
        image: "/placeholder.svg?height=32&width=32",
      },
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      isSentByMe: false,
    },
    {
      id: "msg4",
      content: "Sure, I'm available tomorrow at 10 AM.",
      sender: {
        id: "currentUser",
        name: "Current User",
        image: "/placeholder.svg?height=32&width=32",
      },
      receiver: {
        id: "user2",
        name: "Jane Smith",
        image: "/placeholder.svg?height=32&width=32",
      },
      isRead: true,
      createdAt: new Date(Date.now() - 85400000).toISOString(),
      isSentByMe: true,
    },
  ],
  user3: [
    {
      id: "msg5",
      content: "I've sent you the design files.",
      sender: {
        id: "user3",
        name: "Michael Johnson",
        image: "/placeholder.svg?height=32&width=32",
      },
      receiver: {
        id: "currentUser",
        name: "Current User",
        image: "/placeholder.svg?height=32&width=32",
      },
      isRead: false,
      createdAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      isSentByMe: false,
    },
  ],
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const contactParam = searchParams.get("contact")

  const [selectedContactId, setSelectedContactId] = useState<string | null>(contactParam)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingContacts, setIsLoadingContacts] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/messages")
    }
  }, [status])

  // Load messages when contact is selected
  useEffect(() => {
    if (selectedContactId) {
      setIsLoadingMessages(true)

      // In a real app, this would be an API call
      // const  {
      setIsLoadingMessages(true)

      // In a real app, this would be an API call
      // const fetchMessages = async () => {
      //   const response = await fetch(`/api/messages?contactId=${selectedContactId}`)
      //   const data = await response.json()
      //   return data
      // }

      // Simulate API call with mock data
      setTimeout(() => {
        setMessages(mockMessages[selectedContactId] || [])
        setIsLoadingMessages(false)
      }, 500)
    }
  }, [selectedContactId])

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!selectedContactId || !content.trim()) return

    setIsSendingMessage(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/messages", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ content, receiverId: selectedContactId }),
      // })
      // const newMessage = await response.json()

      // Simulate API call with mock data
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newMessage: Message = {
        id: `msg${Date.now()}`,
        content,
        sender: {
          id: "currentUser",
          name: session?.user?.name || "Current User",
          image: session?.user?.image || "/placeholder.svg?height=32&width=32",
        },
        receiver: {
          id: selectedContactId,
          name: contacts.find((c) => c.id === selectedContactId)?.name || "Contact",
          image: contacts.find((c) => c.id === selectedContactId)?.image || "/placeholder.svg?height=32&width=32",
        },
        isRead: true,
        createdAt: new Date().toISOString(),
        isSentByMe: true,
      }

      // Update messages
      setMessages((prev) => [...prev, newMessage])

      // Update contact's last message
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === selectedContactId ? { ...contact, lastMessage: content, unreadCount: 0 } : contact,
        ),
      )

      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      })
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Failed to send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSendingMessage(false)
    }
  }

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
              <p className="text-muted-foreground">Communicate with other users on the platform.</p>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Conversations</CardTitle>
                <CardDescription>
                  Manage your conversations with printers, manufacturers, and consumers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 border-r pr-4">
                    <ContactList
                      contacts={contacts}
                      selectedContactId={selectedContactId}
                      onSelectContact={setSelectedContactId}
                      isLoading={isLoadingContacts}
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-col">
                    <div className="flex-1">
                      <MessageList
                        contactId={selectedContactId || ""}
                        messages={messages}
                        isLoading={isLoadingMessages}
                      />
                    </div>
                    <Separator className="my-4" />
                    <MessageInput
                      contactId={selectedContactId || ""}
                      onSendMessage={handleSendMessage}
                      isLoading={isSendingMessage}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
