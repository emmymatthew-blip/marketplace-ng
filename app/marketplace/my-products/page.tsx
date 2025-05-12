"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock data - would be fetched from API in production
const mockProducts = [
  {
    id: "product1",
    title: "Digital Printing Press",
    description: "High-quality digital printing press for commercial use. Supports various paper sizes and types.",
    category: "Press Equipment",
    images: ["/placeholder.svg?height=200&width=200"],
    createdAt: "June 15, 2023",
  },
  {
    id: "product2",
    title: "Premium Ink Set",
    description: "Premium quality ink set for all types of printing. Available in various colors.",
    category: "Consumables",
    images: ["/placeholder.svg?height=200&width=200"],
    createdAt: "June 18, 2023",
  },
  {
    id: "product3",
    title: "Screen Printing Kit",
    description: "Complete screen printing kit for beginners and professionals. Includes all necessary tools.",
    category: "Screen Printing",
    images: ["/placeholder.svg?height=200&width=200"],
    createdAt: "June 20, 2023",
  },
]

export default function MyProductsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()

  // Redirect if not authenticated or not a printer/manufacturer
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/marketplace/my-products")
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

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/products/${productId}`, {
      //   method: "DELETE",
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully.",
      })

      // In a real app, we would update the products list
      // For now, we'll just reload the page
      window.location.reload()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Failed to delete product",
        description: "There was an error deleting your product. Please try again.",
        variant: "destructive",
      })
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
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
                <p className="text-muted-foreground">Manage your products in the marketplace.</p>
              </div>
              <Button asChild>
                <Link href="/marketplace/my-products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            </div>

            {mockProducts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">You haven't added any products yet.</p>
                  <Button asChild className="mt-4">
                    <Link href="/marketplace/my-products/new">Add Your First Product</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-48 w-full bg-muted">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{product.title}</CardTitle>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <CardDescription>Added on {product.createdAt}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/marketplace/my-products/${product.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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
