"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  DemonstrationApplicationForm,
  DemoAccessStatusBanners,
} from "@/components/demo-access/demonstration-application-form"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { loginWithCallback } from "@/lib/auth-urls"
import type { DemoApplicationPayload } from "@/lib/demo-application-payload"
import { format } from "date-fns"

export default function DemoAccessApplyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStatus, setCurrentStatus] = useState<string | null>(null)
  const [activeRequestCount, setActiveRequestCount] = useState(0)
  const [myRequestedPreferredDates, setMyRequestedPreferredDates] = useState<Set<string>>(new Set())
  const [availableDates, setAvailableDates] = useState<{ id: string; date: string; time?: string | null }[]>([])
  const [loadingDates, setLoadingDates] = useState(true)

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/demo-access/status")
      const data = await response.json()
      setCurrentStatus(data.status)
      setActiveRequestCount(typeof data.activeCount === "number" ? data.activeCount : 0)

      const requestsResponse = await fetch("/api/demo-access/my-requests")
      const requestsData = await requestsResponse.json()
      if (requestsData.success) {
        const activeCount = (requestsData.data || []).filter(
          (r: { status: string }) => r.status === "PENDING" || r.status === "APPROVED"
        ).length

        const preferredDateSet = new Set<string>()
        for (const r of requestsData.data || []) {
          if ((r.status === "PENDING" || r.status === "APPROVED") && r.preferredDate) {
            preferredDateSet.add(format(new Date(r.preferredDate), "yyyy-MM-dd"))
          }
        }
        setMyRequestedPreferredDates(preferredDateSet)

        if (activeCount >= 2) {
          toast({
            title: "Application limit",
            description: "You can have up to two active demonstration applications (pending or approved) at a time.",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error checking status:", error)
    }
  }, [toast])

  const fetchAvailableDates = useCallback(async () => {
    try {
      setLoadingDates(true)
      const response = await fetch("/api/available-demo-dates")
      const data = await response.json()
      if (data.success) {
        setAvailableDates(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching available dates:", error)
    } finally {
      setLoadingDates(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      checkStatus()
      fetchAvailableDates()
    }
  }, [status, checkStatus, fetchAvailableDates])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(loginWithCallback("/demo-access/apply"))
    }
  }, [status, router])

  const handleSubmit = async (data: {
    title: string
    description: string
    applicationPayload: DemoApplicationPayload
    preferredDate: string | null
    preferredDateId: string | null
  }) => {
    const requestsResponse = await fetch("/api/demo-access/my-requests")
    const requestsData = await requestsResponse.json()
    if (requestsData.success) {
      const activeCount = (requestsData.data || []).filter(
        (r: { status: string }) => r.status === "PENDING" || r.status === "APPROVED"
      ).length
      if (activeCount >= 2) {
        toast({
          title: "Application limit reached",
          description: "You already have two active applications. Wait for a decision before submitting another.",
          variant: "destructive",
        })
        throw new Error("Application limit reached")
      }
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/demo-access/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          applicationPayload: data.applicationPayload,
          preferredDate: data.preferredDate,
          preferredDateId: data.preferredDateId,
        }),
      })

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit application")
      }

      toast({
        title: "Application submitted",
        description: "Your demonstration application is with the review team. You’ll be notified after a decision.",
      })
      await checkStatus()
      router.push("/demo-access/my-requests")
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to submit application"
      toast({
        title: "Submission failed",
        description: message,
        variant: "destructive",
      })
      throw error instanceof Error ? error : new Error(String(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  const profileDefaults = session?.user
    ? {
        companyName: session.user.companyName ?? null,
        contactPerson:
          (session.user as { name?: string | null }).name?.trim() ||
          session.user.email?.split("@")[0] ||
          null,
        corporateEmail: session.user.email ?? null,
        isVerified: session.user.isVerified,
      }
    : undefined

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden border-b border-primary/10 bg-gradient-to-br from-slate-900 via-slate-900 to-primary/90 text-white">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
          <div className="container relative max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/70 hover:text-white">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/demonstrations" className="text-white/70 hover:text-white">
                    Demonstrations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <span className="font-medium text-white">Demonstration application</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-8 max-w-3xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Curated weekly programme</p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Demonstration application</h1>
              <p className="text-lg text-white/85 leading-relaxed">
                Apply for a reviewed slot on PrintMarket NG: one weekly featured spotlight, plus approved sessions in the
                upcoming pipeline. This submission is for <strong>review and scheduling</strong> — not final publishing.
              </p>
            </div>
          </div>
        </div>

        <div className="container max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <DemoAccessStatusBanners
            currentStatus={currentStatus}
            activeRequestCount={activeRequestCount}
            onCreateFeatured={() => router.push("/featured-demonstration/new")}
          />

          {currentStatus !== "APPROVED" && (
            <>
              <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">Application form</h2>
                  <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                    Complete all sections. After approval, you&apos;ll finalise execution on the featured demonstration setup
                    flow — similar to locking a production brief before going live.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" asChild>
                  <a href="/demonstrations">View public programme</a>
                </Button>
              </div>

              <DemonstrationApplicationForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                disabled={activeRequestCount >= 2}
                availableDates={availableDates}
                loadingDates={loadingDates}
                myRequestedPreferredDates={myRequestedPreferredDates}
                activeRequestCount={activeRequestCount}
                profileDefaults={profileDefaults}
                sellerId={session.user.id}
              />
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
