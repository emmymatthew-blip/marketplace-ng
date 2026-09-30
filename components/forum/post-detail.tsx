"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, Flag, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PostDetailProps {
  post: {
    id: string
    title: string
    content: string
    authorId: string
    authorName: string
    authorRole: string
    authorVerified: boolean
    authorAvatar: string
    createdAt: string
    updatedAt: string
    categoryId: string
    categoryName: string
    threadId: string
    threadTitle: string
    likes: number
    views: number
    isLiked: boolean
  }
}

export function PostDetail({ post }: PostDetailProps) {
  const [likes, setLikes] = useState(post.likes)
  const [isLiked, setIsLiked] = useState(post.isLiked)

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
      setIsLiked(false)
    } else {
      setLikes(likes + 1)
      setIsLiked(true)
    }

    // In a real app, send API request to update like status
  }

  const handleReport = () => {
    // In a real app, open report modal or navigate to report page
    alert("Report functionality would open here")
  }

  const handleShare = () => {
    // In a real app, copy link to clipboard or open share dialog
    navigator.clipboard.writeText(`${window.location.origin}/forum/post/${post.id}`)
    alert("Link copied to clipboard")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Image
            src={post.authorAvatar || "/placeholder.svg"}
            alt={post.authorName}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{post.authorName}</h3>
            {post.authorVerified && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="text-xs">
                      Verified
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified {post.authorRole.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Badge variant="secondary" className="text-xs">
              {post.authorRole}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Posted {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none dark:prose-invert">
        <p>{post.content}</p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <Button variant="outline" size="sm" className={isLiked ? "text-primary" : ""} onClick={handleLike}>
          <ThumbsUp className="mr-1 h-4 w-4" />
          {likes}
        </Button>

        <Button variant="outline" size="sm" onClick={handleReport}>
          <Flag className="mr-1 h-4 w-4" />
          Report
        </Button>

        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-1 h-4 w-4" />
          Share
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        <span className="mr-4">{post.views} views</span>
        <span>Category: {post.categoryName}</span>
      </div>
    </div>
  )
}
