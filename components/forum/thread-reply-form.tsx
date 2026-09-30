"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ThreadReplyFormProps {
  threadId: string
}

export function ThreadReplyForm({ threadId }: ThreadReplyFormProps) {
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

      // In a real app, you would refresh the page or update the UI
      // to show the new reply without a full page refresh
      window.location.reload()
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

      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Please be respectful and follow our community guidelines.</p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Reply"}
        </Button>
      </div>
    </form>
  )
}
