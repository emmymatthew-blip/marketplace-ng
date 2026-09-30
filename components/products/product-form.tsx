"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ImagePlus, Trash2, Plus, X, Video, Wand2, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

interface ProductFormProps {
  product?: {
    id: string
    title: string
    description: string
    category: string
    categoryId?: string
    images: string[]
    contactInfo?: string
    condition?: string
    brand?: string
    location?: string
    specifications?: Record<string, string>
    videoUrl?: string
  }
  isEditing?: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set())
  // Track ImageKit URLs that have been uploaded but not yet saved to a product
  const [uploadedImageKitUrls, setUploadedImageKitUrls] = useState<Set<string>>(new Set())
  // Track original images when editing (to detect removed images)
  const [originalImages, setOriginalImages] = useState<string[]>(() => {
    if (isEditing && product?.images) {
      // Filter out blob URLs from original images
      return Array.isArray(product.images) 
        ? product.images.filter(img => img && typeof img === 'string' && !img.startsWith('blob:'))
        : []
    }
    return []
  })
  // Track images that were removed and need to be deleted from ImageKit
  const [removedImageKitUrls, setRemovedImageKitUrls] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(product?.categoryId || "")
  const [condition, setCondition] = useState<string>(product?.condition || "NEW")
  const [brand, setBrand] = useState<string>(product?.brand || "")
  const [location, setLocation] = useState<string>(product?.location || "")
  const [videoUrl, setVideoUrl] = useState<string>(product?.videoUrl || "")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [description, setDescription] = useState<string>(product?.description || "")
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>(
    product?.specifications 
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value }))
      : []
  )
  const router = useRouter()
  const { toast } = useToast()

  // Cleanup orphaned images when component unmounts or user navigates away without saving
  useEffect(() => {
    return () => {
      // If there are uploaded ImageKit URLs that weren't saved to a product, clean them up
      if (uploadedImageKitUrls.size > 0 && !isSubmitting) {
        const orphanedUrls = Array.from(uploadedImageKitUrls)
        console.warn("Orphaned ImageKit images detected (not saved to product):", orphanedUrls)
        
        // Clean up orphaned images from ImageKit
        // This runs in the background and doesn't block navigation
        fetch("/api/upload/cloudinary/cleanup", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrls: orphanedUrls }),
        }).catch(error => {
          console.error("Failed to cleanup orphaned images:", error)
        })
      }
    }
  }, [uploadedImageKitUrls, isSubmitting])

  // Update images when product prop changes (for edit mode)
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      // Ensure images is an array and filter out blob URLs and invalid entries
      const validImages = Array.isArray(product.images) 
        ? product.images.filter(img => {
            if (!img || typeof img !== 'string' || img.trim().length === 0) {
              return false
            }
            // Filter out blob URLs - these are temporary preview URLs
            if (img.startsWith('blob:')) {
              console.warn("Filtering out blob URL:", img)
              return false
            }
            // Only keep valid HTTP/HTTPS URLs (including ImageKit URLs)
            return img.startsWith('http://') || img.startsWith('https://')
          })
        : []
      if (validImages.length > 0) {
        setImages(validImages)
        // Store original images for comparison when editing
        if (isEditing) {
          setOriginalImages(validImages)
          console.log("Set original images for editing:", validImages)
        }
      } else if (product.images.length > 0) {
        // If all images were filtered out, set empty array
        setImages([])
        if (isEditing) {
          setOriginalImages([])
        }
      }
    } else if (product && (!product.images || product.images.length === 0)) {
      // Clear images if product has no images
      setImages([])
      if (isEditing) {
        setOriginalImages([])
      }
    }
  }, [product?.images, isEditing])

  // Update description when product prop changes (for edit mode)
  useEffect(() => {
    if (product?.description) {
      setDescription(product.description)
    }
  }, [product?.description])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/products/categories')
        const data = await response.json()
        if (data.success) {
          setCategories(data.data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Flatten categories for select dropdown
  const flattenCategories = (cats: Category[], level = 0): Array<{ id: string; name: string; level: number }> => {
    const result: Array<{ id: string; name: string; level: number }> = []
    cats.forEach(cat => {
      result.push({ id: cat.id, name: cat.name, level })
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, level + 1))
      }
    })
    return result
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate that at least one image is provided
    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please add at least one product image.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validate that a category is selected
    if (!selectedCategoryId) {
      toast({
        title: "Category required",
        description: "Please select a product category.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    
    // Convert specifications array to object
    const specsObj: Record<string, string> = {}
    specifications.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        specsObj[spec.key.trim()] = spec.value.trim()
      }
    })

    // Handle video - upload file if provided, otherwise use URL
    let finalVideoUrl = videoUrl.trim() || ""
    
    // If a video file is selected, upload it to ImageKit first (prioritize file over URL)
    if (videoFile) {
      try {
        console.log("Starting video file upload to ImageKit:", {
          fileName: videoFile.name,
          fileSize: videoFile.size,
          fileType: videoFile.type
        })
        
        const formData = new FormData()
        formData.append("file", videoFile)

        console.log("Sending video upload request to /api/upload/cloudinary")
        const uploadResponse = await fetch("/api/upload/cloudinary", {
          method: "POST",
          body: formData,
        })

        console.log("Video upload response status:", uploadResponse.status, uploadResponse.statusText)

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json()
          console.error("Video upload failed with error:", errorData)
          throw new Error(errorData.error || `Failed to upload video: ${uploadResponse.statusText}`)
        }

        const uploadData = await uploadResponse.json()
        console.log("Video upload response data:", uploadData)
        
        if (uploadData.url) {
          finalVideoUrl = uploadData.url
          console.log("✅ Video uploaded successfully! URL:", finalVideoUrl)
          
          // Clear the video file and preview since we now have the URL
          setVideoFile(null)
          if (videoPreview) {
            try {
              URL.revokeObjectURL(videoPreview)
            } catch (e) {
              console.warn("Error revoking video preview URL:", e)
            }
          }
          setVideoPreview(null)
        } else {
          console.error("❌ No URL in upload response:", uploadData)
          throw new Error("No URL returned from video upload. Response: " + JSON.stringify(uploadData))
        }
      } catch (error) {
        console.error("❌ Error uploading video:", error)
        toast({
          title: "Video upload failed",
          description: error instanceof Error ? error.message : "Failed to upload video file. Please try again or use a video URL instead.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
    } else if (finalVideoUrl) {
      console.log("Using provided video URL:", finalVideoUrl)
    } else {
      console.log("No video file or URL provided")
    }

    // Filter out blob URLs before submitting - only send valid ImageKit URLs
    const validImages = images.filter(img => {
      if (!img || typeof img !== 'string') {
        console.warn("Invalid image entry:", img)
        return false
      }
      // Filter out blob URLs - these are temporary and shouldn't be saved
      if (img.startsWith('blob:')) {
        console.warn("Filtering out blob URL before submission:", img)
        return false
      }
      // Only keep valid HTTP/HTTPS URLs (ImageKit URLs)
      const isValid = img.startsWith('http://') || img.startsWith('https://')
      if (!isValid) {
        console.warn("Filtering out invalid URL:", img)
      }
      return isValid
    })

    // Check if there are any images still uploading
    if (uploadingImages.size > 0) {
      toast({
        title: "Please wait",
        description: "Some images are still uploading. Please wait for all uploads to complete before submitting.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (validImages.length === 0) {
      toast({
        title: "Images required",
        description: "Please add at least one valid product image. Make sure all images have finished uploading to ImageKit.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const equipmentLocation = location.trim()
    if (equipmentLocation.length < 2) {
      toast({
        title: "Equipment location required",
        description: "Enter where this equipment is located (city, region, or country). This is shown on your listing and is not taken from your company profile.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Log the images being submitted for debugging
    console.log("Submitting product with images:", validImages)
    console.log("Total images in state:", images.length)
    console.log("Valid images after filtering:", validImages.length)
    console.log("All images in state:", images)

    const data = {
      title: formData.get("title") as string,
      description: description || formData.get("description") as string,
      categoryId: selectedCategoryId,
      images: validImages,
      contactInfo: formData.get("contactInfo") as string,
      condition: condition,
      brand: brand,
      location: equipmentLocation,
      specifications: specsObj,
      videoUrl: finalVideoUrl,
    }

    console.log("Data being sent to API:", { 
      ...data, 
      images: data.images,
      videoUrl: data.videoUrl,
      hasVideoFile: !!videoFile
    })

    try {
      const url = isEditing ? `/api/products/${product?.id}` : "/api/products"
      const method = isEditing ? "PUT" : "POST"
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.error || "Failed to save product"
        const errorDetails = errorData.details ? `\n\nDetails: ${JSON.stringify(errorData.details, null, 2)}` : ""
        console.error("API Error:", errorData)
        throw new Error(errorMessage + errorDetails)
      }

      // Delete removed images from ImageKit if any were removed during editing
      if (isEditing && removedImageKitUrls.size > 0) {
        try {
          console.log("Deleting removed images from ImageKit:", Array.from(removedImageKitUrls))
          const deleteResponse = await fetch("/api/upload/cloudinary/cleanup", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrls: Array.from(removedImageKitUrls) }),
          })
          
          if (deleteResponse.ok) {
            const deleteResult = await deleteResponse.json()
            console.log("Removed images deleted from ImageKit:", deleteResult)
          } else {
            console.warn("Failed to delete some removed images from ImageKit")
          }
        } catch (error) {
          console.error("Error deleting removed images from ImageKit:", error)
          // Don't fail the update if image deletion fails
        }
      }

      // Clear uploaded ImageKit URLs since they're now saved to the product
      // This prevents cleanup of images that were successfully saved
      setUploadedImageKitUrls(new Set())
      setRemovedImageKitUrls(new Set())
      console.log("Product saved successfully, cleared uploaded ImageKit URLs tracking")

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
        description: error instanceof Error ? error.message : "There was an error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleRemoveImage = async (index: number) => {
    const newImages = [...images]
    // Revoke object URL if it's a blob URL
    const imageUrl = newImages[index]
    
    if (imageUrl && !imageUrl.startsWith('blob:')) {
      // Check if this is an ImageKit URL from an existing product (being edited)
      const isOriginalImage = isEditing && originalImages.includes(imageUrl)
      
      if (isOriginalImage) {
        // This is an image from the saved product - track it for deletion
        console.log("Removed saved image, will delete from ImageKit:", imageUrl)
        setRemovedImageKitUrls(prev => new Set(prev).add(imageUrl))
      } else {
        // This is a newly uploaded image that hasn't been saved yet
        setUploadedImageKitUrls(prev => {
          const newSet = new Set(prev)
          newSet.delete(imageUrl)
          return newSet
        })
      }
    } else if (imageUrl && imageUrl.startsWith('blob:')) {
      try {
        URL.revokeObjectURL(imageUrl)
      } catch (e) {
        console.warn("Error revoking blob URL:", e)
      }
    }
    
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const uploadImageToCloudinary = async (file: File, previewUrl: string): Promise<string | null> => {
    let uploadIndex: number | null = null
    try {
      // Use a function to get current images state and find index
      setImages(prev => {
        const index = prev.indexOf(previewUrl)
        if (index !== -1) {
          uploadIndex = index
          setUploadingImages(uploadingSet => new Set(uploadingSet).add(index))
        }
        return prev
      })
      
      const formData = new FormData()
      formData.append("file", file)

      console.log("Uploading image to ImageKit:", file.name)
      const response = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      console.log("ImageKit upload successful, received URL:", data.url)
      // Store filePath for potential cleanup
      if (data.filePath) {
        // We can use this for cleanup if needed
      }
      return data.url
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      // Remove from uploading set
      if (uploadIndex !== null) {
        setUploadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(uploadIndex!)
          return newSet
        })
      }
    }
  }

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const removeSpecification = (index: number) => {
    const newSpecs = [...specifications]
    newSpecs.splice(index, 1)
    setSpecifications(newSpecs)
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications]
    newSpecs[index][field] = value
    setSpecifications(newSpecs)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please select a video file (MP4, MOV, AVI, etc.)",
          variant: "destructive",
        })
        return
      }
      
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Video file must be less than 100MB",
          variant: "destructive",
        })
        return
      }

      setVideoFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setVideoPreview(previewUrl)
    }
  }

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value)
    // Clear file if URL is provided
    if (e.target.value) {
      setVideoFile(null)
      setVideoPreview(null)
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoUrl("")
    setVideoPreview(null)
    // Reset file input
    const fileInput = document.getElementById("video-file") as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Helper function to check if URL is YouTube or Vimeo
  const isYouTubeOrVimeoUrl = (url: string): boolean => {
    if (!url) return false
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
    return youtubeRegex.test(url) || vimeoRegex.test(url)
  }

  // Helper function to convert YouTube/Vimeo URL to embed URL
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return ""
    
    // YouTube URL conversion
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Vimeo URL conversion
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    // Return original URL if not YouTube or Vimeo
    return url
  }

  // Auto-fill function with sample data
  const handleAutoFill = () => {
    // Get form elements
    const titleInput = document.getElementById("title") as HTMLInputElement
    const contactInfoTextarea = document.getElementById("contactInfo") as HTMLTextAreaElement
    
    if (titleInput) titleInput.value = "Heidelberg Speedmaster XL 106-8+L - 8-Color Offset Printing Press"
    setDescription(`<p>Professional-grade 8-color offset printing press with perfecting capability. Ideal for high-volume commercial printing, packaging, and label production.</p>

<h2>Key Features:</h2>
<ul>
<li>8 printing units with perfecting capability</li>
<li>Maximum sheet size: 1060 x 750 mm</li>
<li>Maximum printing speed: 18,000 sheets/hour</li>
<li>Advanced Alcolor dampening system</li>
<li>CP2000 control center with touchscreen interface</li>
<li>Automatic plate changing system</li>
<li>Integrated quality control systems</li>
<li>Low-maintenance design with excellent print quality</li>
</ul>

<h2>Perfect for:</h2>
<ul>
<li>Commercial printing companies</li>
<li>Packaging manufacturers</li>
<li>Label printers</li>
<li>High-volume print production</li>
</ul>

<p>This machine is in excellent condition and has been well-maintained with regular service records. Ready for immediate installation and production.</p>`)
    
    if (contactInfoTextarea) contactInfoTextarea.value = "For inquiries about this printing press, please contact us at +234 801 234 5678 or email sales@printmarketng.com. We offer installation support and training services."
    
    // Set other fields via state
    setCondition("USED")
    setBrand("Heidelberg")
    setLocation("Lagos, Nigeria")
    setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    
    // Set sample specifications
    setSpecifications([
      { key: "Manufacturer", value: "Heidelberg" },
      { key: "Model", value: "Speedmaster XL 106-8+L" },
      { key: "Year", value: "2018" },
      { key: "Printing Units", value: "8 Colors" },
      { key: "Max Sheet Size", value: "1060 x 750 mm" },
      { key: "Max Speed", value: "18,000 sheets/hour" },
      { key: "Condition", value: "Used - Excellent" },
      { key: "Warranty", value: "6 months parts and labor" },
    ])
    
    // Set a sample category if available
    const flatCats = flattenCategories(categories)
    if (flatCats.length > 0) {
      const printingCategory = flatCats.find(cat => 
        cat.name.toLowerCase().includes('printing') || 
        cat.name.toLowerCase().includes('press') ||
        cat.name.toLowerCase().includes('offset')
      )
      if (printingCategory) {
        setSelectedCategoryId(printingCategory.id)
      } else {
        setSelectedCategoryId(flatCats[0].id)
      }
    }
    
    // Add sample images (using placeholder for now, user can replace)
    if (images.length === 0) {
      setImages([
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
      ])
    }
    
    toast({
      title: "Form auto-filled",
      description: "Sample data has been filled in. You can edit any fields as needed.",
    })
  }

  const flatCategories = flattenCategories(categories)

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{isEditing ? "Edit Product" : "Add New Product"}</CardTitle>
              <CardDescription>
                {isEditing ? "Update your product information." : "Add a new product to showcase in the marketplace."}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoFill}
                className="gap-2"
              >
                <Wand2 className="h-4 w-4" />
                Auto Fill
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
          <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter a descriptive title"
              defaultValue={product?.title}
              required
            />
          </div>

          <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={selectedCategoryId} 
                onValueChange={setSelectedCategoryId}
                required
              >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                  {flatCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.level > 0 ? "  ".repeat(cat.level) + "• " : ""}{cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Select value={condition} onValueChange={setCondition} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="USED">Used</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  placeholder="Enter brand name (e.g., Heidelberg, Komori)"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Equipment location *</Label>
              <Input
                id="location"
                name="location"
                placeholder="e.g. Lagos, Nigeria — where the equipment is (not your company HQ unless the same)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                minLength={2}
                maxLength={200}
                autoComplete="off"
                aria-describedby="location-hint"
              />
              <p id="location-hint" className="text-xs text-muted-foreground">
                You specify this on each listing so buyers know where the equipment is. It is not copied from your profile.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Describe your product in detail. Use formatting to make it stand out!"
                className="min-h-[200px]"
              />
              <input
                type="hidden"
                id="description"
                name="description"
                value={description}
                required
              />
            </div>
          </div>

          <Separator />

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-md border overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Image failed to load:", image)
                        // Fallback to placeholder if image fails to load
                        const target = e.target as HTMLImageElement
                        if (target.src !== "/placeholder.svg") {
                          target.src = "/placeholder.svg"
                        }
                      }}
                      onLoad={() => {
                        console.log("Image loaded successfully:", image)
                      }}
                    />
                    {uploadingImages.has(index) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                          <div className="text-white text-sm">Uploading...</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                    disabled={uploadingImages.has(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {images.length < 10 && (
                <label
                  htmlFor="image-upload"
                  className="aspect-square flex flex-col items-center justify-center gap-2 border-dashed border rounded-md cursor-pointer hover:bg-accent transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Image</span>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files
                      if (files) {
                        const fileArray = Array.from(files)
                        
                        // Validate all files first
                        for (const file of fileArray) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast({
                              title: "File too large",
                              description: `${file.name} is larger than 5MB. Please choose a smaller image.`,
                              variant: "destructive",
                            })
                            e.target.value = ''
                            return
                          }
                          
                          if (!file.type.startsWith('image/')) {
                            toast({
                              title: "Invalid file type",
                              description: `${file.name} is not an image file.`,
                              variant: "destructive",
                            })
                            e.target.value = ''
                            return
                          }
                        }

                        // Upload all files to ImageKit
                        const uploadPromises = fileArray.map(async (file) => {
                          // Show preview immediately
                          const previewUrl = URL.createObjectURL(file)
                          setImages(prev => [...prev, previewUrl])
                          
                          // Upload to ImageKit
                          const imageKitUrl = await uploadImageToCloudinary(file, previewUrl)
                          
                          if (imageKitUrl) {
                            console.log("ImageKit upload successful:", imageKitUrl)
                            // Track this ImageKit URL as uploaded but not yet saved
                            setUploadedImageKitUrls(prev => new Set(prev).add(imageKitUrl))
                            
                            // Replace preview URL with ImageKit URL using functional update
                            setImages(prev => {
                              const previewIndex = prev.indexOf(previewUrl)
                              if (previewIndex !== -1) {
                                const newImages = [...prev]
                                newImages[previewIndex] = imageKitUrl
                                console.log("Replaced blob URL with ImageKit URL at index", previewIndex)
                                console.log("Updated images array:", newImages)
                                // Revoke preview URL after replacement
                                try {
                                  URL.revokeObjectURL(previewUrl)
                                } catch (e) {
                                  console.warn("Error revoking blob URL:", e)
                                }
                                return newImages
                              } else {
                                console.warn("Preview URL not found, appending ImageKit URL")
                                // If preview URL not found, append the ImageKit URL
                                const newImages = [...prev, imageKitUrl]
                                // Clean up any blob URLs
                                const filtered = newImages.filter(img => !img.startsWith('blob:'))
                                console.log("Appended ImageKit URL, filtered array:", filtered)
                                return filtered
                              }
                            })
                          } else {
                            console.error("ImageKit upload failed for file:", file.name)
                            // Remove failed upload
                            setImages(prev => {
                              const filtered = prev.filter(img => img !== previewUrl)
                              // Clean up any remaining blob URLs
                              return filtered.filter(img => !img.startsWith('blob:'))
                            })
                            try {
                              URL.revokeObjectURL(previewUrl)
                            } catch (e) {
                              console.warn("Error revoking blob URL:", e)
                            }
                          }
                        })

                        await Promise.all(uploadPromises)
                      }
                      // Reset input so same file can be selected again
                      e.target.value = ''
                    }}
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload at least one image of your product. You can add up to 10 images. Maximum file size: 5MB per image.
            </p>
          </div>

          <Separator />

          {/* Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Specifications</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSpecification}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Add detailed specifications like Brand Name, Warranty, Dimensions, etc.
            </p>
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Specification name (e.g., Brand Name, Warranty)"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, "key", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, "value", e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSpecification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {specifications.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No specifications added. Click "Add Specification" to add details.
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Product Video */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Video</h3>
            <p className="text-sm text-muted-foreground">
              Upload a video demonstrating your product features, operation, or installation process (optional)
            </p>
            
            <div className="space-y-4">
              {/* Video URL Input */}
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, or direct link)</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                  value={videoUrl}
                  onChange={handleVideoUrlChange}
                />
                <p className="text-xs text-muted-foreground">
                  Or upload a video file below (MP4, MOV, AVI up to 100MB)
                </p>
              </div>

              {/* Video File Upload */}
              <div className="space-y-2">
                <Label htmlFor="video-file">Upload Video File</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="video-file"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="cursor-pointer"
                  />
                  {(videoFile || videoUrl || videoPreview) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeVideo}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              {/* Video Preview */}
              {(videoPreview || videoUrl) && (
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border">
                  {(() => {
                    const urlToDisplay = videoPreview || videoUrl
                    const isEmbedUrl = isYouTubeOrVimeoUrl(urlToDisplay)
                    
                    if (isEmbedUrl) {
                      // Use iframe for YouTube/Vimeo
                      return (
                        <iframe
                          src={convertToEmbedUrl(urlToDisplay)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Video preview"
                        />
                      )
                    } else {
                      // Use video element for direct video URLs
                      return (
                        <video
                          src={urlToDisplay}
                          controls
                          className="w-full h-full object-contain"
                          onLoadedMetadata={() => {
                            // Video loaded successfully
                          }}
                          onError={() => {
                            toast({
                              title: "Video error",
                              description: "Could not load video. Please check the URL or file. For YouTube/Vimeo, use the full watch URL.",
                              variant: "destructive",
                            })
                          }}
                        />
                      )
                    }
                  })()}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {videoFile ? "File Selected" : isYouTubeOrVimeoUrl(videoPreview || videoUrl) ? "Embed URL" : "Direct URL"}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Upload Placeholder */}
              {!videoPreview && !videoUrl && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">No video uploaded</h4>
                      <p className="text-xs text-muted-foreground">
                        Add a video URL or upload a file to showcase your product
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="space-y-2">
            <Label htmlFor="contactInfo">Contact Information</Label>
            <Textarea
              id="contactInfo"
              name="contactInfo"
                placeholder="Provide contact details for inquiries about this product (e.g., For inquiries about this product, please use the contact button below or call us at +234 801 234 5678)"
              rows={3}
              defaultValue={product?.contactInfo}
            />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:items-center">
          {uploadingImages.size > 0 && (
            <div className="text-sm text-muted-foreground sm:mr-auto">
              <Loader2 className="inline h-4 w-4 animate-spin mr-2" />
              {uploadingImages.size} image{uploadingImages.size > 1 ? 's' : ''} uploading... Please wait.
            </div>
          )}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => router.back()}
              disabled={isSubmitting || uploadingImages.size > 0}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || uploadingImages.size > 0}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {uploadingImages.size > 0 ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Images... ({uploadingImages.size})
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditing ? "Update Product" : "Create Product"
              )}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
