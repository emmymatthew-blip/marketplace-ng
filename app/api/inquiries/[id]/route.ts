import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { notifyInquiryStatusUpdated } from "@/lib/notifications"

const updateInquirySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "NEGOTIATING", "AGREEMENT_CREATED", "CLOSED", "LOST"]).optional(),
  notes: z.string().nullable().optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id,
        OR: [{ vendorId: session.user.id }, { buyerId: session.user.id }],
      },
      include: {
        product: { select: { id: true, title: true, images: true } },
        buyer: { select: { id: true, name: true, email: true, image: true, companyName: true } },
        vendor: { select: { id: true, name: true, companyName: true } },
        agreement: { select: { id: true, status: true } },
      },
    })

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error("Error fetching inquiry:", error)
    return NextResponse.json({ error: "Failed to fetch inquiry" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const inquiry = await prisma.inquiry.findFirst({
      where: {
        id,
        OR: [{ vendorId: session.user.id }, { buyerId: session.user.id }],
      },
    })

    if (!inquiry) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }

    const body = await req.json()
    const parsed = updateInquirySchema.parse(body)
    const updateData: { status?: string; notes?: string | null } = {}
    if (parsed.status !== undefined) updateData.status = parsed.status
    if (parsed.notes !== undefined) updateData.notes = parsed.notes

    const updated = await prisma.inquiry.update({
      where: { id },
      data: updateData,
      include: {
        product: { select: { id: true, title: true, images: true } },
        buyer: { select: { id: true, name: true, email: true, image: true, companyName: true } },
        vendor: { select: { id: true, name: true, companyName: true } },
      },
    })

    if (parsed.status !== undefined && inquiry.buyerId) {
      const link = `/messages/${inquiry.vendorId}?productId=${inquiry.productId}`
      notifyInquiryStatusUpdated(updated.buyerId, parsed.status, link).catch(() => {})
    }

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message ?? "Validation error" }, { status: 400 })
    }
    console.error("Error updating inquiry:", error)
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 })
  }
}
