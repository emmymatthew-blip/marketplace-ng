"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package } from "lucide-react"

interface Product {
  id: string
  title: string
  description: string
  categoryName?: string
  categorySlug?: string
  images: string[]
  createdAt: string
  brand?: string
  condition?: string
}

interface VendorProductsProps {
  vendorId: string
}

export function VendorProducts({ vendorId }: VendorProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch products for this vendor
        const response = await fetch(`/api/products?ownerId=${vendorId}`)
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
      } catch (err) {
        console.error("Error fetching vendor products:", err)
        setError(err instanceof Error ? err.message : "Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    if (vendorId) {
      fetchProducts()
    }
  }, [vendorId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-2">Error loading products</p>
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-gray-500 mb-2">This company has not listed any products yet.</p>
        <p className="text-gray-500 text-sm">Check back later or contact them directly for more information.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            month: 'short',
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
                {product.categoryName && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-white/90 text-gray-800">
                      {product.categoryName}
                    </Badge>
                  </div>
                )}
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
              <CardFooter className="pt-0">
                <Link href={`/marketplace/product/${product.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
