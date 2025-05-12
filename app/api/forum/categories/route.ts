import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

// Define validation schema
const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional(),
})

export async function GET() {
  try {
    const categories = await prisma.forumCategory.findMany({
      include: {
        _count: {
          select: {
            threads: true,
          },
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching forum categories:", error)
    return NextResponse.json({ error: "Failed to fetch forum categories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins can create categories
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create forum categories" }, { status: 403 })
    }

    const body = await req.json()
    const { name, description } = categorySchema.parse(body)

    const category = await prisma.forumCategory.create({
      data: {
        name,
        description,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating forum category:", error)
    return NextResponse.json({ error: "Failed to create forum category" }, { status: 500 })
  }
}
