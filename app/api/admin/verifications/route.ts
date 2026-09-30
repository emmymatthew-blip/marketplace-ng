import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const rows = await query(
      `SELECT uv.*, u.name as "userName", u.email as "userEmail", u."companyName" as "userCompanyName", u.image as "userImage"
       FROM "UserVerification" uv
       JOIN "User" u ON uv."userId" = u.id
       WHERE uv.status = 'PENDING'
       ORDER BY uv."submittedAt" DESC`
    ) as any[]

    const list = (rows ?? []).map((r) => ({
      id: r.id,
      userId: r.userId,
      verificationType: r.verificationType ?? r["verificationType"],
      documentUrl: r.documentUrl ?? r["documentUrl"],
      documentType: r.documentType ?? r["documentType"],
      status: r.status,
      submittedAt: r.submittedAt ?? r["submittedAt"],
      notes: r.notes,
      metadata: r.metadata ? (typeof r.metadata === "string" ? JSON.parse(r.metadata) : r.metadata) : null,
      userName: r.userName ?? r["userName"],
      userEmail: r.userEmail ?? r["userEmail"],
      userCompanyName: r.userCompanyName ?? r["userCompanyName"],
      userImage: r.userImage ?? r["userImage"],
    }))

    return NextResponse.json(list)
  } catch {
    return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 })
  }
}
