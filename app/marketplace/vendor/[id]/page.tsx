"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"
import { LoginModal } from "@/components/auth/login-modal"
import { ProductCard } from "@/components/marketplace/product-card"
import { VerifiedBadge } from "@/components/verified-badge"
import { TrackView } from "@/components/analytics/track-view"
import { RichText } from "@/components/shared/rich-text"
import {
  Award,
  Building2,
  ExternalLink,
  FileText,
  Globe,
  Image as ImageIcon,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Star,
  SquarePen,
  Twitter,
  Users,
  Video,
} from "lucide-react"

interface PageParams {
  id: string
}

interface VendorData {
  id: string
  name?: string | null
  companyName?: string | null
  role?: string | null
  location?: string | null
  cityState?: string | null
  country?: string | null
  image?: string | null
  logo?: string | null
  email?: string | null
  phone?: string | null
  bio?: string | null
  videoUrl?: string | null
  videoDescription?: string | null
  gallery?: string[] | null
  companyWebsite?: string | null
  linkedinUrl?: string | null
  twitterUrl?: string | null
  isVerified?: boolean
  hasCipponMembership?: boolean
  cipponMembershipType?: string | null
  cipponMembershipNumber?: string | null
  productCount?: number | null
  completedProjects?: number | null
  activeClients?: number | null
  satisfactionRate?: number | null
  specialties?: string[] | null
  certifications?: string[] | null
  yearsInBusiness?: number | null
  teamSize?: string | null
}

interface VendorListing {
  id: string
  title: string
  description?: string | null
  category?: { name: string; slug: string } | null
  images?: string[] | null
  location?: string | null
  condition?: string | null
  owner?: {
    name?: string | null
    companyName?: string | null
    isVerified?: boolean
  } | null
}

function formatRoleLabel(role?: string | null) {
  if (!role) return ""
  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function getDisplayName(vendor: VendorData | null) {
  if (!vendor) return "Company"
  return vendor.companyName || vendor.name || "Company"
}

function getLocationLabel(vendor: VendorData | null) {
  if (!vendor) return ""
  return vendor.location || vendor.cityState || vendor.country || ""
}

function getPrimaryImage(vendor: VendorData | null) {
  return vendor?.logo || vendor?.image || "/placeholder-user.jpg"
}

function isYoutubeOrVimeo(url?: string | null) {
  if (!url) return false
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url)
}

function toEmbedUrl(url?: string | null) {
  if (!url) return ""
  const youtube = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\\s]{11})/)
  if (youtube) return `https://www.youtube.com/embed/${youtube[1]}`
  const vimeo = url.match(/(?:vimeo\.com\/)(?:.*\/)?(\d+)/)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

