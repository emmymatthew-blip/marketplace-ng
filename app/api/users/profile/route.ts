import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      companyName,
      phone,
      location,
      bio,
      jobTitle,
      companyWebsite,
      role,
      country,
      cityState,
      specialties,
      yearsInBusiness,
      teamSize,
    } = body

    await query(
      `UPDATE "User" SET 
        name = COALESCE(?, name),
        "companyName" = COALESCE(?, "companyName"),
        phone = COALESCE(?, phone),
        location = COALESCE(?, location),
        bio = COALESCE(?, bio),
        "jobTitle" = COALESCE(?, "jobTitle"),
        "companyWebsite" = COALESCE(?, "companyWebsite"),
        role = COALESCE(?, role),
        country = COALESCE(?, country),
        "cityState" = COALESCE(?, "cityState"),
        specialties = COALESCE(?, specialties),
        "yearsInBusiness" = COALESCE(?, "yearsInBusiness"),
        "teamSize" = COALESCE(?, "teamSize"),
        "updatedAt" = NOW()
       WHERE id = ?`,
      [
        name ?? null,
        companyName ?? null,
        phone ?? null,
        location ?? null,
        bio ?? null,
        jobTitle ?? null,
        companyWebsite ?? null,
        role ?? null,
        country ?? null,
        cityState ?? null,
        typeof specialties === "string" ? specialties : Array.isArray(specialties) ? JSON.stringify(specialties) : specialties ?? null,
        typeof yearsInBusiness === "number"
          ? yearsInBusiness
          : typeof yearsInBusiness === "string" && yearsInBusiness.trim() !== ""
            ? parseInt(yearsInBusiness, 10)
            : null,
        teamSize ?? null,
        session.user.id,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[PROFILE_UPDATE_ERROR]", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
