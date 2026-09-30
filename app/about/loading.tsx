import { Skeleton } from "@/components/ui/skeleton"

export default function AboutLoading() {
  return (
    <div className="container py-12 space-y-8">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </div>
  )
} 