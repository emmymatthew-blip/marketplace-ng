import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from "@/lib/db"

// Define validation schema
const agreementUpdateSchema = z.object({
  status: z.enum(["PROPOSED", "ACTIVE", "COMPLETED", "DISPUTED"]).optional(),
  terms: z.string().min(10, { message: "Terms must be at least 10 characters" }).optional(),
  notes: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

    const agreements = await query(sql, [params.id])

    if (!agreements || (agreements as any[]).length === 0) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    const agreement = (agreements as any[])[0]

    // Check if user is part of the agreement
    if (
      agreement.initiatorId !== session.user.id &&
      agreement.receiverId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "You are not authorized to view this agreement" }, { status: 403 })
    }

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
      isInitiator: agreement.initiatorId === session.user.id,
    }

    // Fetch agreement timeline events
    const timelineEvents = await query("SELECT * FROM agreement_events WHERE agreementId = ? ORDER BY createdAt ASC", [
      params.id,
    ])

    return NextResponse.json({
      ...formattedAgreement,
      events: timelineEvents,
    })
  } catch (error) {
    console.error("Error fetching agreement:", error)
    return NextResponse.json({ error: "Failed to fetch agreement" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const agreements = await query("SELECT * FROM agreements WHERE id = ?", [params.id])

    if (!agreements || (agreements as any[]).length === 0) {
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 })
    }

    const agreement = (agreements as any[])[0]

    // Check if user is part of the agreement or an admin
    if (
      agreement.initiatorId !== session.user.id &&
      agreement.receiverId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "You are not authorized to update this agreement" }, { status: 403 })
    }

    const body = await req.json()
    const { status, terms, notes } = agreementUpdateSchema.parse(body)

    // Only allow status changes by the receiver or admin
    if (status && agreement.initiatorId === session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only the receiver or an admin can change the agreement status" },
        { status: 403 },
      )
    }

    // Build the update query dynamically based on provided fields
    let updateSql = "UPDATE agreements SET updatedAt = NOW()"
    const updateParams: any[] = []

    if (status !== undefined) {
      updateSql += ", status = ?"
      updateParams.push(status)
    }

    if (terms !== undefined) {
      updateSql += ", terms = ?"
      updateParams.push(terms)
    }

    if (notes !== undefined) {
      updateSql += ", notes = ?"
      updateParams.push(notes)
    }

    updateSql += " WHERE id = ?"
    updateParams.push(params.id)

    await query(updateSql, updateParams)

    // If status was changed, add an event to the timeline
    if (status) {
      await query("INSERT INTO agreement_events (agreementId, status, actorId) VALUES (?, ?, ?)", [
        params.id,
        status,
        session.user.id,
      ])
    }

    // Fetch the updated agreement
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

    const updatedAgreements = await query(sql, [params.id])
    const updatedAgreement = (updatedAgreements as any[])[0]

    // Format the agreement to match the expected structure
    const formattedAgreement = {
      id: updatedAgreement.id,
      status: updatedAgreement.status,
      terms: updatedAgreement.terms,
      notes: updatedAgreement.notes,
      createdAt: updatedAgreement.createdAt,
      updatedAt: updatedAgreement.updatedAt,
      initiator: {
        id: updatedAgreement.initiatorId,
        name: updatedAgreement.initiatorName,
        role: updatedAgreement.initiatorRole,
        isVerified: Boolean(updatedAgreement.initiatorIsVerified),
        companyName: updatedAgreement.initiatorCompanyName,
      },
      receiver: {
        id: updatedAgreement.receiverId,
        name: updatedAgreement.receiverName,
        role: updatedAgreement.receiverRole,
        isVerified: Boolean(updatedAgreement.receiverIsVerified),
        companyName: updatedAgreement.receiverCompanyName,
      },
    }

    return NextResponse.json(formattedAgreement)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating agreement:", error)
    return NextResponse.json({ error: "Failed to update agreement" }, { status: 500 })
  }
}
