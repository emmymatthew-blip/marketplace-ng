import { DemoDetailPageClient } from "./client"

interface DemoDetailPageProps {
  params: {
    id: string
  }
}

export default function DemoDetailPage({ params }: DemoDetailPageProps) {
  return <DemoDetailPageClient id={params.id} />
}
