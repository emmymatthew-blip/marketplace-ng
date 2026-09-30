"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface PostReplyFormProps {
  postId: string
}

export function PostReplyForm({ postId }: PostReplyFormProps) {
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Reply content cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, send API request to create reply
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Your reply has been posted",
      })

      setContent("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium">Post a Reply</h3>

      <Textarea
        placeholder="Write your reply here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
        className="resize-y"
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post Reply"}
      </Button>
    </form>
  )
}
