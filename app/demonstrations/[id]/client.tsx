"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  Crown,
  ExternalLink,
  Globe,
  Info,
  Lightbulb,
  Loader2,
  MapPin,
  MessageSquare,
  MonitorPlay,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { TrackView } from "@/components/analytics/track-view"
import { loginWithCallback } from "@/lib/auth-urls"
import { LoginPromptDialog } from "@/components/auth/login-prompt-dialog"

interface DemoManufacturer {
  id: string
  name: string | null
  companyName: string | null
  image: string | null
  isVerified: boolean
  location: string | null
}

/** Aligns with Prisma `DemoStatus` */
type DemoStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "LIVE"
  | "COMPLETED"
  | "PENDING"
  | "REJECTED"

interface DemoDetail {
  id: string
  title: string
  description: string
  videoUrl: string | null
  schedule: string
  price: number
  isPaid: boolean
  status: DemoStatus
  category: string
  location: string | null
  maxAttendees: number | null
  metadata: string | null
  headerImage: string | null
  manufacturerId: string
  manufacturer: DemoManufacturer
  hasPendingUpdateRequest?: boolean
  pendingUpdateCount?: number
}

interface ParsedMetadata {
  gallery?: string[]
  topics?: string[]
  requirements?: string[]
  benefits?: string[]
}

interface DemoDetailPageClientProps {
  id: string
}

