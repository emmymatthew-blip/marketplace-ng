"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginModal } from "@/components/auth/login-modal"
import { InquiryFormDialog } from "@/components/inquiry/inquiry-form-dialog"
import { TrustScoreBadge } from "@/components/trust/trust-score-badge"
import { TrustScoreModal } from "@/components/trust/trust-score-modal"
import { MessageSquare, User, FileText, Send, BarChart3, SquarePen } from "lucide-react"
import { RichText } from "@/components/shared/rich-text"
import { VerifiedBadge } from "@/components/verified-badge"

interface Vendor {
  id: string
  name: string
  companyName?: string
  image?: string
  bio?: string
  isVerified?: boolean
}

interface ProductVendorCardProps {
  vendor: Vendor
  productId: string
  productTitle?: string
}

export function ProductVendorCard({ vendor, productId, productTitle }: ProductVendorCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [trustModalOpen, setTrustModalOpen] = useState(false)
  const [loginCallbackUrl, setLoginCallbackUrl] = useState<string>()
  const isOwner = (session?.user as any)?.id === vendor.id

  const handleOpenInquiry = () => {
    if (!session) {
      setLoginCallbackUrl(`/marketplace/product/${productId}`)
      setShowLoginModal(true)
      return
    }
    setShowInquiryDialog(true)
  }

  const handleContactVendor = () => {
    if (!session) {
      setLoginCallbackUrl(`/messages/${vendor.id}?productId=${productId}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/messages/${vendor.id}?productId=${productId}`)
  }

  const handleCreateAgreement = () => {
    if (!session) {
      setLoginCallbackUrl(`/agreements/new?recipient=${vendor.id}&product=${productId}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/agreements/new?recipient=${vendor.id}&product=${productId}`)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">About the Company</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {vendor.image ? (
                <Image
                  src={vendor.image}
                  alt={vendor.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Link href={`/marketplace/vendor/${vendor.id}`} className="hover:text-primary transition-colors">
                  <h3 className="font-medium">{vendor.name}</h3>
                </Link>
                <VerifiedBadge verified={vendor.isVerified} size="sm" />
              </div>
              {vendor.companyName && (
                <Link href={`/marketplace/vendor/${vendor.id}`} className="hover:text-primary transition-colors">
                  <p className="text-sm text-muted-foreground">{vendor.companyName}</p>
                </Link>
              )}
              {!isOwner && (
                <div className="mt-2">
                  <TrustScoreBadge
                    score={null}
                    onClick={() => setTrustModalOpen(true)}
                    size="sm"
                    showLabel={true}
                  />
                </div>
              )}
            </div>
          </div>

          {vendor.bio && (
            <RichText html={vendor.bio} className="text-sm text-muted-foreground mb-4" />
          )}

          {isOwner ? (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push(`/marketplace/my-products/${productId}/edit`)}
              >
                <SquarePen className="w-4 h-4 mr-2" />
                Edit Listing
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/messages")}>
                <MessageSquare className="w-4 h-4 mr-2" />
                View Messages
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push(`/dashboard/analytics?productId=${productId}`)}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button onClick={handleOpenInquiry} className="w-full bg-primary hover:bg-primary/90 text-white">
                <Send className="w-4 h-4 mr-2" />
                Request Quote
              </Button>
              <Button variant="outline" className="w-full" onClick={handleContactVendor}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Company
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCreateAgreement}>
                <FileText className="w-4 h-4 mr-2" />
                Create Agreement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        callbackUrl={loginCallbackUrl}
      />
      <InquiryFormDialog
        open={showInquiryDialog}
        onOpenChange={setShowInquiryDialog}
        productId={productId}
        productTitle={productTitle}
        vendorId={vendor.id}
      />
      {!isOwner && (
        <TrustScoreModal
          userId={vendor.id}
          userName={vendor.companyName || vendor.name}
          open={trustModalOpen}
          onOpenChange={setTrustModalOpen}
        />
      )}
    </>
  )
}
