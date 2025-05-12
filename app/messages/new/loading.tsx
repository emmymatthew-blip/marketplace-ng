import { Skeleton } from "@/components/ui/skeleton"

export default function NewMessageLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton className="h-8 w-64 mb-6" />

        <Skeleton className="h-10 w-full mb-6" />

        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center p-3">
                <Skeleton className="w-12 h-12 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-60 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
