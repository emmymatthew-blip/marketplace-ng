"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface CreatePostFormProps {
  threadId: string
  onPostCreated?: () => void
  replyToPostId?: string
  replyToUsername?: string
}

export function CreatePostForm({ threadId, onPostCreated, replyToPostId, replyToUsername }: CreatePostFormProps) {
  const [content, setContent] = useState(replyToUsername ? `@${replyToUsername} ` : "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/forum/posts", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     threadId,
      //     content,
      //     replyToPostId
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      })

      setContent("")
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error("Error posting reply:", error)
      toast({
        title: "Failed to post reply",
        description: "There was an error posting your reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">{replyToUsername ? `Reply to ${replyToUsername}` : "Post a Reply"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reply here..."
            rows={5}
            required
          />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {replyToUsername && (
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setContent("")
                if (onPostCreated) onPostCreated()
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Reply"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
