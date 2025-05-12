import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Define validation schema
const postSchema = z.object({
  content: z.string().min(1, { message: "Content cannot be empty" }),
  threadId: z.string(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const threadId = searchParams.get("threadId")

    if (!threadId) {
      return NextResponse.json({ error: "Thread ID is required" }, { status: 400 })
    }

    const posts = await prisma.forumPost.findMany({
      where: {
        threadId,
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
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    return NextResponse.json({ error: "Failed to fetch forum posts" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { content, threadId } = postSchema.parse(body)

    // Check if thread exists
    const thread = await prisma.forumThread.findUnique({
      where: {
        id: threadId,
      },
    })

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 })
    }

    const post = await prisma.forumPost.create({
      data: {
        content,
        threadId,
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
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating forum post:", error)
    return NextResponse.json({ error: "Failed to create forum post" }, { status: 500 })
  }
}
