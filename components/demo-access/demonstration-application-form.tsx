"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { DemoApplicationPayload } from "@/lib/demo-application-payload"
import { demoApplicationPayloadSchema } from "@/lib/demo-application-payload"
import {
  validateStep1,
  validateStep2,
  validateStep3,
  validateStep4,
  validateStep5,
} from "@/lib/demo-application-wizard-validation"
import { DEMO_APPLICATION_WIZARD_STEPS } from "@/lib/demo-application-wizard-meta"

const DEMO_CATEGORIES = [
  "Finishing",
  "Software",
  "Press Equipment",
  "Consumables",
  "UV",
  "Textile",
  "Wide format",
  "Packaging",
  "Other",
]

const DRAFT_KEY = "demo-access-application-wizard-v1"

const STEP_TITLES = DEMO_APPLICATION_WIZARD_STEPS.map((s) => s.title)

type ListingOption = { id: string; title: string }

type Props = {
  onSubmit: (data: {
    title: string
    description: string
    applicationPayload: DemoApplicationPayload
    preferredDate: string | null
    preferredDateId: string | null
  }) => Promise<void>
  isSubmitting: boolean
  disabled: boolean
  availableDates: { id: string; date: string; time?: string | null }[]
  loadingDates: boolean
  myRequestedPreferredDates: Set<string>
  activeRequestCount: number
  profileDefaults?: {
    companyName?: string | null
    contactPerson?: string | null
    corporateEmail?: string | null
    isVerified?: boolean
  }
  /** Current user id — loads marketplace listings for step 2 dropdown */
  sellerId?: string | null
}

function buildInitialPayload(): Partial<DemoApplicationPayload> {
  return {
    summary: "",
    category: "",
    format: "LIVE",
    preferredWeekNote: "",
    alternativeWeekNote: "",
    schedulingFlexibility: "flexible_next",
    relatedListingId: "",
    productCategory: "",
    productOrServiceDescription: "",
    tiedToExistingListing: false,
    attendeesWillLearn: "",
    targetAudience: "",
    keyBenefits: "",
    approvalReason: "",
    coverImageUrl: "",
    previewImageUrls: [],
    previewVideoUrl: "",
    hostingPlatform: "zoom",
    hostingPlatformOther: "",
    estimatedDurationMinutes: 60,
    maxAttendees: 50,
    registrationRequired: true,
    approvalRequiredToJoin: false,
    companyName: "",
    contactPerson: "",
    contactRole: "",
    corporateEmail: "",
    companyWebsite: "",
    confirmAvailability: false,
    confirmOriginalContent: false,
    confirmApprovalRequired: false,
  }
}

