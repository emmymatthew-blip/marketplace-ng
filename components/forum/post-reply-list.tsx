"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Reply {
  id: string
  content: string
  authorId: string
  authorName: string
  authorRole: string
  authorVerified: boolean
  authorAvatar: string
  createdAt: string
  likes: number
  isLiked: boolean
}

interface PostReplyListProps {
  replies: Reply[]
}

export function PostReplyList({ replies }: PostReplyListProps) {
  const [replyLikes, setReplyLikes] = useState<Record<string, { count: number; isLiked: boolean }>>(
    replies.reduce(
      (acc, reply) => ({
        ...acc,
        [reply.id]: { count: reply.likes, isLiked: reply.isLiked },
      }),
      {},
    ),
  )

  const handleLike = (replyId: string) => {
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

  const handleReport = (replyId: string) => {
    // In a real app, open report modal or navigate to report page
    alert(`Report functionality would open for reply ${replyId}`)
  }

  if (replies.length === 0) {
    return <p className="text-center text-muted-foreground py-4">No replies yet. Be the first to reply!</p>
  }

  return (
    <div className="space-y-8">
      {replies.map((reply) => (
        <div key={reply.id} className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Image
                src={reply.authorAvatar || "/placeholder.svg"}
                alt={reply.authorName}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{reply.authorName}</h3>
                {reply.authorVerified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="text-xs">
                          Verified
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified {reply.authorRole.toLowerCase()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <Badge variant="secondary" className="text-xs">
                  {reply.authorRole}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
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
              onClick={() => handleLike(reply.id)}
            >
              <ThumbsUp className="mr-1 h-4 w-4" />
              {replyLikes[reply.id].count}
            </Button>

            <Button variant="ghost" size="sm" onClick={() => handleReport(reply.id)}>
              <Flag className="mr-1 h-4 w-4" />
              Report
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
