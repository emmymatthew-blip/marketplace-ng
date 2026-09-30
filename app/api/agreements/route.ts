import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"
import { prisma } from "@/lib/prisma"
import { trackEvent } from "@/lib/analytics"
import { ensureAgreementThreadSupport, logAgreementThreadEvent } from "@/lib/agreement-thread-events"
import { notifyAgreementOffered } from "@/lib/notifications"

// Define validation schema
const agreementSchema = z.object({
  receiverId: z.string(),
  title: z.string().optional(),
  terms: z.string().min(10, { message: "Terms must be at least 10 characters" }),
  notes: z.string().optional(),
  inquiryId: z.string().optional(),
  productId: z.string().optional(),
  messageContactId: z.string().optional(),
  sourceType: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await ensureAgreementThreadSupport()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const userId = session.user.id

    let sql = `
      SELECT a.*,
        i.id as "initiatorId", i.name as "initiatorName", i.role as "initiatorRole", 
        i."isVerified" as "initiatorIsVerified", i."companyName" as "initiatorCompanyName",
        r.id as "receiverId", r.name as "receiverName", r.role as "receiverRole", 
        r."isVerified" as "receiverIsVerified", r."companyName" as "receiverCompanyName",
        p.id as "productId", p.title as "productTitle", p.images as "productImages"
      FROM "Agreement" a
      JOIN "User" i ON a."initiatorId" = i.id
      JOIN "User" r ON a."receiverId" = r.id
      LEFT JOIN "Product" p ON a."productId" = p.id
      WHERE (a."initiatorId" = ? OR a."receiverId" = ?)
    `
    const params: any[] = [userId, userId]

    if (status) {
      sql += ` AND a.status = ?`
      params.push(status)
    }

    sql += ` ORDER BY a."createdAt" DESC`

    const agreements = await query(sql, params)

    // Format the agreements to match the expected structure
    const formattedAgreements = (agreements as any[]).map((agreement) => {
      const productImagesValue = agreement.productImages || agreement["productImages"]
      return {
        id: agreement.id,
        title: agreement.title || null,
        status: agreement.status,
        terms: agreement.terms,
        notes: agreement.notes,
        sourceType: agreement.sourceType || agreement["sourceType"] || null,
        messageContactId: agreement.messageContactId || agreement["messageContactId"] || null,
        inquiryId: agreement.inquiryId || agreement["inquiryId"] || null,
        createdAt: agreement.createdAt || agreement["createdAt"],
        updatedAt: agreement.updatedAt || agreement["updatedAt"],
        product:
          agreement.productId || agreement["productId"]
            ? {
                id: agreement.productId || agreement["productId"],
                title: agreement.productTitle || agreement["productTitle"] || "Listing",
                images: (() => {
                  if (Array.isArray(productImagesValue)) return productImagesValue
                  if (typeof productImagesValue !== "string") return []
                  try {
                    const parsed = JSON.parse(productImagesValue)
                    return Array.isArray(parsed) ? parsed : []
                  } catch {
                    return []
                  }
                })(),
              }
            : null,
        initiator: {
          id: agreement.initiatorId || agreement["initiatorId"],
          name: agreement.initiatorName || agreement["initiatorName"],
          role: agreement.initiatorRole || agreement["initiatorRole"],
          isVerified: Boolean(agreement.initiatorIsVerified || agreement["initiatorIsVerified"]),
          companyName: agreement.initiatorCompanyName || agreement["initiatorCompanyName"],
        },
        receiver: {
          id: agreement.receiverId || agreement["receiverId"],
          name: agreement.receiverName || agreement["receiverName"],
          role: agreement.receiverRole || agreement["receiverRole"],
          isVerified: Boolean(agreement.receiverIsVerified || agreement["receiverIsVerified"]),
          companyName: agreement.receiverCompanyName || agreement["receiverCompanyName"],
        },
      }
    })

    return NextResponse.json(formattedAgreements)
  } catch (error) {
    console.error("Error fetching agreements:", error)
    return NextResponse.json({ error: "Failed to fetch agreements" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { receiverId, title, terms, notes, inquiryId, productId, messageContactId, sourceType } =
      agreementSchema.parse(body)

    await ensureAgreementThreadSupport()

    // Check if receiver exists
    const users = await query('SELECT * FROM "User" WHERE id = ?', [receiverId])

    if (!users || (users as any[]).length === 0) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    // Generate ID
    const generateId = () => {
      return 'cm' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    }
    const agreementId = generateId()

    // Create agreement
    await query(
      `INSERT INTO "Agreement" (
        id,
        title,
        "initiatorId",
        "receiverId",
        terms,
        notes,
        status,
        "sourceType",
        "messageContactId",
        "productId",
        "inquiryId",
        "createdAt",
        "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        agreementId,
        title || null,
        session.user.id,
        receiverId,
        terms,
        notes || null,
        "PROPOSED",
        sourceType || null,
        messageContactId || receiverId,
        productId || null,
        inquiryId || null,
      ],
    )

    await logAgreementThreadEvent({
      agreementId,
      actorId: session.user.id,
      status: "PROPOSED",
      eventType: "DRAFT_CREATED",
      messageContactId: messageContactId || receiverId,
      productId: productId || null,
      inquiryId: inquiryId || null,
    })

    try {
      await query(
        `UPDATE "Agreement" SET "currentVersion" = 1 WHERE id = ?`,
        [agreementId]
      )
      const revId = "rev-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
      await query(
        `INSERT INTO "AgreementRevision" (id, "agreementId", version, title, terms, notes, "createdById", "createdAt")
         VALUES (?, ?, 1, ?, ?, ?, ?, NOW())`,
        [revId, agreementId, title || null, terms, notes || null, session.user.id]
      )
    } catch {
      // Revision tables may not exist yet
    }

    // Fetch the created agreement with user details
    const sql = `
      SELECT a.*,
        i.id as "initiatorId", i.name as "initiatorName", i.role as "initiatorRole", 
        i."isVerified" as "initiatorIsVerified", i."companyName" as "initiatorCompanyName",
        r.id as "receiverId", r.name as "receiverName", r.role as "receiverRole", 
        r."isVerified" as "receiverIsVerified", r."companyName" as "receiverCompanyName",
        p.id as "productId", p.title as "productTitle", p.images as "productImages"
      FROM "Agreement" a
      JOIN "User" i ON a."initiatorId" = i.id
      JOIN "User" r ON a."receiverId" = r.id
      LEFT JOIN "Product" p ON a."productId" = p.id
      WHERE a.id = ?
    `

    const agreements = await query(sql, [agreementId])
    const agreement = (agreements as any[])[0]

    if (inquiryId) {
      try {
        await prisma.inquiry.updateMany({
          where: {
            id: inquiryId,
            OR: [{ vendorId: session.user.id }, { buyerId: session.user.id }],
          },
          data: { agreementId, status: "AGREEMENT_CREATED" },
        })
      } catch {
        // Inquiry link optional
      }
    }

    await trackEvent({
      eventType: "agreement_created",
      ownerId: receiverId,
      actorId: session.user.id,
      agreementId,
      inquiryId: inquiryId ?? undefined,
    })

    const initiatorName = agreement.initiatorName ?? agreement["initiatorName"] ?? "A partner"
    const agreementLink =
      messageContactId || receiverId
        ? `/messages/${messageContactId || receiverId}${productId ? `?productId=${productId}` : ""}`
        : `/agreements/${agreementId}`
    notifyAgreementOffered(receiverId, initiatorName, agreementId, agreementLink).catch(() => {})

    // Format the agreement to match the expected structure
    const formattedAgreement = {
      id: agreement.id,
      title: agreement.title || null,
      status: agreement.status,
      terms: agreement.terms,
      notes: agreement.notes,
      sourceType: agreement.sourceType || agreement["sourceType"] || null,
      messageContactId: agreement.messageContactId || agreement["messageContactId"] || null,
      inquiryId: agreement.inquiryId || agreement["inquiryId"] || null,
      createdAt: agreement.createdAt || agreement["createdAt"],
      updatedAt: agreement.updatedAt || agreement["updatedAt"],
      product:
        agreement.productId || agreement["productId"]
          ? {
              id: agreement.productId || agreement["productId"],
              title: agreement.productTitle || agreement["productTitle"] || "Listing",
              images: (() => {
                const value = agreement.productImages || agreement["productImages"]
                if (Array.isArray(value)) return value
                if (typeof value !== "string") return []
                try {
                  const parsed = JSON.parse(value)
                  return Array.isArray(parsed) ? parsed : []
                } catch {
                  return []
                }
              })(),
            }
          : null,
      initiator: {
        id: agreement.initiatorId || agreement["initiatorId"],
        name: agreement.initiatorName || agreement["initiatorName"],
        role: agreement.initiatorRole || agreement["initiatorRole"],
        isVerified: Boolean(agreement.initiatorIsVerified || agreement["initiatorIsVerified"]),
        companyName: agreement.initiatorCompanyName || agreement["initiatorCompanyName"],
      },
      receiver: {
        id: agreement.receiverId || agreement["receiverId"],
        name: agreement.receiverName || agreement["receiverName"],
        role: agreement.receiverRole || agreement["receiverRole"],
        isVerified: Boolean(agreement.receiverIsVerified || agreement["receiverIsVerified"]),
        companyName: agreement.receiverCompanyName || agreement["receiverCompanyName"],
      },
    }

    return NextResponse.json(formattedAgreement, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating agreement:", error)
    return NextResponse.json({ error: "Failed to create agreement" }, { status: 500 })
  }
}
