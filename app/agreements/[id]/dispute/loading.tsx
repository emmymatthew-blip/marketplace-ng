import { DashboardPageContainer } from "@/components/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function DisputeLoading() {
  return (
    <DashboardPageContainer className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </DashboardPageContainer>
  )
}
