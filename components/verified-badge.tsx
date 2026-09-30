"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

export type VerificationLevel = "verified" | "company" | "enterprise"

interface VerifiedBadgeProps {
  verified?: boolean
  /** "company" = Verified Company, "enterprise" = Enterprise Verified, otherwise "Verified" */
  level?: VerificationLevel
  className?: string
  size?: "sm" | "default"
  showLabel?: boolean
}

const LABELS: Record<VerificationLevel, string> = {
  verified: "Verified",
  company: "Verified Company",
  enterprise: "Enterprise Verified",
}

export function VerifiedBadge({
  verified = true,
  level = "verified",
  className,
  size = "default",
  showLabel = true,
}: VerifiedBadgeProps) {
  if (!verified) return null
  const label = LABELS[level]
  const isEnterprise = level === "enterprise"
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 inline-flex items-center",
        isEnterprise ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" : "bg-green-100 text-green-800 hover:bg-green-100",
        size === "sm" && "text-xs px-1.5 py-0",
        className
      )}
      title={label}
    >
      {isEnterprise ? <Building2 className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} /> : <CheckCircle className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
      {showLabel && <span className={size === "sm" ? "ml-0.5" : "ml-1"}>{label}</span>}
    </Badge>
  )
}
