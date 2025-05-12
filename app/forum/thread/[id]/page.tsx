"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ForumPostList } from "@/components/forum/forum-post-list"
import { CreatePostForm } from "@/components/forum/create-post-form"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, MessageSquare, ThumbsUp, Printer } from "lucide-react"

// Mock data - would be fetched from API in production
const mockThread = {
  id: "thread1",
  title: "Best UV printer for small business?",
  content:
    "I'm looking to invest in a UV printer for my small business. Budget is around ₦2,000,000. Any recommendations from the community? I've been looking at a few options but I'm not sure which one would be the best value for money. I mainly need it for printing on acrylic, wood, and some small promotional items.",
  author: {
    id: "user1",
    name: "PrinterNewbie",
    image: "/placeholder.svg?height=40&width=40",
    role: "PRINTER",
    isVerified: false,
  },
  category: {
    id: "cat1",
    name: "UV",
  },
  createdAt: "2 hours ago",
  likes: 8,
}

const mockPosts = [
  {
    id: "post1",
    content:
      "I've been using the EcoTech UV-4800 for about a year now for my small shop. It's within your budget at around ₦1,800,000 and has been very reliable. Print quality is excellent on acrylic and wood. The only downside is that the ink is a bit expensive, but the results are worth it.",
    author: {
      id: "user2",
      name: "UVExpert",
      image: "/placeholder.svg?height=40&width=40",
      role: "PRINTER",
      isVerified: true,
    },
    likes: 5,
    createdAt: "1 hour ago",
    isAuthor: false,
  },
  {
    id: "post2",
    content:
      "I would recommend looking at the PrintMaster UV-600. It's slightly above your budget at ₦2,200,000, but it's much more versatile and the running costs are lower in the long run. I've had mine for 2 years and it's been a great investment for my business.",
    author: {
      id: "user3",
      name: "TechPrinter",
      image: "/placeholder.svg?height=40&width=40",
      role: "MANUFACTURER",
      isVerified: true,
    },
    likes: 3,
    createdAt: "45 minutes ago",
    isAuthor: false,
  },
  {
    id: "post3",
    content:
      "Have you considered leasing instead of buying? For a new business, it might be a better option to lease a higher-end model and upgrade as your business grows. Many suppliers in Lagos offer good leasing terms.",
    author: {
      id: "user4",
      name: "BusinessAdvisor",
      image: "/placeholder.svg?height=40&width=40",
      role: "CONSUMER",
      isVerified: false,
    },
    likes: 2,
    createdAt: "30 minutes ago",
    isAuthor: false,
  },
]

export default function ThreadPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null)
  const [threadLiked, setThreadLiked] = useState(false)
  const [posts, setPosts] = useState(mockPosts)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/forum/thread/" + params.id)
    }
  }, [status, params.id])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleReply = (postId: string) => {
    const post = posts.find((p) => p.id === postId)
    if (post) {
      setReplyTo({
        id: postId,
        username: post.author.name,
      })
      // Scroll to reply form
      setTimeout(() => {
        document.getElementById("reply-form")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleLikePost = (postId: string) => {
    // In a real app, this would be an API call
    // For now, we'll just update the UI
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleLikeThread = () => {
    setThreadLiked(!threadLiked)
    // In a real app, this would be an API call
  }

  const handleReportPost = (postId: string) => {
    toast({
      title: "Post reported",
      description: "Thank you for reporting this post. Our moderators will review it.",
    })
  }

  const handlePostCreated = () => {
    setReplyTo(null)
    // In a real app, we would fetch the updated posts
    // For now, we'll just add a mock reply
    const newPost = {
      id: `post${posts.length + 1}`,
      content: "This is a new reply that would come from the API.",
      author: {
        id: session.user.id,
        name: session.user.name || "User",
        image: session.user.image || "/placeholder.svg?height=40&width=40",
        role: session.user.role || "CONSUMER",
        isVerified: session.user.isVerified || false,
      },
      likes: 0,
      createdAt: "Just now",
      isAuthor: true,
    }
    setPosts([...posts, newPost])
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/forum">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forum
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-2xl">{mockThread.title}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={mockThread.author.image || "/placeholder.svg"} alt={mockThread.author.name} />
                        <AvatarFallback>{mockThread.author.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      {mockThread.author.name} • {mockThread.createdAt}
                    </CardDescription>
                  </div>
                  <Badge>{mockThread.category.name}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p>{mockThread.content}</p>
                </div>
              </CardContent>
              <div className="px-6 pb-6 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={threadLiked ? "text-primary" : ""}
                  onClick={handleLikeThread}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {mockThread.likes + (threadLiked ? 1 : 0)} Likes
                </Button>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {posts.length} Replies
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Replies</h2>

              <ForumPostList posts={posts} onReply={handleReply} onLike={handleLikePost} onReport={handleReportPost} />

              <div id="reply-form">
                <CreatePostForm
                  threadId={params.id}
                  onPostCreated={handlePostCreated}
                  replyToPostId={replyTo?.id}
                  replyToUsername={replyTo?.username}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Printer className="h-6 w-6" />
              <span className="">NG MARKETPLACE</span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2023 NG MARKETPLACE. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
