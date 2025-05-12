"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock  ArrowLeft } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast" // Removed duplicate import

// Mock data - would be fetched from API in production
const mockUsers = [
  { id: "user1", name: "PrintTech Solutions", role: "PRINTER" },
  { id: "user2", name: "GraphicPro Systems", role: "MANUFACTURER" },
  { id: "user3", name: "Ink Masters Nigeria", role: "MANUFACTURER" },
  { id: "user4", name: "ScreenTech International", role: "PRINTER" },
]

export default function NewAgreementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState<string>("")

  // Get recipient from URL if available
  useEffect(() => {
    const recipientId = searchParams.get("recipient")
    if (recipientId) {
      setSelectedRecipient(recipientId)
    }
  }, [searchParams])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/agreements/new")
    }
  }, [status])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      receiverId: formData.get("receiverId") as string,
      title: formData.get("title") as string,
      terms: formData.get("terms") as string,
      notes: formData.get("notes") as string,
    }

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/agreements", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Agreement created",
        description: "Your agreement has been sent to the recipient for review.",
      })

      // If we came from a chat, go back to the chat
      const fromChat = searchParams.get("fromChat")
      if (fromChat) {
        router.push(`/messages/${fromChat}`)
      } else {
        router.push("/agreements")
      }
    } catch (error) {
      console.error("Error creating agreement:", error)
      toast({
        title: "Failed to create agreement",
        description: "There was an error creating your agreement. Please try again.",
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
              <h1 className="text-3xl font-bold tracking-tight">Create New Agreement</h1>
              <p className="text-muted-foreground">
                Propose a new business agreement with another user on the platform.
              </p>
            </div>

            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Agreement Details</CardTitle>
                  <CardDescription>
                    Fill out the details of your proposed agreement. The recipient will need to accept it.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiverId">Recipient</Label>
                    <Select 
                      name="receiverId" 
                      required 
                      value={selectedRecipient}
                      onValueChange={setSelectedRecipient}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role.charAt(0) + user.role.slice(1).toLowerCase()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Agreement Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Digital Printing Services" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="terms">Terms and Conditions</Label>
                    <Textarea
                      id="terms"
                      name="terms"
                      placeholder="Describe the terms of your agreement in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea id="notes" name="notes" placeholder="Any additional information or context..." rows={3} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <Link href="/agreements">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Agreement"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
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
