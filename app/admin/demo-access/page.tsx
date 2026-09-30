"use client"

import { useState, useEffect, useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AdminDemoAccessStatusBadge,
  AdminEmptyState,
  AdminErrorState,
  AdminPageContainer,
  AdminPageHeader,
  AdminReviewList,
  AdminSectionCard,
  AdminToolbar,
} from "@/components/admin/admin-page"
import { AdminConfirmDialog } from "@/components/admin/admin-confirm"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Award,
  Users,
  Calendar,
  Link as LinkIcon,
  ExternalLink,
  Sparkles,
  CalendarClock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { DemoAccessApplicationReviewTabs } from "@/components/admin/demo-access-application-review-tabs"

export default function DemoAccessAdminPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [applications, setApplications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [availableDates, setAvailableDates] = useState<any[]>([])
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [rejectUserId, setRejectUserId] = useState<string | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchApplications()
      fetchAvailableDates()
    }
  }, [session, status])

  const fetchAvailableDates = async () => {
    try {
      const response = await fetch("/api/admin/available-demo-dates")
      const data = await response.json()
      if (data.success) {
        setAvailableDates(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching available dates:", error)
    }
  }

  const fetchApplications = async () => {
    try {
      setIsLoading(true)
      setLoadError(false)
      const response = await fetch("/api/admin/demo-access", { cache: "no-store" })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data?.error || "Failed to load applications")
      }
      setApplications(data.data || [])
    } catch (error) {
      console.error("Error fetching applications:", error)
      setLoadError(true)
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (requestId: string, dateId?: string | null) => {
    try {
      const response = await fetch("/api/admin/demo-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          requestId, 
          action: "approve",
          dateId: dateId || null
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to approve")
      }

      toast({
        title: "Approved",
        description: dateId ? "Demo access approved and date assigned" : "Demo access has been approved",
      })

      fetchApplications()
      fetchAvailableDates()
      setSelectedDateId(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch("/api/admin/demo-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, action: "reject" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reject")
      }

      toast({
        title: "Rejected",
        description: "Demo access has been rejected",
      })

      fetchApplications()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject",
        variant: "destructive",
      })
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || app.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const queueStats = useMemo(() => {
    const pending = applications.filter((a) => a.status === "PENDING").length
    const approved = applications.filter((a) => a.status === "APPROVED").length
    const rejected = applications.filter((a) => a.status === "REJECTED").length
    return { pending, approved, rejected, total: applications.length }
  }, [applications])

  const listColumns = [
    { label: "Applicant & company", className: "lg:col-span-4" },
    { label: "Request", className: "lg:col-span-4" },
    { label: "Status", className: "lg:col-span-2" },
    { label: "Actions", className: "lg:col-span-2 lg:text-right" },
  ]

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminPageContainer>
    )
  }

  if (!session || session.user?.role !== "ADMIN") {
    return null
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Demo access applications"
        description="Curation and approval queue for featured live demonstration access — review intent, assign optional slots, and approve or reject."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Demonstrations" },
          { label: "Applications" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/demo-access/dates">
                <CalendarClock className="mr-2 h-4 w-4" />
                Date pool
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/featured-demos">
                <Sparkles className="mr-2 h-4 w-4" />
                Weekly programming
              </Link>
            </Button>
          </div>
        }
      />

      <AdminSectionCard
        title="Queue overview"
        description="Counts reflect the full application set (not only the current filter)."
        headerAction={
          <span className="text-xs text-muted-foreground">
            {queueStats.total} total in system
          </span>
        }
      >
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/50 dark:bg-amber-950/25">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending review</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-amber-950 dark:text-amber-50">{queueStats.pending}</p>
          </div>
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/35 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/25">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approved</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-emerald-950 dark:text-emerald-50">{queueStats.approved}</p>
          </div>
          <div className="rounded-xl border border-border/80 bg-muted/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rejected</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{queueStats.rejected}</p>
          </div>
        </div>
      </AdminSectionCard>

      <AdminToolbar>
        <div className="relative min-w-0 flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      {loadError && !isLoading ? (
        <AdminErrorState
          title="Could not load applications"
          description="The demo access queue could not be loaded. Retry or check your connection."
          onRetry={() => void fetchApplications()}
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <AdminEmptyState
          title="No applications match"
          description="Adjust search or status filters, or wait for new submissions."
          action={{ label: "Open featured programming", href: "/admin/featured-demos" }}
        />
      ) : (
        <AdminReviewList columns={listColumns}>
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="grid gap-4 p-4 transition-colors hover:bg-muted/15 lg:grid-cols-12 lg:items-start"
            >
              <div className="lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Applicant</p>
                <p className="font-semibold text-foreground">{app.name || "Unknown"}</p>
                <p className="text-sm text-muted-foreground">{app.email}</p>
                {app.companyName ? (
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    {app.companyName}
                  </p>
                ) : null}
                <Button variant="link" className="mt-1 h-auto px-0 text-xs" asChild>
                  <Link href={`/admin/users/${app.userId}`}>Admin profile review →</Link>
                </Button>
              </div>
              <div className="lg:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Request</p>
                {app.title ? (
                  <p className="font-medium leading-snug">{app.title}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No title provided</p>
                )}
                {app.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{app.description}</p>
                ) : null}
                {app.requestedAt ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Applied {format(new Date(app.requestedAt), "PPP")}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-muted-foreground">
                  Linked to programming:{" "}
                  {app.linkedDemoId ? (
                    <Link className="font-medium text-primary underline" href="/admin/featured-demos">
                      Yes ({app.linkedDemoStatus || "DRAFT"})
                    </Link>
                  ) : (
                    "No"
                  )}
                </p>
              </div>
              <div className="lg:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:hidden">Status</p>
                <AdminDemoAccessStatusBadge status={app.status || "NOT_APPLIED"} />
              </div>
              <div className="flex flex-wrap gap-2 lg:col-span-2 lg:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setSelectedApplication(app)
                    setIsDialogOpen(true)
                    setIsLoadingProfile(true)
                    try {
                      const response = await fetch(`/api/admin/users/${app.userId}`)
                      const data = await response.json()
                      if (data.success) setUserProfile(data.data)
                    } catch (error) {
                      console.error("Error fetching user profile:", error)
                    } finally {
                      setIsLoadingProfile(false)
                    }
                  }}
                >
                  Review
                </Button>
                {app.status === "PENDING" ? (
                  <Button size="sm" variant="destructive" onClick={() => setRejectUserId(app.id)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </AdminReviewList>
      )}

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setUserProfile(null)
            setSelectedApplication(null)
            setSelectedDateId(null)
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Demo Request & User Profile Details</DialogTitle>
              <DialogDescription>
                Review the demonstration request and complete user profile information
              </DialogDescription>
            </DialogHeader>
            {isLoadingProfile ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : selectedApplication && (
              <div className="space-y-6">
                <DemoAccessApplicationReviewTabs
                  title={selectedApplication.title || ""}
                  description={selectedApplication.description || ""}
                  applicationPayload={selectedApplication.applicationPayload}
                  relatedListingProductTitle={selectedApplication.relatedListingProductTitle ?? null}
                  requestedAt={selectedApplication.requestedAt}
                  preferredDate={selectedApplication.preferredDate}
                  assignedDate={selectedApplication.assignedDate}
                  assignedDateId={selectedApplication.assignedDateId}
                  status={selectedApplication.status}
                />
                <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2 text-sm">
                  <span className="text-muted-foreground">Linked to programming: </span>
                  {selectedApplication.linkedDemoId ? (
                    <Link className="font-medium text-primary underline" href="/admin/featured-demos">
                      Yes ({selectedApplication.linkedDemoStatus || "DRAFT"})
                    </Link>
                  ) : (
                    <span className="font-medium">No</span>
                  )}
                </div>

                {/* User Profile Section */}
                {userProfile && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        User Profile Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Profile Header */}
                      <div className="flex items-start gap-4 pb-4 border-b">
                        {userProfile.image && (
                          <div className="relative w-20 h-20 rounded-full overflow-hidden">
                            <Image
                              src={userProfile.image}
                              alt={userProfile.name || "User"}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{userProfile.name || "Unknown User"}</h3>
                          <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                          {userProfile.companyName && (
                            <p className="text-sm text-muted-foreground">{userProfile.companyName}</p>
                          )}
                        </div>
                      </div>

                      {/* Basic Information */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Basic Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Name</p>
                            <p>{userProfile.name || "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Email</p>
                            <p className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {userProfile.email || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Role</p>
                            <Badge variant="outline">{userProfile.role || "N/A"}</Badge>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Verified</p>
                            <Badge className={userProfile.isVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                              {userProfile.isVerified ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {userProfile.phone && (
                            <div>
                              <p className="font-medium text-muted-foreground">Phone</p>
                              <p className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {userProfile.phone}
                              </p>
                            </div>
                          )}
                          {userProfile.jobTitle && (
                            <div>
                              <p className="font-medium text-muted-foreground">Job Title</p>
                              <p>{userProfile.jobTitle}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Company Information */}
                      {(userProfile.companyName || userProfile.companyWebsite) && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            Company Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {userProfile.companyName && (
                              <div>
                                <p className="font-medium text-muted-foreground">Company Name</p>
                                <p>{userProfile.companyName}</p>
                              </div>
                            )}
                            {userProfile.companyWebsite && (
                              <div>
                                <p className="font-medium text-muted-foreground">Website</p>
                                <a 
                                  href={userProfile.companyWebsite} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-primary hover:underline"
                                >
                                  <Globe className="h-3 w-3" />
                                  {userProfile.companyWebsite}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Location Information */}
                      {(userProfile.location || userProfile.cityState || userProfile.country) && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Location
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {userProfile.location && (
                              <div>
                                <p className="font-medium text-muted-foreground">Address</p>
                                <p>{userProfile.location}</p>
                              </div>
                            )}
                            {userProfile.cityState && (
                              <div>
                                <p className="font-medium text-muted-foreground">City/State</p>
                                <p>{userProfile.cityState}</p>
                              </div>
                            )}
                            {userProfile.country && (
                              <div>
                                <p className="font-medium text-muted-foreground">Country</p>
                                <p>{userProfile.country}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Business Information */}
                      {(userProfile.yearsInBusiness || userProfile.teamSize || userProfile.satisfactionRate) && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            Business Information
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {userProfile.yearsInBusiness && (
                              <div>
                                <p className="font-medium text-muted-foreground">Years in Business</p>
                                <p>{userProfile.yearsInBusiness} years</p>
                              </div>
                            )}
                            {userProfile.teamSize && (
                              <div>
                                <p className="font-medium text-muted-foreground">Team Size</p>
                                <p className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {userProfile.teamSize}
                                </p>
                              </div>
                            )}
                            {userProfile.satisfactionRate !== null && userProfile.satisfactionRate !== undefined && (
                              <div>
                                <p className="font-medium text-muted-foreground">Satisfaction Rate</p>
                                <p>{userProfile.satisfactionRate}%</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      {userProfile.bio && (
                        <div>
                          <h4 className="font-semibold mb-3">Bio</h4>
                          <div 
                            className="text-sm text-muted-foreground prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: userProfile.bio }}
                          />
                        </div>
                      )}

                      {/* Specialties */}
                      {userProfile.specialties && Array.isArray(userProfile.specialties) && userProfile.specialties.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Specialties
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.specialties.map((specialty: string, index: number) => (
                              <Badge key={index} variant="secondary">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {userProfile.certifications && Array.isArray(userProfile.certifications) && userProfile.certifications.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Certifications
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.certifications.map((cert: string, index: number) => (
                              <Badge key={index} variant="outline">{cert}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {(userProfile.linkedinUrl || userProfile.twitterUrl) && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Social Links
                          </h4>
                          <div className="space-y-2 text-sm">
                            {userProfile.linkedinUrl && (
                              <a 
                                href={userProfile.linkedinUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <LinkIcon className="h-3 w-3" />
                                LinkedIn
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            {userProfile.twitterUrl && (
                              <a 
                                href={userProfile.twitterUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                              >
                                <LinkIcon className="h-3 w-3" />
                                Twitter/X
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CIPON Membership */}
                      {userProfile.hasCipponMembership && (
                        <div>
                          <h4 className="font-semibold mb-3">CIPON Membership</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="font-medium text-muted-foreground">Type</p>
                              <p>{userProfile.cipponMembershipType || "N/A"}</p>
                            </div>
                            {userProfile.cipponMembershipNumber && (
                              <div>
                                <p className="font-medium text-muted-foreground">Membership Number</p>
                                <p>{userProfile.cipponMembershipNumber}</p>
                              </div>
                            )}
                            {userProfile.cipponLicenseNumber && (
                              <div>
                                <p className="font-medium text-muted-foreground">License Number</p>
                                <p>{userProfile.cipponLicenseNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Account Information */}
                      <div>
                        <h4 className="font-semibold mb-3">Account Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-muted-foreground">Account Created</p>
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {userProfile.createdAt ? format(new Date(userProfile.createdAt), "PPP") : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Last Updated</p>
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {userProfile.updatedAt ? format(new Date(userProfile.updatedAt), "PPP") : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Date Selection for Approval */}
                {availableDates.length > 0 && (
                  <div className="pt-4 border-t">
                    <Label className="mb-2 block">Assign Available Date (Optional)</Label>
                    <Select value={selectedDateId || undefined} onValueChange={(value) => setSelectedDateId(value === "none" ? null : value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a date to assign (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No date assignment</SelectItem>
                        {availableDates.map((date) => (
                          <SelectItem key={date.id} value={date.id}>
                            {format(new Date(date.date), "PPP")}
                            {date.time && ` at ${date.time}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">
                      Selecting a date will assign it to this user and remove it from available dates
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={() => {
                      handleApprove(selectedApplication.id, selectedDateId === "none" ? null : selectedDateId)
                      setIsDialogOpen(false)
                      setUserProfile(null)
                      setSelectedDateId(null)
                    }}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => {
                      setRejectUserId(selectedApplication.id)
                      setIsDialogOpen(false)
                      setUserProfile(null)
                      setSelectedDateId(null)
                    }}
                    variant="destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      <AdminConfirmDialog
        open={rejectUserId !== null}
        onOpenChange={(open) => !open && setRejectUserId(null)}
        title="Reject demo access?"
        description="The applicant will lose pending featured demonstration access. They can reapply later if your policy allows."
        confirmLabel="Reject application"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={async () => {
          if (!rejectUserId) return
          await handleReject(rejectUserId)
        }}
      />
    </AdminPageContainer>
  )
}
