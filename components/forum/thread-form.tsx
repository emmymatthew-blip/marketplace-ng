"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
  id: string
  name: string
}

interface ThreadFormProps {
  categories: Category[]
  createThread: (formData: FormData) => Promise<void>
}

export function ThreadForm({ categories, createThread }: ThreadFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("content", content)
    formData.append("categoryId", categoryId)

    try {
      await createThread(formData)
    } catch (error) {
      console.error("Error creating thread:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Thread Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter a descriptive title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={100}
        />
        <p className="text-xs text-muted-foreground text-right">{title.length}/100 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Write your thread content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="resize-y"
        />
      </div>

      <Button type="submit" disabled={isSubmitting || !title || !content || !categoryId}>
        {isSubmitting ? "Creating..." : "Create Thread"}
      </Button>
    </form>
  )
}
