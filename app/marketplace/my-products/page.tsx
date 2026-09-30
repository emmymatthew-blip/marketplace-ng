"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, Plus, Edit, Trash2, Package, Eye, AlertTriangle, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { Input } from "@/components/ui/input"
import { isSeller } from "@/lib/user-roles"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductImageGallery } from "@/components/marketplace/product-image-gallery"
import { ProductDetail } from "@/components/marketplace/product-detail"
import { ProductVendorCard } from "@/components/marketplace/product-vendor-card"
import { ProductVideoSection } from "@/components/marketplace/product-video-section"

interface Product {
  id: string
  title: string
  description: string
  categoryId?: string
  category?: {
    name: string
    slug: string
  }
  images: string[] | string // Can be array or JSON string from API
  contactInfo?: string
  condition?: string
  brand?: string
  createdAt: string
  updatedAt: string
}

function MyProductsContent() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<any>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Redirect if not authenticated or not a seller
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/marketplace/my-products")
    } else if (status === "authenticated") {
      if (session?.user?.role && !isSeller(session.user.role)) {
        redirect("/dashboard")
      }
    }
  }, [status, session])

  // Fetch products when authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProducts()
    }
  }, [status, session])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?ownerId=${session?.user?.id}`)
      const data = await response.json()
      
      if (data.success) {
        // Ensure images are parsed correctly
        const formattedProducts = (data.data || []).map((product: any) => ({
          ...product,
          images: Array.isArray(product.images) 
            ? product.images 
            : typeof product.images === 'string' 
              ? JSON.parse(product.images || '[]')
              : []
        }))
        setProducts(formattedProducts)
      } else {
        throw new Error(data.error || "Failed to fetch products")
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load your products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading your products...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user?.role || !isSeller(session.user.role)) {
    return null
  }

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product)
    setDeleteDialogOpen(true)
    setDeleteConfirmation("")
  }

  const handlePreviewClick = async (product: Product) => {
    setPreviewDialogOpen(true)
    setLoadingPreview(true)
    
    try {
      const response = await fetch(`/api/products/${product.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch product details")
      }
      
      const data = await response.json()
      
      // Parse images and specifications
      let images: string[] = []
      try {
        images = Array.isArray(data.images) 
          ? data.images 
          : typeof data.images === 'string' 
            ? JSON.parse(data.images || '[]')
            : []
      } catch (e) {
        console.error('Error parsing images:', e)
      }
      
      let specifications: Record<string, string> = {}
      try {
        if (data.specifications) {
          specifications = typeof data.specifications === 'string' 
            ? JSON.parse(data.specifications) 
            : data.specifications
        }
      } catch (e) {
        console.error('Error parsing specifications:', e)
      }
      
      setPreviewProduct({
        ...data,
        images,
        specifications,
        category: data.category?.name || data.categoryName || "Uncategorized",
      })
    } catch (error) {
      console.error("Error fetching product preview:", error)
      toast({
        title: "Error",
        description: "Failed to load product preview. Please try again.",
        variant: "destructive",
      })
      setPreviewDialogOpen(false)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return

    if (deleteConfirmation.toLowerCase() !== "delete") {
      toast({
        title: "Invalid confirmation",
        description: 'Please type "delete" to confirm.',
        variant: "destructive",
      })
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete product")
      }

      toast({
        title: "Product deleted",
        description: "Your product has been deleted successfully.",
      })

      // Remove product from list
      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
      setDeleteConfirmation("")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Failed to delete product",
        description: error instanceof Error ? error.message : "There was an error deleting your product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
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
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Listings
                </h1>
                <p className="text-lg text-muted-foreground">Manage your advertised products and services.</p>
              </div>
              <Button asChild size="lg" className="gap-2 !text-white">
                <Link href="/marketplace/my-products/new">
                  <Plus className="h-4 w-4" />
                  Advertise Product
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col gap-8">
            {products.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Advertise your first product or service to connect with industry partners.
                  </p>
                  <Button asChild>
                    <Link href="/marketplace/my-products/new">Advertise Your First Product</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                  </p>
                  <Badge variant="secondary" className="px-4 py-1">
                    {session.user.role}
                  </Badge>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => {
                    // Parse images if it's a string
                    let productImages: string[] = []
                    try {
                      if (Array.isArray(product.images)) {
                        productImages = product.images
                      } else if (typeof product.images === 'string') {
                        productImages = JSON.parse(product.images || '[]')
                      }
                    } catch (e) {
                      console.error('Error parsing images:', e)
                      productImages = []
                    }
                    
                    // Format date
                    const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })

                    return (
                      <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                        <Link href={`/marketplace/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
                          <Image
                            src={productImages[0] || "/placeholder.svg?height=300&width=400"}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </Link>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1 flex-1">
                              <Link href={`/marketplace/product/${product.id}`}>
                                <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors">
                                  {product.title}
                                </CardTitle>
                              </Link>
                              <CardDescription>{formattedDate}</CardDescription>
                            </div>
                            {product.category && (
                              <Badge variant="outline" className="shrink-0">
                                {product.category.name}
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || ''}
                          </p>
                          <div className="flex items-center justify-between">
                            {product.brand && (
                              <Badge variant="outline" className="text-xs">
                                {product.brand}
                              </Badge>
                            )}
                            {product.condition && (
                              <Badge variant="secondary" className="text-xs">
                                {product.condition === "NEW" ? "New" : "Used"}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="grid grid-cols-3 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="col-span-1"
                            onClick={() => handlePreviewClick(product)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button asChild variant="outline" size="sm" className="col-span-1">
                            <Link href={`/marketplace/my-products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteClick(product)}
                            className="col-span-1"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[400px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your product
              from our servers and remove it from the marketplace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="mt-4 rounded-lg border p-4">
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md">
                    {(() => {
                      let imageUrl = "/placeholder.svg?height=80&width=80"
                      try {
                        if (Array.isArray(selectedProduct.images) && selectedProduct.images[0]) {
                          imageUrl = selectedProduct.images[0]
                        } else if (typeof selectedProduct.images === 'string') {
                          const parsed = JSON.parse(selectedProduct.images || '[]')
                          imageUrl = parsed[0] || imageUrl
                        }
                      } catch (e) {
                        console.error('Error parsing image:', e)
                      }
                      return (
                        <Image
                          src={imageUrl}
                          alt={selectedProduct.title}
                          fill
                          className="object-cover"
                        />
                      )
                    })()}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium">{selectedProduct.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedProduct.category?.name || "No category"}
                    </p>
                    {selectedProduct.condition && (
                      <Badge variant="secondary" className="mt-1">
                        {selectedProduct.condition === "NEW" ? "New" : "Used"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-sm">
                  Type <span className="text-destructive font-semibold">delete</span> to confirm:
                </p>
                <Input
                  type="text"
                  placeholder="Type delete to confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="max-w-[200px]"
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmation.toLowerCase() !== "delete" || isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Product Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl">Product Preview</DialogTitle>
            <DialogDescription>
              This is how your listing appears to visitors in the marketplace
            </DialogDescription>
          </DialogHeader>
          
          {loadingPreview ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          ) : previewProduct ? (
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Images and Details */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Product Images */}
                  <div className="bg-white rounded-xl">
                    <ProductImageGallery images={previewProduct.images || []} />
                  </div>

                  {/* Product Details */}
                  <div className="bg-white rounded-xl shadow-sm border">
                    <ProductDetail product={previewProduct} />
                  </div>

                  {/* Product Video Section */}
                  {previewProduct.videoUrl && (
                    <div className="bg-white rounded-xl shadow-sm border">
                      <ProductVideoSection
                        productId={previewProduct.id}
                        productName={previewProduct.title}
                        vendorName={previewProduct.owner?.name || "Vendor"}
                        vendorId={previewProduct.owner?.id}
                        videoUrl={previewProduct.videoUrl}
                        videoTitle="Product Demonstration"
                        videoDescription="Watch this video to see our product in action and learn about its features, specifications, and capabilities."
                        isEditable={false}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Vendor Info */}
                <aside className="lg:col-span-4">
                  <div className="sticky top-6">
                    {previewProduct.owner && (
<ProductVendorCard
                        vendor={previewProduct.owner}
                        productId={previewProduct.id}
                        productTitle={previewProduct.title}
                      />
                    )}
                  </div>
                </aside>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function MyProductsPage() {
  return <MyProductsContent />
}
