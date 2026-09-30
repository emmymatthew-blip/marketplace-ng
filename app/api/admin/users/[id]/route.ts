import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { deriveDemoAccessStatusFromRequests } from "@/lib/demo-access-summary"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const resolvedParams = await Promise.resolve(params)
    const userId = resolvedParams.id

    const user = await query(
      `SELECT 
        id, name, email, "companyName", role, "isVerified", phone, location, 
        "cityState", country, bio, image, "companyWebsite", "jobTitle",
        "firstName", "lastName", "videoUrl", "videoDescription",
        gallery, specialties, "yearsInBusiness", "teamSize",
        certifications, "linkedinUrl", "twitterUrl", "satisfactionRate",
        "hasCipponMembership", "cipponMembershipType", "cipponMembershipNumber",
        "cipponLicenseNumber", "createdAt", "updatedAt"
       FROM "User"
       WHERE id = ?`,
      [userId]
    )

    if (!user || (user as any[]).length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userData = (user as any[])[0]

    const demoRows = await query<{ status: string; title: string; requestedAt: string }>(
      `SELECT status::text AS status, title, "requestedAt"::text AS "requestedAt"
       FROM "DemoAccessRequest"
       WHERE "userId" = ?
       ORDER BY "requestedAt" DESC
       LIMIT 20`,
      [userId]
    )

    const demoAccessSummaryStatus = deriveDemoAccessStatusFromRequests(demoRows || [])
    const latestDemoRequest = demoRows && demoRows.length > 0 ? demoRows[0] : null

    // Parse JSON fields
    let gallery: unknown[] = []
    let specialties: unknown[] = []
    let certifications: unknown[] = []

    try {
      if (userData.gallery) gallery = JSON.parse(userData.gallery)
      if (userData.specialties) specialties = JSON.parse(userData.specialties)
      if (userData.certifications) certifications = JSON.parse(userData.certifications)
    } catch (e) {
      console.error("Error parsing JSON fields:", e)
    }

    return NextResponse.json({
      success: true,
      data: {
        ...userData,
        gallery,
        specialties,
        certifications,
        demoAccessSummaryStatus,
        demoAccessRequests: demoRows || [],
        latestDemoRequestTitle: latestDemoRequest?.title ?? null,
        latestDemoRequestAt: latestDemoRequest?.requestedAt ?? null,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user"
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
