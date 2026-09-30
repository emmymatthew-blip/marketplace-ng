"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit3 } from "lucide-react"

const SECTION_OPTIONS = [
  { id: "payment_terms", label: "Payment Terms" },
  { id: "delivery_timeline", label: "Delivery Timeline" },
  { id: "scope_of_work", label: "Scope of Work" },
  { id: "pricing", label: "Pricing" },
  { id: "other", label: "Other" },
] as const

export interface RequestModificationPayload {
  message: string
  sections?: string[]
  suggestedRevision?: string
}

interface RequestModificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agreementTitle: string
  counterpartyName: string
  onSubmit: (payload: RequestModificationPayload) => void
  isLoading?: boolean
}

export function RequestModificationModal({
  open,
  onOpenChange,
  agreementTitle,
  counterpartyName,
  onSubmit,
  isLoading = false,
}: RequestModificationModalProps) {
  const [details, setDetails] = useState("")
  const [sections, setSections] = useState<Record<string, boolean>>({
    payment_terms: false,
    delivery_timeline: false,
    scope_of_work: false,
    pricing: false,
    other: false,
  })
  const [suggestedRevision, setSuggestedRevision] = useState("")

  const handleSectionChange = (id: string, checked: boolean) => {
    setSections((prev) => ({ ...prev, [id]: checked }))
  }

  const buildMessage = (): string => {
    const selected = SECTION_OPTIONS.filter((s) => sections[s.id]).map((s) => s.label)
    const parts: string[] = []
    if (selected.length > 0) {
      parts.push(`Sections needing modification: ${selected.join(", ")}.`)
    }
    if (details.trim()) {
      parts.push(details.trim())
    }
    if (suggestedRevision.trim()) {
      parts.push(`Suggested revision: ${suggestedRevision.trim()}`)
    }
    return parts.length > 0 ? parts.join("\n\n") : "Modification requested."
  }

  const handleSubmit = () => {
    const selectedSections = SECTION_OPTIONS.filter((s) => sections[s.id]).map((s) => s.id)
    onSubmit({
      message: buildMessage(),
      sections: selectedSections.length > 0 ? selectedSections : undefined,
      suggestedRevision: suggestedRevision.trim() || undefined,
    })
    setDetails("")
    setSections({
      payment_terms: false,
      delivery_timeline: false,
      scope_of_work: false,
      pricing: false,
      other: false,
    })
    setSuggestedRevision("")
    onOpenChange(false)
  }

  const isValid = details.trim().length >= 20

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-1 border-b border-border">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit3 className="h-5 w-5 text-primary" aria-hidden />
            Request modification
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Agreement:</span> {agreementTitle}
              </p>
              <p>
                <span className="font-medium text-foreground">Counterparty:</span> {counterpartyName}
              </p>
              <p className="pt-1">
                Provide a clear explanation of the changes you need. The creator will be notified and can revise the agreement.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className="flex flex-col"
        >
          <div className="px-6 py-5 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="modification-details" className="text-sm font-medium">
                Explanation of requested changes <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="modification-details"
                placeholder="Describe in detail what should be changed and why. For example: payment schedule, delivery dates, scope of work, or specific terms that need clarification."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="min-h-[150px] resize-y text-sm"
                required
                minLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters. Be specific so the other party can address your concerns.
              </p>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Sections needing modification (optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SECTION_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={sections[opt.id] ?? false}
                      onCheckedChange={(checked) =>
                        handleSectionChange(opt.id, checked === true)
                      }
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="suggested-revision" className="text-sm font-medium">
                Suggested revision (optional)
              </Label>
              <Textarea
                id="suggested-revision"
                placeholder="If you have specific wording or terms you’d like to propose, add them here."
                value={suggestedRevision}
                onChange={(e) => setSuggestedRevision(e.target.value)}
                className="min-h-[100px] resize-y text-sm"
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !isValid}>
              {isLoading ? "Sending…" : "Submit modification request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
