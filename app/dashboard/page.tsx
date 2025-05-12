"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer } from "lucide-react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ActiveAgreements } from "@/components/dashboard/active-agreements"
import { RecentMessages } from "@/components/dashboard/recent-messages"
import { UserProfileSummary } from "@/components/dashboard/user-profile-summary"
import { Footer } from "@/components/footer"

// Mock data - would be fetched from API in production
const mockAgreements = [
  {
    id: "1",
    title: "Digital Printing Services",
    status: "ACTIVE" as const,
    counterparty: {
      name: "PrintTech Solutions",
      role: "PRINTER",
    },
    service: "Digital Printing",
    startDate: "June 15, 2023",
    dueDate: "July 15, 2023",
    value: "₦120,000",
  },
  {
    id: "2",
    title: "Equipment Maintenance",
    status: "PROPOSED" as const,
    counterparty: {
      name: "GraphicPro Systems",
      role: "MANUFACTURER",
    },
    service: "Printer Maintenance",
    startDate: "Pending",
    dueDate: "August 30, 2023",
    value: "₦85,000",
  },
  {
    id: "3",
    title: "Ink Supply Contract",
    status: "COMPLETED" as const,
    counterparty: {
      name: "Ink Masters Nigeria",
      role: "MANUFACTURER",
    },
    service: "Ink Supply",
    startDate: "May 10, 2023",
    dueDate: "June 10, 2023",
    value: "₦45,000",
  },
  {
    id: "4",
    title: "Banner Printing Project",
    status: "DISPUTED" as const,
    counterparty: {
      name: "ScreenTech International",
      role: "PRINTER",
    },
    service: "Banner Printing",
    startDate: "June 1, 2023",
    dueDate: "June 15, 2023",
    value: "₦65,000",
  },
]

const mockMessages = [
  {
    id: "1",
    sender: {
      id: "sender1",
      name: "John Doe",
      image: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "2 hours ago",
    preview: "Hello, I'm interested in discussing a potential printing project for my company's upcoming event...",
    isRead: false,
  },
  {
    id: "2",
    sender: {
      id: "sender2",
      name: "Jane Smith",
      image: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "Yesterday",
    preview: "Thank you for your proposal. I've reviewed the terms and would like to discuss a few adjustments...",
    isRead: true,
  },
  {
    id: "3",
    sender: {
      id: "sender3",
      name: "Michael Johnson",
      image: "/placeholder.svg?height=32&width=32",
    },
    timestamp: "3 days ago",
    preview: "I've sent the final design files for the brochure project. Please confirm receipt and let me know...",
    isRead: true,
  },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    agreements: 4,
    messages: 3,
    forumActivity: 8,
    upcomingDemos: 2,
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/dashboard")
    }
  }, [status])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg",
    role: "PRINTER" as const,
    isVerified: true,
    cipponId: "CIPPON123",
    phone: "+234 701 234 5678",
    location: "Lagos",
    companyName: undefined,
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      <header className="sticky top-0 z-40 border-b bg-white shadow-md">
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
              <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#326de0] to-[#ce057d]">
                Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back, {session.user.name}! Here's an overview of your activity on NG MARKETPLACE.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="absolute inset-0 bg-[#326de0]/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <DashboardHeader userRole={session.user.role} stats={stats} />
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <Tabs defaultValue="agreements" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-gray-50 p-1 rounded-lg">
                      <TabsTrigger 
                        value="agreements"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#326de0] data-[state=active]:shadow-sm transition-all duration-300"
                      >
                        Agreements
                      </TabsTrigger>
                      <TabsTrigger 
                        value="messages"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#326de0] data-[state=active]:shadow-sm transition-all duration-300"
                      >
                        Messages
                      </TabsTrigger>
                      <TabsTrigger 
                        value="profile"
                        className="data-[state=active]:bg-white data-[state=active]:text-[#326de0] data-[state=active]:shadow-sm transition-all duration-300"
                      >
                        Profile
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="agreements" className="space-y-4 mt-6">
                      <h2 className="text-2xl font-semibold text-[#326de0]">Active Agreements</h2>
                      <ActiveAgreements agreements={mockAgreements} />
                    </TabsContent>
                    <TabsContent value="messages" className="space-y-4 mt-6">
                      <h2 className="text-2xl font-semibold text-[#326de0]">Recent Messages</h2>
                      <RecentMessages messages={mockMessages} />
                    </TabsContent>
                    <TabsContent value="profile" className="space-y-4 mt-6">
                      <h2 className="text-2xl font-semibold text-[#326de0]">Profile Summary</h2>
                      <UserProfileSummary user={mockUser} />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
