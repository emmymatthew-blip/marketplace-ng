import { DashboardPageContainer } from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function VerificationLoading() {
  return (
    <DashboardPageContainer className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-10 w-full max-w-2xl" />
      <div className="grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </DashboardPageContainer>
  )
}
