"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const COUNTRIES = [
  "Nigeria", "Ghana", "United States", "United Kingdom", "Canada", "Germany",
  "France", "China", "India", "South Africa", "Kenya", "Egypt", "Brazil",
  "Australia", "Other",
]

const CURRENCIES = [
  { value: "NGN", label: "NGN (₦)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD" },
  { value: "GHS", label: "GHS" },
  { value: "ZAR", label: "ZAR" },
  { value: "CNY", label: "CNY (¥)" },
  { value: "INR", label: "INR (₹)" },
  { value: "Other", label: "Other" },
]

interface InquiryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  productTitle?: string
  vendorId: string
}

export function InquiryFormDialog({
  open,
  onOpenChange,
  productId,
  productTitle,
  vendorId,
}: InquiryFormDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [country, setCountry] = useState("")
  const [quantity, setQuantity] = useState("")
  const [budget, setBudget] = useState("")
  const [budgetCurrency, setBudgetCurrency] = useState("USD")
  const [timelineDate, setTimelineDate] = useState<Date | undefined>(undefined)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast({ title: "Message required", description: "Please enter your message.", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          message: message.trim(),
          companyName: companyName.trim() || undefined,
          country: country || undefined,
          quantity: quantity.trim() || undefined,
          budget: budget.trim()
            ? `${budget.trim()} ${budgetCurrency}`
            : undefined,
          timeline: timelineDate ? format(timelineDate, "PPP") : undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast({ title: "Error", description: data?.error ?? "Failed to send inquiry", variant: "destructive" })
        setLoading(false)
        return
      }
      toast({ title: "Inquiry sent", description: "The vendor will respond via messages." })
      onOpenChange(false)
      setMessage("")
      setCompanyName("")
      setCountry("")
      setQuantity("")
      setBudget("")
      setBudgetCurrency("USD")
      setTimelineDate(undefined)
      router.push(`/messages/${vendorId}?productId=${productId}`)
    } catch {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send inquiry</DialogTitle>
          <DialogDescription>
            {productTitle ? `Request a quote for "${productTitle}"` : "Send a message to the vendor. An inquiry and message thread will be created."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inquiry-message">Message *</Label>
            <Textarea
              id="inquiry-message"
              placeholder="Introduce your company and what you need..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-company">Company name</Label>
            <Input
              id="inquiry-company"
              placeholder="Your company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-country">Country</Label>
            <select
              id="inquiry-country"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-quantity">Quantity (optional)</Label>
            <Input
              id="inquiry-quantity"
              placeholder="e.g. 2 units"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inquiry-budget">Budget (optional)</Label>
            <div className="flex gap-2">
              <Input
                id="inquiry-budget"
                placeholder="e.g. 10,000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="flex-1 min-w-0"
              />
              <select
                id="inquiry-budget-currency"
                aria-label="Budget currency"
                className="flex h-10 w-[100px] shrink-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={budgetCurrency}
                onChange={(e) => setBudgetCurrency(e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Timeline (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="inquiry-timeline"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !timelineDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                  {timelineDate ? format(timelineDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={timelineDate}
                  onSelect={setTimelineDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send inquiry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
