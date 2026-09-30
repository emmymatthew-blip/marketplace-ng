"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Building2, FileText, Handshake, Inbox, MessageSquare, Package, ShieldCheck, UserRound } from "lucide-react"

import { DashboardHeader, DashboardPageContainer } from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"

type RecipientOption = {
  id: string
  name: string
  companyName?: string | null
  isVerified?: boolean
  source: "messages" | "inquiries" | "profile"
}

type ProductContext = {
  id: string
  title: string
  image?: string | null
  category?: string | null
  condition?: string | null
  companyName?: string | null
}

type InquiryContext = {
  id: string
  status?: string
  createdAt?: string
  initialMessage?: string
  country?: string | null
  companyName?: string | null
  buyer?: { id: string; name?: string | null; companyName?: string | null } | null
  vendor?: { id: string; name?: string | null; companyName?: string | null } | null
  product?: { id: string; title?: string | null; images?: string[] | null } | null
}

const AGREEMENT_TYPES = [
  { value: "service", label: "Service Agreement" },
  { value: "project", label: "Project Contract" },
  { value: "retainer", label: "Retainer Agreement" },
  { value: "partnership", label: "Partnership Agreement" },
] as const

const SERVICE_TYPES = [
  { value: "printing", label: "Printing Services" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "design", label: "Design Services" },
  { value: "consulting", label: "Consulting" },
  { value: "other", label: "Other" },
] as const

/** Radix Select does not allow SelectItem value="" — use a sentinel for empty-state rows. */
const NO_LISTINGS_SELECT_VALUE = "__no_listings__"

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0]
}

