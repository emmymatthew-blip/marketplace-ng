"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ProductForm } from "@/components/products/product-form"
import { ArrowLeft } from "lucide-react"
import { Footer } from "@/components/footer"
import { isSeller } from "@/lib/user-roles"

function EditProductContent() {
  const { data: session, status } = useSession()
  const params = useParams()
  const productId = params?.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/marketplace/my-products/" + productId + "/edit")
    } else if (status === "authenticated") {
      if (session?.user?.role && !isSeller(session.user.role)) {
        redirect("/dashboard")
      }
    }
  }, [status, session, productId])

  // Fetch product data
  useEffect(() => {
    if (status === "authenticated" && productId) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${productId}`)
          if (!response.ok) {
            throw new Error("Failed to fetch product")
          }
          const data = await response.json()
          
          // Ensure images is an array and filter out blob URLs
          let productImages = data.images || []
          if (typeof productImages === 'string') {
            try {
              productImages = JSON.parse(productImages)
            } catch (e) {
              console.error("Error parsing images:", e)
              productImages = []
            }
          }
          if (!Array.isArray(productImages)) {
            productImages = []
          }
          
          // Filter out blob URLs - these are temporary and shouldn't be in the database
          productImages = productImages.filter((img: string) => {
            if (!img || typeof img !== 'string') return false
            if (img.startsWith('blob:')) {
              console.warn("Filtering out blob URL from product data:", img)
              return false
            }
            return img.startsWith('http://') || img.startsWith('https://')
          })
          
          console.log("Product data loaded:", {
            id: data.id,
            imagesCount: productImages.length,
            images: productImages
          })
          
          // Transform API data to match ProductForm interface
          setProduct({
            id: data.id,
            title: data.title,
            description: data.description,
            categoryId: data.categoryId,
            category: data.category?.name || "",
            images: productImages,
            contactInfo: data.contactInfo || "",
            condition: data.condition || "NEW",
            brand: data.brand || "",
            location: data.location || "",
            specifications: data.specifications || {},
            videoUrl: data.videoUrl || "",
          })
        } catch (error) {
          console.error("Error fetching product:", error)
          setError("Failed to load product. Please try again.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchProduct()
    }
  }, [status, productId])

  if (status === "loading" || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user?.role || !isSeller(session.user.role)) {
    return null
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button asChild>
            <Link href="/marketplace/my-products">Back to My Listings</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button asChild>
            <Link href="/marketplace/my-products">Back to My Listings</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background py-10">
          <div className="container mx-auto">
            <div className="flex flex-col gap-6">
              <Button variant="ghost" size="sm" asChild className="w-fit">
                <Link href="/marketplace/my-products" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to My Listings
                </Link>
              </Button>

              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Edit Product
                </h1>
                <p className="text-lg text-muted-foreground">
                  Update your product information to keep it accurate and up-to-date.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background rounded-2xl" />
            <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl border shadow-lg">
              <ProductForm product={product} isEditing={true} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function EditProductPage() {
  return <EditProductContent />
}
