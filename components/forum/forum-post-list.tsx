"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, Flag, MoreHorizontal, Reply } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ForumPost {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
    role: string
    isVerified: boolean
  }
  likes: number
  createdAt: string
  isAuthor: boolean
}

interface ForumPostListProps {
  posts: ForumPost[]
  onReply: (postId: string) => void
  onLike: (postId: string) => void
  onReport: (postId: string) => void
  onEdit?: (postId: string) => void
  onDelete?: (postId: string) => void
}

export function ForumPostList({ posts, onReply, onLike, onReport, onEdit, onDelete }: ForumPostListProps) {
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({})

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
    onLike(postId)
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <Card key={post.id} id={`post-${post.id}`}>
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{post.author.name}</span>
                <Badge variant="outline">{post.author.role}</Badge>
                {post.author.isVerified && <Badge variant="secondary">Verified</Badge>}
              </div>
              <div className="text-sm text-muted-foreground">{post.createdAt}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReply(post.id)}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onReport(post.id)}>
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
                {post.isAuthor && onEdit && <DropdownMenuItem onClick={() => onEdit(post.id)}>Edit</DropdownMenuItem>}
                {post.isAuthor && onDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(post.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>{post.content}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={likedPosts[post.id] ? "text-primary" : ""}
              onClick={() => handleLike(post.id)}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              {post.likes + (likedPosts[post.id] ? 1 : 0)} Likes
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onReply(post.id)}>
              <Reply className="mr-1 h-4 w-4" />
              Reply
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
