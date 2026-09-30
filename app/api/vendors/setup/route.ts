import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      companyName,
      bio,
      phone,
      email,
      location,
      cityState,
      country,
      companyWebsite,
      linkedinUrl,
      twitterUrl,
      logo,
      gallery,
      videoUrl,
      videoDescription,
      specialties,
      yearsInBusiness,
      teamSize,
      certifications,
      completedProjects,
      activeClients,
      // satisfactionRate is now calculated from agreements, not stored
    } = body

    // Convert arrays to JSON strings for storage
    const galleryJson = gallery && Array.isArray(gallery) ? JSON.stringify(gallery) : null
    const specialtiesJson = specialties && Array.isArray(specialties) ? JSON.stringify(specialties) : null
    const certificationsJson = certifications && Array.isArray(certifications) ? JSON.stringify(certifications) : null

    // Update all vendor profile fields
    await query(
      `UPDATE "User" 
       SET name = ?, 
           "companyName" = ?, 
           bio = ?, 
           phone = ?, 
           email = COALESCE(?, email),
           location = ?, 
           "cityState" = ?,
           country = ?,
           "companyWebsite" = ?,
           image = ?,
           "videoUrl" = ?,
           "videoDescription" = ?,
           gallery = ?,
           specialties = ?,
           "yearsInBusiness" = ?,
           "teamSize" = ?,
           certifications = ?,
           "linkedinUrl" = ?,
           "twitterUrl" = ?,
           "updatedAt" = NOW() 
       WHERE id = ?`,
      [
        name || null,
        companyName || null,
        bio || null,
        phone || null,
        email || null,
        location || null,
        cityState || null,
        country || null,
        companyWebsite || null,
        logo || null,
        videoUrl || null,
        videoDescription || null,
        galleryJson,
        specialtiesJson,
        yearsInBusiness ? parseInt(yearsInBusiness) : null,
        teamSize || null,
        certificationsJson,
        linkedinUrl || null,
        twitterUrl || null,
        session.user.id,
      ]
    )

    return NextResponse.json({ 
      success: true,
      message: "Vendor profile updated successfully" 
    })
  } catch (error: any) {
    console.error("[VENDOR_SETUP_ERROR]", error)
    return NextResponse.json(
      { 
        error: "Failed to update vendor profile",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch vendor data with all profile fields and calculate satisfaction rate from agreements
    const vendors = await query(
      `SELECT 
        u.id,
        u.name,
        u.email,
        u."companyName",
        u.bio,
        u.phone,
        u.location,
        u."cityState",
        u.country,
        u."companyWebsite",
        u.image,
        u."videoUrl",
        u."videoDescription",
        u.gallery,
        u.specialties,
        u."yearsInBusiness",
        u."teamSize",
        u.certifications,
        u."linkedinUrl",
        u."twitterUrl",
        u."satisfactionRate",
        u."createdAt",
        u."updatedAt",
        COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as "completedAgreements",
        COUNT(DISTINCT CASE WHEN a.status = 'DISPUTED' THEN a.id END) as "disputedAgreements"
      FROM "User" u
      LEFT JOIN "Agreement" a ON (u.id = a."initiatorId" OR u.id = a."receiverId") AND a.status IN ('COMPLETED', 'DISPUTED')
      WHERE u.id = ?
      GROUP BY u.id`,
      [session.user.id]
    )

    if (!vendors || (vendors as any[]).length === 0) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 })
    }

    const vendor = (vendors as any[])[0]

    // Parse JSON fields
    let gallery = []
    let specialties = []
    let certifications = []
    
    try {
      if (vendor.gallery) gallery = JSON.parse(vendor.gallery)
      if (vendor.specialties) specialties = JSON.parse(vendor.specialties)
      if (vendor.certifications) certifications = JSON.parse(vendor.certifications)
    } catch (e) {
      console.error("Error parsing JSON fields:", e)
    }

    // Calculate satisfaction rate from agreements
    // Formula: (COMPLETED / (COMPLETED + DISPUTED)) * 100
    const completedAgreements = parseInt(vendor.completedAgreements) || 0
    const disputedAgreements = parseInt(vendor.disputedAgreements) || 0
    const totalRelevantAgreements = completedAgreements + disputedAgreements
    
    let calculatedSatisfactionRate: number | null = null
    if (totalRelevantAgreements > 0) {
      // Calculate percentage: (completed / total) * 100
      calculatedSatisfactionRate = Math.round((completedAgreements / totalRelevantAgreements) * 100 * 10) / 10 // Round to 1 decimal place
    }
    // If no agreements, leave as null (don't use stored value)

    return NextResponse.json({
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        companyName: vendor.companyName,
        bio: vendor.bio,
        phone: vendor.phone,
        location: vendor.location,
        cityState: vendor.cityState,
        country: vendor.country,
        companyWebsite: vendor.companyWebsite,
        image: vendor.image,
        videoUrl: vendor.videoUrl,
        videoDescription: vendor.videoDescription,
        gallery: gallery,
        specialties: specialties,
        yearsInBusiness: vendor.yearsInBusiness,
        teamSize: vendor.teamSize,
        certifications: certifications,
        linkedinUrl: vendor.linkedinUrl,
        twitterUrl: vendor.twitterUrl,
        satisfactionRate: calculatedSatisfactionRate,
      }
    })
  } catch (error: any) {
    console.error("[VENDOR_SETUP_GET_ERROR]", error)
    return NextResponse.json(
      { 
        error: "Failed to fetch vendor profile",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
