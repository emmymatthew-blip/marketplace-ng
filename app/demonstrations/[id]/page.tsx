import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { DemoDetailPageClient } from "./client"

interface DemoDetailPageProps {
  params: {
    id: string
  }
}

export default function DemoDetailPage({ params }: DemoDetailPageProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden />
        </div>
      }
    >
      <DemoDetailPageClient id={params.id} />
    </Suspense>
  )
}
