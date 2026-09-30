"use client"

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Globe,
  Mail,
  RefreshCw,
  Shield,
  User,
} from "lucide-react"

import {
  AdminDemoAccessStatusBadge,
  AdminKpiCard,
  AdminPageContainer,
  AdminPageHeader,
  AdminSectionCard,
} from "@/components/admin/admin-page"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

type UserPayload = Record<string, unknown> & {
  id: string
  name?: string | null
  email?: string | null
  companyName?: string | null
  role?: string | null
  isVerified?: boolean | null
  companyWebsite?: string | null
  demoAccessSummaryStatus?: string | null
  latestDemoRequestTitle?: string | null
  latestDemoRequestAt?: string | null
  createdAt?: string | null
}

export default function AdminUserReviewPage() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : ""
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [user, setUser] = useState<UserPayload | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { cache: "no-store" })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to load user")
      setUser(json.success ? json.data : null)
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to load",
        variant: "destructive",
      })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") load()
  }, [status, session?.user?.role, load])

  if (status === "loading") {
    return (
      <AdminPageContainer>
        <Skeleton className="h-24 w-full max-w-2xl rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </AdminPageContainer>
    )
  }

  if (!session || session.user?.role !== "ADMIN") return null

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="User & company review"
        description="Operational snapshot for trust decisions — verification, demo access, and profile context."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "Directory" },
          { label: "User" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/demo-access">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Applications
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => load()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : !user ? (
        <AdminSectionCard title="Not found" description="This user ID could not be loaded.">
          <div className="p-6 text-sm text-muted-foreground">
            Check the ID or return to demo applications to pick a valid applicant.
          </div>
        </AdminSectionCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminKpiCard
              title="Verification"
              value={user.isVerified ? "Verified" : "Unverified"}
              hint="Platform trust flag"
              icon={Shield}
              variant={user.isVerified ? "accent" : "warning"}
            />
            <AdminKpiCard
              title="Demo access"
              value={<AdminDemoAccessStatusBadge status={(user.demoAccessStatus as string) || "NOT_APPLIED"} />}
              hint="Featured demo program"
              icon={Calendar}
            />
            <AdminKpiCard
              title="Role"
              value={String(user.role ?? "—")}
              hint="Account type"
              icon={User}
            />
          </div>

          <AdminSectionCard title="Identity" description="Contact and account basics.">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/15 p-3">
                <User className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</p>
                  <p className="font-medium">{user.name || "—"}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/15 p-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</p>
                  <p className="truncate font-medium">{user.email || "—"}</p>
                </div>
              </div>
              {user.companyName ? (
                <div className="flex gap-3 rounded-lg border border-border/60 bg-muted/15 p-3 sm:col-span-2">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company</p>
                    <p className="font-medium">{String(user.companyName)}</p>
                    {user.companyWebsite ? (
                      <a
                        href={String(user.companyWebsite)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Website
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Demonstration request" description="Latest application (DemoAccessRequest).">
            <div className="space-y-3 p-4 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</p>
                <p className="font-medium">
                  {user.latestDemoRequestTitle ? String(user.latestDemoRequestTitle) : "—"}
                </p>
              </div>
              {user.latestDemoRequestAt ? (
                <p className="text-muted-foreground">
                  Requested {format(new Date(String(user.latestDemoRequestAt)), "PPP p")}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/demo-access">Open applications queue</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/users/${id}/trust`}>Trust &amp; score</Link>
                </Button>
              </div>
            </div>
          </AdminSectionCard>

          <AdminSectionCard title="Account" description="Record metadata.">
            <div className="p-4 text-sm text-muted-foreground">
              {user.createdAt ? <p>Created {format(new Date(String(user.createdAt)), "PPP")}</p> : null}
              <p className="mt-1 font-mono text-xs">ID: {user.id}</p>
            </div>
          </AdminSectionCard>
        </>
      )}
    </AdminPageContainer>
  )
}
