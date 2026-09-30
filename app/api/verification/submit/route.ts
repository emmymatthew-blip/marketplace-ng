import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import {
  notifyAdminsVerificationSubmitted,
  notifyVerificationSubmitted,
} from "@/lib/notifications"
import { randomUUID } from "crypto"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { verificationType, documentUrl, documentType, metadata } = body

    if (!verificationType || !["IDENTITY", "BUSINESS", "ENTERPRISE"].includes(verificationType)) {
      return NextResponse.json(
        { error: "verificationType must be IDENTITY, BUSINESS, or ENTERPRISE" },
        { status: 400 }
      )
    }

    const id = randomUUID()
    const metadataStr = metadata ? JSON.stringify(metadata) : null

    await query(
      `INSERT INTO "UserVerification" (
        id, "userId", "verificationType", "documentUrl", "documentType",
        status, "submittedAt", "createdAt", "updatedAt", "metadata"
      ) VALUES (?, ?, ?, ?, ?, 'PENDING', NOW(), NOW(), NOW(), ?)`,
      [
        id,
        session.user.id,
        verificationType,
        documentUrl ?? null,
        documentType ?? null,
        metadataStr,
      ]
    )

    notifyVerificationSubmitted(session.user.id).catch(() => {})
    notifyAdminsVerificationSubmitted(verificationType).catch(() => {})

    return NextResponse.json({
      id,
      verificationType,
      status: "PENDING",
      message: "Verification submitted for review.",
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to submit verification" },
      { status: 500 }
    )
  }
}
