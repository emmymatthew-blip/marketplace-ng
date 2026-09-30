"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { CreateThreadForm } from "@/components/forum/create-thread-form"
import { ArrowLeft, Printer } from "lucide-react"
import { Footer } from "@/components/footer"

// Mock data - would be fetched from API in production
const mockCategories = [
  { id: "cat1", name: "Press Equipment" },
  { id: "cat2", name: "Screen Printing" },
  { id: "cat3", name: "Textile" },
  { id: "cat4", name: "UV" },
  { id: "cat5", name: "Software" },
  { id: "cat6", name: "Graphics" },
  { id: "cat7", name: "Consumables" },
  { id: "cat8", name: "Promotional Materials" },
  { id: "cat9", name: "Pre-Press" },
  { id: "cat10", name: "Post-Press" },
]

export default function NewThreadPage() {
  const { data: session, status } = useSession()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/forum/new")
    }
  }, [status])

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
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/forum">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forum
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Create New Thread</h1>
              <p className="text-muted-foreground">
                Start a new discussion in the forum. Be sure to choose the appropriate category.
              </p>
            </div>

            <CreateThreadForm categories={mockCategories} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
