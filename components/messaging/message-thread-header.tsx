"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { VerifiedBadge } from "@/components/verified-badge"
import { Building2, Package, FileText } from "lucide-react"

export interface MessageThreadHeaderProps {
  companyName: string
  contactName: string
  contactImage?: string
  isVerified?: boolean
  productContext?: {
    id: string
    title: string
  } | null
  agreementStatus?: {
    id: string
    status: string
  } | null
}

export function MessageThreadHeader({
  companyName,
  contactName,
  contactImage,
  isVerified,
  productContext,
  agreementStatus,
}: MessageThreadHeaderProps) {
  return (
    <div className="border-b bg-muted/30 px-4 py-3 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
          {contactImage ? (
            <img src={contactImage} alt="" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <Building2 className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold truncate">{contactName}</span>
            <VerifiedBadge verified={isVerified} size="sm" />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {companyName || "Company"}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        {productContext && (
          <Link
            href={`/marketplace/product/${productContext.id}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1.5 border hover:bg-muted/50 transition-colors"
          >
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="truncate max-w-[180px]">{productContext.title}</span>
          </Link>
        )}
        {agreementStatus && (
          <Link
            href={`/agreements/${agreementStatus.id}`}
            className="inline-flex items-center gap-1.5 rounded-md bg-background px-2 py-1.5 border hover:bg-muted/50 transition-colors"
          >
            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Agreement: </span>
            <Badge variant="secondary" className="text-xs">{agreementStatus.status}</Badge>
          </Link>
        )}
      </div>
    </div>
  )
}
