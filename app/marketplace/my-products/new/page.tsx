"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ProductForm } from "@/components/products/product-form"
import { ArrowLeft, Printer } from "lucide-react"
import { isSeller } from "@/lib/user-roles"

function NewProductContent() {
  const { data: session, status } = useSession()

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/marketplace/my-products/new")
      return
    }
    
    if (status === "authenticated") {
      // Check if user is a seller by role
      if (session?.user?.role && !isSeller(session.user.role)) {
        redirect("/dashboard")
        return
      }
    }
  }, [status, session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session || !session.user?.role || !isSeller(session.user.role)) {
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
                <Link href="/marketplace/my-products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Listings
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Advertise a Product</h1>
              <p className="text-muted-foreground">
                Add a listing to promote your product or service. Provide detailed information to attract industry partners.
              </p>
            </div>

            <ProductForm />
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

export default function NewProductPage() {
  return <NewProductContent />
}
