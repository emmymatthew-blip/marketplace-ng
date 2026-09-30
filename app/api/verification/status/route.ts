import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import {
  buildMethodStatuses,
  type VerificationSubmission,
  type VerificationStatusPayload,
} from "@/lib/normalizers/verification"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rows = (await query(
      `SELECT "verificationLevel", "identityVerified", "businessVerified", "enterpriseVerified", "isVerified"
       FROM "User" WHERE id = ?`,
      [session.user.id]
    )) as Record<string, unknown>[]

    const submissionsRaw = (await query(
      `SELECT id, "verificationType", "documentType", status, "submittedAt", metadata
       FROM "UserVerification"
       WHERE "userId" = ?
       ORDER BY "submittedAt" DESC
       LIMIT 50`,
      [session.user.id]
    )) as Record<string, unknown>[]

    const submissions: VerificationSubmission[] = (submissionsRaw ?? []).map((s) => ({
      id: String(s?.id ?? ""),
      verificationType: String(s?.verificationType ?? ""),
      documentType: s?.documentType != null ? String(s.documentType) : null,
      status: String(s?.status ?? "PENDING"),
      submittedAt: s?.submittedAt != null ? String(s.submittedAt) : null,
      metadata: (() => {
        if (!s?.metadata) return null
        try {
          return JSON.parse(String(s.metadata)) as Record<string, unknown>
        } catch {
          return null
        }
      })(),
    }))

    const identityVerified = Boolean(rows?.[0]?.identityVerified ?? rows?.[0]?.["identityVerified"])
    const businessVerified = Boolean(rows?.[0]?.businessVerified ?? rows?.[0]?.["businessVerified"])
    const enterpriseVerified = Boolean(rows?.[0]?.enterpriseVerified ?? rows?.[0]?.["enterpriseVerified"])

    const methodStatuses = buildMethodStatuses(submissions, {
      identityVerified,
      businessVerified,
      enterpriseVerified,
    })

    const base: VerificationStatusPayload = {
      verificationLevel: Number(rows?.[0]?.verificationLevel ?? rows?.[0]?.["verificationLevel"] ?? 0),
      identityVerified,
      businessVerified,
      enterpriseVerified,
      isVerified: Boolean(rows?.[0]?.isVerified ?? rows?.[0]?.["isVerified"]),
      submissions,
      methodStatuses,
    }

    return NextResponse.json(base)
  } catch {
    const fallback: VerificationStatusPayload = {
      verificationLevel: 0,
      identityVerified: false,
      businessVerified: false,
      enterpriseVerified: false,
      isVerified: false,
      submissions: [],
      methodStatuses: buildMethodStatuses(
        [],
        { identityVerified: false, businessVerified: false, enterpriseVerified: false }
      ),
    }
    return NextResponse.json(fallback)
  }
}