export function DemonstrationApplicationForm({
  onSubmit,
  isSubmitting,
  disabled,
  availableDates,
  loadingDates,
  myRequestedPreferredDates,
  activeRequestCount,
  profileDefaults,
  sellerId,
}: Props) {
  const [step, setStep] = useState(1)
  const [title, setTitle] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [p, setP] = useState<Partial<DemoApplicationPayload>>(buildInitialPayload)
  /** Step 2 split fields — combined into productOrServiceDescription on submit */
  const [productServiceText, setProductServiceText] = useState("")
  const [whatWillBeDemonstrated, setWhatWillBeDemonstrated] = useState("")
  const [previewImagesRaw, setPreviewImagesRaw] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [listings, setListings] = useState<ListingOption[]>([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [draftLoaded, setDraftLoaded] = useState(false)

  const update = <K extends keyof DemoApplicationPayload>(key: K, value: DemoApplicationPayload[K]) => {
    setP((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (!profileDefaults) return
    setP((prev) => ({
      ...prev,
      companyName: prev.companyName?.trim() || profileDefaults.companyName || "",
      contactPerson: prev.contactPerson?.trim() || profileDefaults.contactPerson || "",
      corporateEmail: prev.corporateEmail?.trim() || profileDefaults.corporateEmail || "",
    }))
  }, [profileDefaults])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) {
        setDraftLoaded(true)
        return
      }
      const d = JSON.parse(raw) as Record<string, unknown>
      if (typeof d.step === "number") setStep(Math.min(5, Math.max(1, d.step)))
      if (typeof d.title === "string") setTitle(d.title)
      if (typeof d.fullDescription === "string") setFullDescription(d.fullDescription)
      if (typeof d.productServiceText === "string") setProductServiceText(d.productServiceText)
      if (typeof d.whatWillBeDemonstrated === "string") setWhatWillBeDemonstrated(d.whatWillBeDemonstrated)
      if (typeof d.previewImagesRaw === "string") setPreviewImagesRaw(d.previewImagesRaw)
      if (d.payload && typeof d.payload === "object") setP({ ...buildInitialPayload(), ...(d.payload as object) })
      if (d.selectedDateIso && typeof d.selectedDateIso === "string") {
        const dt = new Date(d.selectedDateIso)
        if (!Number.isNaN(dt.getTime())) setSelectedDate(dt)
      }
      if (typeof d.selectedDateId === "string" || d.selectedDateId === null) setSelectedDateId(d.selectedDateId as string | null)
    } catch {
      /* ignore */
    }
    setDraftLoaded(true)
  }, [])

  useEffect(() => {
    if (!draftLoaded) return
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            step,
            title,
            fullDescription,
            productServiceText,
            whatWillBeDemonstrated,
            previewImagesRaw,
            payload: p,
            selectedDateIso: selectedDate?.toISOString(),
            selectedDateId,
          })
        )
      } catch {
        /* ignore */
      }
    }, 500)
    return () => clearTimeout(t)
  }, [
    draftLoaded,
    step,
    title,
    fullDescription,
    productServiceText,
    whatWillBeDemonstrated,
    previewImagesRaw,
    p,
    selectedDate,
    selectedDateId,
  ])

  useEffect(() => {
    if (step !== 2 || !sellerId) return
    let cancelled = false
    ;(async () => {
      try {
        setLoadingListings(true)
        const res = await fetch(`/api/products?ownerId=${encodeURIComponent(sellerId)}&limit=100`)
        const data = await res.json()
        const rows = (data?.data || data?.products || []) as { id: string; title: string }[]
        if (cancelled || !Array.isArray(rows)) return
        const opts: ListingOption[] = rows.map((x) => ({
          id: x.id,
          title: x.title,
        }))
        setListings(opts)
      } catch {
        setListings([])
      } finally {
        if (!cancelled) setLoadingListings(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [step, sellerId])

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const validateCurrentStep = useCallback((): boolean => {
    setFieldErrors({})
    let errors: Record<string, string> = {}
    if (step === 1) {
      errors = validateStep1({
        title,
        summary: p.summary || "",
        fullDescription,
        category: p.category || "",
      })
    } else if (step === 2) {
      errors = validateStep2({
        productCategory: p.productCategory || "",
        productOrServiceDescription: productServiceText,
        whatWillBeDemonstrated,
      })
    } else if (step === 3) {
      errors = validateStep3({ preferredWeekNote: p.preferredWeekNote || "" })
    } else if (step === 4) {
      errors = validateStep4({
        attendeesWillLearn: p.attendeesWillLearn || "",
        targetAudience: p.targetAudience || "",
        keyBenefits: p.keyBenefits || "",
        approvalReason: p.approvalReason || "",
      })
    } else if (step === 5) {
      errors = validateStep5({ p, coverImageUrl: p.coverImageUrl, previewVideoUrl: p.previewVideoUrl })
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return false
    }
    return true
  }, [step, title, fullDescription, p, productServiceText, whatWillBeDemonstrated])

  const handleNext = () => {
    if (!validateCurrentStep()) return
    setStep((s) => Math.min(5, s + 1))
  }

  const handleBack = () => {
    setFieldErrors({})
    setStep((s) => Math.max(1, s - 1))
  }

  const buildFinalPayload = (): DemoApplicationPayload | null => {
    const previewImageUrls = previewImagesRaw
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6)

    const combinedProduct = `${productServiceText.trim()}\n\nWhat will be demonstrated:\n${whatWillBeDemonstrated.trim()}`

    const payload: DemoApplicationPayload = {
      ...buildInitialPayload(),
      ...p,
      summary: p.summary || "",
      category: p.category || "",
      format: "LIVE",
      preferredWeekNote: p.preferredWeekNote || "",
      schedulingFlexibility: (p.schedulingFlexibility as "fixed_week" | "flexible_next") || "flexible_next",
      productCategory: p.productCategory || "",
      productOrServiceDescription: combinedProduct,
      tiedToExistingListing: Boolean((p.relatedListingId || "").trim()),
      attendeesWillLearn: p.attendeesWillLearn || "",
      targetAudience: p.targetAudience || "",
      keyBenefits: p.keyBenefits || "",
      approvalReason: p.approvalReason || "",
      previewImageUrls,
      relatedListingId: (p.relatedListingId || "").trim() || undefined,
      alternativeWeekNote: (p.alternativeWeekNote || "").trim() || undefined,
      coverImageUrl: (p.coverImageUrl || "").trim() || undefined,
      previewVideoUrl: (p.previewVideoUrl || "").trim() || undefined,
      companyWebsite: (p.companyWebsite || "").trim() || undefined,
      hostingPlatformOther:
        p.hostingPlatform === "other" ? (p.hostingPlatformOther || "").trim() : undefined,
    } as DemoApplicationPayload

    const result = demoApplicationPayloadSchema.safeParse(payload)
    if (!result.success) {
      const err: Record<string, string> = {}
      result.error.flatten().fieldErrors &&
        Object.entries(result.error.flatten().fieldErrors).forEach(([k, v]) => {
          if (v?.[0]) err[k] = v[0]
        })
      setFieldErrors(err)
      return null
    }
    return result.data
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCurrentStep()) return
    const final = buildFinalPayload()
    if (!final) return

    try {
      await onSubmit({
        title: title.trim(),
        description: fullDescription.trim(),
        applicationPayload: final,
        preferredDate: selectedDate ? selectedDate.toISOString().split("T")[0] : null,
        preferredDateId: selectedDateId,
      })
      clearDraft()
    } catch {
      /* parent shows toast; keep draft */
    }
  }

  const slotPicker = (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-semibold">Optional: admin-published slot</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Reserve a platform slot if available. Otherwise rely on your preferred week below.
        </p>
      </div>
      {loadingDates ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : availableDates.length > 0 ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : "Pick an available slot"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                if (!date) {
                  setSelectedDateId(null)
                  return
                }
                const dateStr = format(date, "yyyy-MM-dd")
                const match = availableDates.find((d) => format(new Date(d.date), "yyyy-MM-dd") === dateStr)
                setSelectedDateId(match?.id || null)
              }}
              disabled={(date) => {
                const dateStr = format(date, "yyyy-MM-dd")
                if (myRequestedPreferredDates.has(dateStr)) return true
                return !availableDates.some((d) => format(new Date(d.date), "yyyy-MM-dd") === dateStr)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      ) : (
        <p className="text-sm text-muted-foreground border rounded-lg p-4 bg-muted/30">
          No admin slots published yet — continue with your preferred week.
        </p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleFinalSubmit} className="space-y-8">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/[0.03] to-background shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-5 w-5" />
            <CardTitle className="text-lg">Curated weekly demonstration application</CardTitle>
          </div>
          <CardDescription className="text-sm leading-relaxed">
            One featured spotlight per week; other approved sessions join the upcoming pipeline. This wizard collects a
            review-ready application — final publishing happens after approval.
          </CardDescription>
        </CardHeader>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Guided steps</AlertTitle>
        <AlertDescription>
          Complete each step in order. Your progress is saved automatically in this browser as a draft.
        </AlertDescription>
      </Alert>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted-foreground">
            Step <span className="text-foreground font-semibold">{step}</span> of 5 — {STEP_TITLES[step - 1]}
          </p>
          <Button type="button" variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={clearDraft}>
            Clear draft
          </Button>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={cn(
                "h-2 flex-1 rounded-full transition-colors duration-300",
                n <= step ? "bg-primary" : "bg-muted",
                n === step && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
              )}
            />
          ))}
        </div>
      </div>

      <Card className="overflow-hidden border-border/80 shadow-md">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-xl">{STEP_TITLES[step - 1]}</CardTitle>
          <CardDescription>
            {DEMO_APPLICATION_WIZARD_STEPS[step - 1]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="w-title">Demonstration title</Label>
                    <Input
                      id="w-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. UV hybrid workflow for packaging proofs"
                    />
                    {fieldErrors.title && <p className="text-sm text-destructive">{fieldErrors.title}</p>}
                  </div>
                  <div className="space-y-2 max-w-md">
                    <Label>Category</Label>
                    <Select value={p.category || ""} onValueChange={(v) => update("category", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEMO_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.category && <p className="text-sm text-destructive">{fieldErrors.category}</p>}
                    <p className="text-xs text-muted-foreground">
                      Demonstrations in this programme are <span className="font-medium text-foreground">live</span> sessions
                      only.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="w-sum">Short summary</Label>
                    <Textarea
                      id="w-sum"
                      value={p.summary || ""}
                      onChange={(e) => update("summary", e.target.value)}
                      placeholder="2–4 sentences for reviewers and programme previews."
                      className="min-h-[88px]"
                    />
                    {fieldErrors.summary && <p className="text-sm text-destructive">{fieldErrors.summary}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="w-full">Full description</Label>
                    <Textarea
                      id="w-full"
                      value={fullDescription}
                      onChange={(e) => setFullDescription(e.target.value)}
                      placeholder="Agenda, scope, equipment, credibility — minimum 50 characters for the review record."
                      className="min-h-[140px]"
                    />
                    {fieldErrors.fullDescription && (
                      <p className="text-sm text-destructive">{fieldErrors.fullDescription}</p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Related marketplace listing</Label>
                    {sellerId ? (
                      loadingListings ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading your listings…
                        </div>
                      ) : (
                        <Select
                          value={(p.relatedListingId || "none") as string}
                          onValueChange={(v) => {
                            if (v === "none") {
                              update("relatedListingId", "")
                              update("tiedToExistingListing", false)
                            } else {
                              update("relatedListingId", v)
                              update("tiedToExistingListing", true)
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a listing (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None / not tied to a listing</SelectItem>
                            {listings.map((l) => (
                              <SelectItem key={l.id} value={l.id}>
                                {l.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )
                    ) : (
                      <Input
                        value={p.relatedListingId || ""}
                        onChange={(e) => {
                          update("relatedListingId", e.target.value)
                          update("tiedToExistingListing", e.target.value.trim().length > 0)
                        }}
                        placeholder="Product / listing ID if you have one"
                      />
                    )}
                    <p className="text-xs text-muted-foreground">
                      Tie this application to a listing so reviewers see commercial context.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Product category</Label>
                    <Select value={p.productCategory || ""} onValueChange={(v) => update("productCategory", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category of what you’re demonstrating" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEMO_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.productCategory && (
                      <p className="text-sm text-destructive">{fieldErrors.productCategory}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="w-ps">Product / service description</Label>
                    <Textarea
                      id="w-ps"
                      value={productServiceText}
                      onChange={(e) => setProductServiceText(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="What you sell or offer — commercial context."
                    />
                    {fieldErrors.productOrServiceDescription && (
                      <p className="text-sm text-destructive">{fieldErrors.productOrServiceDescription}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="w-demo">What will be demonstrated</Label>
                    <Textarea
                      id="w-demo"
                      value={whatWillBeDemonstrated}
                      onChange={(e) => setWhatWillBeDemonstrated(e.target.value)}
                      className="min-h-[100px]"
                      placeholder="The actual demo focus — equipment, workflow, or story arc."
                    />
                    {fieldErrors.whatWillBeDemonstrated && (
                      <p className="text-sm text-destructive">{fieldErrors.whatWillBeDemonstrated}</p>
                    )}
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  {slotPicker}
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="w-pref">Preferred week / slot</Label>
                    <Textarea
                      id="w-pref"
                      value={p.preferredWeekNote || ""}
                      onChange={(e) => update("preferredWeekNote", e.target.value)}
                      placeholder="e.g. Week of 15 Sept 2026; Tuesday AM WAT"
                      className="min-h-[88px]"
                    />
                    {fieldErrors.preferredWeekNote && (
                      <p className="text-sm text-destructive">{fieldErrors.preferredWeekNote}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="w-alt">Alternative week (optional)</Label>
                    <Input
                      id="w-alt"
                      value={p.alternativeWeekNote || ""}
                      onChange={(e) => update("alternativeWeekNote", e.target.value)}
                      placeholder="Backup window"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border p-4 bg-muted/20">
                    <div>
                      <p className="font-medium">Flexibility</p>
                      <p className="text-sm text-muted-foreground">
                        {p.schedulingFlexibility === "flexible_next"
                          ? "We can move you to the next suitable featured or approved slot."
                          : "We should only schedule the week you specify (subject to availability)."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm text-muted-foreground">Fixed week only</span>
                      <Switch
                        checked={p.schedulingFlexibility === "flexible_next"}
                        onCheckedChange={(c) => update("schedulingFlexibility", c ? "flexible_next" : "fixed_week")}
                      />
                      <span className="text-sm font-medium">Flexible</span>
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  {(
                    [
                      ["attendeesWillLearn", "What attendees will learn"],
                      ["targetAudience", "Target audience"],
                      ["keyBenefits", "Key benefits / outcomes"],
                      ["approvalReason", "Why this should be approved or featured"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={key}>{label}</Label>
                      <Textarea
                        id={key}
                        value={(p[key] as string) || ""}
                        onChange={(e) => update(key, e.target.value)}
                        className="min-h-[96px]"
                      />
                      {fieldErrors[key] && <p className="text-sm text-destructive">{fieldErrors[key]}</p>}
                    </div>
                  ))}
                </>
              )}

              {step === 5 && (
                <>
                  <div className="rounded-lg border border-primary/20 bg-muted/20 p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">Review summary</p>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>
                        <span className="font-medium text-foreground">Title:</span> {title || "—"}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Format:</span> Live ·{" "}
                        <span className="font-medium text-foreground">Category:</span> {p.category || "—"}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Scheduling:</span>{" "}
                        {(p.preferredWeekNote || "").slice(0, 120) || "—"}
                        {(p.preferredWeekNote || "").length > 120 ? "…" : ""}
                      </li>
                      <li>
                        <span className="font-medium text-foreground">Audience:</span>{" "}
                        {(p.targetAudience || "").slice(0, 80) || "—"}
                        …
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="w-cover">Cover / banner image URL</Label>
                      <Input
                        id="w-cover"
                        type="url"
                        value={p.coverImageUrl || ""}
                        onChange={(e) => update("coverImageUrl", e.target.value)}
                        placeholder="https://…"
                      />
                      {fieldErrors.coverImageUrl && (
                        <p className="text-sm text-destructive">{fieldErrors.coverImageUrl}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="w-pv">Preview video URL (optional)</Label>
                      <Input
                        id="w-pv"
                        type="url"
                        value={p.previewVideoUrl || ""}
                        onChange={(e) => update("previewVideoUrl", e.target.value)}
                      />
                      {fieldErrors.previewVideoUrl && (
                        <p className="text-sm text-destructive">{fieldErrors.previewVideoUrl}</p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="w-prev-imgs">Extra preview image URLs (optional)</Label>
                      <Textarea
                        id="w-prev-imgs"
                        value={previewImagesRaw}
                        onChange={(e) => setPreviewImagesRaw(e.target.value)}
                        className="min-h-[64px] font-mono text-xs"
                        placeholder="One URL per line"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="w-dur">Duration (minutes)</Label>
                      <Input
                        id="w-dur"
                        type="number"
                        min={15}
                        max={480}
                        value={p.estimatedDurationMinutes ?? 60}
                        onChange={(e) => update("estimatedDurationMinutes", Number(e.target.value) || 60)}
                      />
                      {fieldErrors.estimatedDurationMinutes && (
                        <p className="text-sm text-destructive">{fieldErrors.estimatedDurationMinutes}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="w-max">Max attendees</Label>
                      <Input
                        id="w-max"
                        type="number"
                        min={1}
                        max={10000}
                        value={p.maxAttendees ?? 50}
                        onChange={(e) => update("maxAttendees", Number(e.target.value) || 50)}
                      />
                      {fieldErrors.maxAttendees && (
                        <p className="text-sm text-destructive">{fieldErrors.maxAttendees}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <Label>Hosting platform</Label>
                    <Select
                      value={p.hostingPlatform}
                      onValueChange={(v) => update("hostingPlatform", v as DemoApplicationPayload["hostingPlatform"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="google_meet">Google Meet</SelectItem>
                        <SelectItem value="youtube_live">YouTube Live</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {p.hostingPlatform === "other" && (
                      <Input
                        value={p.hostingPlatformOther || ""}
                        onChange={(e) => update("hostingPlatformOther", e.target.value)}
                        placeholder="Platform name"
                      />
                    )}
                    {fieldErrors.hostingPlatformOther && (
                      <p className="text-sm text-destructive">{fieldErrors.hostingPlatformOther}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 rounded-lg border p-4">
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <Label htmlFor="w-reg">Registration required</Label>
                      <Switch
                        id="w-reg"
                        checked={!!p.registrationRequired}
                        onCheckedChange={(c) => update("registrationRequired", c)}
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between gap-2">
                      <Label htmlFor="w-apr">Approval to join</Label>
                      <Switch
                        id="w-apr"
                        checked={!!p.approvalRequiredToJoin}
                        onCheckedChange={(c) => update("approvalRequiredToJoin", c)}
                      />
                    </div>
                  </div>

                  {profileDefaults?.isVerified !== undefined && (
                    <p className="text-sm rounded-md border bg-muted/40 px-3 py-2 text-muted-foreground">
                      <span className="font-medium text-foreground">Account verification:</span>{" "}
                      {profileDefaults.isVerified ? "Verified" : "Not verified"}
                    </p>
                  )}

                  <div className="space-y-3 max-w-xl">
                    <Label className="text-base">Contact for this application</Label>
                    {(
                      [
                        ["companyName", "Company name"],
                        ["contactPerson", "Contact person"],
                        ["contactRole", "Role / title"],
                        ["corporateEmail", "Corporate email"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="space-y-1">
                        <Label htmlFor={`w-${key}`} className="text-xs text-muted-foreground">
                          {label}
                        </Label>
                        <Input
                          id={`w-${key}`}
                          type={key === "corporateEmail" ? "email" : "text"}
                          value={(p[key] as string) || ""}
                          onChange={(e) => update(key, e.target.value)}
                        />
                        {fieldErrors[key] && <p className="text-sm text-destructive">{fieldErrors[key]}</p>}
                      </div>
                    ))}
                    <div className="space-y-1">
                      <Label htmlFor="w-site" className="text-xs text-muted-foreground">
                        Company website (optional)
                      </Label>
                      <Input
                        id="w-site"
                        type="url"
                        value={p.companyWebsite || ""}
                        onChange={(e) => update("companyWebsite", e.target.value)}
                        placeholder="https://"
                      />
                      {fieldErrors.companyWebsite && (
                        <p className="text-sm text-destructive">{fieldErrors.companyWebsite}</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
                    <p className="text-sm font-medium">Confirmations</p>
                    {(
                      [
                        ["confirmAvailability", "We are available for the proposed week(s), subject to platform confirmation."],
                        ["confirmOriginalContent", "Content is original or we are authorized to present it."],
                        ["confirmApprovalRequired", "We understand public scheduling and featured placement require approval."],
                      ] as const
                    ).map(([key, text]) => (
                      <div key={key} className="flex items-start gap-3">
                        <Checkbox
                          id={`w-${key}`}
                          checked={!!p[key]}
                          onCheckedChange={(c) => update(key, c === true)}
                        />
                        <Label htmlFor={`w-${key}`} className="font-normal leading-snug cursor-pointer text-sm">
                          {text}
                        </Label>
                      </div>
                    ))}
                    {(fieldErrors.confirmAvailability ||
                      fieldErrors.confirmOriginalContent ||
                      fieldErrors.confirmApprovalRequired) && (
                      <p className="text-sm text-destructive">Please confirm all three to submit.</p>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 mt-8 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex gap-2">
              {step < 5 ? (
                <Button type="button" onClick={handleNext} className="gap-1 min-w-[120px]">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={
                    disabled ||
                    isSubmitting ||
                    activeRequestCount >= 2 ||
                    !title.trim() ||
                    title.trim().length < 10 ||
                    !fullDescription.trim() ||
                    fullDescription.trim().length < 50
                  }
                  className="min-w-[200px] gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : activeRequestCount >= 2 ? (
                    "Limit reached"
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit application
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

export function DemoAccessStatusBanners(props: {
  currentStatus: string | null
  activeRequestCount: number
  onCreateFeatured: () => void
}) {
  const { currentStatus, activeRequestCount, onCreateFeatured } = props
  return (
    <>
      {currentStatus === "APPROVED" && (
        <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/30">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">Application approved</p>
                  <p className="text-sm text-green-800 dark:text-green-200/90">
                    You can complete your featured demonstration setup — final date, assets, and hosting details.
                  </p>
                </div>
              </div>
              <Button onClick={onCreateFeatured} className="shrink-0">
                Continue to featured demonstration setup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStatus === "PENDING" && (
        <Card className="mb-6 border-amber-200 bg-amber-50/80 dark:bg-amber-950/25">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 dark:text-amber-100">Review in progress</p>
                <p className="text-sm text-amber-800 dark:text-amber-200/90">
                  You have {activeRequestCount} active application{activeRequestCount === 1 ? "" : "s"} (pending or approved).
                  You may submit another until you reach two active applications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStatus === "REJECTED" && (
        <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">Previous application not approved</p>
                <p className="text-sm text-red-800 dark:text-red-200/90">
                  You can submit a new application below with updated detail.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
