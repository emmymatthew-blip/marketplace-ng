"use client"

import Link from "next/link"
import {
  CheckCircle2,
  Clock3,
  FileEdit,
  FileText,
  Handshake,
  MessageSquareMore,
  Package,
  ShieldAlert,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export interface AgreementThreadEvent {
  id: string
  type: "agreement_event"
  agreementId: string
  agreementTitle?: string | null
  agreementStatus: string
  status: string
  eventType?: string | null
  createdAt: string
  actorId?: string | null
  actorName?: string | null
  initiatorId: string
  receiverId: string
  sourceType?: string | null
  productId?: string | null
  inquiryId?: string | null
  product?: { id: string; title: string; images: string[] } | null
}

interface AgreementThreadCardProps {
  event: AgreementThreadEvent
  currentUserId: string
  loadingAgreementId?: string | null
  /** When false, only show View Agreement (informational). When true, show role/state actions. */
  isLatestForAgreement?: boolean
  onAccept?: (agreementId: string) => void
  onRequestModification?: (agreementId: string) => void
  onDecline?: (agreementId: string) => void
  onWithdraw?: (agreementId: string) => void
}

function getEventTitle(event: AgreementThreadEvent) {
  switch (event.eventType) {
    case "DRAFT_CREATED":
      return "Agreement Draft Created"
    case "MODIFICATION_REQUESTED":
      return "Modification Requested"
    case "REVISED_AGREEMENT_SENT":
      return "Agreement Update"
    case "AGREEMENT_ACTIVATED":
      return "Agreement Activated"
    case "AGREEMENT_COMPLETED":
      return "Agreement Completed"
    case "AGREEMENT_DECLINED":
      return "Agreement Declined"
    case "AGREEMENT_WITHDRAWN":
      return "Agreement Withdrawn"
    case "DISPUTE_OPENED":
      return "Dispute Raised"
    case "DISPUTE_RESPONSE_SUBMITTED":
      return "Dispute Response Submitted"
    case "DISPUTE_RESOLVED":
      return "Dispute Resolved"
    case "DISPUTE_ESCALATED":
      return "Dispute Escalated"
    default:
      if (event.agreementStatus === "ACTIVE") return "Active Agreement"
      if (event.agreementStatus === "COMPLETED") return "Agreement Completed"
      if (event.agreementStatus === "DISPUTED") return "Dispute Opened"
      if (event.agreementStatus === "DECLINED") return "Agreement Declined"
      if (event.agreementStatus === "CANCELLED") return "Agreement Withdrawn"
      return "Agreement Update"
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PROPOSED":
      return "Pending Review"
    case "MODIFICATION_REQUESTED":
      return "Modification Requested"
    case "ACTIVE":
      return "Active"
    case "COMPLETED":
      return "Completed"
    case "DISPUTED":
      return "Disputed"
    case "RESOLVED":
      return "Resolved"
    case "DECLINED":
      return "Declined"
    case "CANCELLED":
      return "Withdrawn"
    default:
      return status
  }
}

function getIcon(event: AgreementThreadEvent) {
  switch (event.eventType) {
    case "AGREEMENT_COMPLETED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    case "AGREEMENT_ACTIVATED":
      return <Handshake className="h-4 w-4 text-emerald-600" />
    case "MODIFICATION_REQUESTED":
      return <MessageSquareMore className="h-4 w-4 text-amber-600" />
    case "REVISED_AGREEMENT_SENT":
      return <FileEdit className="h-4 w-4 text-blue-600" />
    case "AGREEMENT_DECLINED":
      return <XCircle className="h-4 w-4 text-muted-foreground" />
    case "AGREEMENT_WITHDRAWN":
      return <XCircle className="h-4 w-4 text-muted-foreground" />
    case "DISPUTE_OPENED":
      return <ShieldAlert className="h-4 w-4 text-rose-600" />
    case "DISPUTE_RESPONSE_SUBMITTED":
      return <MessageSquareMore className="h-4 w-4 text-blue-600" />
    case "DISPUTE_RESOLVED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    case "DISPUTE_ESCALATED":
      return <ShieldAlert className="h-4 w-4 text-rose-600" />
    default:
      return <FileText className="h-4 w-4 text-primary" />
  }
}

/**
 * Returns which actions to show for this event based on:
 * - isLatestForAgreement: only the latest event per agreement gets decision buttons
 * - agreementStatus: current agreement state
 * - isInitiator / isRecipient: viewer role
 */
function getActions(config: {
  event: AgreementThreadEvent
  isLatestForAgreement: boolean
  isInitiator: boolean
  isRecipient: boolean
  isLoading: boolean
}) {
  const { event, isLatestForAgreement, isInitiator, isRecipient, isLoading } = config
  const status = event.agreementStatus

  const viewAgreement = true

  if (!isLatestForAgreement) {
    return { viewAgreement, accept: false, requestModification: false, decline: false, withdraw: false, revise: false, awaitingResponse: false, awaitingRevision: false, markCompleted: false, openDispute: false }
  }

  switch (status) {
    case "PROPOSED":
      return {
        viewAgreement: true,
        accept: isRecipient,
        requestModification: isRecipient,
        decline: isRecipient,
        withdraw: isInitiator,
        revise: false,
        awaitingResponse: isInitiator,
        awaitingRevision: false,
        markCompleted: false,
        openDispute: false,
      }
    case "MODIFICATION_REQUESTED":
      return {
        viewAgreement: true,
        accept: false,
        requestModification: false,
        decline: false,
        withdraw: false,
        revise: isInitiator,
        awaitingResponse: false,
        awaitingRevision: isRecipient,
        markCompleted: false,
        openDispute: false,
      }
    case "ACTIVE":
      return {
        viewAgreement: true,
        accept: false,
        requestModification: false,
        decline: false,
        withdraw: false,
        revise: false,
        awaitingResponse: false,
        awaitingRevision: false,
        markCompleted: true,
        openDispute: true,
      }
    case "COMPLETED":
    case "DECLINED":
    case "CANCELLED":
    case "DISPUTED":
    case "RESOLVED":
    default:
      return {
        viewAgreement: true,
        accept: false,
        requestModification: false,
        decline: false,
        withdraw: false,
        revise: false,
        awaitingResponse: false,
        awaitingRevision: false,
        markCompleted: false,
        openDispute: false,
      }
  }
}

export function AgreementThreadCard({
  event,
  currentUserId,
  loadingAgreementId,
  isLatestForAgreement = true,
  onAccept,
  onRequestModification,
  onDecline,
  onWithdraw,
}: AgreementThreadCardProps) {
  const isInitiator = event.initiatorId === currentUserId
  const isRecipient = event.receiverId === currentUserId
  const isLoading = loadingAgreementId === event.agreementId

  const actions = getActions({
    event,
    isLatestForAgreement,
    isInitiator,
    isRecipient,
    isLoading,
  })

  const isActionable = isLatestForAgreement && (
    actions.accept ||
    actions.requestModification ||
    actions.decline ||
    actions.withdraw ||
    actions.revise
  )

  const isDisputed =
    event.eventType === "DISPUTE_OPENED" || event.agreementStatus === "DISPUTED"

  const isHistorical = !isLatestForAgreement

  const cardClassName = isHistorical
    ? "border border-dashed border-border bg-muted/30 opacity-75 shadow-none"
    : isDisputed
      ? "border border-destructive/40 bg-destructive/10 shadow-sm"
      : isActionable
        ? "border-2 border-primary/40 bg-primary/5 shadow-md"
        : "border border-border bg-card shadow-sm"

  const contentMuted = isHistorical ? " text-muted-foreground" : ""

  return (
    <Card className={cardClassName}>
      {isActionable && (
        <div className="border-b border-primary/20 bg-primary/10 px-4 py-2">
          <p className="text-xs font-semibold text-primary">Awaiting Your Decision</p>
        </div>
      )}
      <CardContent className={`space-y-4 p-4${contentMuted}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getIcon(event)}
              <p className={`font-medium${isHistorical ? " text-muted-foreground" : " text-foreground"}`}>
                {getEventTitle(event)}
              </p>
              {isHistorical && (
                <span className="text-xs font-normal text-muted-foreground">(past event)</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Created by {event.actorName || "A user"}</span>
              {event.sourceType ? (
                <span className="capitalize">From {event.sourceType.replace(/_/g, " ")}</span>
              ) : null}
              {event.inquiryId ? <span>Linked inquiry</span> : null}
            </div>
          </div>
          <Badge
            variant="outline"
            className={
              isHistorical
                ? "border-border bg-muted/50 text-muted-foreground"
                : isDisputed
                  ? "border-destructive/50 bg-destructive/20 text-destructive"
                  : "bg-background"
            }
          >
            {getStatusLabel(event.agreementStatus)}
          </Badge>
        </div>

        {event.agreementTitle ? (
          <div className={`rounded-lg border border-border px-3 py-2 text-sm font-medium${isHistorical ? " bg-muted/30 text-muted-foreground" : " bg-background text-foreground"}`}>
            {event.agreementTitle}
          </div>
        ) : null}

        {event.product ? (
          <Link
            href={`/marketplace/product/${event.product.id}`}
            className={`flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-muted/50${isHistorical ? " bg-muted/30 text-muted-foreground" : " bg-background text-foreground"}`}
          >
            <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">Related listing: {event.product.title}</span>
          </Link>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          {actions.viewAgreement && (
            <Button size="sm" variant={isHistorical ? "ghost" : "default"} asChild className={isHistorical ? "text-muted-foreground" : ""}>
              <Link href={`/agreements/${event.agreementId}`}>View Agreement</Link>
            </Button>
          )}

          {actions.accept && (
            <Button
              size="sm"
              variant="default"
              disabled={isLoading}
              onClick={() => onAccept?.(event.agreementId)}
            >
              {isLoading ? "Processing..." : "Accept"}
            </Button>
          )}
          {actions.requestModification && (
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => onRequestModification?.(event.agreementId)}
            >
              {isLoading ? "Updating..." : "Request Modification"}
            </Button>
          )}
          {actions.decline && (
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => onDecline?.(event.agreementId)}
            >
              {isLoading ? "Processing..." : "Decline"}
            </Button>
          )}
          {actions.withdraw && (
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => onWithdraw?.(event.agreementId)}
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </Button>
          )}
          {actions.revise && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/agreements/${event.agreementId}/revise`}>Revise Agreement</Link>
            </Button>
          )}
          {actions.awaitingResponse && (
            <div className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              Awaiting Response
            </div>
          )}
          {actions.awaitingRevision && (
            <div className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
              <Clock3 className="h-3.5 w-3.5" />
              Awaiting Revision
            </div>
          )}
          {actions.markCompleted && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/agreements/${event.agreementId}`}>Mark Completed</Link>
            </Button>
          )}
          {actions.openDispute && (
            <Button size="sm" variant="outline" asChild>
              <Link href={`/agreements/${event.agreementId}/dispute`}>Open Dispute</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
