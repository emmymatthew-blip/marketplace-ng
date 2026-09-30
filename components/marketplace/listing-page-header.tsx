"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { VerifiedBadge } from "@/components/verified-badge"
import { LoginModal } from "@/components/auth/login-modal"
import { InquiryFormDialog } from "@/components/inquiry/inquiry-form-dialog"
import { MessageSquare, FileText, Send, ChevronRight, MapPin, Tag, Building2, BarChart3, SquarePen } from "lucide-react"
import { useState } from "react"

function getConditionLabel(condition: string | undefined | null): string {
  if (!condition) return ""
  if (condition === "NEW") return "New Machines"
  if (condition === "USED") return "Used Machines"
  return condition
}

export interface ListingPageHeaderProps {
  product: {
    id: string
    title: string
    category: string
    condition?: string | null
    brand?: string | null
    location?: string | null
    createdAt?: string | null
    owner: {
      id: string
      name?: string | null
      companyName?: string | null
      isVerified?: boolean
    }
  }
}

export function ListingPageHeader({ product }: ListingPageHeaderProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [loginCallbackUrl, setLoginCallbackUrl] = useState<string>()
  const isOwner = (session?.user as any)?.id === product.owner.id

  const companyName = product.owner?.companyName || product.owner?.name || "Company"
  const conditionLabel = getConditionLabel(product.condition)

  const handleContactCompany = () => {
    if (!session) {
      setLoginCallbackUrl(`/messages/${product.owner.id}?productId=${product.id}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/messages/${product.owner.id}?productId=${product.id}`)
  }

  const handleRequestQuote = () => {
    if (!session) {
      setLoginCallbackUrl(`/marketplace/product/${product.id}`)
      setShowLoginModal(true)
      return
    }
    setShowInquiryDialog(true)
  }

  const handleCreateAgreement = () => {
    if (!session) {
      setLoginCallbackUrl(`/agreements/new?recipient=${product.owner.id}&product=${product.id}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/agreements/new?recipient=${product.owner.id}&product=${product.id}`)
  }

  const dateListed = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : null

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link href="/marketplace" className="hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
            <Link href={`/marketplace/product/${product.id}`} className="font-medium text-foreground truncate max-w-[200px] sm:max-w-none" aria-current="page">
              Listing
            </Link>
          </nav>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {product.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  {companyName}
                </span>
                {product.owner?.isVerified && (
                  <VerifiedBadge verified size="sm" level="company" showLabel={true} className="inline-flex" />
                )}
              </div>
            </div>

            {/* Meta row: location, condition, category, brand */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {product.location && (
                <span
                  className="flex items-center gap-1.5"
                  title={`Equipment location: ${product.location}`}
                >
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="sr-only">Equipment location: </span>
                  {product.location}
                </span>
              )}
              {conditionLabel && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-4 w-4 shrink-0" aria-hidden />
                  {conditionLabel}
                </span>
              )}
              {product.category && (
                <span>{product.category}</span>
              )}
              {product.brand && (
                <span>{product.brand}</span>
              )}
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {isOwner ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/marketplace/my-products/${product.id}/edit`)}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <SquarePen className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    Edit Listing
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push("/messages")}>
                    <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    View Messages
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/analytics?productId=${product.id}`)}>
                    <BarChart3 className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    View Analytics
                  </Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={handleRequestQuote} className="bg-primary hover:bg-primary/90 text-white">
                    <Send className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    Request Quote
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleContactCompany}>
                    <MessageSquare className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    Contact Company
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCreateAgreement}>
                    <FileText className="h-4 w-4 mr-1.5 shrink-0" aria-hidden />
                    Create Agreement
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} callbackUrl={loginCallbackUrl} />
      <InquiryFormDialog
        open={showInquiryDialog}
        onOpenChange={setShowInquiryDialog}
        productId={product.id}
        productTitle={product.title}
        vendorId={product.owner.id}
      />
    </>
  )
}
