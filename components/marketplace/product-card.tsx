"use client"

import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight, Tag } from "lucide-react"
import { VerifiedBadge } from "@/components/verified-badge"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"
import { cn } from "@/lib/utils"

// --- Helpers (safe fallbacks, consistent labels) ---

function getProductImage(images: string[] | undefined | null): string {
  if (images && images.length > 0 && images[0]) return images[0]
  return PLACEHOLDER_IMAGE
}

function getConditionLabel(condition: string | undefined | null): string | null {
  if (!condition) return null
  if (condition === "NEW") return "New Machines"
  if (condition === "USED") return "Used Machines"
  return condition
}

function getOwnerDisplayName(owner: ProductCardProps["product"]["owner"]): string {
  if (!owner) return "—"
  const name = owner.companyName || owner.name
  return (name && String(name).trim()) || "—"
}

/** Strip HTML and normalize whitespace for a one-line snippet. */
function getPlainTextDescription(html: string | undefined | null, maxLength = 120): string {
  if (!html || typeof html !== "string") return ""
  const stripped = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  if (maxLength > 0 && stripped.length > maxLength) {
    return stripped.slice(0, maxLength).trim() + "…"
  }
  return stripped
}

function getCategoryName(category: ProductCardProps["product"]["category"]): string {
  if (!category) return "Uncategorized"
  return category.name || "Uncategorized"
}

// --- Types ---

export interface ProductCardProps {
  product: {
    id: string
    title: string
    description?: string | null
    categoryId?: string | null
    category?: {
      name: string
      slug: string
    } | null
    images?: string[] | null
    location?: string | null
    condition?: string | null
    owner?: {
      name?: string | null
      companyName?: string | null
      isVerified?: boolean
    } | null
  }
  viewMode?: "grid" | "list"
}

// --- Component ---

export function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const imageSrc = getProductImage(product.images)
  const ownerName = getOwnerDisplayName(product.owner)
  const conditionLabel = getConditionLabel(product.condition)
  const categoryName = getCategoryName(product.category)
  const descriptionSnippet = getPlainTextDescription(product.description, 100)
  const isVerified = !!product.owner?.isVerified
  const location = product.location?.trim() || null

  if (viewMode === "list") {
    return (
      <Link
        href={`/marketplace/product/${product.id}`}
        className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
        aria-label={`View listing: ${product.title} from ${ownerName}`}
      >
        <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md border border-border bg-card rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
            {/* Image */}
            <div className="relative w-full sm:w-36 aspect-square sm:aspect-auto sm:min-h-[140px] shrink-0 overflow-hidden">
              <Image
                src={imageSrc}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 144px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              {conditionLabel && (
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="text-[10px] font-medium shadow-sm bg-background/90 backdrop-blur-sm">
                    {conditionLabel}
                  </Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 p-4 min-w-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm font-medium text-foreground/90">{ownerName}</span>
                  {isVerified && (
                    <VerifiedBadge size="sm" showLabel={false} className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0" />
                  )}
                </div>
                {descriptionSnippet && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1.5">
                    {descriptionSnippet}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3 shrink-0" />
                    {categoryName}
                  </span>
                  {location && (
                    <span className="flex items-center gap-1" title={`Equipment location: ${location}`}>
                      <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                      <span className="truncate max-w-[140px]">{location}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Badges + affordance (desktop) */}
              <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:shrink-0">
                <div className="flex flex-wrap gap-1.5">
                  {conditionLabel && (
                    <Badge variant="outline" className="text-xs font-normal">
                      {conditionLabel}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs font-normal">
                    {categoryName}
                  </Badge>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                  View listing
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // --- Grid view ---
  return (
    <Link
      href={`/marketplace/product/${product.id}`}
      className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      aria-label={`View listing: ${product.title} from ${ownerName}`}
    >
      <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md border border-border bg-card rounded-xl">
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={imageSrc}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {/* Bottom gradient for readability when badges overlap */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"
            aria-hidden
          />
          {/* Condition on image */}
          {conditionLabel && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="text-[10px] font-medium shadow-sm bg-background/90 backdrop-blur-sm border-0">
                {conditionLabel}
              </Badge>
            </div>
          )}
          {/* Verified: top-right, subtle */}
          {isVerified && (
            <div className="absolute top-2 right-2">
              <VerifiedBadge
                size="sm"
                showLabel={false}
                className="bg-background/90 backdrop-blur-sm text-emerald-700 dark:text-emerald-400 border-0 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors text-[15px] leading-tight">
            {product.title}
          </h3>
          <p className="text-sm font-medium text-foreground/85 mt-1.5">
            {ownerName}
            {isVerified && (
              <VerifiedBadge size="sm" showLabel={true} className="ml-1.5 align-middle bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0 inline-flex" />
            )}
          </p>
          {descriptionSnippet && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
              {descriptionSnippet}
            </p>
          )}
          {/* Metadata row */}
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3 shrink-0" />
              {categoryName}
            </span>
            {location && (
              <span className="flex items-center gap-1 min-w-0" title={`Equipment location: ${location}`}>
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                <span className="truncate">{location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Footer affordance */}
        <div className="px-4 pb-4 pt-0">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
            View listing
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden />
          </span>
        </div>
      </Card>
    </Link>
  )
}
