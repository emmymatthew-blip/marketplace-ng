import { Skeleton } from "@/components/ui/skeleton"

export default function VendorProfileLoading() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <Skeleton className="h-24 w-24 rounded-full shrink-0" />
            <Skeleton className="h-6 w-40 mt-4" />
            <Skeleton className="h-4 w-28 mt-2" />
            <Skeleton className="h-4 w-32 mt-2" />
            <div className="w-full space-y-2 mt-6">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-40 mt-6" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
