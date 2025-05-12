import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"

import { MessageDetail } from "@/components/messaging/message-detail"

export const metadata: Metadata = {
  title: "Messages | NG Marketplace",
  description: "View and send messages to other users on the platform",
}

// Placeholder data
const mockContact = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  image: "/placeholder.svg",
  role: "PRINTER",
  companyName: "PrintTech Solutions",
}

const mockMessages = [
  {
    id: "1",
    content: "Hello, I'm interested in your printing services.",
    senderId: "1",
    receiverId: "currentUser",
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    senderName: "John Doe",
    senderImage: "/placeholder.svg"
  },
  {
    id: "2",
    content: "Hi John! Thanks for reaching out. What kind of printing services are you looking for?",
    senderId: "currentUser",
    receiverId: "1",
    isRead: true,
    createdAt: new Date(Date.now() - 3500000).toISOString(),
    senderName: "You",
    senderImage: "/placeholder.svg"
  },
  {
    id: "3",
    content: "I need some business cards and brochures printed for my company.",
    senderId: "1",
    receiverId: "currentUser",
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    senderName: "John Doe",
    senderImage: "/placeholder.svg"
  },
]

export default async function MessageDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <MessageDetail contactId={params.id} messages={mockMessages} contact={mockContact} />
    </div>
  )
}
