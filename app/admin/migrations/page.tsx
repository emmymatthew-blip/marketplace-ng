"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { AlertTriangle, Database, Loader2, CheckCircle2, XCircle, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminPageContainer, AdminPageHeader, AdminSectionCard } from "@/components/admin/admin-page"
import { AdminConfirmDialog } from "@/components/admin/admin-confirm"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export default function MigrationsPage() {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const runMigration = async () => {
    setIsRunning(true)
    setResult(null)

    try {
      const response = await fetch("/api/migrations/run-featured-demo-migration", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
        toast({
          title: "Migration successful",
          description: data.message,
        })
      } else {
        setResult({ success: false, message: data.error || "Migration failed" })
        toast({
          title: "Migration failed",
          description: data.error || "Failed to run migration",
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to run migration"
      setResult({ success: false, message })
      toast({
        title: "Migration failed",
        description: message,
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

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
        title="System migrations"
        description="Controlled database operations. Use Prisma migrations in production; this console runs legacy HTTP-triggered scripts only."
        breadcrumbs={[
          { label: "Admin", href: "/admin/dashboard" },
          { label: "System" },
          { label: "Migrations" },
        ]}
      />

      <Alert variant="destructive" className="border-destructive/40 bg-destructive/[0.06]">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>High-impact operations</AlertTitle>
        <AlertDescription className="text-foreground/90">
          Running a migration can alter schema or data. Confirm backups and environment before executing. Do not run ad-hoc scripts
          against production without a change plan.
        </AlertDescription>
      </Alert>

      <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Shield className="h-4 w-4 text-muted-foreground" />
          System utility
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          This section is separate from business operations (queues, programming, taxonomy). Access is restricted to admins.
        </p>
      </div>

      <AdminSectionCard
        title="Featured demo images migration"
        description="Adds media columns on DemoClass for featured live demo headers and adverts."
        className="border-slate-200/80 dark:border-slate-800"
      >
        <div className="space-y-6 p-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">What this migration does</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                Adds <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">headerImage</code> to{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">DemoClass</code>
              </li>
              <li>
                Adds <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">advertImage</code> to{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">DemoClass</code>
              </li>
              <li>Adds column comments where supported</li>
            </ul>
          </div>

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="h-4 w-4 shrink-0" />
              Endpoint: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">POST /api/migrations/run-featured-demo-migration</code>
            </div>
            <Button onClick={() => setConfirmOpen(true)} disabled={isRunning} variant="destructive" className="sm:min-w-[160px]">
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running…
                </>
              ) : (
                "Run migration"
              )}
            </Button>
          </div>

          {result && (
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                result.success
                  ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                  : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className={`font-medium ${result.success ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}`}>
                  {result.success ? "Completed" : "Failed"}
                </p>
                <p className={`mt-1 text-sm ${result.success ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
                  {result.message}
                </p>
              </div>
            </div>
          )}
        </div>
      </AdminSectionCard>

      <AdminConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Run featured-demo migration?"
        description="This calls the legacy HTTP migration endpoint and may alter the database. Ensure backups and that you are in the correct environment."
        confirmLabel="Run migration"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={runMigration}
      />
    </AdminPageContainer>
  )
}
