"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { DashboardPageContainer, DashboardHeader } from "@/components/dashboard"
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  User,
  Briefcase,
  Shield,
  Camera,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TEAM_SIZE_OPTIONS } from "@/lib/company-profile"

const ROLE_COMPANY = "COMMERCIAL_PRINTER"
const ROLE_PROFESSIONAL = "END_USER_PRINTER"

const STEPS = [
  { id: "profile", title: "Basic profile", icon: User },
  { id: "company", title: "Company details", icon: Building2 },
  { id: "industry", title: "Industry focus", icon: Briefcase },
  { id: "verification", title: "Verification", icon: Shield },
]

interface CategoryItem {
  id: string
  name: string
  slug?: string
}

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [stepIndex, setStepIndex] = useState(0)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState("")
  const [accountType, setAccountType] = useState<"company" | "professional">("company")
  const [country, setCountry] = useState("")
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null)
  const [companyName, setCompanyName] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [location, setLocation] = useState("")
  const [companyDescription, setCompanyDescription] = useState("")
  const [yearsInBusiness, setYearsInBusiness] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [categoryIds, setCategoryIds] = useState<string[]>([])
  const [equipmentTypes, setEquipmentTypes] = useState("")
  const [servicesOffered, setServicesOffered] = useState("")
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    fetch("/api/products/categories")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        const raw = data?.data ?? data?.categories ?? (Array.isArray(data) ? data : [])
        const flatten = (nodes: { id: string; name: string; slug?: string; children?: unknown[] }[]): CategoryItem[] => {
          const out: CategoryItem[] = []
          for (const n of nodes) {
            out.push({ id: n.id, name: n.name, slug: n.slug })
            if (Array.isArray(n.children) && n.children.length) {
              out.push(...flatten(n.children as { id: string; name: string; slug?: string; children?: unknown[] }[]))
            }
          }
          return out
        }
        setCategories(Array.isArray(raw) ? flatten(raw) : [])
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const u = session?.user as Record<string, unknown> | undefined
    if (u?.name) setName(String(u.name))
    if (u?.companyName) setCompanyName(String(u.companyName ?? ""))
    if (u?.companyWebsite) setCompanyWebsite(String(u.companyWebsite ?? ""))
    if (u?.country) setCountry(String(u.country ?? ""))
    if (u?.location) setLocation(String(u.location ?? ""))
    if (u?.bio) setCompanyDescription(String(u.bio ?? ""))
    if (u?.yearsInBusiness != null) setYearsInBusiness(String(u.yearsInBusiness))
    if (u?.teamSize) setTeamSize(String(u.teamSize))
    const role = u?.role as string | undefined
    if (role === ROLE_PROFESSIONAL) setAccountType("professional")
    else if (role) setAccountType("company")
  }, [session])

  const role = accountType === "company" ? ROLE_COMPANY : ROLE_PROFESSIONAL
  const showCompanyStep = accountType === "company"
  const effectiveSteps = showCompanyStep ? STEPS : [STEPS[0], STEPS[2], STEPS[3]]
  const safeStepIndex = Math.min(stepIndex, effectiveSteps.length - 1)
  const currentStepId = effectiveSteps[safeStepIndex]?.id ?? "profile"
  const progress = ((safeStepIndex + 1) / effectiveSteps.length) * 100

  useEffect(() => {
    if (stepIndex >= effectiveSteps.length) setStepIndex(effectiveSteps.length - 1)
  }, [effectiveSteps.length, stepIndex])

  const saveStep = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/users/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: string })?.error ?? "Save failed")
    }
  }

  const handleNext = async () => {
    setSaving(true)
    try {
      if (currentStepId === "profile") {
        await saveStep({ name: name || undefined, role, country: country || undefined })
        toast({ title: "Saved", description: "Your profile has been updated." })
      }
      if (currentStepId === "company") {
        await saveStep({
          companyName: companyName || undefined,
          companyWebsite: companyWebsite || undefined,
          location: location || undefined,
          bio: companyDescription || undefined,
          yearsInBusiness: yearsInBusiness || undefined,
          teamSize: teamSize || undefined,
        })
        toast({ title: "Saved", description: "Company details updated." })
      }
      if (currentStepId === "industry") {
        const specialties = [
          ...categoryIds,
          equipmentTypes ? `Equipment: ${equipmentTypes}` : null,
          servicesOffered ? `Services: ${servicesOffered}` : null,
        ].filter(Boolean)
        await saveStep({ specialties: specialties.length ? JSON.stringify(specialties) : undefined })
        toast({ title: "Saved", description: "Industry focus updated." })
      }
      if (safeStepIndex < effectiveSteps.length - 1) {
        setStepIndex(safeStepIndex + 1)
      } else {
        router.push("/dashboard")
      }
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Could not save.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSkip = () => {
    if (safeStepIndex < effectiveSteps.length - 1) {
      setStepIndex(safeStepIndex + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleVerifyNow = () => {
    router.push("/verification")
  }

  if (status === "loading" || !session) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  const currentStep = effectiveSteps[safeStepIndex]

  return (
    <DashboardPageContainer className="max-w-2xl">
      <DashboardHeader
        title="Get started"
        description="Complete your profile to improve listing relevance and partner trust. You can skip any step."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Onboarding" }]}
      />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          {effectiveSteps.map((s, i) => {
            const Icon = s.icon
            const isActive = i === safeStepIndex
            const isDone = i < safeStepIndex
            return (
              <div key={s.id} className="flex items-center gap-1" aria-hidden>
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isDone && "border-primary bg-primary text-white",
                    isActive && "border-primary bg-primary/10 text-primary",
                    !isDone && !isActive && "border-muted bg-muted/50"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                {i < effectiveSteps.length - 1 && (
                  <div className="h-px w-6 bg-border hidden sm:block" aria-hidden />
                )}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm text-muted-foreground">
            Step {safeStepIndex + 1} of {effectiveSteps.length}
          </span>
        </div>

        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader>
            <CardTitle>{currentStep.title}</CardTitle>
            <CardDescription>
              {currentStepId === "profile" &&
                "Tell us your name, how you use the platform, and where you're based."}
              {currentStepId === "company" &&
                "Add your company information so partners can find and trust you."}
              {currentStepId === "industry" &&
                "This helps improve listing relevance and recommendations."}
              {currentStepId === "verification" &&
                "Verification builds trust. You can do this now or later from the Verification Center."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepId === "profile" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="onboard-name">Name</Label>
                  <Input
                    id="onboard-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>I am a</Label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType("company")}
                      className={cn(
                        "flex-1 rounded-lg border-2 p-3 text-left transition-colors",
                        accountType === "company"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <Building2 className="mb-1 h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Company</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        I represent a business
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType("professional")}
                      className={cn(
                        "flex-1 rounded-lg border-2 p-3 text-left transition-colors",
                        accountType === "professional"
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border hover:border-muted-foreground"
                      )}
                    >
                      <User className="mb-1 h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">Industry Professional</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        I work in the industry
                      </p>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboard-country">Country</Label>
                  <Input
                    id="onboard-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Nigeria, United Kingdom"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profile photo (optional)</Label>
                  <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      {profilePhotoFile ? (
                        <span className="text-xs text-muted-foreground truncate px-1">
                          {profilePhotoFile.name}
                        </span>
                      ) : (
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Input
                        type="file"
                        accept="image/*"
                        className="cursor-pointer"
                        onChange={(e) => setProfilePhotoFile(e.target.files?.[0] ?? null)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        You can add or change your photo later in Settings.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStepId === "company" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="onboard-company">Company name</Label>
                  <Input
                    id="onboard-company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Print Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboard-website">Website</Label>
                  <Input
                    id="onboard-website"
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboard-location">Location</Label>
                  <Input
                    id="onboard-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State / Region"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboard-desc">Short company description</Label>
                  <Textarea
                    id="onboard-desc"
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                    placeholder="A brief description of your business"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="onboard-years">Years in Business</Label>
                    <Input
                      id="onboard-years"
                      type="number"
                      min="0"
                      value={yearsInBusiness}
                      onChange={(e) => setYearsInBusiness(e.target.value)}
                      placeholder="e.g. 15"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="onboard-team">Team Size</Label>
                    <select
                      id="onboard-team"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                    >
                      <option value="">Select team size</option>
                      {TEAM_SIZE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {currentStepId === "industry" && (
              <>
                <div className="space-y-2">
                  <Label>Product categories</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Select categories that match your listings (optional).
                  </p>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-border p-2 space-y-1">
                    {categories.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">Loading categories…</p>
                    ) : (
                      categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={categoryIds.includes(cat.id)}
                            onChange={(e) =>
                              setCategoryIds((prev) =>
                                e.target.checked ? [...prev, cat.id] : prev.filter((id) => id !== cat.id)
                              )
                            }
                            className="rounded border-border"
                          />
                          <span className="text-sm">{cat.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboard-equipment">Equipment types (optional)</Label>
                  <Input
                    id="onboard-equipment"
                    value={equipmentTypes}
                    onChange={(e) => setEquipmentTypes(e.target.value)}
                    placeholder="e.g. Offset, Digital, Screen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="onboard-services">Services offered (optional)</Label>
                  <Textarea
                    id="onboard-services"
                    value={servicesOffered}
                    onChange={(e) => setServicesOffered(e.target.value)}
                    placeholder="e.g. Large format, packaging, finishing"
                    rows={2}
                  />
                </div>
              </>
            )}

            {currentStepId === "verification" && (
              <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Verified companies build trust faster, stand out in listings, and increase
                  confidence during agreements. Complete verification from the Trust & Verification
                  Center.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleVerifyNow} asChild>
                    <Link href="/verification">
                      <Shield className="mr-2 h-4 w-4" />
                      Verify now
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Skip for now
                  </Button>
                </div>
              </div>
            )}

            {currentStepId !== "verification" && (
              <div className="flex flex-wrap gap-2 pt-2">
                {safeStepIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStepIndex(safeStepIndex - 1)}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                )}
                <div className="flex-1" />
                <Button type="button" variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
                <Button type="button" onClick={handleNext} disabled={saving}>
                  {saving ? "Saving…" : safeStepIndex === effectiveSteps.length - 1 ? "Finish" : "Next"}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center">
          <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to dashboard
          </Link>
        </p>
      </div>
    </DashboardPageContainer>
  )
}
