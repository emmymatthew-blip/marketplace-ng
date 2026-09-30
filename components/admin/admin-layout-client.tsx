"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Loader2 } from "lucide-react"

import { AdminShell } from "@/components/admin/admin-shell"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    redirect("/login?callbackUrl=/admin/dashboard")
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return <AdminShell>{children}</AdminShell>
}