export default function VendorProfilePage({
  params,
}: {
  params: Promise<PageParams> | PageParams
}) {
  const router = useRouter()
  const { data: session } = useSession()
  const resolvedParams = use(params as Promise<PageParams>)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginCallbackUrl, setLoginCallbackUrl] = useState<string | undefined>()
  const [vendor, setVendor] = useState<VendorData | null>(null)
  const [listings, setListings] = useState<VendorListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [listingsLoading, setListingsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true)
        setListingsLoading(true)
        setError(null)

        const [vendorResponse, listingsResponse] = await Promise.all([
          fetch(`/api/vendors/${resolvedParams.id}`),
          fetch(`/api/products?ownerId=${resolvedParams.id}&limit=12`),
        ])

        if (!vendorResponse.ok) {
          throw new Error("Failed to load company profile")
        }

        const vendorData = (await vendorResponse.json()) as VendorData
        setVendor(vendorData)

        if (listingsResponse.ok) {
          const listingsData = await listingsResponse.json()
          setListings(Array.isArray(listingsData?.data) ? listingsData.data : [])
        } else {
          setListings([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load company profile")
      } finally {
        setIsLoading(false)
        setListingsLoading(false)
      }
    }

    if (resolvedParams.id) {
      loadPage()
    }
  }, [resolvedParams.id])

  const handleContactCompany = () => {
    if (!session) {
      setLoginCallbackUrl(`/messages/${resolvedParams.id}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/messages/${resolvedParams.id}`)
  }

  const handleCreateAgreement = () => {
    if (!session) {
      setLoginCallbackUrl(`/agreements/new?recipient=${resolvedParams.id}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/agreements/new?recipient=${resolvedParams.id}`)
  }

  const displayName = getDisplayName(vendor)
  const locationLabel = getLocationLabel(vendor)
  const primaryImage = getPrimaryImage(vendor)
  const gallery = Array.isArray(vendor?.gallery) ? vendor?.gallery : []
  const specialties = Array.isArray(vendor?.specialties) ? vendor.specialties : []
  const certifications = Array.isArray(vendor?.certifications) ? vendor.certifications : []
  const roleLabel = formatRoleLabel(vendor?.role)
  const isOwner = (session?.user as any)?.id === resolvedParams.id

  const stats = useMemo(
    () =>
      [
        {
          label: "Listings Published",
          value: vendor?.productCount ?? listings.length,
          icon: FileText,
        },
        {
          label: "Completed Projects",
          value: vendor?.completedProjects ?? 0,
          icon: Award,
        },
        {
          label: "Active Clients",
          value: vendor?.activeClients ?? 0,
          icon: Users,
        },
        {
          label: "Satisfaction Rate",
          value: vendor?.satisfactionRate != null ? `${vendor.satisfactionRate}%` : "—",
          icon: Star,
        },
      ],
    [vendor, listings.length]
  )

  if (isLoading) {
  return (
      <div className="flex min-h-screen flex-col bg-muted/30">
          <MainNav />
        <main className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <Skeleton className="h-28 w-28 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-5 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:w-[220px]">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-24 rounded-xl" />
              ))}
          </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="space-y-4">
                <Skeleton className="h-11 rounded-xl" />
                <Skeleton className="h-80 rounded-xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-56 rounded-xl" />
                <Skeleton className="h-56 rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !vendor) {
    return (
      <div className="flex min-h-screen flex-col bg-muted/30">
        <MainNav />
        <main className="flex flex-1 items-center justify-center pt-16">
          <Card className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm">
            <CardContent className="flex flex-col items-center px-6 py-10 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/60" aria-hidden />
              <h1 className="mt-4 text-xl font-semibold text-foreground">Company profile unavailable</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {error || "The company profile you are looking for could not be found."}
              </p>
              <Button className="mt-6" asChild>
                <Link href="/marketplace">Back to marketplace</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <TrackView eventType="vendor_profile_view" vendorId={resolvedParams.id} />
      <MainNav />

      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-border bg-muted">
                    <Image
                      src={primaryImage}
                      alt={displayName}
                      fill
                      className="object-contain p-3"
                      sizes="96px"
                    />
                  </div>
                  <div className="min-w-0 space-y-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{displayName}</h1>
                        {vendor.isVerified ? (
                          <VerifiedBadge verified level="company" />
                        ) : null}
                        {vendor.hasCipponMembership ? (
                          <Badge variant="outline" className="rounded-full">
                            <Award className="mr-1.5 h-3.5 w-3.5" aria-hidden />
                            CIPPON Member
                          </Badge>
                        ) : null}
                      </div>
                      {locationLabel ? (
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                          {locationLabel}
                        </p>
                      ) : null}
                      </div>

                    <div className="flex flex-wrap gap-2">
                      {roleLabel ? <Badge variant="secondary">{roleLabel}</Badge> : null}
                      {specialties.slice(0, 3).map((specialty) => (
                        <Badge key={specialty} variant="outline" className="rounded-full">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto lg:ml-auto lg:min-w-[220px]">
                  {isOwner ? (
                    <>
                      <Button onClick={() => router.push("/marketplace/vendor/setup")} className="w-full">
                        <SquarePen className="mr-2 h-4 w-4" aria-hidden />
                        Edit Profile
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/dashboard/listings")} className="w-full">
                        <FileText className="mr-2 h-4 w-4" aria-hidden />
                        Manage Listings
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/messages")} className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
                        View Messages
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={handleContactCompany} className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
                        Contact Company
                      </Button>
                      <Button variant="outline" onClick={handleCreateAgreement} className="w-full">
                        <FileText className="mr-2 h-4 w-4" aria-hidden />
                        Create Agreement
                      </Button>
                    </>
                  )}
                  {vendor.companyWebsite ? (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={vendor.companyWebsite} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" aria-hidden />
                        Visit Website
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label} className="rounded-xl border border-border bg-card shadow-sm">
                    <CardContent className="flex items-center gap-4 p-5">
                      <div className="rounded-xl bg-muted p-3">
                        <Icon className="h-5 w-5 text-muted-foreground" aria-hidden />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
              <section className="min-w-0">
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 rounded-xl border border-border bg-card p-1 shadow-sm">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="listings">Listings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <Card className="rounded-xl border border-border bg-card shadow-sm">
                      <CardHeader>
                        <CardTitle>Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {vendor.bio ? (
                          <RichText html={vendor.bio} className="text-sm text-muted-foreground" />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            This company has not added an overview yet.
                          </p>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Company role</p>
                            <p className="text-sm font-medium text-foreground">{roleLabel || "Not specified"}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Location</p>
                            <p className="text-sm font-medium text-foreground">{locationLabel || "Not specified"}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Years in business</p>
                            <p className="text-sm font-medium text-foreground">
                              {vendor.yearsInBusiness ? `${vendor.yearsInBusiness} years` : "Not specified"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">Team size</p>
                            <p className="text-sm font-medium text-foreground">
                              {vendor.teamSize ? `${vendor.teamSize} employees` : "Not specified"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {(specialties.length > 0 || certifications.length > 0) && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card className="rounded-xl border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-base">Specialties</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {specialties.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {specialties.map((specialty) => (
                                  <Badge key={specialty} variant="outline" className="rounded-full">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No specialties listed yet.</p>
                            )}
                          </CardContent>
                        </Card>

                        <Card className="rounded-xl border border-border bg-card shadow-sm">
                          <CardHeader>
                            <CardTitle className="text-base">Credentials</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {certifications.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {certifications.map((item) => (
                                  <Badge key={item} variant="secondary" className="rounded-full">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No credentials listed yet.</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="media" className="space-y-6">
                    <Card className="rounded-xl border border-border bg-card shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Video className="h-4 w-4" aria-hidden />
                          Company Video
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {vendor.videoUrl ? (
                          <>
                            <div className="overflow-hidden rounded-xl border border-border bg-muted">
                              <div className="aspect-video">
                                {isYoutubeOrVimeo(vendor.videoUrl) ? (
                                  <iframe
                                    src={toEmbedUrl(vendor.videoUrl)}
                                    className="h-full w-full"
                                    title={`${displayName} company video`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : (
                                  <video
                                    src={vendor.videoUrl}
                                    className="h-full w-full object-contain bg-black"
                                    controls
                                    poster="/images/video-poster.jpg"
                                  />
                    )}
                  </div>
                </div>
                            {vendor.videoDescription ? (
                              <RichText html={vendor.videoDescription} className="text-sm text-muted-foreground" />
                            ) : null}
                          </>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                            <Video className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden />
                            <p className="mt-3 text-sm font-medium text-foreground">No company video available</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Supporting media and company visuals will appear here when available.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="rounded-xl border border-border bg-card shadow-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" aria-hidden />
                          Company Gallery
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {gallery.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {gallery.map((image, index) => (
                              <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted">
                        <Image
                          src={image}
                                  alt={`${displayName} gallery image ${index + 1}`}
                          fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden />
                            <p className="mt-3 text-sm font-medium text-foreground">No company gallery available</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Gallery images will appear here when the company adds supporting visuals.
                            </p>
                </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="listings" className="space-y-6">
                    <Card className="rounded-xl border border-border bg-card shadow-sm">
                      <CardHeader>
                        <CardTitle>Listings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {listingsLoading ? (
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                              <Skeleton key={item} className="h-80 rounded-xl" />
                            ))}
                          </div>
                        ) : listings.length > 0 ? (
                          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {listings.map((listing) => (
                              <ProductCard key={listing.id} product={listing} />
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
                            <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" aria-hidden />
                            <p className="mt-3 text-sm font-medium text-foreground">No listings published yet</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              This company has not published any listings yet. You can still contact them directly to learn more.
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </section>

              <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                <Card className="rounded-xl border border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Company quick facts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    {locationLabel ? (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>{locationLabel}</span>
                      </div>
                    ) : null}
                    {vendor.email ? (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span className="break-all">{vendor.email}</span>
                      </div>
                    ) : null}
                    {vendor.phone ? (
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <span>{vendor.phone}</span>
                      </div>
                    ) : null}
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Building2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      <span>{vendor.productCount ?? listings.length} listings published</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Verification & credentials</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    {vendor.isVerified ? (
                      <div className="flex items-center gap-2">
                        <VerifiedBadge verified level="company" />
                      </div>
                    ) : (
                      <p>Verification status has not been published yet.</p>
                    )}
                    {vendor.hasCipponMembership ? (
                      <div className="rounded-lg border border-border bg-muted/30 p-3">
                        <p className="font-medium text-foreground">CIPPON membership</p>
                        <p className="mt-1">
                          {vendor.cipponMembershipType || "Membership"} {vendor.cipponMembershipNumber ? `• ${vendor.cipponMembershipNumber}` : ""}
                        </p>
                      </div>
                    ) : null}
                    {certifications.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {certifications.slice(0, 4).map((item) => (
                          <Badge key={item} variant="outline" className="rounded-full">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Links & channels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {vendor.companyWebsite ? (
                      <a
                        href={vendor.companyWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Globe className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">Visit Website</span>
                        <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden />
                      </a>
                    ) : null}
                    {vendor.linkedinUrl ? (
                      <a
                        href={vendor.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">LinkedIn</span>
                        <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden />
                      </a>
                    ) : null}
                    {vendor.twitterUrl ? (
                      <a
                        href={vendor.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Twitter className="h-4 w-4 shrink-0" aria-hidden />
                        <span className="truncate">Twitter</span>
                        <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0" aria-hidden />
                      </a>
                    ) : null}
                    {!vendor.companyWebsite && !vendor.linkedinUrl && !vendor.twitterUrl ? (
                      <p className="text-muted-foreground">No public links available yet.</p>
                    ) : null}
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Shield className="h-4 w-4 text-primary" aria-hidden />
                      {isOwner ? "Owner tools" : "Platform guidance"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-muted-foreground">
                    {isOwner ? (
                      <>
                        <p>
                          Manage how your company appears on PrintMarket NG and respond quickly to incoming inquiries from buyers and partners.
                        </p>
                        <div className="flex flex-col gap-2">
                          <Button onClick={() => router.push("/marketplace/vendor/setup")} className="w-full">
                            <SquarePen className="mr-2 h-4 w-4" aria-hidden />
                            Edit Vendor Profile
                          </Button>
                          <Button variant="outline" onClick={() => router.push("/dashboard/listings")} className="w-full">
                            <FileText className="mr-2 h-4 w-4" aria-hidden />
                            Manage Listings
                          </Button>
                          <Button variant="outline" onClick={() => router.push("/messages")} className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
                            View Messages
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>
                          PrintMarket NG can help mediate issues only when an agreement has been created between both parties.
                        </p>
                        <div className="flex flex-col gap-2">
                          <Button onClick={handleContactCompany} className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" aria-hidden />
                            Contact Company
                          </Button>
                          <Button variant="outline" onClick={handleCreateAgreement} className="w-full">
                            <FileText className="mr-2 h-4 w-4" aria-hidden />
                            Create Agreement
                          </Button>
              </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        callbackUrl={loginCallbackUrl}
      />
    </div>
  )
}
