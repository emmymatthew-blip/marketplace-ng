import { Skeleton } from "@/components/ui/skeleton"

export default function MessagesLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block w-[320px] shrink-0 border-r border-border p-4 space-y-3">
          <Skeleton className="h-9 w-full rounded-lg" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Skeleton className="h-12 w-12 rounded-full mb-4" />
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </div>
    </div>
  )
}
