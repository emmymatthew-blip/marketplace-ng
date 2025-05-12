import { Skeleton } from "@/components/ui/skeleton"

export default function DisputeLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-10 w-64 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-4" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />

          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
        </div>
      </div>
    </div>
  )
}
