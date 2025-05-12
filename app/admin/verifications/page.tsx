"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AdminSidebar } from "@/components/sidebar/admin-sidebar"
import { VerificationRequestCard } from "@/components/admin/verification-request-card"
import { useToast } from "@/components/ui/use-toast"
import { Search } from "lucide-react"

// Mock data - would be fetched from API in production
const mockVerificationRequests = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg?height=40&width=40",
    role: "PRINTER",
    cipponId: "CIPPON12345",
    submittedAt: "June 15, 2023",
    companyName: "John's Printing Services",
    location: "Lagos",
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    image: "/placeholder.svg?height=40&width=40",
    role: "PRINTER",
    cipponId: "CIPPON67890",
    submittedAt: "June 18, 2023",
    companyName: "Smith Printing Solutions",
    location: "Abuja",
  },
  {
    id: "user3",
    name: "Michael Johnson",
    email: "michael@example.com",
    image: "/placeholder.svg?height=40&width=40",
    role: "PRINTER",
    cipponId: "CIPPON54321",
    submittedAt: "June 20, 2023",
    companyName: "Johnson Print & Design",
    location: "Port Harcourt",
  },
]

export default function VerificationsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [requests, setRequests] = useState(mockVerificationRequests)

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/admin/verifications")
    } else if (status === "authenticated" && session.user.role !== "ADMIN") {
      redirect("/dashboard")
    }
  }, [status, session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  const filteredRequests = requests.filter(
    (request) =>
      request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (request.cipponId && request.cipponId.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleVerify = async (userId: string, cipponId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/admin/verify-printer", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId, cipponId, isVerified: true }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the verified request from the list
      setRequests(requests.filter((request) => request.id !== userId))
    } catch (error) {
      console.error("Error verifying printer:", error)
      throw error
    }
  }

  const handleReject = async (userId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/admin/verify-printer", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ userId, isVerified: false }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Remove the rejected request from the list
      setRequests(requests.filter((request) => request.id !== userId))
    } catch (error) {
      console.error("Error rejecting verification:", error)
      throw error
    }
  }

  return (
    <AdminSidebar>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Printer Verifications</h1>
          <p className="text-muted-foreground">Verify CIPPON membership for printer accounts.</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or CIPPON ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear
          </Button>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No verification requests found</h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery
                ? "No requests match your search criteria."
                : "There are no pending verification requests at this time."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredRequests.map((request) => (
              <VerificationRequestCard
                key={request.id}
                request={request}
                onVerify={handleVerify}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </AdminSidebar>
  )
}
