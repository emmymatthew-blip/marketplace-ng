import { AdminPageContainer } from "@/components/admin/admin-page"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <AdminPageContainer>
      <div className="space-y-6">
        <div className="space-y-2 border-b border-border/60 pb-6">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-8 w-72 max-w-full" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <Skeleton className="h-12 w-full max-w-xl rounded-xl" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </AdminPageContainer>
  )
}
