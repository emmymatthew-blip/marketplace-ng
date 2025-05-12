"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ImagePlus, Trash2 } from "lucide-react"

interface ProductFormProps {
  product?: {
    id: string
    title: string
    description: string
    category: string
    images: string[]
    contactInfo?: string
  }
  isEditing?: boolean
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      images: images,
      contactInfo: formData.get("contactInfo") as string,
    }

    try {
      // In a real app, this would be an API call
      // const url = isEditing ? `/api/products/${product?.id}` : "/api/products"
      // const method = isEditing ? "PUT" : "POST"
      // const response = await fetch(url, {
      //   method,
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: isEditing
          ? "Your product has been updated successfully."
          : "Your product has been created successfully.",
      })

      router.push("/marketplace/my-products")
    } catch (error) {
      console.error(isEditing ? "Error updating product:" : "Error creating product:", error)
      toast({
        title: isEditing ? "Failed to update product" : "Failed to create product",
        description: "There was an error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = () => {
    // In a real app, this would open a file picker and upload the image
    // For now, we'll just add a placeholder image
    const newImage = `/placeholder.svg?height=300&width=300&text=Image${images.length + 1}`
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update your product information." : "Add a new product to showcase in the marketplace."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Product Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              defaultValue={product?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category" defaultValue={product?.category} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="press">Press Equipment</SelectItem>
                <SelectItem value="screen">Screen Printing</SelectItem>
                <SelectItem value="textile">Textile</SelectItem>
                <SelectItem value="uv">UV</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="graphics">Graphics</SelectItem>
                <SelectItem value="consumables">Consumables</SelectItem>
                <SelectItem value="promotional">Promotional Materials</SelectItem>
                <SelectItem value="prepress">Pre-Press</SelectItem>
                <SelectItem value="postpress">Post-Press</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your product in detail..."
              rows={6}
              defaultValue={product?.description}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product image ${index + 1}`}
                    className="aspect-square object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="aspect-square flex flex-col items-center justify-center gap-2 border-dashed"
                onClick={handleImageUpload}
              >
                <ImagePlus className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Upload at least one image of your product. You can add up to 5 images.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Textarea
              id="contactInfo"
              name="contactInfo"
              placeholder="Provide contact details for inquiries about this product..."
              rows={3}
              defaultValue={product?.contactInfo}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
                ? "Update Product"
                : "Create Product"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
