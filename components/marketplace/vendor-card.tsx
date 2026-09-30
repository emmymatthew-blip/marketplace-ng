"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import {
  MapPin,
  MessageSquare,
  ExternalLink,
  Award,
  Building2,
  FileText,
} from "lucide-react"
import Link from "next/link"

const FALLBACK_IMAGE = "/placeholder-user.jpg"

// --- Helpers (safe fallbacks, consistent labels) ---

function getDisplayName(vendor: VendorCardProps["vendor"]): string {
  const name = vendor.companyName || vendor.name
  return (name && String(name).trim()) || "Company"
}

/** Strip HTML and normalize to plain text; max length for card preview. */
function getCompanySummary(html: string | undefined | null, maxLength = 160): string {
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

function getVerificationStatus(vendor: VendorCardProps["vendor"]): "verified" | "unverified" {
  return !!(vendor.verified || vendor.isVerified) ? "verified" : "unverified"
}

function getListingCountLabel(count: number | undefined | null): string {
  if (count == null || count < 0) return ""
  return count === 1 ? "1 listing" : `${count} listings`
}

function getAvatarInitials(displayName: string): string {
  const trimmed = displayName.trim()
  if (!trimmed) return "Co"
  const parts = trimmed.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0]! + parts[parts.length - 1]![0]!).toUpperCase().slice(0, 2)
  }
  return trimmed.slice(0, 2).toUpperCase()
}

function getImageSrc(src: string | undefined | null): string {
  return (src && String(src).trim()) || FALLBACK_IMAGE
}

// --- Types ---

export interface VendorCardProps {
  vendor: {
    id: string
    name?: string | null
    companyName?: string | null
    description?: string | null
    category?: string | null
    location?: string | null
    image?: string | null
    verified?: boolean
    isVerified?: boolean
    rating?: number
    reviews?: number
    email?: string | null
    phone?: string | null
    jobTitle?: string | null
    companyWebsite?: string | null
    hasCipponMembership?: boolean
    cipponMembershipType?: string | null
    cipponMembershipNumber?: string | null
    productCount?: number | null
    role?: string | null
  }
  viewMode?: "grid" | "list"
}

// --- Component ---

export function VendorCard({ vendor, viewMode = "grid" }: VendorCardProps) {
  const { data: session } = useSession()
  const displayName = getDisplayName(vendor)
  const status = getVerificationStatus(vendor)
  const summary = getCompanySummary(vendor.description)
  const listingLabel = getListingCountLabel(vendor.productCount ?? undefined)
  const imageSrc = getImageSrc(vendor.image)
  const location = vendor.location?.trim() || null
  const category = vendor.category?.trim() || null
  const hasCippon = !!vendor.hasCipponMembership
  const website = vendor.companyWebsite?.trim() || null
  const isOwner = (session?.user as any)?.id === vendor.id

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden h-full border border-border bg-card rounded-xl transition-shadow duration-200 hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-stretch gap-0">
          {/* Left: company image/logo */}
          <div className="flex sm:flex-col sm:w-32 sm:min-h-[140px] items-center gap-3 p-4 sm:pt-4 sm:pb-2 sm:px-4 border-b sm:border-b-0 sm:border-r border-border bg-muted/20">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-border shrink-0">
              <AvatarImage src={imageSrc} alt={displayName} className="object-cover" />
              <AvatarFallback className="rounded-xl bg-muted text-muted-foreground font-medium text-lg">
                {getAvatarInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-wrap gap-1.5 sm:justify-center sm:mt-auto">
              {status === "verified" ? (
                <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0">
                  <Building2 className="h-3 w-3 mr-1 shrink-0" aria-hidden />
                  Verified Company
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] font-medium text-muted-foreground border-0">
                  Verification Pending
                </Badge>
              )}
              {hasCippon && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  <Award className="h-3 w-3 mr-1 shrink-0" aria-hidden />
                  CIPPON
                </Badge>
              )}
            </div>
          </div>

          {/* Middle: company info */}
          <div className="flex-1 min-w-0 p-4 flex flex-col">
            <h3 className="font-semibold text-foreground text-lg leading-tight">
              {displayName}
            </h3>
            {location && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{location}</span>
              </p>
            )}
            {category && (
              <p className="text-xs text-muted-foreground mt-0.5">{category}</p>
            )}
            {summary && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {summary}
              </p>
            )}
            {listingLabel && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                <FileText className="h-3 w-3 shrink-0" aria-hidden />
                {listingLabel}
              </p>
                )}
              </div>

          {/* Right: actions */}
          <div className="flex sm:flex-col sm:justify-end gap-2 p-4 sm:py-4 sm:pl-2 border-t sm:border-t-0 sm:border-l border-border bg-muted/10 sm:min-w-[140px]">
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href={`/marketplace/vendor/${vendor.id}`}>View Company</Link>
            </Button>
            {isOwner ? (
              <>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href="/marketplace/vendor/setup">
                    Edit Profile
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href="/dashboard/listings">
                    Manage Listings
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                  <Link href="/messages">
                    <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    View Messages
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link href={`/messages/${vendor.id}`}>
                  <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                  Contact Company
                </Link>
              </Button>
            )}
            {website && (
              <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground">
                <a href={website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5 shrink-0" aria-hidden />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </Card>
    )
  }

  // --- Grid view ---
  return (
    <Card className="overflow-hidden h-full flex flex-col border border-border bg-card rounded-xl transition-shadow duration-200 hover:shadow-md">
      {/* Visual identity */}
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          <Avatar className="h-14 w-14 rounded-xl border border-border shrink-0">
            <AvatarImage src={imageSrc} alt={displayName} className="object-cover" />
            <AvatarFallback className="rounded-xl bg-muted text-muted-foreground font-medium">
              {getAvatarInitials(displayName)}
              </AvatarFallback>
            </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
              {displayName}
            </h3>
            {location && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden />
                <span className="truncate">{location}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {status === "verified" ? (
                <Badge variant="secondary" className="text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-0">
                  Verified Company
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] font-medium text-muted-foreground border-0">
                  Verification Pending
                </Badge>
              )}
              {hasCippon && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  CIPPON Member
                </Badge>
              )}
              {category && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {category}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="flex-1 pt-0 space-y-3">
        {summary && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {summary}
          </p>
        )}
        {listingLabel && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3 shrink-0" aria-hidden />
            {listingLabel}
          </p>
        )}
      </CardContent>

      {/* Footer: primary View Company, secondary Contact, optional Website */}
      <CardFooter className="flex flex-wrap gap-2 border-t border-border pt-4">
        <Button asChild size="sm" className="flex-1 min-w-[100px]">
          <Link href={`/marketplace/vendor/${vendor.id}`}>View Company</Link>
        </Button>
        {isOwner ? (
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/marketplace/vendor/setup">Edit Profile</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/listings">Manage Listings</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/messages">
                <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                View Messages
              </Link>
            </Button>
          </>
        ) : (
          <Button asChild variant="outline" size="sm">
          <Link href={`/messages/${vendor.id}`}>
              <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
              Contact Company
          </Link>
        </Button>
        )}
        {website && (
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground w-full sm:w-auto">
            <a href={website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5 shrink-0" aria-hidden />
              Visit Website
            </a>
        </Button>
        )}
      </CardFooter>
    </Card>
  )
}
