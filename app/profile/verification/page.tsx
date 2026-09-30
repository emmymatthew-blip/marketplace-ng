"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { CipponVerificationForm } from "@/components/profile/cippon-verification-form"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Printer } from "lucide-react"

interface ExtendedUser {
  id: string
  name: string
  email: string
  image?: string
  role: string
  isVerified: boolean
  cipponId?: string
}

export default function VerificationPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/profile/verification")
    }
  }, [status, session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session?.user) return null

  const user = session.user as ExtendedUser

  const handleSubmitVerification = async (data: { cipponId: string; verificationDocument: string }) => {
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/profile/verification", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Verification request submitted",
        description: "Your CIPPON verification request has been submitted for review.",
      })
    } catch (error) {
      console.error("Error submitting verification request:", error)
      toast({
        title: "Failed to submit verification request",
        description: "There was an error submitting your verification request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Profile
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/verification">Verification Center</Link>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">CIPPON Verification</h1>
              <p className="text-muted-foreground">
                Verify your account as a CIPPON member to access printer-specific features. You can also use the full Verification Center for identity and business verification.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-1">
                <CipponVerificationForm
                  isVerified={user.isVerified}
                  cipponId={user.cipponId}
                  onSubmit={handleSubmitVerification}
                />
              </div>
              <div className="md:col-span-1">
                <div className="rounded-md bg-muted p-6">
                  <h3 className="text-lg font-medium mb-4">Why verify your CIPPON membership?</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Build trust with potential clients and partners</li>
                    <li>Access exclusive printer-specific features</li>
                    <li>Participate in industry-specific forums and discussions</li>
                    <li>Receive priority in search results and listings</li>
                    <li>Connect with other verified CIPPON members</li>
                  </ul>
                  <div className="mt-6">
                    <h4 className="font-medium mb-2">Verification Process</h4>
                    <ol className="space-y-2 list-decimal pl-5">
                      <li>Submit your CIPPON ID and membership certificate</li>
                      <li>Our team will verify your information with CIPPON</li>
                      <li>Once verified, your profile will display a verification badge</li>
                      <li>Verification typically takes 1-3 business days</li>
                    </ol>
                  </div>
                </div>
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
              <span className="">PrintMarket NG</span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2023 PrintMarket NG. All rights reserved.</p>
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
