"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ProductForm } from "@/components/products/product-form"
import { ArrowLeft, Printer } from "lucide-react"

export default function NewProductPage() {
  const { data: session, status } = useSession()

  // Redirect if not authenticated or not a printer/manufacturer
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/marketplace/my-products/new")
    } else if (status === "authenticated" && session.user.role !== "PRINTER" && session.user.role !== "MANUFACTURER") {
      redirect("/dashboard")
    }
  }, [status, session])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session || (session.user.role !== "PRINTER" && session.user.role !== "MANUFACTURER")) {
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
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/marketplace/my-products">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to My Products
                </Link>
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
              <p className="text-muted-foreground">
                Add a new product to showcase in the marketplace. Provide detailed information to attract potential
                customers.
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
