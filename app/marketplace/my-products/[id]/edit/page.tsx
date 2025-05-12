"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ProductForm } from "@/components/products/product-form"
import { ArrowLeft, Printer } from "lucide-react"

// Mock data - would be fetched from API in production
const mockProduct = {
  id: "product1",
  title: "Digital Printing Press",
  description: "High-quality digital printing press for commercial use. Supports various paper sizes and types.",
  category: "press",
  images: ["/placeholder.svg?height=300&width=300"],
  contactInfo: "Email: sales@example.com\nPhone: +234 123 456 7890",
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState(mockProduct)

  // Redirect if not authenticated or not a printer/manufacturer
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/marketplace/my-products/" + params.id + "/edit")
    } else if (status === "authenticated" && session.user.role !== "PRINTER" && session.user.role !== "MANUFACTURER") {
      redirect("/dashboard")
    }
  }, [status, session, params.id])

  // Fetch product data
  useEffect(() => {
    if (status === "authenticated") {
      // In a real app, this would be an API call
      // const fetchProduct = async () => {
      //   try {
      //     const response = await fetch(`/api/products/${params.id}`)
      //     const data = await response.json()
      //     setProduct(data)
      //   } catch (error) {
      //     console.error("Error fetching product:", error)
      //   } finally {
      //     setIsLoading(false)
      //   }
      // }
      // fetchProduct()

      // Simulate API call
      setTimeout(() => {
        setProduct(mockProduct)
        setIsLoading(false)
      }, 500)
    }
  }, [status, params.id])

  if (status === "loading" || isLoading) {
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
              <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
              <p className="text-muted-foreground">
                Update your product information to keep it accurate and up-to-date.
              </p>
            </div>

            <ProductForm product={product} isEditing={true} />
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
