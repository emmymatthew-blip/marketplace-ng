"use client"

import Link from "next/link"
import Image from "next/image"
import { Package, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"

export interface ProductContextSummary {
  id: string
  title: string
  images?: string[]
  condition?: string
  location?: string
  description?: string
  price?: number | string
  category?: string
  vendorName?: string
  ownerId?: string
}

function getConditionLabel(condition?: string): string {
  if (!condition) return ""
  const c = String(condition).toUpperCase()
  if (c === "NEW") return "New Machines"
  if (c === "USED") return "Used Machines"
  return condition
}

interface ProductContextCardProps {
  product: ProductContextSummary
  onDismiss?: () => void
  showDismiss?: boolean
}

export function ProductContextCard({
  product,
  onDismiss,
  showDismiss = false,
}: ProductContextCardProps) {
  const imageSrc =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : PLACEHOLDER_IMAGE
  const conditionLabel = getConditionLabel(product.condition)

  return (
    <div className="border-b border-border bg-muted/30 p-3 md:p-4">
      <div className="flex items-start gap-3">
        <Link
          href={`/marketplace/product/${product.id}`}
          className="relative block h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted"
        >
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Inquiry about this listing
              </span>
            </div>
            {showDismiss && onDismiss && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={onDismiss}
                aria-label="Remove product context"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Link
            href={`/marketplace/product/${product.id}`}
            className="mt-1 block text-sm font-medium text-foreground hover:text-primary line-clamp-2"
          >
            {product.title}
          </Link>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            {product.category && <span>{product.category}</span>}
            {conditionLabel && <span>{conditionLabel}</span>}
            {product.location && (
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                {product.location}
              </span>
            )}
            {product.vendorName && <span>· {product.vendorName}</span>}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            asChild
          >
            <Link href={`/marketplace/product/${product.id}`}>
              View listing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
