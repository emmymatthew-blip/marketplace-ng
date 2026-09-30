"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertTriangle,
  CheckCircle,
  FileText,
  MessageSquare,
  Package,
  Send,
  ExternalLink,
  Edit3,
  XCircle,
  History,
} from "lucide-react"
import { RequestModificationModal } from "@/components/agreements/request-modification-modal"
import { VerifiedBadge } from "@/components/verified-badge"
import { Badge } from "@/components/ui/badge"

export interface AgreementParty {
  id: string
  name: string
  image?: string
  role: string
  isVerified: boolean
  companyName?: string
}

export interface AgreementProduct {
  id: string
  title: string
  images?: string[]
}

export interface AgreementDetailData {
  id: string
  title: string
  status: "PROPOSED" | "MODIFICATION_REQUESTED" | "ACTIVE" | "COMPLETED" | "DISPUTED" | "RESOLVED" | "DECLINED" | "CANCELLED"
  initiator: AgreementParty
  receiver: AgreementParty
  terms: string
  notes?: string
  startDate?: string
  dueDate?: string
  createdAt: string
  updatedAt: string
  isInitiator: boolean
  product?: AgreementProduct | null
  messageContactId?: string | null
  inquiryId?: string | null
  sourceType?: string | null
  agreementValue?: string | null
  currentVersion?: number
}

export interface AgreementRevisionItem {
  id: string
  version: number
  title: string | null
  changeSummary: string | null
  createdAt: string
  createdBy: string | null
}

export interface ModificationRequestItem {
  id: string
  message: string
  createdAt: string
  requestedBy: string | null
}

interface AgreementDetailProps {
  agreement: AgreementDetailData
  revisions?: AgreementRevisionItem[]
  latestModificationRequest?: ModificationRequestItem | null
  onAccept: () => void
  onReject: () => void
  onComplete: () => void
  onDispute: () => void
  onRequestModification?: (payload: { message: string; sections?: string[]; suggestedRevision?: string }) => void
  onDecline?: () => void
  onWithdraw?: () => void
  onRevise?: () => void
  isLoading: boolean
}

function getStatusVariant(
  status: string
): "secondary" | "default" | "destructive" | "outline" {
  switch (status) {
    case "PROPOSED":
      return "secondary"
    case "MODIFICATION_REQUESTED":
      return "secondary"
    case "ACTIVE":
      return "default"
    case "COMPLETED":
    case "RESOLVED":
      return "outline"
    case "DISPUTED":
      return "destructive"
    case "DECLINED":
    case "CANCELLED":
      return "outline"
    default:
      return "secondary"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "PROPOSED":
      return <FileText className="h-4 w-4" />
    case "MODIFICATION_REQUESTED":
      return <Edit3 className="h-4 w-4" />
    case "ACTIVE":
      return <CheckCircle className="h-4 w-4" />
    case "COMPLETED":
    case "RESOLVED":
      return <CheckCircle className="h-4 w-4" />
    case "DISPUTED":
      return <AlertTriangle className="h-4 w-4" />
    case "DECLINED":
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />
    default:
      return <FileText className="h-4 w-4" />
  }
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
  } catch {
    return iso
  }
}

