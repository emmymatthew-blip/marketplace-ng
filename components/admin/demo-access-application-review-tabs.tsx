"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Calendar, ExternalLink, ImageIcon, Video } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DEMO_APPLICATION_WIZARD_STEPS,
  splitProductOrServiceDescription,
} from "@/lib/demo-application-wizard-meta"
import type { DemoApplicationPayload } from "@/lib/demo-application-payload"
import { demoApplicationPayloadSchema } from "@/lib/demo-application-payload"
import { extractRelatedListingId } from "@/lib/demo-access-related-listing"
import { cn } from "@/lib/utils"

function Row({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}

function Pre({ children }: { children: React.ReactNode }) {
  return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{children || "—"}</p>
}

const HOST_LABELS: Record<string, string> = {
  zoom: "Zoom",
  google_meet: "Google Meet",
  youtube_live: "YouTube Live",
  other: "Other",
}

function safeParsePayload(raw: string | null | undefined): {
  payload: DemoApplicationPayload | null
  rawJson: string | null
  parseError: string | null
} {
  if (raw == null || String(raw).trim() === "") {
    return { payload: null, rawJson: null, parseError: "No structured application payload stored." }
  }
  try {
    const obj = JSON.parse(raw) as unknown
    const parsed = demoApplicationPayloadSchema.safeParse(obj)
    if (parsed.success) {
      return { payload: parsed.data, rawJson: null, parseError: null }
    }
    return {
      payload: obj as DemoApplicationPayload,
      rawJson: null,
      parseError: "Payload doesn’t match current schema — showing best-effort fields below.",
    }
  } catch {
    return { payload: null, rawJson: raw, parseError: "Invalid JSON in applicationPayload." }
  }
}

function asRecord(p: DemoApplicationPayload | null): Record<string, unknown> {
  if (!p) return {}
  return p as unknown as Record<string, unknown>
}

export type DemoAccessApplicationReviewProps = {
  title: string
  description: string
  applicationPayload: string | null | undefined
  /** Resolved server-side from Product when relatedListingId is present */
  relatedListingProductTitle?: string | null
  requestedAt?: string | null
  preferredDate?: string | null
  assignedDate?: string | null
  assignedDateId?: string | null
  status?: string
}

export function DemoAccessApplicationReviewTabs({
  title,
  description,
  applicationPayload,
  relatedListingProductTitle,
  requestedAt,
  preferredDate,
  assignedDate,
  assignedDateId,
  status,
}: DemoAccessApplicationReviewProps) {
  const { payload, rawJson, parseError } = useMemo(
    () => safeParsePayload(applicationPayload),
    [applicationPayload]
  )
  const r = asRecord(payload)
  const relatedListingIdResolved = extractRelatedListingId(r)
  const [fetchedListingTitle, setFetchedListingTitle] = useState<string | null>(null)
  const [resolvingListingTitle, setResolvingListingTitle] = useState(false)

  useEffect(() => {
    if (!relatedListingIdResolved) {
      setFetchedListingTitle(null)
      setResolvingListingTitle(false)
      return
    }
    const serverTitle = relatedListingProductTitle?.trim()
    if (serverTitle) {
      setFetchedListingTitle(null)
      setResolvingListingTitle(false)
      return
    }
    let cancelled = false
    setResolvingListingTitle(true)
    setFetchedListingTitle(null)
    fetch(`/api/products/${encodeURIComponent(relatedListingIdResolved)}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { title?: string } | null) => {
        if (cancelled || !data?.title) return
        setFetchedListingTitle(String(data.title).trim())
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setResolvingListingTitle(false)
      })
    return () => {
      cancelled = true
    }
  }, [relatedListingIdResolved, relatedListingProductTitle])

  const resolvedProductTitle =
    relatedListingProductTitle?.trim() || fetchedListingTitle?.trim() || null
  const productCombined = typeof r.productOrServiceDescription === "string" ? r.productOrServiceDescription : ""
  const { productService, whatWillBeDemonstrated } = splitProductOrServiceDescription(productCombined)

  const formatDate = (v: string | null | undefined) => {
    if (v == null || v === "") return "—"
    try {
      return format(new Date(v), "PPP p")
    } catch {
      return String(v)
    }
  }

  const bool = (v: unknown) => (v === true ? "Yes" : v === false ? "No" : "—")

  const previewUrls = Array.isArray(r.previewImageUrls) ? (r.previewImageUrls as string[]) : []

  return (
    <Card className="border-primary/15">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Demonstration application</CardTitle>
            <CardDescription className="mt-1">
              Same 5 steps as the host wizard. Request status:{" "}
              {status ? <Badge variant="outline">{status}</Badge> : "—"}
            </CardDescription>
          </div>
          {requestedAt ? (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Submitted {formatDate(requestedAt)}
            </p>
          ) : null}
        </div>
        {parseError && (payload != null || rawJson != null) ? (
          <p className="text-sm text-amber-700 dark:text-amber-400">{parseError}</p>
        ) : null}
      </CardHeader>
      <CardContent>
        {rawJson ? (
          <div className="space-y-4">
            <Row label="Demonstration title">
              <Pre>{title}</Pre>
            </Row>
            <Row label="Full description">
              <Pre>{description}</Pre>
            </Row>
            <p className="text-xs font-medium text-muted-foreground">Raw applicationPayload</p>
            <pre className="max-h-64 overflow-auto rounded-md border bg-muted/40 p-3 text-xs">{rawJson}</pre>
          </div>
        ) : !payload ? (
          <div className="space-y-4 rounded-lg border border-dashed bg-muted/15 p-4">
            <p className="text-sm text-muted-foreground">{parseError}</p>
            <Row label="Demonstration title (record)">
              <Pre>{title}</Pre>
            </Row>
            <Row label="Full description (record)">
              <Pre>{description}</Pre>
            </Row>
          </div>
        ) : (
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="mb-4 flex h-auto min-h-10 w-full flex-wrap justify-start gap-1 bg-muted/60 p-1">
              {DEMO_APPLICATION_WIZARD_STEPS.map((s) => (
                <TabsTrigger
                  key={s.id}
                  value={s.id}
                  className="max-w-full flex-none px-2 py-2 text-left text-[11px] leading-tight sm:text-sm"
                >
                  <span className="font-medium text-muted-foreground">{s.id}.</span> {s.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="1" className="mt-0 space-y-4 rounded-lg border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{DEMO_APPLICATION_WIZARD_STEPS[0].description}</p>
              <Separator />
              <Row label="Demonstration title (review record)">
                <Pre>{title}</Pre>
              </Row>
              <Row label="Category">
                <Pre>{(r.category as string) || "—"}</Pre>
              </Row>
              <Row label="Format">
                <Badge variant="secondary">{(r.format as string) || "LIVE"}</Badge>
              </Row>
              <Row label="Short summary">
                <Pre>{(r.summary as string) || "—"}</Pre>
              </Row>
              <Row label="Full description">
                <Pre>{description || "—"}</Pre>
              </Row>
            </TabsContent>

            <TabsContent value="2" className="mt-0 space-y-4 rounded-lg border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{DEMO_APPLICATION_WIZARD_STEPS[1].description}</p>
              <Separator />
              <Row label="Tied to existing listing">
                <Pre>{bool(r.tiedToExistingListing)}</Pre>
              </Row>
              <Row label="Related listing">
                {(r.relatedListingId as string)?.trim() ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Product name</p>
                      <p className="font-medium text-foreground">
                        {resolvedProductTitle
                          ? resolvedProductTitle
                          : resolvingListingTitle
                            ? "Resolving title…"
                            : "— (not found — ID may be invalid or listing removed)"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Listing ID</p>
                      <p className="font-mono text-xs break-all">{(r.relatedListingId as string).trim()}</p>
                    </div>
                    <Link
                      href={`/marketplace/product/${String(r.relatedListingId).trim()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary underline"
                    >
                      Open listing
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </Link>
                  </div>
                ) : (
                  <Pre>—</Pre>
                )}
              </Row>
              <Row label="Product category">
                <Pre>{(r.productCategory as string) || "—"}</Pre>
              </Row>
              <Row label="Product / service description">
                <Pre>{productService || "—"}</Pre>
              </Row>
              <Row label="What will be demonstrated">
                <Pre>{whatWillBeDemonstrated || (productCombined ? "— (see combined field in raw data)" : "—")}</Pre>
              </Row>
            </TabsContent>

            <TabsContent value="3" className="mt-0 space-y-4 rounded-lg border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{DEMO_APPLICATION_WIZARD_STEPS[2].description}</p>
              <Separator />
              <Row label="Reserved / preferred date (system)">
                <Pre>{formatDate(preferredDate ?? undefined)}</Pre>
              </Row>
              <Row label="Assigned date (admin)">
                <Pre>{formatDate(assignedDate ?? undefined)}</Pre>
              </Row>
              <Row label="Assigned slot ID">
                <Pre>{assignedDateId || "—"}</Pre>
              </Row>
              <Row label="Preferred week / slot (applicant note)">
                <Pre>{(r.preferredWeekNote as string) || "—"}</Pre>
              </Row>
              <Row label="Alternative week">
                <Pre>{(r.alternativeWeekNote as string) || "—"}</Pre>
              </Row>
              <Row label="Scheduling flexibility">
                <Pre>
                  {r.schedulingFlexibility === "flexible_next"
                    ? "Flexible — next suitable featured or approved slot"
                    : r.schedulingFlexibility === "fixed_week"
                      ? "Fixed week only (subject to availability)"
                      : String(r.schedulingFlexibility || "—")}
                </Pre>
              </Row>
            </TabsContent>

            <TabsContent value="4" className="mt-0 space-y-4 rounded-lg border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{DEMO_APPLICATION_WIZARD_STEPS[3].description}</p>
              <Separator />
              <Row label="What attendees will learn">
                <Pre>{(r.attendeesWillLearn as string) || "—"}</Pre>
              </Row>
              <Row label="Target audience">
                <Pre>{(r.targetAudience as string) || "—"}</Pre>
              </Row>
              <Row label="Key benefits / outcomes">
                <Pre>{(r.keyBenefits as string) || "—"}</Pre>
              </Row>
              <Row label="Why this should be approved or featured">
                <Pre>{(r.approvalReason as string) || "—"}</Pre>
              </Row>
            </TabsContent>

            <TabsContent value="5" className="mt-0 space-y-4 rounded-lg border bg-muted/20 p-4">
              <p className="text-xs text-muted-foreground">{DEMO_APPLICATION_WIZARD_STEPS[4].description}</p>
              <Separator />
              <Row label="Cover / banner image">
                {r.coverImageUrl ? (
                  <a
                    href={String(r.coverImageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 break-all text-primary underline"
                  >
                    <ImageIcon className="h-3.5 w-3.5 shrink-0" />
                    {String(r.coverImageUrl)}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <Pre>—</Pre>
                )}
              </Row>
              <Row label="Preview video">
                {r.previewVideoUrl ? (
                  <a
                    href={String(r.previewVideoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 break-all text-primary underline"
                  >
                    <Video className="h-3.5 w-3.5 shrink-0" />
                    {String(r.previewVideoUrl)}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : (
                  <Pre>—</Pre>
                )}
              </Row>
              <Row label="Extra preview images">
                {previewUrls.length ? (
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    {previewUrls.map((url) => (
                      <li key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline">
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Pre>—</Pre>
                )}
              </Row>
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Duration (minutes)">
                  <Pre>{r.estimatedDurationMinutes != null ? String(r.estimatedDurationMinutes) : "—"}</Pre>
                </Row>
                <Row label="Max attendees">
                  <Pre>{r.maxAttendees != null ? String(r.maxAttendees) : "—"}</Pre>
                </Row>
              </div>
              <Row label="Hosting platform">
                <Pre>
                  {HOST_LABELS[String(r.hostingPlatform)] || String(r.hostingPlatform || "—")}
                  {r.hostingPlatform === "other" && r.hostingPlatformOther
                    ? ` — ${String(r.hostingPlatformOther)}`
                    : ""}
                </Pre>
              </Row>
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Registration required">
                  <Pre>{bool(r.registrationRequired)}</Pre>
                </Row>
                <Row label="Approval required to join">
                  <Pre>{bool(r.approvalRequiredToJoin)}</Pre>
                </Row>
              </div>
              <Separator />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Application contact</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Row label="Company name">
                  <Pre>{(r.companyName as string) || "—"}</Pre>
                </Row>
                <Row label="Contact person">
                  <Pre>{(r.contactPerson as string) || "—"}</Pre>
                </Row>
                <Row label="Role / title">
                  <Pre>{(r.contactRole as string) || "—"}</Pre>
                </Row>
                <Row label="Corporate email">
                  <Pre>{(r.corporateEmail as string) || "—"}</Pre>
                </Row>
                <Row label="Company website" className="sm:col-span-2">
                  {r.companyWebsite ? (
                    <a
                      href={String(r.companyWebsite)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-primary underline"
                    >
                      {String(r.companyWebsite)}
                    </a>
                  ) : (
                    <Pre>—</Pre>
                  )}
                </Row>
              </div>
              <Separator />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Confirmations</p>
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className={r.confirmAvailability === true ? "text-emerald-600" : "text-muted-foreground"}>
                    {r.confirmAvailability === true ? "✓" : "○"}
                  </span>
                  <span>Available for proposed week(s), subject to platform confirmation</span>
                </li>
                <li className="flex gap-2">
                  <span className={r.confirmOriginalContent === true ? "text-emerald-600" : "text-muted-foreground"}>
                    {r.confirmOriginalContent === true ? "✓" : "○"}
                  </span>
                  <span>Content is original or authorized</span>
                </li>
                <li className="flex gap-2">
                  <span className={r.confirmApprovalRequired === true ? "text-emerald-600" : "text-muted-foreground"}>
                    {r.confirmApprovalRequired === true ? "✓" : "○"}
                  </span>
                  <span>Understands public scheduling / featured placement require approval</span>
                </li>
              </ul>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
