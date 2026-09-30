import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { calculateTrustScore, type TrustScoreResult } from "@/lib/trust-score"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Base user record (required)
    const userRows = (await query(
      `SELECT u.id,
              u.name,
              u."companyName",
              u.image,
              u.bio,
              u."companyWebsite",
              u.location,
              u."yearsInBusiness",
              u."teamSize",
              u."isVerified",
              u."identityVerified",
              u."businessVerified",
              u."enterpriseVerified",
              u."hasCipponMembership",
              u."emailVerified",
              u."createdAt"
       FROM "User" u WHERE u.id = ?`,
      [userId]
    )) as any[]

    if (!userRows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userRows[0]
    const createdAt = user.createdAt ? new Date(user.createdAt) : new Date()
    const accountAgeDays = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Defaults so the endpoint still works even if some tables are missing
    let hasIdentity = !!user.identityVerified
    let hasBusiness = !!user.businessVerified
    let hasEnterprise = !!user.enterpriseVerified

    let proposed = 0
    let active = 0
    let completed = 0
    let other = 0

    let disputesRaised = 0
    let disputesEscalated = 0
    let disputesResolved = 0

    let inquiriesReceived = 0
    let inquiriesResponded = 0
    let unansweredInquiries = 0

    let productCount = 0
    let productCountLast90Days = 0

    let hasRecentActivity = false

    // Optional: verification records
    try {
      const verificationRows = (await query(
        `SELECT "verificationType", status FROM "UserVerification" WHERE "userId" = ? AND status = ?`,
        [userId, "APPROVED"]
      )) as any[]
      hasIdentity = hasIdentity || verificationRows.some((r) => r.verificationType === "IDENTITY")
      hasBusiness = hasBusiness || verificationRows.some((r) => r.verificationType === "BUSINESS")
      hasEnterprise = hasEnterprise || verificationRows.some((r) => r.verificationType === "ENTERPRISE")
    } catch (err) {
      console.warn("Trust score: skipping UserVerification data due to error", err)
    }

    // Optional: agreement stats
    try {
      const agreementRows = (await query(
        `SELECT 
          COUNT(*) FILTER (WHERE a.status = 'PROPOSED' OR a.status = 'MODIFICATION_REQUESTED') as proposed,
          COUNT(*) FILTER (WHERE a.status = 'ACTIVE') as active,
          COUNT(*) FILTER (WHERE a.status = 'COMPLETED') as completed,
          COUNT(*) FILTER (WHERE a.status IN ('DECLINED','CANCELLED','RESOLVED')) as other,
          COUNT(*) FILTER (WHERE a.status = 'CANCELLED') as cancelled,
          COUNT(*) FILTER (WHERE a.status = 'DISPUTED') as disputed
         FROM "Agreement" a
         WHERE a."initiatorId" = ? OR a."receiverId" = ?`,
        [userId, userId]
      )) as any[]
      const ag = agreementRows[0] || {}
      proposed = Number(ag.proposed ?? 0)
      active = Number(ag.active ?? 0)
      completed = Number(ag.completed ?? 0)
      other = Number(ag.other ?? 0)
      // These feed into agreement performance scoring (optional fields in TrustScoreInput)
      var agreementsCancelled = Number(ag.cancelled ?? 0)
      var agreementsDisputed = Number(ag.disputed ?? 0)
    } catch (err) {
      console.warn("Trust score: skipping Agreement stats due to error", err)
    }

    const totalFinished = completed + other
    const agreementsCreated = proposed + active + completed + other
    const completionRate = totalFinished > 0 ? completed / totalFinished : 0

    // Optional: disputes / complaints
    try {
      const complaintRows = (await query(
        `SELECT status FROM "Complaint" c
         INNER JOIN "Agreement" a ON a.id = c."agreementId" AND (a."initiatorId" = ? OR a."receiverId" = ?)
         WHERE c."userId" = ?`,
        [userId, userId, userId]
      )) as any[]
      for (const row of complaintRows) {
        disputesRaised += 1
        if (row.status === "ESCALATED") disputesEscalated += 1
        if (row.status === "RESOLVED") disputesResolved += 1
      }
    } catch (err) {
      console.warn("Trust score: skipping Complaint stats due to error", err)
    }

    // Optional: inquiry responsiveness
    try {
      const inquiryRows = (await query(
        `SELECT status FROM "Inquiry" WHERE "vendorId" = ?`,
        [userId]
      )) as any[]
      inquiriesReceived = inquiryRows.length
      inquiriesResponded = inquiryRows.filter((r) => r.status && r.status !== "NEW").length
      unansweredInquiries = inquiryRows.filter((r) => r.status === "NEW").length
    } catch (err) {
      console.warn("Trust score: skipping Inquiry stats due to error", err)
    }

    // Optional: product activity
    try {
      const productRows = (await query(
        `SELECT COUNT(*) as cnt, COUNT(*) FILTER (WHERE "createdAt" >= NOW() - INTERVAL '90 days') as recent
         FROM "Product" WHERE "ownerId" = ?`,
        [userId]
      )) as any[]
      productCount = Number(productRows[0]?.cnt ?? 0)
      productCountLast90Days = Number(productRows[0]?.recent ?? 0)
    } catch (err) {
      console.warn("Trust score: skipping Product stats due to error", err)
    }

    // Optional: recent activity across multiple tables
    try {
      const recentActivityRows = (await query(
        `(SELECT "createdAt" FROM "Agreement" WHERE "initiatorId" = ? OR "receiverId" = ? ORDER BY "updatedAt" DESC LIMIT 1)
         UNION ALL
         (SELECT "createdAt" FROM "Product" WHERE "ownerId" = ? ORDER BY "updatedAt" DESC LIMIT 1)
         UNION ALL
         (SELECT "createdAt" FROM "Inquiry" WHERE "vendorId" = ? OR "buyerId" = ? ORDER BY "updatedAt" DESC LIMIT 1)`,
        [userId, userId, userId, userId, userId]
      )) as any[]
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
      hasRecentActivity = recentActivityRows.some(
        (r) => r.createdAt && new Date(r.createdAt).getTime() > thirtyDaysAgo
      )
    } catch (err) {
      console.warn("Trust score: skipping recent activity stats due to error", err)
    }

    const emailVerified = Boolean(user.emailVerified)
    const hasCipponMembership = Boolean(user.hasCipponMembership)
    const companyWebsiteVerified =
      !!user.companyWebsite && String(user.companyWebsite).trim().length > 0

    const input = {
      emailVerified,
      identityVerified: !!hasIdentity,
      businessVerified: !!hasBusiness,
      enterpriseVerified: !!hasEnterprise,
      hasCipponMembership,
      companyWebsiteVerified,
      hasCacVerification: false,

      hasCompanyName: !!(user.companyName && String(user.companyName).trim().length > 0),
      hasImage: !!(user.image && String(user.image).trim().length > 0),
      hasBio: !!(user.bio && String(user.bio).trim().length > 0),
      hasCompanyWebsite: !!(user.companyWebsite && String(user.companyWebsite).trim().length > 0),
      hasYearsInBusiness: user.yearsInBusiness != null && Number(user.yearsInBusiness) > 0,
      hasTeamSize: !!(user.teamSize && String(user.teamSize).trim().length > 0),
      hasLocation: !!(user.location && String(user.location).trim().length > 0),
      productCount,

      agreementsCreated,
      agreementsCompleted: completed,
      agreementsActive: active,
      completionRate,
      agreementsDisputed,
      agreementsCancelled,

      disputesRaised,
      disputesEscalated,
      disputesResolved,

      inquiriesReceived,
      inquiriesResponded,
      unansweredInquiries,

      accountAgeDays,
      hasRecentActivity,
      productCountLast90Days,
    }

    const result: TrustScoreResult = calculateTrustScore(input)

    return NextResponse.json({
      trustScore: result.score,
      level: result.level,
      breakdown: result.breakdown,
      positiveSignals: result.positiveSignals,
      riskSignals: result.riskSignals,
      details: {
        userName: user.name,
        companyName: user.companyName,
        accountAgeDays,
        agreementsCompleted: completed,
        agreementsCreated,
        completionRate: Math.round(completionRate * 100),
        disputesRaised,
        disputesEscalated,
        disputesResolved,
        inquiriesReceived,
        inquiriesResponded,
        productCount,
        // Expose verification signals so the UI can show clear badges.
        emailVerified,
        identityVerified: !!hasIdentity,
        businessVerified: !!hasBusiness,
        enterpriseVerified: !!hasEnterprise,
        hasCipponMembership,
        companyWebsiteVerified,
      },
    })
  } catch (error) {
    console.error("Error checking user trustworthiness:", error)
    return NextResponse.json(
      { error: "Failed to check user trustworthiness" },
      { status: 500 }
    )
  }
}
