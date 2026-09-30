import { Skeleton } from "@/components/ui/skeleton"

export default function MessageDetailLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="min-w-0 flex-1 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={i % 2 === 0 ? "flex justify-start" : "flex justify-end"}>
            <Skeleton
              className={i % 2 === 0 ? "h-16 w-[70%] max-w-sm rounded-lg" : "h-16 w-[60%] max-w-sm rounded-lg ml-auto"}
            />
          </div>
        ))}
      </div>
      <div className="shrink-0 border-t border-border p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
