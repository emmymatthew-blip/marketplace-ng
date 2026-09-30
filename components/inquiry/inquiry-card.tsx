"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageSquare, FileText, CheckCircle, StickyNote, MoreVertical, Building2, MapPin, Clock3, ArrowRightCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface InquiryCardData {
  id: string
  status: string
  initialMessage: string
  companyName?: string | null
  country?: string | null
  createdAt: string
  product?: { id: string; title: string } | null
  buyer?: { id: string; name: string; companyName?: string | null } | null
  vendor?: { id: string; name: string } | null
  notes?: string | null
  agreementId?: string | null
}

interface InquiryCardProps {
  inquiry: InquiryCardData
  onStatusChange?: (id: string, status: string) => void
  onNotesChange?: (id: string, notes: string) => void
  refetch?: () => void
  variant?: "pipeline" | "list"
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  NEGOTIATING: "Negotiating",
  AGREEMENT_CREATED: "Agreement",
  CLOSED: "Closed",
  LOST: "Lost",
}

function getLatestActivityLabel(inquiry: InquiryCardData) {
  if (inquiry.agreementId || inquiry.status === "AGREEMENT_CREATED") return "Moved into agreement stage"
  if (inquiry.status === "NEGOTIATING") return "Negotiation in progress"
  if (inquiry.status === "CONTACTED") return "Conversation opened"
  if (inquiry.status === "CLOSED") return "Inquiry closed"
  if (inquiry.status === "LOST") return "Opportunity marked lost"
  return "Awaiting first response"
}

export function InquiryCard({
  inquiry,
  onStatusChange,
  onNotesChange,
  refetch,
  variant = "pipeline",
}: InquiryCardProps) {
  const { toast } = useToast()
  const [notesOpen, setNotesOpen] = useState(false)
  const [notesValue, setNotesValue] = useState(inquiry.notes ?? "")
  const [updating, setUpdating] = useState(false)

  const vendorId = inquiry.vendor?.id
  const buyerId = inquiry.buyer?.id
  const productId = inquiry.product?.id
  const messagePreview = inquiry.initialMessage?.slice(0, 80) + (inquiry.initialMessage?.length > 80 ? "…" : "")
  const dateStr = inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "—"
  const senderName = inquiry.buyer?.companyName || inquiry.companyName || inquiry.buyer?.name || "Unknown company"
  const latestActivity = getLatestActivityLabel(inquiry)
  const showMoveToNegotiating =
    inquiry.status !== "NEGOTIATING" && inquiry.status !== "CLOSED" && inquiry.status !== "LOST" && inquiry.status !== "AGREEMENT_CREATED"

  const handleUpdateStatus = async (status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error("Failed to update")
      onStatusChange?.(inquiry.id, status)
      refetch?.()
      toast({ title: "Status updated" })
    } catch {
      toast({ title: "Error", description: "Could not update status", variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  const handleSaveNotes = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesValue || null }),
      })
      if (!res.ok) throw new Error("Failed to update")
      onNotesChange?.(inquiry.id, notesValue)
      refetch?.()
      setNotesOpen(false)
      toast({ title: "Notes saved" })
    } catch {
      toast({ title: "Error", description: "Could not save notes", variant: "destructive" })
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <Card className="flex flex-col rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {variant === "list" ? "Lead overview" : "Incoming opportunity"}
              </p>
              <Link href={`/marketplace/product/${productId}`} className="mt-1 font-medium text-sm hover:underline truncate block">
                {inquiry.product?.title ?? "Listing"}
              </Link>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {senderName}
                </span>
                {inquiry.country && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {inquiry.country}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {dateStr}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {STATUS_LABELS[inquiry.status] ?? inquiry.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 py-2">
          <p className="text-sm text-muted-foreground line-clamp-2">{messagePreview}</p>
          <div className="mt-3 rounded-lg border border-border bg-muted/20 px-3 py-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Latest activity</p>
            <p className="mt-1 text-sm text-foreground">{latestActivity}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-1.5 pt-3 border-t">
          {buyerId && vendorId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/messages/${buyerId}?productId=${productId}`}>
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Open conversation
              </Link>
            </Button>
          )}
          {showMoveToNegotiating && (
            <Button
              variant="outline"
              size="sm"
              disabled={updating}
              onClick={() => handleUpdateStatus("NEGOTIATING")}
            >
              <ArrowRightCircle className="h-3.5 w-3.5 mr-1" />
              Move to Negotiating
            </Button>
          )}
          {!inquiry.agreementId && buyerId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/agreements/new?recipient=${buyerId}&product=${productId}&inquiryId=${inquiry.id}`}>
                <FileText className="h-3.5 w-3.5 mr-1" />
                Create Agreement
              </Link>
            </Button>
          )}
          {inquiry.agreementId && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/agreements/${inquiry.agreementId}`}>
                <FileText className="h-3.5 w-3.5 mr-1" />
                View Agreement
              </Link>
            </Button>
          )}
          {(inquiry.status === "NEW" || inquiry.status === "CONTACTED" || inquiry.status === "NEGOTIATING") && (
            <Button
              variant="outline"
              size="sm"
              disabled={updating}
              onClick={() => handleUpdateStatus("CLOSED")}
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              Mark Closed
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => setNotesOpen(true)}>
            <StickyNote className="h-3.5 w-3.5 mr-1" />
            Notes
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {inquiry.status !== "CONTACTED" && (
                <DropdownMenuItem onClick={() => handleUpdateStatus("CONTACTED")} disabled={updating}>
                  Mark Contacted
                </DropdownMenuItem>
              )}
              {inquiry.status !== "NEGOTIATING" && (
                <DropdownMenuItem onClick={() => handleUpdateStatus("NEGOTIATING")} disabled={updating}>
                  Mark Negotiating
                </DropdownMenuItem>
              )}
              {inquiry.status !== "LOST" && (
                <DropdownMenuItem onClick={() => handleUpdateStatus("LOST")} disabled={updating}>
                  Mark Lost
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add notes</DialogTitle>
            <DialogDescription>Internal notes for this inquiry (not visible to the buyer).</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={4}
              placeholder="Add notes..."
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNotesOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNotes} disabled={updating}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
