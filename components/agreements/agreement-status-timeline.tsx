import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  MessageSquare,
  Send,
  XCircle,
} from "lucide-react"

export type TimelineStatus = "PROPOSED" | "MODIFICATION_REQUESTED" | "ACTIVE" | "COMPLETED" | "DISPUTED" | "RESOLVED" | "DECLINED" | "CANCELLED"

export interface TimelineEvent {
  status: TimelineStatus
  date: string
  actor?: string | null
  /** Richer label when available from API (e.g. DRAFT_CREATED, MODIFICATION_REQUESTED) */
  eventType?: string | null
}

interface AgreementStatusTimelineProps {
  events: TimelineEvent[]
}

const EVENT_TYPE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  DRAFT_CREATED: {
    label: "Draft created",
    icon: <FileText className="h-5 w-5 text-muted-foreground" />,
  },
  SENT_FOR_REVIEW: {
    label: "Sent for review",
    icon: <Send className="h-5 w-5 text-blue-500" />,
  },
  MODIFICATION_REQUESTED: {
    label: "Modification requested",
    icon: <Edit3 className="h-5 w-5 text-amber-500" />,
  },
  STATUS_UPDATED: {
    label: "Status updated",
    icon: <FileText className="h-5 w-5 text-muted-foreground" />,
  },
  AGREEMENT_ACTIVATED: {
    label: "Agreement activated",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  AGREEMENT_COMPLETED: {
    label: "Agreement completed",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
  },
  DISPUTE_OPENED: {
    label: "Dispute opened",
    icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
  },
  DISPUTE_RESOLVED: {
    label: "Dispute resolved",
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
  },
  AGREEMENT_DECLINED: {
    label: "Agreement declined",
    icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
  },
  AGREEMENT_WITHDRAWN: {
    label: "Agreement withdrawn",
    icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
  },
  REVISED_AGREEMENT_SENT: {
    label: "Revised agreement sent",
    icon: <Send className="h-5 w-5 text-blue-500" />,
  },
}

function getStatusFallback(status: string, actor?: string | null): { label: string; icon: React.ReactNode } {
  switch (status) {
    case "PROPOSED":
      return {
        label: actor ? `Agreement proposed by ${actor}` : "Agreement proposed",
        icon: <FileText className="h-5 w-5 text-blue-500" />,
      }
    case "MODIFICATION_REQUESTED":
      return {
        label: actor ? `Modification requested by ${actor}` : "Modification requested",
        icon: <Edit3 className="h-5 w-5 text-amber-500" />,
      }
    case "ACTIVE":
      return {
        label: actor ? `Agreement accepted by ${actor}` : "Agreement activated",
        icon: <Clock className="h-5 w-5 text-green-500" />,
      }
    case "COMPLETED":
      return {
        label: actor ? `Agreement completed by ${actor}` : "Agreement completed",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      }
    case "DISPUTED":
      return {
        label: actor ? `Dispute raised by ${actor}` : "Agreement disputed",
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      }
    case "DECLINED":
      return {
        label: actor ? `Agreement declined by ${actor}` : "Agreement declined",
        icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
      }
    case "CANCELLED":
      return {
        label: actor ? `Agreement cancelled by ${actor}` : "Agreement cancelled",
        icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
      }
    case "RESOLVED":
      return {
        label: actor ? `Dispute resolved by ${actor}` : "Dispute resolved",
        icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
      }
    default:
      return {
        label: "Status updated",
        icon: <FileText className="h-5 w-5 text-muted-foreground" />,
      }
  }
}

function getEventDisplay(event: TimelineEvent): { label: string; icon: React.ReactNode } {
  const byType = event.eventType && EVENT_TYPE_LABELS[event.eventType]
  if (byType) return byType
  return getStatusFallback(event.status, event.actor)
}

export function AgreementStatusTimeline({ events }: AgreementStatusTimelineProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Agreement timeline</h3>
      <ol className="relative border-l border-muted-foreground/20">
        {events.length === 0 ? (
          <li className="ml-6 text-sm text-muted-foreground">No events yet.</li>
        ) : (
          events.map((event, index) => {
            const { label, icon } = getEventDisplay(event)
            return (
              <li key={index} className="mb-6 ml-6">
                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full border border-muted-foreground/20 bg-background">
                  {icon}
                </span>
                <p className="font-medium">{label}</p>
                <time className="text-sm text-muted-foreground">{event.date}</time>
              </li>
            )
          })
        )}
      </ol>
    </div>
  )
}