export function AgreementDetail({
  agreement,
  revisions = [],
  latestModificationRequest,
  onAccept,
  onReject,
  onComplete,
  onDispute,
  onRequestModification,
  onDecline,
  onWithdraw,
  onRevise,
  isLoading,
}: AgreementDetailProps) {
  const router = useRouter()
  const [modificationModalOpen, setModificationModalOpen] = useState(false)
  const isProposed = agreement.status === "PROPOSED"
  const isModificationRequested = agreement.status === "MODIFICATION_REQUESTED"
  const isActive = agreement.status === "ACTIVE"
  const isDisputed = agreement.status === "DISPUTED"

  return (
    <div className="space-y-6">
      {/* Agreement overview card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="text-xl">{agreement.title}</CardTitle>
              <CardDescription>
                Created {formatDate(agreement.createdAt)} · Last updated {formatDate(agreement.updatedAt)}
              </CardDescription>
            </div>
            <Badge variant={getStatusVariant(agreement.status)} className="flex w-fit items-center gap-1.5">
              {getStatusIcon(agreement.status)}
              {agreement.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Counterparties */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Initiator</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agreement.initiator.image} alt={agreement.initiator.name} />
                  <AvatarFallback>{agreement.initiator.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {agreement.initiator.name}
                    <VerifiedBadge verified={agreement.initiator.isVerified} size="sm" />
                  </div>
                  {agreement.initiator.companyName && (
                    <div className="text-sm text-muted-foreground">{agreement.initiator.companyName}</div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Receiver</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={agreement.receiver.image} alt={agreement.receiver.name} />
                  <AvatarFallback>{agreement.receiver.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    {agreement.receiver.name}
                    <VerifiedBadge verified={agreement.receiver.isVerified} size="sm" />
                  </div>
                  {agreement.receiver.companyName && (
                    <div className="text-sm text-muted-foreground">{agreement.receiver.companyName}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dates & value */}
          <div className="flex flex-wrap gap-6 text-sm">
            {agreement.startDate && (
              <div>
                <span className="text-muted-foreground">Start date</span>
                <p className="font-medium">{agreement.startDate}</p>
              </div>
            )}
            {agreement.dueDate && (
              <div>
                <span className="text-muted-foreground">Due date</span>
                <p className="font-medium">{agreement.dueDate}</p>
              </div>
            )}
            {agreement.agreementValue && (
              <div>
                <span className="text-muted-foreground">Agreement value</span>
                <p className="font-medium">{agreement.agreementValue}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {isModificationRequested && latestModificationRequest && (
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Edit3 className="h-5 w-5" />
              Modification requested
            </CardTitle>
            <CardDescription>
              {latestModificationRequest.requestedBy && (
                <span>Requested by {latestModificationRequest.requestedBy}</span>
              )}
              {" · "}
              {formatDate(latestModificationRequest.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{latestModificationRequest.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Main terms sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agreement overview</CardTitle>
          <CardDescription>Summary and key terms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">Full terms and conditions</h3>
            <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-4 text-sm">
              {agreement.terms || "No terms specified."}
            </div>
          </section>
          {agreement.notes && (
            <section>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">Additional notes</h3>
              <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-4 text-sm">
                {agreement.notes}
              </div>
            </section>
          )}
        </CardContent>
      </Card>

      {/* Context links and actions */}
      <div className="flex flex-wrap gap-2">
        {agreement.product && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/marketplace/product/${agreement.product.id}`}>
              <Package className="mr-2 h-4 w-4" />
              View listing
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        )}
        {agreement.messageContactId && (
          <Button variant="outline" size="sm" asChild>
            <Link
              href={
                agreement.product
                  ? `/messages/${agreement.messageContactId}?productId=${agreement.product.id}`
                  : `/messages/${agreement.messageContactId}`
              }
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View conversation
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        )}
        {isDisputed && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/agreements/${agreement.id}/dispute`)}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            View dispute details
          </Button>
        )}
      </div>

      {revisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <History className="h-5 w-5" />
              Revision history
            </CardTitle>
            <CardDescription>Version history of this agreement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {revisions.map((rev) => (
                <li
                  key={rev.id}
                  className="flex flex-wrap items-baseline gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"
                >
                  <span className="font-medium">Version {rev.version}</span>
                  <span className="text-muted-foreground">{formatDate(rev.createdAt)}</span>
                  {rev.createdBy && (
                    <span className="text-muted-foreground">by {rev.createdBy}</span>
                  )}
                  {rev.changeSummary && (
                    <span className="w-full text-muted-foreground">{rev.changeSummary}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Role-aware actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actions</CardTitle>
          <CardDescription>Agreement actions based on your role and current status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {isProposed && !agreement.isInitiator && (
            <>
              <Button onClick={onAccept} disabled={isLoading}>
                {isLoading ? "Processing…" : "Accept agreement"}
              </Button>
              {onRequestModification && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setModificationModalOpen(true)}
                    disabled={isLoading}
                  >
                    <Edit3 className="mr-2 h-4 w-4" />
                    Request modification
                  </Button>
                  <RequestModificationModal
                    open={modificationModalOpen}
                    onOpenChange={setModificationModalOpen}
                    agreementTitle={agreement.title}
                    counterpartyName={agreement.initiator.name}
                    onSubmit={(payload) => onRequestModification?.(payload)}
                    isLoading={isLoading}
                  />
                </>
              )}
              {onDecline && (
                <Button variant="outline" onClick={onDecline} disabled={isLoading}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline agreement
                </Button>
              )}
              <Button variant="ghost" onClick={onReject} disabled={isLoading}>
                Cancel
              </Button>
            </>
          )}

          {isProposed && agreement.isInitiator && (
            <>
              <span className="flex items-center text-sm text-muted-foreground">
                <Send className="mr-2 h-4 w-4" />
                Awaiting response from counterparty
              </span>
              {onWithdraw && (
                <Button variant="outline" onClick={onWithdraw} disabled={isLoading}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Withdraw draft
                </Button>
              )}
            </>
          )}

          {isModificationRequested && agreement.isInitiator && (
            <>
              {onRevise && (
                <Button onClick={onRevise} disabled={isLoading}>
                  <Edit3 className="mr-2 h-4 w-4" />
                  Revise agreement
                </Button>
              )}
              {onWithdraw && (
                <Button variant="outline" onClick={onWithdraw} disabled={isLoading}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Withdraw agreement
                </Button>
              )}
            </>
          )}

          {isActive && (
            <>
              <Button onClick={onComplete} disabled={isLoading}>
                {isLoading ? "Processing…" : "Mark as completed"}
              </Button>
              <Button variant="outline" onClick={onDispute} disabled={isLoading}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Open dispute
              </Button>
            </>
          )}

          {isDisputed && (
            <Button
              variant="outline"
              onClick={() => router.push(`/agreements/${agreement.id}/dispute`)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              View dispute details
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
