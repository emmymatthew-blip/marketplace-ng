"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { AgreementDetail } from "@/components/agreements/agreement-detail"
import { AgreementStatusTimeline } from "@/components/agreements/agreement-status-timeline"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Printer } from "lucide-react"

type AgreementStatus = "PROPOSED" | "ACTIVE" | "COMPLETED" | "DISPUTED"

interface Agreement {
  id: string
  title: string
  status: AgreementStatus
  initiator: {
    id: string
    name: string
    image: string
    role: string
    isVerified: boolean
  }
  receiver: {
    id: string
    name: string
    image: string
    role: string
    isVerified: boolean
    companyName: string
  }
  terms: string
  notes: string
  startDate: string
  dueDate: string
  createdAt: string
  updatedAt: string
  isInitiator: boolean
}

interface TimelineEvent {
  status: AgreementStatus
  date: string
  actor: string
}

const mockAgreement: Agreement = {
  id: "agreement1",
  title: "Digital Printing Services",
  status: "PROPOSED",
  initiator: {
    id: "user1",
    name: "John Doe",
    image: "/placeholder.svg?height=40&width=40",
    role: "CONSUMER",
    isVerified: false,
  },
  receiver: {
    id: "user2",
    name: "PrintTech Solutions",
    image: "/placeholder.svg?height=40&width=40",
    role: "PRINTER",
    isVerified: true,
    companyName: "PrintTech Solutions Ltd",
  },
  terms: `1. PrintTech Solutions will provide digital printing services for marketing materials including brochures, flyers, and business cards.

2. The client will provide all design files in PDF format at least 5 business days before the required delivery date.

3. PrintTech Solutions will deliver a proof for approval within 2 business days of receiving the design files.

4. The client will pay 50% of the total cost upfront and the remaining 50% upon delivery.

5. The total cost for the services is ₦120,000.

6. PrintTech Solutions will deliver the final printed materials within 3 business days of proof approval.

7. This agreement is valid for 3 months from the date of acceptance.`,
  notes: "Please ensure all design files are in CMYK color mode and have at least 3mm bleed on all sides.",
  startDate: "June 15, 2023",
  dueDate: "July 15, 2023",
  createdAt: "June 10, 2023",
  updatedAt: "June 10, 2023",
  isInitiator: false,
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    status: "PROPOSED",
    date: "June 10, 2023",
    actor: "John Doe",
  },
]

interface AgreementDetailPageClientProps {
  id: string
}

export function AgreementDetailPageClient({ id }: AgreementDetailPageClientProps) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [agreement, setAgreement] = useState<Agreement>(mockAgreement)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(mockTimelineEvents)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/agreements/" + id)
    }
  }, [status, id])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleAccept = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/agreements/${id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ status: "ACTIVE" }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setAgreement({
        ...agreement,
        status: "ACTIVE",
        updatedAt: new Date().toLocaleDateString(),
      })

      // Add to timeline
      setTimelineEvents([
        ...timelineEvents,
        {
          status: "ACTIVE" as const,
          date: new Date().toLocaleDateString(),
          actor: session.user.name || "You",
        },
      ])

      toast({
        title: "Agreement accepted",
        description: "The agreement has been accepted and is now active.",
      })
    } catch (error) {
      console.error("Error accepting agreement:", error)
      toast({
        title: "Failed to accept agreement",
        description: "There was an error accepting the agreement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Agreement rejected",
        description: "The agreement has been rejected.",
      })

      // Redirect back to agreements list
      window.location.href = "/agreements"
    } catch (error) {
      console.error("Error rejecting agreement:", error)
      toast({
        title: "Failed to reject agreement",
        description: "There was an error rejecting the agreement. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setAgreement({
        ...agreement,
        status: "COMPLETED",
        updatedAt: new Date().toLocaleDateString(),
      })

      // Add to timeline
      setTimelineEvents([
        ...timelineEvents,
        {
          status: "COMPLETED" as const,
          date: new Date().toLocaleDateString(),
          actor: session.user.name || "You",
        },
      ])

      toast({
        title: "Agreement completed",
        description: "The agreement has been marked as completed.",
      })
    } catch (error) {
      console.error("Error completing agreement:", error)
      toast({
        title: "Failed to complete agreement",
        description: "There was an error completing the agreement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDispute = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update local state
      setAgreement({
        ...agreement,
        status: "DISPUTED",
        updatedAt: new Date().toLocaleDateString(),
      })

      // Add to timeline
      setTimelineEvents([
        ...timelineEvents,
        {
          status: "DISPUTED" as const,
          date: new Date().toLocaleDateString(),
          actor: session.user.name || "You",
        },
      ])

      toast({
        title: "Dispute raised",
        description: "A dispute has been raised for this agreement.",
      })
    } catch (error) {
      console.error("Error disputing agreement:", error)
      toast({
        title: "Failed to raise dispute",
        description: "There was an error raising a dispute for this agreement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/agreements">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Agreements
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Agreement Details</h1>
              <p className="text-muted-foreground">Review and manage your agreement.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <AgreementDetail
                  agreement={agreement}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onComplete={handleComplete}
                  onDispute={handleDispute}
                  isLoading={isLoading}
                />
              </div>
              <div>
                <AgreementStatusTimeline events={timelineEvents} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Printer className="h-6 w-6" />
              <span className="">NG MARKETPLACE</span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2023 NG MARKETPLACE. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 