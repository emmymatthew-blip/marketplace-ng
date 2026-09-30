import {
  MessageSquare,
  Inbox,
  FileText,
  Handshake,
  CheckCircle,
  AlertTriangle,
  Shield,
  Calendar,
  type LucideIcon,
} from "lucide-react"
import type { NotificationType } from "@/lib/notifications"

export const NOTIFICATION_TYPE_ICON: Record<string, LucideIcon> = {
  MESSAGE_RECEIVED: MessageSquare,
  INQUIRY_RECEIVED: Inbox,
  INQUIRY_STATUS_UPDATED: Inbox,
  AGREEMENT_OFFERED: FileText,
  AGREEMENT_MODIFICATION_REQUESTED: FileText,
  AGREEMENT_ACCEPTED: CheckCircle,
  AGREEMENT_ACTIVATED: Handshake,
  AGREEMENT_COMPLETED: CheckCircle,
  AGREEMENT_DISPUTED: AlertTriangle,
  AGREEMENT_RESOLVED: CheckCircle,
  AGREEMENT_REVISED: FileText,
  VERIFICATION_SUBMITTED: Shield,
  VERIFICATION_APPROVED: Shield,
  VERIFICATION_REJECTED: Shield,
  VERIFICATION_MORE_INFO: Shield,
  DEMO_ACCESS_APPROVED: Calendar,
  DEMO_ACCESS_REJECTED: Calendar,
  DEMO_APPROVED: Calendar,
  DEMO_REJECTED: Calendar,
}

export function getNotificationIcon(type: NotificationType): LucideIcon {
  return NOTIFICATION_TYPE_ICON[type] ?? MessageSquare
}
