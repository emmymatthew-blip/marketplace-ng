"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { VerificationDocumentUpload } from "./verification-document-upload"
import type { ReactNode } from "react"

export type VerificationOptionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "MORE_INFO_REQUIRED"
  | "PENDING"

export interface VerificationOptionCardProps {
  title: string
  description: string
  status: VerificationOptionStatus
  actionLabel?: string
  onAction?: () => void
  showUpload?: boolean
  uploadValue?: File | null
  onUploadChange?: (file: File | null) => void
  uploadAccept?: Record<string, string[]>
  children?: ReactNode
  disabled?: boolean
}

export function VerificationOptionCard({
  title,
  description,
  status,
  actionLabel = "Submit",
  onAction,
  showUpload,
  uploadValue,
  onUploadChange,
  uploadAccept,
  children,
  disabled,
}: VerificationOptionCardProps) {
  const isComplete = status === "APPROVED"
  const canSubmit =
    status === "NOT_STARTED" || status === "REJECTED" || status === "MORE_INFO_REQUIRED"

  return (
    <Card className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        {showUpload && (
          <VerificationDocumentUpload
            value={uploadValue}
            onChange={onUploadChange}
            accept={uploadAccept}
            disabled={disabled || isComplete}
          />
        )}
        {canSubmit && onAction && (
          <Button onClick={onAction} disabled={disabled || isComplete} size="sm">
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
