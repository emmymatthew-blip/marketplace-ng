"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Eye, MessageSquare, Pin, Lock, Flag, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ThreadHeaderProps {
  thread: {
    id: string
    title: string
    categoryId: string
    categoryName: string
    createdAt: string
    updatedAt: string
    views: number
    replyCount: number
    isLocked: boolean
    isPinned: boolean
    author: {
      id: string
      name: string
      role: string
      verified: boolean
      avatar: string
    }
  }
}

export function ThreadHeader({ thread }: ThreadHeaderProps) {
  const [isReported, setIsReported] = useState(false)

  const handleReport = () => {
    setIsReported(true)
    // In a real app, send API request to report thread
  }

  const handleShare = () => {
    // In a real app, copy link to clipboard or open share dialog
    navigator.clipboard.writeText(`${window.location.origin}/forum/thread/${thread.id}`)
    alert("Link copied to clipboard")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-2">{thread.title}</h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>Started by {thread.author.name}</span>
          <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
          <span className="flex items-center">
            <Eye className="mr-1 h-4 w-4" />
            {thread.views} views
          </span>
          <span className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            {thread.replyCount} replies
          </span>

          {thread.isPinned && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center text-amber-500">
                    <Pin className="mr-1 h-4 w-4" />
                    Pinned
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This thread has been pinned by a moderator</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {thread.isLocked && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center text-red-500">
                    <Lock className="mr-1 h-4 w-4" />
                    Locked
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This thread has been locked and no new replies can be added</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="flex mt-4 gap-2">
          <Button variant="outline" size="sm" onClick={handleReport} disabled={isReported}>
            <Flag className="mr-1 h-4 w-4" />
            {isReported ? "Reported" : "Report"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