function getConditionLabel(condition?: string | null) {
  if (!condition) return null
  const normalized = String(condition).toUpperCase()
  if (normalized === "NEW") return "New Machines"
  if (normalized === "USED") return "Used Machines"
  return condition
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export default function NewAgreementPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const recipientParam = searchParams.get("recipient")
  const recipientNameParam = searchParams.get("name")
  const productParam = searchParams.get("product")
  const inquiryId = searchParams.get("inquiryId")
  const fromChat = searchParams.get("fromChat")
  const hasContext = Boolean(recipientParam || productParam || inquiryId || fromChat)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingContext, setIsLoadingContext] = useState(true)
  const [didAutofill, setDidAutofill] = useState(false)
  const [recipientOptions, setRecipientOptions] = useState<RecipientOption[]>([])
  const [lockedRecipient, setLockedRecipient] = useState<RecipientOption | null>(null)
  const [productContext, setProductContext] = useState<ProductContext | null>(null)
  const [availableListings, setAvailableListings] = useState<ProductContext[]>([])
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>(productParam ?? undefined)
  const [inquiryContext, setInquiryContext] = useState<InquiryContext | null>(null)

  const [receiverId, setReceiverId] = useState(recipientParam ?? "")
  const [title, setTitle] = useState("")
  const [agreementType, setAgreementType] = useState<string>("service")
  const [serviceType, setServiceType] = useState<string>("printing")
  const [agreementValue, setAgreementValue] = useState("")
  const [startDate, setStartDate] = useState(() => formatDateInput(new Date()))
  const [dueDate, setDueDate] = useState(() => {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    return formatDateInput(nextMonth)
  })
  const [companyName, setCompanyName] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [deliveryTerms, setDeliveryTerms] = useState("")
  const [terms, setTerms] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`)
    }
  }, [status, router])

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return

    const loadContext = async () => {
      setIsLoadingContext(true)

      const [
        ownProfileData,
        conversationsData,
        vendorInquiriesData,
        buyerInquiriesData,
        productData,
        recipientProfileData,
      ] = await Promise.all([
        fetchJson<{ vendor?: { companyName?: string | null; name?: string | null } }>("/api/vendors/setup"),
        fetchJson<
          Array<{
            contact: { id: string; name: string; companyName?: string | null; isVerified?: boolean }
          }>
        >("/api/messages/conversations"),
        fetchJson<InquiryContext[]>("/api/inquiries?role=vendor"),
        fetchJson<InquiryContext[]>("/api/inquiries?role=buyer"),
        productParam ? fetchJson<any>(`/api/products/${productParam}`) : Promise.resolve(null),
        recipientParam ? fetchJson<any>(`/api/vendors/${recipientParam}`) : Promise.resolve(null),
      ])

      const optionMap = new Map<string, RecipientOption>()
      const combinedInquiries = [
        ...(Array.isArray(vendorInquiriesData) ? vendorInquiriesData : []),
        ...(Array.isArray(buyerInquiriesData) ? buyerInquiriesData : []),
      ]

      if (ownProfileData?.vendor?.companyName || ownProfileData?.vendor?.name) {
        setCompanyName((prev) => prev || ownProfileData.vendor?.companyName || ownProfileData.vendor?.name || "")
      } else {
        setCompanyName((prev) => prev || session.user.name || "")
      }

      for (const conversation of Array.isArray(conversationsData) ? conversationsData : []) {
        if (!conversation?.contact?.id) continue
        optionMap.set(conversation.contact.id, {
          id: conversation.contact.id,
          name: conversation.contact.name,
          companyName: conversation.contact.companyName ?? null,
          isVerified: Boolean(conversation.contact.isVerified),
          source: "messages",
        })
      }

      for (const inquiry of combinedInquiries) {
        const counterparty =
          inquiry.vendor?.id === session.user.id ? inquiry.buyer : inquiry.vendor

        if (!counterparty?.id || optionMap.has(counterparty.id)) continue
        optionMap.set(counterparty.id, {
          id: counterparty.id,
          name: counterparty.name || "Unknown contact",
          companyName: counterparty.companyName ?? inquiry.companyName ?? null,
          source: "inquiries",
        })
      }

      if (recipientParam && recipientProfileData?.id && !optionMap.has(recipientParam)) {
        optionMap.set(recipientParam, {
          id: recipientProfileData.id,
          name: recipientProfileData.name || recipientProfileData.companyName || recipientNameParam || "Recipient",
          companyName: recipientProfileData.companyName ?? null,
          isVerified: Boolean(recipientProfileData.isVerified),
          source: "profile",
        })
      }

      const options = Array.from(optionMap.values()).sort((a, b) =>
        (a.companyName || a.name).localeCompare(b.companyName || b.name)
      )
      setRecipientOptions(options)

      const matchedInquiry =
        combinedInquiries.find((inquiry) => inquiry.id === inquiryId) ?? null
      setInquiryContext(matchedInquiry)

      if (matchedInquiry && !recipientParam) {
        const counterpart =
          matchedInquiry.vendor?.id === session.user.id
            ? matchedInquiry.buyer
            : matchedInquiry.vendor
        if (counterpart?.id) {
          setReceiverId(counterpart.id)
          setLockedRecipient({
            id: counterpart.id,
            name: counterpart.name || "Recipient",
            companyName: counterpart.companyName ?? matchedInquiry.companyName ?? null,
            source: "inquiries",
          })
        }
      }

      if (recipientParam) {
        const matchedRecipient =
          options.find((option) => option.id === recipientParam) ??
          (recipientProfileData
            ? {
                id: recipientProfileData.id,
                name: recipientProfileData.name || recipientProfileData.companyName || recipientNameParam || "Recipient",
                companyName: recipientProfileData.companyName ?? null,
                isVerified: Boolean(recipientProfileData.isVerified),
                source: "profile" as const,
              }
            : null)

        if (matchedRecipient) {
          setLockedRecipient(matchedRecipient)
          setReceiverId(matchedRecipient.id)
        } else if (recipientParam) {
          setLockedRecipient({
            id: recipientParam,
            name: recipientNameParam || "Recipient",
            companyName: null,
            source: "profile",
          })
          setReceiverId(recipientParam)
        }
      }

      if (productData?.id) {
        const context = {
          id: productData.id,
          title: productData.title ?? "Listing",
          image: Array.isArray(productData.images) ? productData.images[0] : null,
          category: productData.category?.name ?? null,
          condition: getConditionLabel(productData.condition),
          companyName: productData.owner?.companyName ?? productData.owner?.name ?? null,
        }
        setProductContext(context)
        setSelectedListingId(productData.id)
      } else if (matchedInquiry?.product?.id) {
        const context = {
          id: matchedInquiry.product.id,
          title: matchedInquiry.product.title ?? "Listing",
          image: Array.isArray(matchedInquiry.product.images) ? matchedInquiry.product.images[0] ?? null : null,
          category: null,
          condition: null,
          companyName: null,
        }
        setProductContext(context)
        setSelectedListingId(context.id)
      }

      setIsLoadingContext(false)
    }

    loadContext()
  }, [status, session?.user?.id, session?.user?.name, recipientParam, recipientNameParam, productParam, inquiryId])

  const sourceSummary = useMemo(() => {
    if (inquiryId) return "Inquiry"
    if (fromChat) return "Conversation"
    if (productParam) return "Listing discussion"
    return "Standalone draft"
  }, [fromChat, inquiryId, productParam])

  useEffect(() => {
    if (didAutofill || isLoadingContext) return

    const recipientDisplay = lockedRecipient?.companyName || lockedRecipient?.name || recipientNameParam || ""
    const sourceText =
      inquiryId
        ? "inquiry"
        : fromChat
          ? "conversation"
          : productParam
            ? "listing discussion"
            : "agreement draft"

    if (recipientDisplay) {
      setTitle((prev) => prev || `Agreement draft with ${recipientDisplay}`)
      setTerms((prev) =>
        prev ||
        `1. This draft is between both parties regarding the proposed scope of work.\n2. Commercial terms, delivery expectations, and responsibilities should be reviewed by both parties.\n3. Any disputes may be mediated on PrintMarket NG when an agreement exists.`
      )
      setNotes((prev) => prev || `Draft initiated from ${sourceText}.`)
    }

    setDidAutofill(true)
  }, [didAutofill, isLoadingContext, lockedRecipient, recipientNameParam, inquiryId, fromChat, productParam])

  const selectedRecipientOption = useMemo(
    () => recipientOptions.find((option) => option.id === receiverId) ?? lockedRecipient,
    [recipientOptions, receiverId, lockedRecipient]
  )

  // Load available listings for the selected recipient so listing context can be chosen manually
  useEffect(() => {
    const ownerId = lockedRecipient?.id || receiverId
    if (!ownerId) {
      setAvailableListings([])
      return
    }

    let cancelled = false
    const loadListings = async () => {
      try {
        const res = await fetch(`/api/products?ownerId=${ownerId}&limit=50`, { cache: "no-store" })
        if (!res.ok) {
          if (!cancelled) setAvailableListings([])
          return
        }
        const json = await res.json()
        const items = Array.isArray(json.data) ? json.data : []
        const mapped: ProductContext[] = items.map((item: any) => ({
          id: item.id,
          title: item.title ?? "Listing",
          image: Array.isArray(item.images) ? item.images[0] ?? null : null,
          category: item.category?.name ?? item.categoryName ?? null,
          condition: getConditionLabel(item.condition),
          companyName: item.owner?.companyName ?? item.ownerCompanyName ?? null,
        }))
        if (!cancelled) {
          setAvailableListings(mapped)
          // If we don't already have a productContext and something is preselected, sync context
          if (!productContext && selectedListingId) {
            const found = mapped.find((p) => p.id === selectedListingId)
            if (found) {
              setProductContext(found)
            }
          }
        }
      } catch {
        if (!cancelled) setAvailableListings([])
      }
    }

    loadListings()
    return () => {
      cancelled = true
    }
  }, [lockedRecipient?.id, receiverId])

  const handleListingChange = (value: string) => {
    if (value === NO_LISTINGS_SELECT_VALUE) {
      setSelectedListingId(undefined)
      return
    }
    setSelectedListingId(value || undefined)
    const found = availableListings.find((p) => p.id === value) || null
    setProductContext(found)
  }

  const listingSelectValue =
    availableListings.length === 0 ? NO_LISTINGS_SELECT_VALUE : selectedListingId

  const backHref = useMemo(() => {
    if (inquiryId) return "/dashboard/inquiries"
    if (recipientParam || fromChat) {
      const messageTarget = fromChat || recipientParam
      const qs = productParam ? `?productId=${productParam}` : ""
      return `/messages/${messageTarget}${qs}`
    }
    return "/agreements"
  }, [fromChat, inquiryId, productParam, recipientParam])

  const canSubmit = Boolean(receiverId && title.trim() && terms.trim() && paymentTerms.trim() && deliveryTerms.trim())

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)

    const compiledTerms = [
      "Agreement Summary",
      `Title: ${title}`,
      `Agreement Type: ${AGREEMENT_TYPES.find((item) => item.value === agreementType)?.label ?? agreementType}`,
      `Service Type: ${SERVICE_TYPES.find((item) => item.value === serviceType)?.label ?? serviceType}`,
      `Agreement Value: ${agreementValue || "Not specified"}`,
      `Start Date: ${startDate || "Not specified"}`,
      `Due Date: ${dueDate || "Not specified"}`,
      companyName ? `Initiating Company: ${companyName}` : null,
      "",
      "Commercial Terms",
      `Payment Terms: ${paymentTerms}`,
      `Delivery Terms: ${deliveryTerms}`,
      "",
      "Detailed Terms",
      terms,
    ]
      .filter(Boolean)
      .join("\n")

    const compiledNotes = [
      `Source: ${sourceSummary}`,
      inquiryContext?.country ? `Inquiry country: ${inquiryContext.country}` : null,
      notes.trim() ? notes.trim() : null,
    ]
      .filter(Boolean)
      .join("\n\n")

    try {
      const response = await fetch("/api/agreements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId,
          title: title.trim(),
          terms: compiledTerms,
          notes: compiledNotes || undefined,
          inquiryId: inquiryId || undefined,
          productId: selectedListingId || productContext?.id || productParam || undefined,
          messageContactId: recipientParam || fromChat || undefined,
          sourceType: inquiryId ? "inquiry" : fromChat ? "conversation" : productParam ? "listing_discussion" : "standalone",
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error ?? "Failed to create agreement")
      }

      toast({
        title: "Agreement draft sent",
        description: inquiryId
          ? "The inquiry has been linked and moved into agreement stage."
          : "Your agreement draft has been sent to the other party for review.",
      })

      if (inquiryId) {
        router.push("/dashboard/inquiries")
      } else if (fromChat) {
        router.push(`/messages/${fromChat}${productParam ? `?productId=${productParam}` : ""}`)
      } else if (recipientParam) {
        router.push(`/messages/${recipientParam}${productParam ? `?productId=${productParam}` : ""}`)
      } else {
        router.push("/agreements")
      }
    } catch (error) {
      toast({
        title: "Failed to create agreement",
        description:
          error instanceof Error
            ? error.message
            : "There was an error creating your agreement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || !session) {
  return (
      <DashboardPageContainer className="space-y-6">
        <Skeleton className="h-10 w-56 rounded-lg" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
        <Skeleton className="h-[420px] rounded-xl" />
      </DashboardPageContainer>
    )
  }

  return (
    <DashboardPageContainer className="space-y-6">
      <DashboardHeader
        title="Create Agreement Draft"
        description="Build a structured agreement draft that can be sent to the other party for review. Agreements work best when started from an existing conversation or inquiry."
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href={backHref}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {inquiryId ? "Back to Inquiries" : recipientParam || fromChat ? "Back to Conversation" : "Back to Agreements"}
                </Link>
              </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <UserRound className="h-4 w-4 text-primary" />
              Recipient
            </CardTitle>
            <CardDescription>
              {lockedRecipient ? "This agreement is tied to a known counterparty." : "Choose the recipient you want to send this draft to."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {isLoadingContext ? (
              <Skeleton className="h-16 rounded-lg" />
            ) : selectedRecipientOption ? (
              <>
                <p className="font-medium text-foreground">
                  {selectedRecipientOption.companyName || selectedRecipientOption.name}
                </p>
                <p className="text-sm text-muted-foreground">{selectedRecipientOption.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  Source: {selectedRecipientOption.source}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recipient locked yet. In standalone mode, pick from your recent contacts or inquiry counterparties below.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4 text-primary" />
              Listing Context
            </CardTitle>
            <CardDescription>
              Show the listing or product discussion this draft is tied to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingContext ? (
              <Skeleton className="h-20 rounded-lg" />
            ) : (
              <div className="space-y-3">
                {productContext ? (
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={productContext.image || PLACEHOLDER_IMAGE}
                        alt={productContext.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground line-clamp-2">{productContext.title}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {productContext.category ? <span>{productContext.category}</span> : null}
                        {productContext.condition ? <span>{productContext.condition}</span> : null}
                        {productContext.companyName ? <span>{productContext.companyName}</span> : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No listing context attached to this draft.
                  </p>
                )}

                <div className="space-y-1">
                  <Label htmlFor="listing-select" className="text-xs font-medium text-muted-foreground">
                    Select a related listing (optional)
                  </Label>
                  <Select
                    value={listingSelectValue}
                    onValueChange={handleListingChange}
                    disabled={!selectedRecipientOption && availableListings.length === 0}
                  >
                    <SelectTrigger id="listing-select">
                      <SelectValue placeholder="Select a related listing (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableListings.length > 0 ? (
                        availableListings.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={NO_LISTINGS_SELECT_VALUE} disabled>
                          No listings available for this company
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {selectedRecipientOption && availableListings.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No listings available for this company. You can still proceed without a listing context.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Source
            </CardTitle>
            <CardDescription>
              Agreements are usually created after parties begin discussing terms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium text-foreground">{sourceSummary}</p>
            {inquiryContext ? (
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Inquiry context linked</p>
                {inquiryContext.initialMessage ? (
                  <p className="mt-1 line-clamp-2">{inquiryContext.initialMessage}</p>
                ) : null}
              </div>
            ) : hasContext ? (
              <p className="text-sm text-muted-foreground">
                This draft is grounded in an existing business discussion and will be easier for the other party to review.
              </p>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Standalone mode is available as a fallback, but agreements work best when launched from messages, inquiries, or listing discussions.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Agreement Summary
            </CardTitle>
            <CardDescription>
              Define the core scope, value, and schedule for this draft.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {lockedRecipient ? (
              <div className="space-y-2 md:col-span-2">
                <Label>Recipient</Label>
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm">
                  <p className="font-medium text-foreground">
                    {lockedRecipient.companyName || lockedRecipient.name}
                  </p>
                  <p className="text-muted-foreground">{lockedRecipient.name}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="receiverId">Recipient</Label>
                <Select value={receiverId} onValueChange={setReceiverId}>
                  <SelectTrigger id="receiverId">
                    <SelectValue placeholder="Select from your recent contacts or inquiry counterparties" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipientOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {(option.companyName || option.name) + ` · ${option.source}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {recipientOptions.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    No recent contacts found yet. Start from Messages or Inquiries for a better context-aware agreement flow.
                  </p>
                ) : null}
                </div>
              )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="agreement-title">Agreement Title</Label>
              <Input
                id="agreement-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Supply and installation agreement for digital press"
                required
              />
            </div>

                  <div className="space-y-2">
              <Label htmlFor="agreement-type">Agreement Type</Label>
              <Select value={agreementType} onValueChange={setAgreementType}>
                <SelectTrigger id="agreement-type">
                  <SelectValue placeholder="Select agreement type" />
                      </SelectTrigger>
                      <SelectContent>
                  {AGREEMENT_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger id="service-type">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                  {SERVICE_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
              <Label htmlFor="agreement-value">Agreement Value</Label>
              <Input
                id="agreement-value"
                value={agreementValue}
                onChange={(e) => setAgreementValue(e.target.value)}
                placeholder="e.g. NGN 4,500,000"
              />
                  </div>

                  <div className="space-y-2">
              <Label htmlFor="company-name">Your Company / Organization</Label>
                    <Input 
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company or operating name"
                    />
                  </div>

                    <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
                      <Input 
                id="start-date"
                        type="date" 
                min={formatDateInput(new Date())}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
                      <Input 
                id="due-date"
                        type="date" 
                min={startDate || formatDateInput(new Date())}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-4 w-4 text-primary" />
              Commercial Terms
            </CardTitle>
            <CardDescription>
              Capture the practical commercial terms the other party should review first.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Textarea
                id="payment-terms"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder="Describe deposits, milestones, payment schedule, and settlement conditions..."
                rows={5}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
              <Label htmlFor="delivery-terms">Delivery Terms</Label>
                    <Textarea
                id="delivery-terms"
                value={deliveryTerms}
                onChange={(e) => setDeliveryTerms(e.target.value)}
                placeholder="Describe delivery scope, installation timeline, logistics responsibilities, and handover expectations..."
                rows={5}
                      required
                    />
                  </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Detailed Terms
            </CardTitle>
            <CardDescription>
              Add the detailed working terms that will be included in the draft sent for review.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                  <div className="space-y-2">
              <Label htmlFor="detailed-terms">Terms and Conditions</Label>
                    <Textarea
                id="detailed-terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Describe scope, obligations, timelines, responsibilities, revision handling, and dispute expectations..."
                rows={8}
                      required
                    />
                  </div>
                  <div className="space-y-2">
              <Label htmlFor="additional-notes">Additional Notes</Label>
                    <Textarea
                id="additional-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add context from the conversation, inquiry, or listing discussion that will help the other party review this draft."
                rows={4}
                    />
                  </div>
                </CardContent>
          <CardFooter className="flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              This draft will be sent to the other party for review.
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button variant="outline" asChild>
                <Link href={backHref}>Cancel</Link>
                  </Button>
              <Button type="submit" disabled={isSubmitting || !canSubmit}>
                {isSubmitting ? "Sending..." : "Send Agreement Draft"}
                  </Button>
            </div>
                </CardFooter>
        </Card>
              </form>

      {!hasContext ? (
        <Card className="rounded-xl border border-dashed border-border bg-muted/10 shadow-sm">
          <CardContent className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium text-foreground">Prefer a more context-aware agreement flow?</p>
              <p className="text-sm text-muted-foreground">
                Start from a conversation or inquiry so the recipient, listing, and business discussion are already attached to the draft.
              </p>
          </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/messages">
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  Go to Messages
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/inquiries">
                  <Inbox className="mr-1.5 h-4 w-4" />
                  View Inquiries
                </Link>
              </Button>
        </div>
          </CardContent>
        </Card>
      ) : null}
    </DashboardPageContainer>
  )
}
