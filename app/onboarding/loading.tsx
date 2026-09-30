import { DashboardPageContainer, DashboardHeader } from "@/components/dashboard"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OnboardingLoading() {
  return (
    <DashboardPageContainer className="max-w-2xl">
      <DashboardHeader
        title="Get started"
        description="Complete your profile to improve listing relevance and partner trust."
      />
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-9 w-9 rounded-full" />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-2 flex-1" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Card className="rounded-xl border border-border shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full max-w-md mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-16 ml-auto" />
              <Skeleton className="h-9 w-16" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageContainer>
  )
}
