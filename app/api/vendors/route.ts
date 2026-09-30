import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { USER_ROLES } from "@/lib/user-roles"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")
    const location = searchParams.get("location")
    const verified = searchParams.get("verified")

    // Get buyer roles to exclude
    const buyerRoles = [...USER_ROLES.PRINT_BUYERS]
    const rolesToExclude = ['ADMIN', ...buyerRoles]

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
        u."createdAt",
        u."updatedAt",
        COUNT(p.id) as "productCount"
      FROM "User" u
      LEFT JOIN "Product" p ON u.id = p."ownerId"
      WHERE u.role NOT IN (${rolesToExclude.map(() => '?').join(', ')})
    `
    const params: any[] = rolesToExclude

    if (role) {
      sql += ` AND u.role = ?`
      params.push(role)
    }

    if (search) {
      sql += ` AND (u.name LIKE ? OR u."companyName" LIKE ? OR u.bio LIKE ?)`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    if (location) {
      sql += ` AND (u.location LIKE ? OR u."cityState" LIKE ? OR u.country LIKE ?)`
      const locationTerm = `%${location}%`
      params.push(locationTerm, locationTerm, locationTerm)
    }

    if (verified === "true") {
      sql += ` AND u."isVerified" = true`
    }

    sql += " GROUP BY u.id ORDER BY u.\"isVerified\" DESC, u.\"createdAt\" DESC"

    const vendors = await query(sql, params)

    // Transform the data to match the expected format
    const transformedVendors = vendors.map((vendor: any) => ({
      id: vendor.id,
      name: vendor.name || vendor.companyName || "Unknown Vendor",
      description: vendor.bio || "No description available",
      category: vendor.role?.replace(/_/g, " ") || "Vendor",
      location: vendor.location || vendor.cityState || vendor.country || "Location not specified",
      image: vendor.image || "/placeholder-user.jpg",
      verified: vendor.isVerified,
      rating: 4.5, // Mock rating for now
      reviews: Math.floor(Math.random() * 100) + 10, // Mock reviews for now
      email: vendor.email,
      phone: vendor.phone,
      companyName: vendor.companyName,
      jobTitle: vendor.jobTitle,
      companyWebsite: vendor.companyWebsite,
      hasCipponMembership: vendor.hasCipponMembership,
      cipponMembershipType: vendor.cipponMembershipType,
      cipponMembershipNumber: vendor.cipponMembershipNumber,
      productCount: parseInt(vendor.productCount) || 0,
      role: vendor.role
    }))

    return NextResponse.json({
      success: true,
      data: transformedVendors
    })
  } catch (error: any) {
    console.error("Error fetching vendors:", error)
    console.error("Error details:", error.message, error.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch vendors",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
