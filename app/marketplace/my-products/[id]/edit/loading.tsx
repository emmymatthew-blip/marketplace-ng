import { Skeleton } from "@/components/ui/skeleton"

export default function EditProductLoading() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="rounded-xl border border-border p-6 space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  )
}
