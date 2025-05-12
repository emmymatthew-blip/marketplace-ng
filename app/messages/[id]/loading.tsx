import { Skeleton } from "@/components/ui/skeleton"

export default function MessageDetailLoading() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-lg shadow-md">
        <div className="border-b p-4 flex items-center">
          <Skeleton className="w-10 h-10 rounded-full mr-3" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[70%] ${i % 2 === 0 ? "bg-gray-100" : "bg-blue-100"} rounded-lg p-3`}>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-1 text-right">
                    <Skeleton className="h-3 w-16 inline-block" />
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="border-t p-4">
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}
