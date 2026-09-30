"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, Flag, Share2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Author {
  id: string
  name: string
  role: string
  verified: boolean
  avatar: string
}

interface OriginalPost {
  id: string
  content: string
  createdAt: string
  likes: number
  isLiked: boolean
}

interface Reply {
  id: string
  content: string
  author: Author
  createdAt: string
  likes: number
  isLiked: boolean
}

interface ThreadReplyListProps {
  originalPost: OriginalPost
  originalAuthor: Author
  replies: Reply[]
}

export function ThreadReplyList({ originalPost, originalAuthor, replies }: ThreadReplyListProps) {
  const [postLikes, setPostLikes] = useState({
    count: originalPost.likes,
    isLiked: originalPost.isLiked,
  })

  const [replyLikes, setReplyLikes] = useState<Record<string, { count: number; isLiked: boolean }>>(
    replies.reduce(
      (acc, reply) => ({
        ...acc,
        [reply.id]: { count: reply.likes, isLiked: reply.isLiked },
      }),
      {},
    ),
  )

  const handlePostLike = () => {
    setPostLikes((prev) => ({
      count: prev.isLiked ? prev.count - 1 : prev.count + 1,
      isLiked: !prev.isLiked,
    }))
    // In a real app, send API request to update like status
  }

  const handleReplyLike = (replyId: string) => {
    setReplyLikes((prev) => {
      const current = prev[replyId]
      return {
        ...prev,
        [replyId]: {
          count: current.isLiked ? current.count - 1 : current.count + 1,
          isLiked: !current.isLiked,
        },
      }
    })
    // In a real app, send API request to update like status
  }

  const handleShare = (id: string) => {
    // In a real app, copy link to clipboard or open share dialog
    navigator.clipboard.writeText(`${window.location.origin}/forum/post/${id}`)
    alert("Link copied to clipboard")
  }

  const handleReport = (id: string) => {
    // In a real app, open report modal or navigate to report page
    alert(`Report functionality would open for post ${id}`)
  }

  return (
    <div className="space-y-8">
      {/* Original post */}
      <div className="space-y-4" id="post-original">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Image
              src={originalAuthor.avatar || "/placeholder.svg"}
              alt={originalAuthor.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{originalAuthor.name}</h3>
              {originalAuthor.verified && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Verified {originalAuthor.role.toLowerCase()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <Badge variant="secondary" className="text-xs">
                {originalAuthor.role}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Original Poster
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Posted {formatDistanceToNow(new Date(originalPost.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>{originalPost.content}</p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button
            variant="outline"
            size="sm"
            className={postLikes.isLiked ? "text-primary" : ""}
            onClick={handlePostLike}
          >
            <ThumbsUp className="mr-1 h-4 w-4" />
            {postLikes.count}
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleReport(originalPost.id)}>
            <Flag className="mr-1 h-4 w-4" />
            Report
          </Button>

          <Button variant="outline" size="sm" onClick={() => handleShare(originalPost.id)}>
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Replies */}
      {replies.map((reply, index) => (
        <div key={reply.id} className="space-y-4 pt-8 border-t" id={`reply-${index + 1}`}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Image
                src={reply.author.avatar || "/placeholder.svg"}
                alt={reply.author.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{reply.author.name}</h3>
                {reply.author.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified {reply.author.role.toLowerCase()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Badge variant="secondary" className="text-xs">
                  {reply.author.role}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                Replied {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p>{reply.content}</p>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className={replyLikes[reply.id].isLiked ? "text-primary" : ""}
              onClick={() => handleReplyLike(reply.id)}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              {replyLikes[reply.id].count}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => handleReport(reply.id)}>
              <Flag className="mr-1 h-4 w-4" />
              Report
            </Button>

            <Button variant="ghost" size="sm" onClick={() => handleShare(reply.id)}>
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      ))}

      {replies.length === 0 && (
        <div className="text-center py-8 border-t">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-2" />
          <p className="text-muted-foreground">No replies yet. Be the first to reply!</p>
        </div>
      )}
    </div>
  )
}
