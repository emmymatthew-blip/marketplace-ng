"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"

interface RelatedProductsProps {
  products: any[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  // If no products or empty array, show nothing
  if (!products || products.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product) => (
          <Link key={product.id} href={`/marketplace/product/${product.id}`} className="flex gap-3 group">
            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted">
              <Image
                src={product.images?.[0] || PLACEHOLDER_IMAGE}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium group-hover:text-primary transition-colors">{product.title}</h3>
              <p className="text-sm text-muted-foreground">{product.category}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
