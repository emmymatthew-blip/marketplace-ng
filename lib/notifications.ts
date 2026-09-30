import { randomUUID } from "crypto"
import { prisma } from "@/lib/prisma"
import { query } from "@/lib/db"

export const NOTIFICATION_TYPES = {
  MESSAGE_RECEIVED: "MESSAGE_RECEIVED",
  INQUIRY_RECEIVED: "INQUIRY_RECEIVED",
  INQUIRY_STATUS_UPDATED: "INQUIRY_STATUS_UPDATED",
  AGREEMENT_OFFERED: "AGREEMENT_OFFERED",
  AGREEMENT_MODIFICATION_REQUESTED: "AGREEMENT_MODIFICATION_REQUESTED",
  AGREEMENT_ACCEPTED: "AGREEMENT_ACCEPTED",
  AGREEMENT_ACTIVATED: "AGREEMENT_ACTIVATED",
  AGREEMENT_COMPLETED: "AGREEMENT_COMPLETED",
  AGREEMENT_DISPUTED: "AGREEMENT_DISPUTED",
  AGREEMENT_RESOLVED: "AGREEMENT_RESOLVED",
  AGREEMENT_REVISED: "AGREEMENT_REVISED",
  VERIFICATION_SUBMITTED: "VERIFICATION_SUBMITTED",
  VERIFICATION_APPROVED: "VERIFICATION_APPROVED",
  VERIFICATION_REJECTED: "VERIFICATION_REJECTED",
  VERIFICATION_MORE_INFO: "VERIFICATION_MORE_INFO",
  DEMO_ACCESS_APPROVED: "DEMO_ACCESS_APPROVED",
  DEMO_ACCESS_REJECTED: "DEMO_ACCESS_REJECTED",
  DEMO_APPROVED: "DEMO_APPROVED",
  DEMO_REJECTED: "DEMO_REJECTED",
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

export interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  body: string
  link?: string | null
  metadata?: Record<string, unknown> | null
}

async function ensureNotificationsTable(): Promise<void> {
  await query(
    `CREATE TABLE IF NOT EXISTS "Notification" (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      link TEXT,
      "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
      metadata TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON DELETE CASCADE
    )`,
    []
  )
}

