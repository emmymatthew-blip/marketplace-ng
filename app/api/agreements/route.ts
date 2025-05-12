import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from "@/lib/db"

// Define validation schema
const agreementSchema = z.object({
  receiverId: z.string(),
  terms: z.string().min(10, { message: "Terms must be at least 10 characters" }),
  notes: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const userId = session.user.id

    let sql = `
      SELECT a.*, 
        i.id as initiatorId, i.name as initiatorName, i.role as initiatorRole, 
        i.isVerified as initiatorIsVerified, i.companyName as initiatorCompanyName,
        r.id as receiverId, r.name as receiverName, r.role as receiverRole, 
        r.isVerified as receiverIsVerified, r.companyName as receiverCompanyName
      FROM agreements a
      JOIN users i ON a.initiatorId = i.id
      JOIN users r ON a.receiverId = r.id
      WHERE (a.initiatorId = ? OR a.receiverId = ?)
    `
    const params: any[] = [userId, userId]

    if (status) {
      sql += " AND a.status = ?"
      params.push(status)
    }

    sql += " ORDER BY a.createdAt DESC"

    const agreements = await query(sql, params)

    // Format the agreements to match the expected structure
    const formattedAgreements = (agreements as any[]).map((agreement) => ({
      id: agreement.id,
      status: agreement.status,
      terms: agreement.terms,
      notes: agreement.notes,
      createdAt: agreement.createdAt,
      updatedAt: agreement.updatedAt,
      initiator: {
        id: agreement.initiatorId,
        name: agreement.initiatorName,
        role: agreement.initiatorRole,
        isVerified: Boolean(agreement.initiatorIsVerified),
        companyName: agreement.initiatorCompanyName,
      },
      receiver: {
        id: agreement.receiverId,
        name: agreement.receiverName,
        role: agreement.receiverRole,
        isVerified: Boolean(agreement.receiverIsVerified),
        companyName: agreement.receiverCompanyName,
      },
    }))

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
    const { receiverId, terms, notes } = agreementSchema.parse(body)

    // Check if receiver exists
    const users = await query("SELECT * FROM users WHERE id = ?", [receiverId])

    if (!users || (users as any[]).length === 0) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 })
    }

    // Create agreement
    const result = await query(
      `INSERT INTO agreements (initiatorId, receiverId, terms, notes, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [session.user.id, receiverId, terms, notes, "PROPOSED"],
    )

    const agreementId = (result as any).insertId

    // Fetch the created agreement with user details
    const sql = `
      SELECT a.*, 
        i.id as initiatorId, i.name as initiatorName, i.role as initiatorRole, 
        i.isVerified as initiatorIsVerified, i.companyName as initiatorCompanyName,
        r.id as receiverId, r.name as receiverName, r.role as receiverRole, 
        r.isVerified as receiverIsVerified, r.companyName as receiverCompanyName
      FROM agreements a
      JOIN users i ON a.initiatorId = i.id
      JOIN users r ON a.receiverId = r.id
      WHERE a.id = ?
    `

    const agreements = await query(sql, [agreementId])
    const agreement = (agreements as any[])[0]

    // Format the agreement to match the expected structure
    const formattedAgreement = {
      id: agreement.id,
      status: agreement.status,
      terms: agreement.terms,
      notes: agreement.notes,
      createdAt: agreement.createdAt,
      updatedAt: agreement.updatedAt,
      initiator: {
        id: agreement.initiatorId,
        name: agreement.initiatorName,
        role: agreement.initiatorRole,
        isVerified: Boolean(agreement.initiatorIsVerified),
        companyName: agreement.initiatorCompanyName,
      },
      receiver: {
        id: agreement.receiverId,
        name: agreement.receiverName,
        role: agreement.receiverRole,
        isVerified: Boolean(agreement.receiverIsVerified),
        companyName: agreement.receiverCompanyName,
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
