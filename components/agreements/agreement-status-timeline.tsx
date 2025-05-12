import { CheckCircle, Clock, FileText, AlertTriangle } from "lucide-react"

interface TimelineEvent {
  status: "PROPOSED" | "ACTIVE" | "COMPLETED" | "DISPUTED"
  date: string
  actor?: string
}

interface AgreementStatusTimelineProps {
  events: TimelineEvent[]
}

export function AgreementStatusTimeline({ events }: AgreementStatusTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PROPOSED":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "ACTIVE":
        return <Clock className="h-5 w-5 text-green-500" />
      case "COMPLETED":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "DISPUTED":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getStatusText = (status: string, actor?: string) => {
    switch (status) {
      case "PROPOSED":
        return actor ? `Agreement proposed by ${actor}` : "Agreement proposed"
      case "ACTIVE":
        return actor ? `Agreement accepted by ${actor}` : "Agreement activated"
      case "COMPLETED":
        return actor ? `Agreement completed by ${actor}` : "Agreement completed"
      case "DISPUTED":
        return actor ? `Dispute raised by ${actor}` : "Agreement disputed"
      default:
        return "Status updated"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Agreement Timeline</h3>
      <ol className="relative border-l border-muted-foreground/20">
        {events.map((event, index) => (
          <li key={index} className="mb-6 ml-6">
            <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-muted-foreground/20">
              {getStatusIcon(event.status)}
            </span>
            <h3 className="flex items-center text-lg font-semibold">{getStatusText(event.status, event.actor)}</h3>
            <time className="mb-1 text-sm font-normal text-muted-foreground">{event.date}</time>
          </li>
        ))}
      </ol>
    </div>
  )
}