export async function createNotification(input: CreateNotificationInput): Promise<void> {
  const { userId, type, title, body, link, metadata } = input
  try {
    await ensureNotificationsTable()
    await query(
      `INSERT INTO "Notification" (id, "userId", type, title, body, link, "isRead", metadata, "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        randomUUID(),
        userId,
        type,
        title,
        body,
        link ?? null,
        false,
        metadata ? JSON.stringify(metadata) : null,
      ]
    )
  } catch {
    // Fail silently so API routes don't break if notifications table is missing
  }
}

export async function notifyMessageReceived(receiverId: string, senderName: string, link: string): Promise<void> {
  await createNotification({
    userId: receiverId,
    type: NOTIFICATION_TYPES.MESSAGE_RECEIVED,
    title: "New message",
    body: `${senderName} sent you a message.`,
    link,
  })
}

export async function notifyInquiryReceived(
  vendorId: string,
  buyerName: string,
  productTitle: string,
  inquiryId: string
): Promise<void> {
  await createNotification({
    userId: vendorId,
    type: NOTIFICATION_TYPES.INQUIRY_RECEIVED,
    title: "New inquiry",
    body: `${buyerName} sent an inquiry about "${productTitle}".`,
    link: `/dashboard/inquiries`,
    metadata: { inquiryId },
  })
}

export async function notifyInquiryStatusUpdated(
  buyerId: string,
  status: string,
  link: string
): Promise<void> {
  await createNotification({
    userId: buyerId,
    type: NOTIFICATION_TYPES.INQUIRY_STATUS_UPDATED,
    title: "Inquiry updated",
    body: `Your inquiry status was updated to ${status}.`,
    link,
  })
}

export async function notifyAgreementOffered(
  receiverId: string,
  initiatorName: string,
  agreementId: string,
  link?: string
): Promise<void> {
  await createNotification({
    userId: receiverId,
    type: NOTIFICATION_TYPES.AGREEMENT_OFFERED,
    title: "New agreement draft received",
    body: `${initiatorName} sent you an agreement draft for review.`,
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyAgreementModificationRequested(
  targetUserId: string,
  fromName: string,
  agreementId: string,
  link?: string
): Promise<void> {
  await createNotification({
    userId: targetUserId,
    type: NOTIFICATION_TYPES.AGREEMENT_MODIFICATION_REQUESTED,
    title: "Agreement modification requested",
    body: `${fromName} requested changes to the agreement.`,
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyAgreementAccepted(
  proposerId: string,
  acceptorName: string,
  agreementId: string,
  link?: string
): Promise<void> {
  await createNotification({
    userId: proposerId,
    type: NOTIFICATION_TYPES.AGREEMENT_ACCEPTED,
    title: "Agreement accepted",
    body: `${acceptorName} accepted your agreement.`,
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyAgreementActivated(userId: string, agreementId: string, link?: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.AGREEMENT_ACTIVATED,
    title: "Agreement activated",
    body: "The agreement is now active.",
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyAgreementCompleted(userId: string, agreementId: string, link?: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.AGREEMENT_COMPLETED,
    title: "Agreement completed",
    body: "The agreement has been marked as completed.",
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyAgreementDisputed(
  otherPartyId: string,
  fromName: string,
  agreementId: string,
  link?: string
): Promise<void> {
  await createNotification({
    userId: otherPartyId,
    type: NOTIFICATION_TYPES.AGREEMENT_DISPUTED,
    title: "Dispute opened",
    body: `${fromName} opened a dispute on the agreement.`,
    link: link || `/agreements/${agreementId}/dispute`,
    metadata: { agreementId },
  })
}

export async function notifyAdminsAgreementDisputed(
  agreementId: string,
  fromName: string
): Promise<void> {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" as const },
      select: { id: true },
    })
    const link = `/admin/agreements?disputed=${agreementId}`
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: NOTIFICATION_TYPES.AGREEMENT_DISPUTED,
        title: "Agreement dispute",
        body: `${fromName} opened a dispute on an agreement.`,
        link,
        metadata: { agreementId },
      })
    }
  } catch {
    // Fail silently
  }
}

export async function notifyAgreementResolved(userId: string, agreementId: string, link?: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.AGREEMENT_RESOLVED,
    title: "Dispute resolved",
    body: "The agreement dispute has been resolved.",
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyAgreementRevised(
  recipientId: string,
  initiatorName: string,
  agreementId: string,
  link?: string
): Promise<void> {
  await createNotification({
    userId: recipientId,
    type: NOTIFICATION_TYPES.AGREEMENT_REVISED,
    title: "Revised agreement sent",
    body: `${initiatorName} sent a revised agreement for your review.`,
    link: link || `/agreements/${agreementId}`,
    metadata: { agreementId },
  })
}

export async function notifyVerificationSubmitted(userId: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.VERIFICATION_SUBMITTED,
    title: "Verification submitted",
    body: "Your verification has been submitted for review.",
    link: "/verification",
  })
}

export async function notifyAdminsVerificationSubmitted(
  verificationType: string
): Promise<void> {
  try {
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" as const },
      select: { id: true },
    })
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: NOTIFICATION_TYPES.VERIFICATION_SUBMITTED,
        title: "Verification submitted",
        body: `A ${verificationType.toLowerCase()} verification was submitted for review.`,
        link: "/admin/verifications",
      })
    }
  } catch {
    // Fail silently
  }
}

export async function notifyVerificationApproved(userId: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.VERIFICATION_APPROVED,
    title: "Verification approved",
    body: "Your verification has been approved.",
    link: "/verification",
  })
}

export async function notifyVerificationRejected(userId: string, notes?: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.VERIFICATION_REJECTED,
    title: "Verification not approved",
    body: notes ? `Your verification was not approved. ${notes}` : "Your verification was not approved. Please check the verification center for details.",
    link: "/verification",
  })
}

export async function notifyVerificationMoreInfo(userId: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.VERIFICATION_MORE_INFO,
    title: "More information needed",
    body: "Additional information is required for your verification.",
    link: "/verification",
  })
}

export async function notifyDemoAccessApproved(userId: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.DEMO_ACCESS_APPROVED,
    title: "Demo access approved",
    body: "Your demo access request has been approved.",
    link: "/demonstrations",
  })
}

export async function notifyDemoAccessRejected(userId: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.DEMO_ACCESS_REJECTED,
    title: "Demo access not approved",
    body: "Your demo access request was not approved.",
    link: "/demo-access/apply",
  })
}

export async function notifyDemoApproved(userId: string, demoTitle: string, demoId: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.DEMO_APPROVED,
    title: "Demonstration approved",
    body: `"${demoTitle}" has been approved.`,
    link: `/demonstrations/${demoId}`,
    metadata: { demoId },
  })
}

export async function notifyDemoRejected(userId: string, demoTitle: string): Promise<void> {
  await createNotification({
    userId,
    type: NOTIFICATION_TYPES.DEMO_REJECTED,
    title: "Demonstration not approved",
    body: `"${demoTitle}" was not approved.`,
    link: "/demo-access/my-requests",
  })
}
