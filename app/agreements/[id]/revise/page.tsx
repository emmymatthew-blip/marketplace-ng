"use client"

import { use, useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowLeft, Building2, FileText, Handshake, Package, ShieldCheck, UserRound } from "lucide-react"
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

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0]
}

function parseCompiledTerms(terms: string): {
  title: string
  agreementType: string
  serviceType: string
  agreementValue: string
  startDate: string
  dueDate: string
  companyName: string
  paymentTerms: string
  deliveryTerms: string
  detailedTerms: string
} {
  const defaults = {
    title: "",
    agreementType: "service",
    serviceType: "printing",
    agreementValue: "",
    startDate: formatDateInput(new Date()),
    dueDate: (() => {
      const d = new Date()
      d.setMonth(d.getMonth() + 1)
      return formatDateInput(d)
    })(),
    companyName: "",
    paymentTerms: "",
    deliveryTerms: "",
    detailedTerms: "",
  }
  if (!terms?.trim()) return defaults
  const t = terms
  const getLine = (key: string) => {
    const re = new RegExp(`^${key}:\\s*(.+)$`, "m")
    const m = t.match(re)
    return m ? m[1].trim() : ""
  }
  const summaryBlock = t.split("Commercial Terms")[0] ?? ""
  const commercialBlock = t.includes("Commercial Terms") ? t.split("Commercial Terms")[1]?.split("Detailed Terms")[0] ?? "" : ""
  const detailedBlock = t.includes("Detailed Terms") ? t.split("Detailed Terms").slice(1).join("Detailed Terms").trim() : t
  const paymentMatch = commercialBlock.match(/Payment Terms:\s*([\s\S]*?)(?=Delivery Terms:|$)/i)
  const deliveryMatch = commercialBlock.match(/Delivery Terms:\s*([\s\S]*?)$/im)
  return {
    title: getLine("Title") || summaryBlock.split("\n")[1]?.replace(/^Title:\s*/i, "").trim() || "",
    agreementType: AGREEMENT_TYPES.some((o) => getLine("Agreement Type").toLowerCase().includes(o.value)) ? AGREEMENT_TYPES.find((o) => getLine("Agreement Type").toLowerCase().includes(o.value))!.value : "service",
    serviceType: SERVICE_TYPES.some((o) => getLine("Service Type").toLowerCase().includes(o.value)) ? SERVICE_TYPES.find((o) => getLine("Service Type").toLowerCase().includes(o.value))!.value : "printing",
    agreementValue: getLine("Agreement Value").replace(/^Not specified$/i, "") || "",
    startDate: getLine("Start Date").replace(/^Not specified$/i, "") || defaults.startDate,
    dueDate: getLine("Due Date").replace(/^Not specified$/i, "") || defaults.dueDate,
    companyName: getLine("Initiating Company") || "",
    paymentTerms: paymentMatch ? paymentMatch[1].trim() : "",
    deliveryTerms: deliveryMatch ? deliveryMatch[1].trim() : "",
    detailedTerms: detailedBlock.trim() || terms,
  }
}

interface RevisePageProps {
  params: Promise<{ id: string }>
}

