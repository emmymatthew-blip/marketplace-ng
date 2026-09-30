import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PostDetail } from "@/components/forum/post-detail"
import { PostReplyForm } from "@/components/forum/post-reply-form"
import { PostReplyList } from "@/components/forum/post-reply-list"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Post Detail | PrintMarket NG Forum",
  description: "View and reply to forum posts on PrintMarket NG",
}

async function getPost(id: string) {
  try {
    // In a real app, fetch from your API
    return {
      id,
      title: "How to properly maintain printing equipment?",
      content:
        "I recently purchased a new digital printing press and I want to ensure it lasts as long as possible. What are the best practices for maintaining printing equipment? Should I follow a specific schedule or are there particular products I should use?",
      authorId: "user-1",
      authorName: "John Printer",
      authorRole: "PRINTER",
      authorVerified: true,
      authorAvatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categoryId: "cat-tech-id",
      categoryName: "Technology",
      threadId: "thread-1",
      threadTitle: "Equipment Maintenance",
      likes: 15,
      views: 230,
      isLiked: false,
    }
  } catch (error) {
    return null
  }
}

async function getReplies(postId: string) {
  // In a real app, fetch from your API
  return [
    {
      id: "reply-1",
      content:
        "Regular cleaning is essential. I recommend cleaning the printheads at least once a week and doing a deep clean monthly. Also, make sure to use the manufacturer-recommended cleaning solutions.",
      authorId: "user-2",
      authorName: "Mary Manufacturer",
      authorRole: "MANUFACTURER",
      authorVerified: true,
      authorAvatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likes: 8,
      isLiked: false,
    },
    {
      id: "reply-2",
      content:
        "Temperature and humidity control in your printing area is also crucial. Extreme conditions can damage sensitive components. I keep my printing room at 20-22°C with 40-60% humidity.",
      authorId: "user-3",
      authorName: "Bob Consumer",
      authorRole: "CONSUMER",
      authorVerified: false,
      authorAvatar: "/placeholder.svg?height=40&width=40",
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      likes: 5,
      isLiked: true,
    },
  ]
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  const replies = await getReplies(params.id)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumb
        items={[
          { label: "Forum", href: "/forum" },
          { label: post.categoryName, href: `/forum/category/${post.categoryId}` },
          { label: post.threadTitle, href: `/forum/thread/${post.threadId}` },
          { label: "Post", href: `/forum/post/${post.id}`, active: true },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <PostDetail post={post} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Replies ({replies.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PostReplyList replies={replies} />
          <PostReplyForm postId={post.id} />
        </CardContent>
      </Card>
    </div>
  )
}
