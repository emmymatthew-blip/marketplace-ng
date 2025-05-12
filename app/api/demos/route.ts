import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Define validation schema
const demoSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  videoUrl: z.string().url().optional(),
  schedule: z.string().transform((str) => new Date(str)),
  price: z.number().min(0),
  isPaid: z.boolean().default(true),
  category: z.string(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const manufacturerId = searchParams.get("manufacturerId")
    const status = searchParams.get("status") || "APPROVED"

    const whereClause: any = {
      status,
    }

    if (category) {
      whereClause.category = category
    }

    if (manufacturerId) {
      whereClause.manufacturerId = manufacturerId
    }

    const demos = await prisma.demoClass.findMany({
      where: whereClause,
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            image: true,
            isVerified: true,
          },
        },
      },
      orderBy: {
        schedule: "asc",
      },
    })

    return NextResponse.json(demos)
  } catch (error) {
    console.error("Error fetching demos:", error)
    return NextResponse.json({ error: "Failed to fetch demos" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only manufacturers can create demos
    if (session.user.role !== "MANUFACTURER") {
      return NextResponse.json({ error: "Only manufacturers can create demonstration classes" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, videoUrl, schedule, price, isPaid, category } = demoSchema.parse(body)

    const demo = await prisma.demoClass.create({
      data: {
        title,
        description,
        videoUrl,
        schedule,
        price,
        isPaid,
        category,
        manufacturerId: session.user.id,
        status: "PENDING", // All demos need admin approval
      },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            companyName: true,
            image: true,
            isVerified: true,
          },
        },
      },
    })

    return NextResponse.json(demo, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating demo:", error)
    return NextResponse.json({ error: "Failed to create demonstration class" }, { status: 500 })
  }
}
