import { AgreementDetailPageClient } from "./client"

export default function AgreementDetailPage({ params }: { params: { id: string } }) {
  return <AgreementDetailPageClient id={params.id} />
}
