"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Shield,
  Building2,
  FileCheck,
  Globe,
  CheckCircle,
  MapPin,
  Star,
  ArrowUpRight,
} from "lucide-react"
import { DashboardPageContainer, DashboardHeader, StatusBadge } from "@/components/dashboard"
import { VerificationOptionCard } from "@/components/verification/verification-option-card"
import { VerificationSupportPanel } from "@/components/verification/verification-support-panel"

type VerificationLevel = 0 | 1 | 2 | 3 | 4
const LEVEL_LABELS: Record<VerificationLevel, string> = {
  0: "Unverified",
  1: "Email verified",
  2: "Identity verified",
  3: "Business verified",
  4: "Enterprise verified",
}

export default function VerificationCenterPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [level, setLevel] = useState<VerificationLevel>(0)
  const [identityVerified, setIdentityVerified] = useState(false)
  const [businessVerified, setBusinessVerified] = useState(false)
  const [enterpriseVerified, setEnterpriseVerified] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [cacNumber, setCacNumber] = useState("")
  const [cipponId, setCipponId] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [corporateEmail, setCorporateEmail] = useState("")
  const [identityDoc, setIdentityDoc] = useState<File | null>(null)
  const [businessDoc, setBusinessDoc] = useState<File | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/verification")
    }
  }, [status, router])

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/verification/status", { cache: "no-store" })
      const data = res.ok ? await res.json() : {}
      setLevel(Math.min(4, Math.max(0, data?.verificationLevel ?? 0)) as VerificationLevel)
      setIdentityVerified(!!data?.identityVerified)
      setBusinessVerified(!!data?.businessVerified)
      setEnterpriseVerified(!!data?.enterpriseVerified)
      setSubmissions(Array.isArray(data?.submissions) ? data.submissions : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "loading") return
    if (status === "unauthenticated") return
    if (!session?.user?.id) {
      setLoading(false)
      return
    }
    setLoading(true)
    void fetchStatus()
  }, [status, session?.user?.id, fetchStatus])

  const uploadVerificationDocument = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "/printmarket/verifications/")
    const uploadRes = await fetch("/api/upload/cloudinary", {
      method: "POST",
      body: formData,
    })
    const uploadText = await uploadRes.text()
    if (!uploadRes.ok) {
      let message = "Failed to upload document"
      try {
        const parsed = JSON.parse(uploadText)
        if (parsed?.error) message = parsed.error
      } catch {
        if (uploadText) message = uploadText
      }
      throw new Error(message)
    }
    const parsed = JSON.parse(uploadText) as { url?: string }
    if (!parsed?.url) throw new Error("Upload failed: missing url")
    return parsed.url
  }

  const submitVerification = async (payload: {
    verificationType: "IDENTITY" | "BUSINESS" | "ENTERPRISE"
    documentType: string
    metadata?: Record<string, any>
    file?: File | null
  }) => {
    setSubmitting(true)
    try {
      let documentUrl: string | undefined
      if (payload.file) {
        documentUrl = await uploadVerificationDocument(payload.file)
      }

      const res = await fetch("/api/verification/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationType: payload.verificationType,
          documentType: payload.documentType,
          documentUrl,
          metadata: payload.metadata,
        }),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error((d as { error?: string })?.error ?? "Submit failed")
      }

      toast({
        title: "Submitted",
        description: "Verification has been submitted for review.",
      })

      await fetchStatus()
      return true
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit.",
        variant: "destructive",
      })
      return false
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitIdentity = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!identityDoc) {
      toast({
        title: "Missing document",
        description: "Please upload a government-issued ID to continue.",
        variant: "destructive",
      })
      return
    }

    const ok = await submitVerification({
      verificationType: "IDENTITY",
      documentType: "GOVERNMENT_ID",
      metadata: { cacNumber: cacNumber || undefined, cipponId: cipponId || undefined },
      file: identityDoc,
    })
    if (ok) setIdentityDoc(null)
  }

  const handleSubmitBusiness = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const ok = await submitVerification({
      verificationType: "BUSINESS",
      documentType: "CAC_REGISTRATION",
      metadata: {
        cacNumber: cacNumber || undefined,
        companyWebsite: companyWebsite || undefined,
        corporateEmail: corporateEmail || undefined,
      },
      file: businessDoc,
    })
    if (ok) setBusinessDoc(null)
  }

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const progressPercent = (level / 4) * 100

  const getOptionStatus = (docType: string) => {
    const matches = submissions.filter((s) => s?.documentType === docType)
    const latest = matches.length
      ? [...matches].sort((a, b) => {
          const ta = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
          const tb = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
          return tb - ta
        })[0]
      : null
    if (!latest) return "NOT_STARTED"
    const st = String(latest.status || "").toUpperCase()
    if (st === "APPROVED") return "APPROVED"
    if (st === "REJECTED") return "REJECTED"
    if (st === "REQUEST_INFO") return "MORE_INFO_REQUIRED"
    if (st === "PENDING") return "UNDER_REVIEW"
    return "UNDER_REVIEW"
  }

  let nextStepDescription = ""
  if (level === 0) {
    nextStepDescription = "Verify your email address and start adding basic company details."
  } else if (level < 2 && !identityVerified) {
    nextStepDescription = "Submit a government ID to verify your identity."
  } else if (!businessVerified) {
    nextStepDescription = "Submit your CAC or business registration details to verify your business."
  } else if (!enterpriseVerified) {
    nextStepDescription =
      "Request enterprise verification if you represent a larger organization or brand."
  } else {
    nextStepDescription =
      "Your account is fully verified. Keep your profile and company details up to date."
  }

  return (
    <DashboardPageContainer>
      <DashboardHeader
        title="Complete Verification"
        description="Build a trusted, verifiable profile that gives buyers and partners confidence when they do business with you."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Verification" }]}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              Why verification matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Verification turns your PrintMarket NG presence into a strong trust signal for serious
              buyers, distributors, and partners. Verified companies are more likely to be shortlisted
              and receive higher quality inquiries.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">Verified badge on your profile</p>
                  <p className="text-xs text-muted-foreground">
                    Stand out in search results, listings, and ongoing conversations.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileCheck className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">Stronger trust in agreements</p>
                  <p className="text-xs text-muted-foreground">
                    Give partners confidence when moving from inquiry to formal agreement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ArrowUpRight className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">Better visibility on the platform</p>
                  <p className="text-xs text-muted-foreground">
                    Verified sellers surface more prominently across marketplace experiences.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">Stronger company credibility</p>
                  <p className="text-xs text-muted-foreground">
                    Present your company as a serious, verifiable partner to local and international clients.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Current status
            </span>
            <StatusBadge
              status={
                identityVerified || businessVerified || enterpriseVerified
                  ? level >= 4
                    ? "ENTERPRISE_VERIFIED"
                    : level >= 2
                      ? "VERIFIED"
                      : "UNDER_REVIEW"
                  : "UNVERIFIED"
              }
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Verification is optional, but highly recommended for companies that want to win larger,
            higher-trust work.
          </p>
        </div>
      </div>

      <Card className="rounded-xl border border-border shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="rounded-lg bg-muted/80 p-2">
              <Shield className="h-4 w-4 text-muted-foreground" aria-hidden />
            </span>
            Your verification level
          </CardTitle>
          <CardDescription>
            Higher verification increases trust. Verification is optional but recommended for
            companies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="h-10 rounded bg-muted animate-pulse" />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{LEVEL_LABELS[level]}</span>
                <Badge variant={level >= 2 ? "default" : "secondary"}>Level {level}</Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    {level >= 1 ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    Email verified
                  </li>
                  <li className="flex items-center gap-2">
                    {identityVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    Identity verified
                  </li>
                  <li className="flex items-center gap-2">
                    {businessVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    Business verified
                  </li>
                  <li className="flex items-center gap-2">
                    {enterpriseVerified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="w-4" />
                    )}
                    Enterprise verified
                  </li>
                </ul>
                <div className="md:w-64">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                    Next recommended step
                  </p>
                  <p className="text-xs text-muted-foreground">{nextStepDescription}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <Tabs defaultValue="local" className="space-y-6">
            <TabsList className="rounded-lg p-1 bg-muted/50">
              <TabsTrigger value="local" className="rounded-md">
                <MapPin className="h-4 w-4 mr-2" />
                Local (Nigeria)
              </TabsTrigger>
              <TabsTrigger value="international" className="rounded-md">
                <Globe className="h-4 w-4 mr-2" />
                International
              </TabsTrigger>
            </TabsList>

            <TabsContent value="local" className="space-y-6 mt-0">
              <Card className="rounded-xl border border-border bg-muted/25 shadow-none">
                <CardContent className="py-4 text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Recommended path for Nigerian companies</p>
                  <p>
                    Start with your CAC registration, then add a government ID. If you are a printer with
                    CIPPON membership, add it as an additional trust signal.
                  </p>
                  <p className="text-xs">
                    You do not need every option completed to benefit from verification—each approved item
                    improves your trust profile.
                  </p>
                </CardContent>
              </Card>

              <VerificationOptionCard
                title="CAC registration"
                description="Submit your Corporate Affairs Commission (CAC) registration certificate or number to verify your business in Nigeria."
                status={
                  businessVerified ? "APPROVED" : getOptionStatus("CAC_REGISTRATION")
                }
                actionLabel="Submit for Review"
                onAction={async () => {
                  if (!cacNumber && !businessDoc) {
                    toast({
                      title: "Missing details",
                      description: "Add your CAC number or upload a CAC document to continue.",
                      variant: "destructive",
                    })
                    return
                  }
                  const ok = await submitVerification({
                    verificationType: "BUSINESS",
                    documentType: "CAC_REGISTRATION",
                    metadata: { cacNumber: cacNumber || undefined },
                    file: businessDoc,
                  })
                  if (ok) setBusinessDoc(null)
                }}
                showUpload
                uploadValue={businessDoc}
                onUploadChange={setBusinessDoc}
                disabled={submitting}
              >
                <div className="space-y-2">
                  <Label>CAC registration number</Label>
                  <Input
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    placeholder="RC 123456"
                  />
                </div>
              </VerificationOptionCard>

              <VerificationOptionCard
                title="CIPPON membership"
                description="If you are a member of the Chartered Institute of Professional Printers of Nigeria (CIPPON), add your membership details."
                status={getOptionStatus("CIPPON_MEMBERSHIP")}
                actionLabel="Submit Membership Details"
                onAction={async () => {
                  if (!cipponId) {
                    toast({
                      title: "Missing details",
                      description: "Please enter your CIPPON member ID to continue.",
                      variant: "destructive",
                    })
                    return
                  }
                  await submitVerification({
                    verificationType: "BUSINESS",
                    documentType: "CIPPON_MEMBERSHIP",
                    metadata: { cipponId },
                  })
                }}
                disabled={submitting}
              >
                <div className="space-y-2">
                  <Label>CIPPON member ID (optional)</Label>
                  <Input
                    value={cipponId}
                    onChange={(e) => setCipponId(e.target.value)}
                    placeholder="CIPPON ID"
                  />
                </div>
              </VerificationOptionCard>

              <VerificationOptionCard
                title="Government ID"
                description="Upload a valid government-issued ID (e.g. national ID, driver's licence, international passport) for identity verification."
                status={
                  identityVerified ? "APPROVED" : getOptionStatus("GOVERNMENT_ID")
                }
                actionLabel="Verify Identity"
                onAction={() => handleSubmitIdentity()}
                showUpload
                uploadValue={identityDoc}
                onUploadChange={setIdentityDoc}
                disabled={submitting}
              />
            </TabsContent>

            <TabsContent value="international" className="space-y-6 mt-0">
              <Card className="rounded-xl border border-border bg-muted/25 shadow-none">
                <CardContent className="py-4 text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Recommended path for international firms</p>
                  <p>
                    Start with your official business registration document, then add a corporate email
                    domain and optional website verification.
                  </p>
                  <p className="text-xs">
                    You can begin building trust as soon as one method is approved—additional methods
                    simply strengthen your profile.
                  </p>
                </CardContent>
              </Card>

              <VerificationOptionCard
                title="Business registration document"
                description="Upload an official business registration or incorporation document from your country (PDF or image)."
                status={businessVerified ? "APPROVED" : getOptionStatus("BUSINESS_REGISTRATION")}
                actionLabel="Verify Business"
                onAction={async () => {
                  if (!businessDoc) {
                    toast({
                      title: "Missing document",
                      description: "Please upload your business registration document to continue.",
                      variant: "destructive",
                    })
                    return
                  }
                  const ok = await submitVerification({
                    verificationType: "BUSINESS",
                    documentType: "BUSINESS_REGISTRATION",
                    file: businessDoc,
                  })
                  if (ok) setBusinessDoc(null)
                }}
                showUpload
                uploadValue={businessDoc}
                onUploadChange={setBusinessDoc}
                disabled={submitting}
              />

              <VerificationOptionCard
                title="Corporate email domain"
                description="Verify your company email domain (e.g. @yourcompany.com) to confirm affiliation with your organization."
                status={
                  businessVerified ? "APPROVED" : getOptionStatus("CORPORATE_EMAIL")
                }
                actionLabel="Submit for Review"
                onAction={async () => {
                  if (!corporateEmail) {
                    toast({
                      title: "Missing details",
                      description: "Please enter a corporate email address to continue.",
                      variant: "destructive",
                    })
                    return
                  }
                  await submitVerification({
                    verificationType: "BUSINESS",
                    documentType: "CORPORATE_EMAIL",
                    metadata: { corporateEmail },
                  })
                }}
                disabled={submitting}
              >
                <div className="space-y-2">
                  <Label>Corporate email</Label>
                  <Input
                    type="email"
                    value={corporateEmail}
                    onChange={(e) => setCorporateEmail(e.target.value)}
                    placeholder="name@company.com"
                  />
                </div>
              </VerificationOptionCard>

              <VerificationOptionCard
                title="Company website verification"
                description="Add your company website. We may use it to cross-check your business details."
                status={
                  businessVerified ? "APPROVED" : getOptionStatus("COMPANY_WEBSITE")
                }
                actionLabel="Submit for Review"
                onAction={async () => {
                  if (!companyWebsite) {
                    toast({
                      title: "Missing details",
                      description: "Please enter your company website to continue.",
                      variant: "destructive",
                    })
                    return
                  }
                  await submitVerification({
                    verificationType: "BUSINESS",
                    documentType: "COMPANY_WEBSITE",
                    metadata: { companyWebsite },
                  })
                }}
                disabled={submitting}
              >
                <div className="space-y-2">
                  <Label>Company website</Label>
                  <Input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </VerificationOptionCard>
            </TabsContent>
          </Tabs>

          <Card className="rounded-xl border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Enterprise verification
              </CardTitle>
              <CardDescription>
                A premium verification pathway for larger organizations, OEMs, and brands that need a
                deeper level of trust and due diligence on PrintMarket NG.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground mb-4">
                <p>
                  Enterprise verification may include enhanced document checks, reference validation,
                  and closer collaboration with the PrintMarket NG team.
                </p>
                <p>
                  It is recommended for manufacturers, large distributors, and organizations that want
                  to signal strong reliability to high-value buyers.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="font-semibold">
                <Link href="/contact?topic=enterprise-verification">
                  Request Enterprise Verification
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:order-last">
          <VerificationSupportPanel />
        </div>
      </div>
    </DashboardPageContainer>
  )
}
