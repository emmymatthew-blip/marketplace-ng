import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendorId = params.id

    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 })
    }

    // First try to find by ID
    let sql = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u."companyName",
        u."jobTitle",
        u."companyWebsite",
        u.country,
        u."cityState",
        u.location,
        u.phone,
        u.bio,
        u."isVerified",
        u."hasCipponMembership",
        u."cipponMembershipType",
        u."cipponMembershipNumber",
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
        COUNT(DISTINCT p.id) as "productCount",
        COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as "completedProjects",
        COUNT(DISTINCT CASE WHEN a.status = 'ACTIVE' THEN a.id END) as "activeClients",
        COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as "completedAgreements",
        COUNT(DISTINCT CASE WHEN a.status = 'DISPUTED' THEN a.id END) as "disputedAgreements",
        COUNT(DISTINCT CASE WHEN a.status IN ('COMPLETED', 'DISPUTED') THEN a.id END) as "totalRelevantAgreements"
      FROM "User" u
      LEFT JOIN "Product" p ON u.id = p."ownerId"
      LEFT JOIN "Agreement" a ON (u.id = a."initiatorId" OR u.id = a."receiverId") AND a.status IN ('COMPLETED', 'DISPUTED')
      WHERE u.id = ? AND u.role != ?
      GROUP BY u.id
    `

    let vendors = await query(sql, [vendorId, 'ADMIN'])

    // If not found by ID and it looks like an email, try searching by email
    if ((!vendors || (vendors as any[]).length === 0) && vendorId.includes('@')) {
      sql = `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u."companyName",
          u."jobTitle",
          u."companyWebsite",
          u.country,
          u."cityState",
          u.location,
          u.phone,
          u.bio,
          u."isVerified",
          u."hasCipponMembership",
          u."cipponMembershipType",
          u."cipponMembershipNumber",
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
          COUNT(DISTINCT p.id) as "productCount",
          COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as "completedProjects",
          COUNT(DISTINCT CASE WHEN a.status = 'ACTIVE' THEN a.id END) as "activeClients",
          COUNT(DISTINCT CASE WHEN a.status = 'COMPLETED' THEN a.id END) as "completedAgreements",
          COUNT(DISTINCT CASE WHEN a.status = 'DISPUTED' THEN a.id END) as "disputedAgreements",
          COUNT(DISTINCT CASE WHEN a.status IN ('COMPLETED', 'DISPUTED') THEN a.id END) as "totalRelevantAgreements"
        FROM "User" u
        LEFT JOIN "Product" p ON u.id = p."ownerId"
        LEFT JOIN "Agreement" a ON (u.id = a."initiatorId" OR u.id = a."receiverId") AND a.status IN ('COMPLETED', 'DISPUTED')
        WHERE u.email = ? AND u.role != ?
        GROUP BY u.id
      `
      vendors = await query(sql, [vendorId, 'ADMIN'])
    }

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
    // Always calculate from agreements, never use stored value
    const completedAgreements = parseInt(vendor.completedAgreements) || 0
    const disputedAgreements = parseInt(vendor.disputedAgreements) || 0
    const totalRelevantAgreements = completedAgreements + disputedAgreements
    
    console.log(`[Vendor ${vendorId}] Satisfaction Rate Calculation:`, {
      completedAgreements,
      disputedAgreements,
      totalRelevantAgreements,
      storedValue: vendor.satisfactionRate
    })
    
    let calculatedSatisfactionRate: number | null = null
    if (totalRelevantAgreements > 0) {
      // Calculate percentage: (completed / total) * 100
      calculatedSatisfactionRate = Math.round((completedAgreements / totalRelevantAgreements) * 100 * 10) / 10 // Round to 1 decimal place
      console.log(`[Vendor ${vendorId}] Calculated satisfaction rate: ${calculatedSatisfactionRate}%`)
    } else {
      console.log(`[Vendor ${vendorId}] No agreements found, satisfaction rate set to null`)
    }
    // If no agreements, leave as null (don't use stored value)

    // Transform the data to match the expected format
    const formattedVendor = {
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      role: vendor.role,
      companyName: vendor.companyName,
      jobTitle: vendor.jobTitle,
      companyWebsite: vendor.companyWebsite,
      country: vendor.country,
      cityState: vendor.cityState,
      location: vendor.location,
      phone: vendor.phone,
      bio: vendor.bio,
      isVerified: Boolean(vendor.isVerified),
      hasCipponMembership: Boolean(vendor.hasCipponMembership),
      cipponMembershipType: vendor.cipponMembershipType,
      cipponMembershipNumber: vendor.cipponMembershipNumber,
      image: vendor.image,
      logo: vendor.image, // Alias for compatibility
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
      productCount: parseInt(vendor.productCount) || 0,
      completedProjects: parseInt(vendor.completedProjects) || 0,
      activeClients: parseInt(vendor.activeClients) || 0,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    }

    return NextResponse.json(formattedVendor)
  } catch (error) {
    console.error("Error fetching vendor:", error)
    return NextResponse.json(
      { error: "Failed to fetch vendor. Please try again later." },
      { status: 500 }
    )
  }
}

