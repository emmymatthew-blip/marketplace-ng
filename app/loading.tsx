import { Skeleton } from "@/components/ui/skeleton"

export default function RootLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Skeleton className="h-10 w-10 rounded" />
            <div className="hidden md:flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 border-b border-border">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-6 w-full max-w-md" />
                <div className="flex gap-3 pt-2">
                  <Skeleton className="h-11 w-32 rounded-lg" />
                  <Skeleton className="h-11 w-36 rounded-lg" />
                </div>
              </div>
              <Skeleton className="aspect-video w-full rounded-xl hidden lg:block" />
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="container">
            <div className="text-center space-y-2 mb-8">
              <Skeleton className="h-8 w-64 mx-auto" />
              <Skeleton className="h-4 w-96 max-w-full mx-auto" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-xl border border-border overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
