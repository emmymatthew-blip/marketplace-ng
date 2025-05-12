"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ProfileForm } from "@/components/profile/profile-form"
import { Printer } from "lucide-react"
import { Footer } from "@/components/footer"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/profile")
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
    bio: "Professional printer with over 10 years of experience in the industry.",
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
              <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and account settings.</p>
            </div>

            <ProfileForm user={mockUser} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
