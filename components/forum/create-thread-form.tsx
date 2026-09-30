"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ImagePlus, X, Loader2, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

interface ForumCategory {
  id: string
  name: string
}

interface CreateThreadFormProps {
  categories: ForumCategory[]
}

export function CreateThreadForm({ categories }: CreateThreadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [headerImage, setHeaderImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        setHeaderImage(reader.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }, [toast])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      processFile(file)
    }
  }, [processFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      categoryId: formData.get("categoryId") as string,
      headerImage: headerImage,
    }

    try {
      // In a real app, this would be an API call
      // const response = await fetch("/api/forum/threads", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Thread created",
        description: "Your thread has been posted successfully.",
      })

      router.push("/forum")
    } catch (error) {
      console.error("Error creating thread:", error)
      toast({
        title: "Failed to create thread",
        description: "There was an error creating your thread. Please try again.",
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
          <CardTitle>Create New Thread</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Thread Image (Optional)</Label>
            <div className="relative">
              {headerImage ? (
                <div className="relative aspect-[16/9] max-h-[280px] max-w-[600px] w-full overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={headerImage}
                    alt="Thread header"
                    fill
                    className="object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => setHeaderImage(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`flex aspect-[16/9] max-h-[280px] max-w-[600px] w-full items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-200 ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted bg-muted"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    {isUploading ? (
                      <>
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                      </>
                    ) : (
                      <>
                        {isDragActive ? (
                          <>
                            <Upload className="h-8 w-8 text-primary" />
                            <p className="text-sm font-medium">Drop your image here</p>
                          </>
                        ) : (
                          <>
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium">
                                Drag and drop or click to upload
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Recommended size: 1920x820px. Max 5MB.
                              </p>
                            </div>
                            <Button type="button" variant="secondary" size="sm">
                              Choose Image
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <input {...getInputProps()} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input id="title" name="title" placeholder="Enter a descriptive title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select name="categoryId" required>
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
            <Textarea id="content" name="content" placeholder="Write your post here..." rows={10} required />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Posting..." : "Post Thread"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