export default function ReviseAgreementPage({ params }: RevisePageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receiver, setReceiver] = useState<{ id: string; name: string; companyName?: string | null } | null>(null)
  const [productContext, setProductContext] = useState<{ id: string; title: string; images?: string[] } | null>(null)
  const [title, setTitle] = useState("")
  const [agreementType, setAgreementType] = useState("service")
  const [serviceType, setServiceType] = useState("printing")
  const [agreementValue, setAgreementValue] = useState("")
  const [startDate, setStartDate] = useState(() => formatDateInput(new Date()))
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return formatDateInput(d)
  })
  const [companyName, setCompanyName] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [deliveryTerms, setDeliveryTerms] = useState("")
  const [terms, setTerms] = useState("")
  const [notes, setNotes] = useState("")
  const [changeSummary, setChangeSummary] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/agreements/${id}/revise`)}`)
      return
    }
    if (status !== "authenticated" || !session?.user?.id) return

    let cancelled = false
    fetch(`/api/agreements/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load agreement")
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        const initiatorId = (data.initiator as { id?: string })?.id
        const isInitiator = initiatorId === (session.user as { id?: string }).id
        if (!isInitiator) {
          setError("Only the agreement creator can revise this agreement.")
          setLoading(false)
          return
        }
        if (data.status !== "MODIFICATION_REQUESTED") {
          setError("This agreement can only be revised when modification has been requested.")
          setLoading(false)
          return
        }
        setReceiver({
          id: data.receiver?.id ?? "",
          name: data.receiver?.name ?? "Recipient",
          companyName: data.receiver?.companyName ?? null,
        })
        setProductContext(data.product ?? null)
        const rawTerms = data.terms ?? ""
        const rawNotes = data.notes ?? ""
        const parsed = parseCompiledTerms(rawTerms)
        setTitle(data.title ?? parsed.title)
        setAgreementType(parsed.agreementType)
        setServiceType(parsed.serviceType)
        setAgreementValue(parsed.agreementValue)
        setStartDate(parsed.startDate || formatDateInput(new Date()))
        setDueDate(parsed.dueDate || formatDateInput(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)))
        setCompanyName(parsed.companyName)
        setPaymentTerms(parsed.paymentTerms)
        setDeliveryTerms(parsed.deliveryTerms)
        setTerms(parsed.detailedTerms)
        setNotes(rawNotes)
        setChangeSummary("")
        setError(null)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message ?? "Failed to load agreement")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, status, session?.user?.id, router])

  const canSubmit = Boolean(
    title.trim() && terms.trim() && paymentTerms.trim() && deliveryTerms.trim()
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)

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

    try {
      const res = await fetch(`/api/agreements/${id}/revise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          terms: compiledTerms,
          notes: notes.trim() || undefined,
          changeSummary: changeSummary.trim() || undefined,
          paymentTerms: paymentTerms.trim() || undefined,
          deliveryTerms: deliveryTerms.trim() || undefined,
          value: agreementValue.trim() || undefined,
          startDate: startDate || undefined,
          dueDate: dueDate || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? "Failed to submit revision")
      }
      toast({
        title: "Revision submitted",
        description: "The revised agreement has been sent to the other party for review.",
      })
      router.push(`/agreements/${id}`)
    } catch (e) {
      toast({
        title: "Failed to submit revision",
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const backHref = `/agreements/${id}`

  if (status === "loading" || loading) {
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

  if (!session) return null

  if (error) {
    return (
      <DashboardPageContainer>
        <DashboardHeader title="Revise agreement" description="" />
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
        <Button variant="outline" asChild className="mt-4">
          <Link href={backHref}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to agreement
          </Link>
        </Button>
      </DashboardPageContainer>
    )
  }

  function ReviseFormContent() {
  return (
      <DashboardPageContainer className="space-y-6">
      <DashboardHeader
          title="Revise Agreement Draft"
          description="Update the agreement based on the modification request and resubmit for review. The layout matches creating a new agreement for consistency."
        actions={
            <Button variant="outline" size="sm" asChild>
              <Link href={backHref}>
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back to Agreement
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
              This agreement is tied to the following counterparty.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {receiver ? (
              <>
                <p className="font-medium text-foreground">
                  {receiver.companyName || receiver.name}
                </p>
                <p className="text-sm text-muted-foreground">{receiver.name}</p>
                <p className="text-xs text-muted-foreground">Source: agreement</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Loading…</p>
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
              Listing or product this agreement is tied to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {productContext ? (
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={productContext.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={productContext.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground line-clamp-2">{productContext.title}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No listing context attached.
              </p>
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
              Revising an existing agreement after a modification request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-medium text-foreground">Agreement revision</p>
            <p className="text-sm text-muted-foreground">
              You are updating the draft in response to the other party’s requested changes. Submit to send the revised agreement for review.
            </p>
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
            {receiver && (
              <div className="space-y-2 md:col-span-2">
                <Label>Recipient</Label>
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm">
                  <p className="font-medium text-foreground">
                    {receiver.companyName || receiver.name}
                  </p>
                  <p className="text-muted-foreground">{receiver.name}</p>
                </div>
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
                placeholder="Add context that will help the other party review this draft."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="change-summary">Change summary (optional)</Label>
              <Textarea
                id="change-summary"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder="e.g. Updated payment terms; revised delivery schedule"
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                Briefly describe what you changed for the revision history.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              This revised draft will be sent to the other party for review.
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" asChild>
                <Link href={backHref}>Cancel</Link>
          </Button>
              <Button type="submit" disabled={submitting || !canSubmit}>
                {submitting ? "Sending…" : "Submit Revised Agreement"}
          </Button>
        </div>
          </CardFooter>
        </Card>
      </form>
    </DashboardPageContainer>
  )
  }
  return <ReviseFormContent />
}
