import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { prisma } from "@/lib/prisma"
import { query } from "@/lib/db"
import { trackEvent } from "@/lib/analytics"
import { notifyInquiryReceived } from "@/lib/notifications"
import { authOptions } from "@/lib/auth"

const createInquirySchema = z.object({
  productId: z.string().min(1),
  message: z.string().min(1, "Message is required"),
  companyName: z.string().optional(),
  country: z.string().optional(),
  quantity: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const role = searchParams.get("role") || "vendor" // vendor = inquiries I received, buyer = inquiries I sent
    const status = searchParams.get("status")

    const where: any = role === "vendor"
      ? { vendorId: session.user.id }
      : { buyerId: session.user.id }
    if (status) {
      where.status = status
    }

    const inquiries = await prisma.inquiry.findMany({
      where,
      include: {
        product: { select: { id: true, title: true, images: true } },
        buyer: { select: { id: true, name: true, email: true, image: true, companyName: true } },
        vendor: { select: { id: true, name: true, companyName: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { productId, message, companyName, country, quantity, budget, timeline } =
      createInquirySchema.parse(body)

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, ownerId: true },
    })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const vendorId = product.ownerId
    const buyerId = session.user.id
    if (vendorId === buyerId) {
      return NextResponse.json({ error: "Cannot send inquiry on your own listing" }, { status: 400 })
    }

    let messageThreadId: string | null = null
    try {
      await query(`
        CREATE TABLE IF NOT EXISTS "messages" (
          id TEXT PRIMARY KEY,
          content TEXT NOT NULL,
          "senderId" TEXT NOT NULL,
          "receiverId" TEXT NOT NULL,
          "isRead" BOOLEAN DEFAULT FALSE,
          "productId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"(id) ON DELETE CASCADE,
          CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"(id) ON DELETE CASCADE,
          CONSTRAINT "messages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"(id) ON DELETE SET NULL
        )
      `)
    } catch {
      // Table may already exist
    }

    const firstMessageId = uuidv4()
    await query(
      `INSERT INTO "messages" (id, content, "senderId", "receiverId", "productId", "isRead", "createdAt")
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firstMessageId, message, buyerId, vendorId, productId, false, new Date()]
    )
    messageThreadId = firstMessageId

    const inquiry = await prisma.inquiry.create({
      data: {
        productId,
        vendorId,
        buyerId,
        messageThreadId,
        initialMessage: message,
        companyName: companyName || null,
        country: country || null,
        quantity: quantity || null,
        budget: budget || null,
        timeline: timeline || null,
      },
      include: {
        product: { select: { id: true, title: true, images: true } },
        buyer: { select: { id: true, name: true, email: true, image: true, companyName: true } },
        vendor: { select: { id: true, name: true, companyName: true } },
      },
    })

    await trackEvent({
      eventType: "inquiry_created",
      ownerId: vendorId,
      actorId: buyerId,
      productId,
      vendorId,
      inquiryId: inquiry.id,
      country: country ?? null,
    })

    const buyerName = inquiry.buyer?.companyName ?? inquiry.buyer?.name ?? "A partner"
    const productTitle = inquiry.product?.title ?? "your listing"
    notifyInquiryReceived(vendorId, buyerName, productTitle, inquiry.id).catch(() => {})

    return NextResponse.json(inquiry, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0]?.message ?? "Validation error" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create inquiry" }, { status: 500 })
  }
}
