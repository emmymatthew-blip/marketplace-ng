"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { FileUpload } from "@/components/ui/file-upload"
import { Separator } from "@/components/ui/separator"

interface CreatePostFormProps {
  threadId: string
  onPostCreated?: () => void
  replyToPostId?: string
  replyToUsername?: string
}

export function CreatePostForm({ threadId, onPostCreated, replyToPostId, replyToUsername }: CreatePostFormProps) {
  const [content, setContent] = useState(replyToUsername ? `@${replyToUsername} ` : "")
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to upload files and create the post
      // const formData = new FormData()
      // formData.append("threadId", threadId)
      // formData.append("content", content)
      // if (replyToPostId) formData.append("replyToPostId", replyToPostId)
      // files.forEach(file => formData.append("files", file))
      
      // const response = await fetch("/api/forum/posts", {
      //   method: "POST",
      //   body: formData,
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Reply posted",
        description: `Your reply has been posted successfully${files.length > 0 ? ' with attachments' : ''}.`,
      })

      setContent("")
      setFiles([])
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

  const handleFileError = (error: string) => {
    toast({
      title: "File upload error",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">{replyToUsername ? `Reply to ${replyToUsername}` : "Post a Reply"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your reply here..."
            rows={5}
            required
          />
          <Separator className="my-4" />
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Attachments</h4>
            <FileUpload
              onChange={setFiles}
              value={files}
              onError={handleFileError}
              maxFiles={3}
              maxSize={10 * 1024 * 1024} // 10MB
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
                'application/pdf': ['.pdf'],
                'application/msword': ['.doc'],
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {replyToUsername && (
            <Button
              variant="ghost"
              type="button"
              onClick={() => {
                setContent("")
                setFiles([])
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