export function DemoDetailPageClient({ id }: DemoDetailPageClientProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [demo, setDemo] = useState<DemoDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const isOwner = Boolean(demo && session?.user?.id === demo.manufacturerId)

  const registerReturnPath = `/demonstrations/${id}?action=register`
  const messagesPath = `/messages?context=demo-${id}`
  const contactHostHref = session ? messagesPath : loginWithCallback(messagesPath)

  const openRegisterInterest = () => {
    if (!session) {
      setShowLoginPrompt(true)
      return
    }
    setShowRegistrationModal(true)
  }

  useEffect(() => {
    if (!demo || isOwner) return
    if (searchParams.get("action") !== "register") return
    if (!session) {
      setShowLoginPrompt(true)
      return
    }
    setShowRegistrationModal(true)
  }, [demo, session, isOwner, searchParams])

  const parsedMetadata: ParsedMetadata = useMemo(() => {
    if (!demo?.metadata) return {}
    try {
      const raw = JSON.parse(demo.metadata) as ParsedMetadata
      return raw || {}
    } catch {
      return {}
    }
  }, [demo?.metadata])

  const gallery = useMemo(() => {
    if (!demo) return []
    const metaGallery = Array.isArray(parsedMetadata.gallery) ? parsedMetadata.gallery : []
    const all = [demo.headerImage, ...metaGallery].filter((v): v is string => Boolean(v))
    return Array.from(new Set(all))
  }, [demo, parsedMetadata.gallery])

  const youtubeEmbedUrl = useMemo(() => {
    const url = demo?.videoUrl
    if (!url) return null
    if (url.includes("youtube.com/embed/")) return url
    const watch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/i)
    if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`
    return null
  }, [demo?.videoUrl])

  const hasSessionMedia = Boolean(demo?.videoUrl)
  const hasEmbeddableVideo = Boolean(youtubeEmbedUrl)

  const heroVisual = selectedImage || gallery[0] || "/images/Canon-pixma-2 1.png"

  useEffect(() => {
    let cancelled = false
    async function loadDemo() {
      setIsLoading(true)
      setLoadError(null)
      try {
        const res = await fetch(`/api/demos/${id}`, { cache: "no-store" })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data?.error || "Failed to load demonstration")
        }
        const data = (await res.json()) as DemoDetail
        if (!cancelled) {
          setDemo(data)
          let firstGallery: string | null = null
          try {
            if (data.metadata) {
              const parsed = JSON.parse(data.metadata) as ParsedMetadata
              firstGallery = parsed?.gallery?.[0] || null
            }
          } catch {
            // Ignore parse issues; fallback below.
          }
          setSelectedImage(data.headerImage || firstGallery || null)
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load demonstration"
          setLoadError(message)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadDemo()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleRegister = async () => {
    if (!session) {
      router.push(loginWithCallback(registerReturnPath))
      return
    }

    setRegistrationStatus("loading")
    setIsRegistering(true)

    try {
      const res = await fetch(`/api/demos/${id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "REGISTER_INTEREST" }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Failed to register interest")
      }

      setIsRegistered(true)
      setRegistrationStatus("success")

      setTimeout(() => {
        setShowRegistrationModal(false)
        setRegistrationStatus("idle")
      }, 1500)

      toast({
        title: "Interest registered",
        description: "The host will be able to see your interest in this demonstration.",
      })
    } catch (error) {
      console.error("Error registering interest for demonstration:", error)
      setRegistrationStatus("error")
      toast({
        title: "Could not register interest",
        description: "There was an issue capturing your interest. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const primaryImage = selectedImage || gallery[0] || "/images/Canon-pixma-2 1.png"
  const scheduleDate = new Date(demo?.schedule || new Date().toISOString())
  const manufacturerName = demo?.manufacturer.companyName || demo?.manufacturer.name || "Host company"

  const statusLabel = (status: DemoStatus) => {
    if (status === "APPROVED") return "Approved"
    if (status === "SCHEDULED") return "Scheduled"
    if (status === "LIVE") return "Live now"
    if (status === "COMPLETED") return "Completed"
    if (status === "UNDER_REVIEW") return "Under review"
    if (status === "SUBMITTED") return "Submitted"
    if (status === "DRAFT") return "Draft"
    if (status === "REJECTED") return "Rejected"
    return "Pending"
  }

  const statusTone = (status: DemoStatus) => {
    if (status === "LIVE") return "bg-emerald-100 text-emerald-800 border-emerald-200"
    if (status === "SCHEDULED") return "bg-violet-100 text-violet-800 border-violet-200"
    if (status === "APPROVED") return "bg-blue-100 text-blue-800 border-blue-200"
    if (status === "COMPLETED") return "bg-slate-100 text-slate-800 border-slate-200"
    if (status === "REJECTED") return "bg-red-100 text-red-800 border-red-200"
    return "bg-amber-100 text-amber-900 border-amber-200"
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!demo || loadError) {
    return (
      <div className="w-full py-10 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">
          {loadError || "This demonstration could not be found."}
        </p>
        <Button variant="outline" asChild>
          <Link href="/demonstrations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to demonstrations
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <TrackView eventType="demo_view" demoId={id} />
      <div className="w-full py-6 lg:py-8 space-y-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demonstrations">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to weekly demonstrations
                </Link>
              </Button>
            </div>

            {/* Compact summary header */}
            <section className="rounded-xl border bg-card p-5 md:p-6">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{demo.category}</Badge>
                    <Badge className={`border ${statusTone(demo.status)}`}>{statusLabel(demo.status)}</Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Crown className="h-3.5 w-3.5" />
                      Curated weekly spotlight
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">{demo.title}</h1>
                    <p className="text-muted-foreground text-base leading-relaxed">
                      Curated weekly live demonstration for print and manufacturing teams.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <div className="inline-flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      {scheduleDate.toLocaleDateString()}
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-1.5">
                      <Clock className="h-4 w-4 text-primary" />
                      {scheduleDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    {demo.location ? (
                      <div className="inline-flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {demo.location}
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-lg border bg-background px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={demo.manufacturer.image || undefined} alt={manufacturerName} />
                        <AvatarFallback>{manufacturerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{manufacturerName}</p>
                        <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                          {demo.manufacturer.isVerified ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Verified host
                            </span>
                          ) : (
                            <span>Host profile</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {isOwner ? (
                    <>
                      <Button asChild>
                        <Link href={`/demonstrations/${id}/edit`}>
                          {demo.status === "APPROVED" ||
                          demo.status === "SCHEDULED" ||
                          demo.status === "COMPLETED" ||
                          demo.status === "LIVE"
                            ? "Request changes"
                            : "Manage demo"}
                        </Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href={`/demonstrations/${id}/leads`}>View leads</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isRegistered || isRegistering}
                        onClick={openRegisterInterest}
                      >
                        {isRegistered ? "Access secured" : "Reserve your spot"}
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/marketplace/vendor/${demo.manufacturer.id}`}>View company</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Primary video/session block */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Session media</h2>
                <p className="text-xs text-muted-foreground">Primary preview for this weekly session</p>
              </div>
              <Card className="overflow-hidden border-border/80 shadow-sm">
                <CardContent className="p-0">
                  <div className="relative aspect-video w-full bg-muted/30">
                    {hasEmbeddableVideo ? (
                      <iframe
                        src={youtubeEmbedUrl!}
                        title={`${demo.title} session media`}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <>
                        <Image src={heroVisual} alt={demo.title} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/45" />
                        <div className="absolute inset-0 flex items-center justify-center p-6">
                          <div className="max-w-md rounded-xl border border-white/30 bg-black/60 px-4 py-3 text-center text-white">
                            <p className="inline-flex items-center justify-center gap-2 text-sm font-medium">
                              <MonitorPlay className="h-4 w-4" />
                              {hasSessionMedia ? "Preview unavailable" : "Session media pending"}
                            </p>
                            <p className="mt-2 text-xs text-white/80">
                              {hasSessionMedia
                                ? "This media URL is not embeddable yet. You can still reserve access and request full session details from the host."
                                : "Host video preview has not been published yet. Reserve your spot to receive access details."}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
              <div className="space-y-8">
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight">About this demonstration</h2>
                  <Card className="border-border/80 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="space-y-4 text-muted-foreground leading-relaxed">
                        {demo.description.split("\n\n").map((paragraph, idx) => (
                          <p key={idx}>{paragraph}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {parsedMetadata.topics?.length ? (
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">What you'll experience</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {parsedMetadata.topics.map((topic, idx) => (
                        <Card key={`${topic}-${idx}`} className="border-border/80">
                          <CardContent className="pt-4">
                            <p className="inline-flex items-start gap-2 text-sm">
                              <BookOpen className="mt-0.5 h-4 w-4 text-primary" />
                              <span>{topic}</span>
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                ) : null}

                {parsedMetadata.benefits?.length ? (
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">Key outcomes</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {parsedMetadata.benefits.map((benefit, idx) => (
                        <Card key={`${benefit}-${idx}`} className="border-emerald-200/60 bg-emerald-50/40">
                          <CardContent className="pt-4">
                            <p className="inline-flex items-start gap-2 text-sm">
                              <Check className="mt-0.5 h-4 w-4 text-emerald-600" />
                              <span>{benefit}</span>
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                ) : null}

                {parsedMetadata.requirements?.length ? (
                  <section className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">Requirements</h2>
                    <div className="grid gap-3">
                      {parsedMetadata.requirements.map((requirement, idx) => (
                        <Card key={`${requirement}-${idx}`}>
                          <CardContent className="pt-4">
                            <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                              <Info className="mt-0.5 h-4 w-4 text-blue-600" />
                              <span>{requirement}</span>
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                ) : null}

                <section>
                  <Card className="border-primary/30 bg-gradient-to-br from-primary/[0.06] to-background">
                    <CardHeader>
                      <CardTitle className="inline-flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-primary" />
                        Why this matters
                      </CardTitle>
                      <CardDescription>
                        This weekly spotlight helps print businesses reduce guesswork and evaluate production outcomes with confidence.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Teams often make expensive equipment and process decisions without seeing practical live context. This session
                        closes that gap by showing implementation detail, expected output quality, and workflow constraints.
                      </p>
                      <p>
                        For procurement, operations, and technical leads, it provides a credible basis for faster decision-making and
                        better vendor conversations.
                      </p>
                    </CardContent>
                  </Card>
                </section>

                <section className="space-y-4">
                  <h2 className="text-xl font-semibold tracking-tight">About the host</h2>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={demo.manufacturer.image || undefined} alt={manufacturerName} />
                          <AvatarFallback>{manufacturerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{manufacturerName}</p>
                          <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                            {demo.manufacturer.isVerified ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Verified on PrintMarket NG
                              </span>
                            ) : (
                              "PrintMarket NG host"
                            )}
                          </p>
                        </div>
                      </div>
                      {demo.manufacturer.location ? (
                        <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          {demo.manufacturer.location}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                          <Link href={`/marketplace/vendor/${demo.manufacturer.id}`}>
                            <Globe className="mr-2 h-4 w-4" />
                            View company profile
                          </Link>
                        </Button>
                        <Button asChild variant="ghost">
                          <Link href={contactHostHref}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact host
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Related listings</CardTitle>
                      <CardDescription>Continue from live demonstration to product and vendor evaluation.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild variant="outline">
                        <Link href={`/marketplace/vendor/${demo.manufacturer.id}?tab=listings`}>
                          View listings from {manufacturerName}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </section>
              </div>

              <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
                <Card className="border-border/80 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Session access</CardTitle>
                    <CardDescription>Premium live demonstration by curated host.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-semibold text-primary">
                      {demo.isPaid ? `₦${demo.price.toLocaleString()}` : "Free access"}
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{scheduleDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Time</span>
                        <span className="font-medium">
                          {scheduleDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {demo.maxAttendees ? (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Capacity</span>
                          <span className="font-medium inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {demo.maxAttendees}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Host</span>
                        <span className="font-medium truncate max-w-[180px]">{manufacturerName}</span>
                      </div>
                    </div>
                    <Separator />
                    {!isOwner ? (
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          disabled={isRegistered || isRegistering}
                          onClick={openRegisterInterest}
                        >
                          {isRegistering ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Securing access...
                            </>
                          ) : isRegistered ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Access secured
                            </>
                          ) : (
                            "Secure access"
                          )}
                        </Button>
                        <Button className="w-full" variant="outline" asChild>
                          <Link href={contactHostHref}>Contact host</Link>
                        </Button>
                        <Button className="w-full" variant="ghost" asChild>
                          <Link href={`/marketplace/vendor/${demo.manufacturer.id}`}>View company</Link>
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          High-demand topic · Limited capacity · Host verified by PrintMarket NG
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {demo.hasPendingUpdateRequest ? (
                          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                            Changes pending approval ({demo.pendingUpdateCount || 1})
                          </div>
                        ) : null}
                        <Button className="w-full" asChild>
                          <Link href={`/demonstrations/${id}/edit`}>
                            {demo.status === "APPROVED" ||
                            demo.status === "SCHEDULED" ||
                            demo.status === "COMPLETED" ||
                            demo.status === "LIVE"
                              ? "Request changes"
                              : "Manage demo setup"}
                          </Link>
                        </Button>
                        <Button className="w-full" variant="outline" asChild>
                          <Link href={`/demonstrations/${id}/leads`}>Open leads</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
      </div>

        <LoginPromptDialog
          open={showLoginPrompt}
          onOpenChange={setShowLoginPrompt}
          returnTo={registerReturnPath}
          title="Sign in to register interest"
          description="Create an account or sign in to register your interest in this demonstration. You'll return to this page after signing in."
        />

        {/* Registration / interest modal */}
        {!isOwner && (
          <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register interest in this demonstration</DialogTitle>
                <DialogDescription>
                  You are registering your interest in &quot;{demo.title}&quot; hosted by{" "}
                  {manufacturerName}. The host may follow up with you to share details and next steps.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {registrationStatus === "success" ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <div className="rounded-full bg-green-100 p-3">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-green-600">Interest registered</h3>
                    <p className="text-center text-sm text-gray-500">
                      Your interest has been captured. The host company can now see you as a potential attendee.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      By registering interest, you:
                    </p>
                    <ul className="mt-2 text-sm text-gray-700 space-y-2">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Signal that you want to join this demonstration
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Make it easier for the host to follow up with you
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Help PrintMarket NG understand demand for this topic
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <DialogFooter>
                {registrationStatus === "loading" ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </Button>
                ) : registrationStatus === "success" ? (
                  <Button variant="ghost" onClick={() => setShowRegistrationModal(false)}>
                    Close
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => setShowRegistrationModal(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRegister}>
                      Confirm registration of interest
                    </Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
    </>
  )
}