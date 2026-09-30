import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Define validation schema
const threadSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
  categoryId: z.string(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")
    const authorId = searchParams.get("authorId")

    const whereClause: any = {}

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    if (authorId) {
      whereClause.authorId = authorId
    }

    const threads = await prisma.forumThread.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            isVerified: true,
          },
        },
        category: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(threads)
  } catch (error) {
    console.error("Error fetching forum threads:", error)
    return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, categoryId } = threadSchema.parse(body)

    // Check if category exists
    const category = await prisma.forumCategory.findUnique({
      where: {
        id: categoryId,
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const thread = await prisma.forumThread.create({
      data: {
        title,
        content,
        categoryId,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
            isVerified: true,
          },
        },
        category: true,
      },
    })

    return NextResponse.json(thread, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating forum thread:", error)
    return NextResponse.json({ error: "Failed to create forum thread" }, { status: 500 })
  }
}
