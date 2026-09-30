"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { ImagePlus, X, Loader2, Save, Upload, Video, Globe, Linkedin, Twitter, Building2, MapPin, Phone, Mail, Award, Users, Clock, Wand2, Package, Plus, Eye, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductImageGallery } from "@/components/marketplace/product-image-gallery"
import { ProductDetail } from "@/components/marketplace/product-detail"
import { ProductVendorCard } from "@/components/marketplace/product-vendor-card"
import { ProductVideoSection } from "@/components/marketplace/product-video-section"
import { TEAM_SIZE_OPTIONS } from "@/lib/company-profile"

export default function VendorSetupPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set())
  const [uploadingLogo, setUploadingLogo] = useState(false)
  // Track ImageKit URLs that have been uploaded but not yet saved
  const [uploadedImageKitUrls, setUploadedImageKitUrls] = useState<Set<string>>(new Set())
  // Track original images when editing (to detect removed images)
  const [originalLogo, setOriginalLogo] = useState<string | null>(null)
  const [originalGallery, setOriginalGallery] = useState<string[]>([])
  // Track images that were removed and need to be deleted from ImageKit
  const [removedImageKitUrls, setRemovedImageKitUrls] = useState<Set<string>>(new Set())
  
  // Form state
  const [name, setName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [bio, setBio] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [cityState, setCityState] = useState("")
  const [country, setCountry] = useState("")
  const [companyWebsite, setCompanyWebsite] = useState("")
  const [linkedinUrl, setLinkedinUrl] = useState("")
  const [twitterUrl, setTwitterUrl] = useState("")
  const [logo, setLogo] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [gallery, setGallery] = useState<string[]>([])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [videoUrl, setVideoUrl] = useState("")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [videoDescription, setVideoDescription] = useState("")
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")
  const [yearsInBusiness, setYearsInBusiness] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [certifications, setCertifications] = useState<string[]>([])
  const [newCertification, setNewCertification] = useState("")
  const [completedProjects, setCompletedProjects] = useState("")
  const [activeClients, setActiveClients] = useState("")
  const [satisfactionRate, setSatisfactionRate] = useState("")
  
  // Products state
  const [products, setProducts] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewProduct, setPreviewProduct] = useState<any>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Load vendor data
  useEffect(() => {
    if (status === "loading") return
    
    if (!session?.user) {
      router.push("/login?callbackUrl=/marketplace/vendor/setup")
      return
    }

    const loadVendorData = async () => {
      try {
        // Try the setup endpoint first, then fallback to vendors endpoint
        let response = await fetch("/api/vendors/setup")
        let data
        
        if (response.ok) {
          data = await response.json()
          const vendor = data.vendor || data
          
          setName(vendor.name || "")
          setCompanyName(vendor.companyName || "")
          setBio(vendor.bio || "")
          setPhone(vendor.phone || "")
          setEmail(vendor.email || "")
          setLocation(vendor.location || "")
          setCityState(vendor.cityState || "")
          setCountry(vendor.country || "")
          setCompanyWebsite(vendor.companyWebsite || "")
          const vendorLogo = vendor.image || null
          setLogo(vendorLogo)
          setOriginalLogo(vendorLogo)
          setVideoUrl(vendor.videoUrl || "")
          setVideoDescription(vendor.videoDescription || "")
          const vendorGallery = Array.isArray(vendor.gallery) ? vendor.gallery : []
          setGallery(vendorGallery)
          setOriginalGallery(vendorGallery)
          setSpecialties(Array.isArray(vendor.specialties) ? vendor.specialties : [])
          setYearsInBusiness(vendor.yearsInBusiness ? String(vendor.yearsInBusiness) : "")
          setTeamSize(vendor.teamSize || "")
          setCertifications(Array.isArray(vendor.certifications) ? vendor.certifications : [])
          setLinkedinUrl(vendor.linkedinUrl || "")
          setTwitterUrl(vendor.twitterUrl || "")
          setCompletedProjects(vendor.completedProjects ? String(vendor.completedProjects) : "")
          setActiveClients(vendor.activeClients ? String(vendor.activeClients) : "")
          setSatisfactionRate(vendor.satisfactionRate ? String(vendor.satisfactionRate) : "")
        } else {
          // Fallback to vendors endpoint
          response = await fetch(`/api/vendors/${session.user.id}`)
          if (!response.ok) {
            throw new Error("Failed to load vendor data")
          }
          data = await response.json()
          const vendor = data.vendor || data

          setName(vendor.name || "")
          setCompanyName(vendor.companyName || "")
          setBio(vendor.bio || "")
          setPhone(vendor.phone || "")
          setEmail(vendor.email || "")
          setLocation(vendor.location || "")
          setCityState(vendor.cityState || "")
          setCountry(vendor.country || "")
          setCompanyWebsite(vendor.companyWebsite || "")
          const vendorLogo = vendor.image || vendor.logo || null
          setLogo(vendorLogo)
          setOriginalLogo(vendorLogo)
          setVideoUrl(vendor.videoUrl || "")
          setVideoDescription(vendor.videoDescription || "")
          const vendorGallery = Array.isArray(vendor.gallery) ? vendor.gallery : []
          setGallery(vendorGallery)
          setOriginalGallery(vendorGallery)
          setSpecialties(Array.isArray(vendor.specialties) ? vendor.specialties : [])
          setYearsInBusiness(vendor.yearsInBusiness ? String(vendor.yearsInBusiness) : "")
          setTeamSize(vendor.teamSize || "")
          setCertifications(Array.isArray(vendor.certifications) ? vendor.certifications : [])
          setLinkedinUrl(vendor.linkedinUrl || "")
          setTwitterUrl(vendor.twitterUrl || "")
          setCompletedProjects(vendor.completedProjects ? String(vendor.completedProjects) : "")
          setActiveClients(vendor.activeClients ? String(vendor.activeClients) : "")
          setSatisfactionRate(vendor.satisfactionRate ? String(vendor.satisfactionRate) : "")
        }
      } catch (error) {
        console.error("Error loading vendor data:", error)
        // Don't show error toast on initial load - just set loading to false
        // The form will still be usable with empty fields
      } finally {
        setIsLoading(false)
      }
    }

    loadVendorData()
  }, [session, status, router, toast])

  // Fetch user's products
  useEffect(() => {
    if (!session?.user?.id) return

    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        const response = await fetch(`/api/products?ownerId=${session.user.id}`)
        const data = await response.json()
        
        if (data.success) {
          // Ensure images are parsed correctly
          const formattedProducts = (data.data || []).map((product: any) => ({
            ...product,
            images: Array.isArray(product.images) 
              ? product.images 
              : typeof product.images === 'string' 
                ? JSON.parse(product.images || '[]')
                : []
          }))
          setProducts(formattedProducts)
        } else {
          throw new Error(data.error || "Failed to fetch products")
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load your products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [session?.user?.id, toast])

  const handlePreviewClick = async (product: any) => {
    setPreviewDialogOpen(true)
    setLoadingPreview(true)
    
    try {
      const response = await fetch(`/api/products/${product.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch product details")
      }
      
      const data = await response.json()
      
      // Parse images and specifications
      let images: string[] = []
      try {
        images = Array.isArray(data.images) 
          ? data.images 
          : typeof data.images === 'string' 
            ? JSON.parse(data.images || '[]')
            : []
      } catch (e) {
        console.error('Error parsing images:', e)
      }
      
      let specifications: Record<string, string> = {}
      try {
        if (data.specifications) {
          specifications = typeof data.specifications === 'string' 
            ? JSON.parse(data.specifications) 
            : data.specifications
        }
      } catch (e) {
        console.error('Error parsing specifications:', e)
      }
      
      setPreviewProduct({
        ...data,
        images,
        specifications,
        category: data.category?.name || data.categoryName || "Uncategorized",
      })
    } catch (error) {
      console.error("Error fetching product preview:", error)
      toast({
        title: "Error",
        description: "Failed to load product preview. Please try again.",
        variant: "destructive",
      })
      setPreviewDialogOpen(false)
    } finally {
      setLoadingPreview(false)
    }
  }

  // Helper function to upload image to ImageKit
  const uploadImageToCloudinary = async (file: File, previewUrl?: string): Promise<string | null> => {
    try {
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
      return data.url
    } catch (error: any) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    }
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file.",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Logo must be less than 5MB.",
        variant: "destructive",
      })
      return
    }

    // Track original logo for deletion if replaced
    if (logo && logo.startsWith('https://') && originalLogo && logo === originalLogo) {
      setRemovedImageKitUrls(prev => new Set(prev).add(logo))
    }

    setLogoFile(file)
    const previewUrl = URL.createObjectURL(file)
    setLogo(previewUrl)
    setUploadingLogo(true)

    // Upload to ImageKit
    try {
      const imageKitUrl = await uploadImageToCloudinary(file, previewUrl)
      
      if (imageKitUrl) {
        console.log("Logo ImageKit upload successful:", imageKitUrl)
        // Track this ImageKit URL as uploaded but not yet saved
        setUploadedImageKitUrls(prev => new Set(prev).add(imageKitUrl))
        
        // Replace preview URL with ImageKit URL
        setLogo(imageKitUrl)
        URL.revokeObjectURL(previewUrl)
      } else {
        // Upload failed, keep preview but mark as failed
        console.error("Logo ImageKit upload failed")
      }
    } catch (error) {
      console.error("Error uploading logo:", error)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        })
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB.`,
          variant: "destructive",
        })
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Upload all files to ImageKit
    const uploadPromises = validFiles.map(async (file, index) => {
      const fileIndex = gallery.length + index
      setUploadingImages(prev => new Set(prev).add(fileIndex))

      try {
        // Show preview immediately
        const previewUrl = URL.createObjectURL(file)
        setGallery(prev => [...prev, previewUrl])
        
        // Upload to ImageKit
        const imageKitUrl = await uploadImageToCloudinary(file, previewUrl)
        
        if (imageKitUrl) {
          console.log("Gallery ImageKit upload successful:", imageKitUrl)
          // Track this ImageKit URL as uploaded but not yet saved
          setUploadedImageKitUrls(prev => new Set(prev).add(imageKitUrl))
          
          // Replace preview URL with ImageKit URL
          setGallery(prev => {
            const previewIndex = prev.indexOf(previewUrl)
            if (previewIndex !== -1) {
              const newGallery = [...prev]
              newGallery[previewIndex] = imageKitUrl
              // Revoke preview URL after replacement
              try {
                URL.revokeObjectURL(previewUrl)
              } catch (e) {
                console.warn("Error revoking blob URL:", e)
              }
              return newGallery
            }
            // If preview URL not found, append the ImageKit URL
            const newGallery = [...prev, imageKitUrl]
            // Clean up any blob URLs
            return newGallery.filter(img => !img.startsWith('blob:'))
          })
        } else {
          // Upload failed, remove preview
          setGallery(prev => {
            const filtered = prev.filter(img => img !== previewUrl)
            try {
              URL.revokeObjectURL(previewUrl)
            } catch (e) {
              console.warn("Error revoking blob URL:", e)
            }
            return filtered
          })
        }
      } catch (error) {
        console.error("Error uploading gallery image:", error)
      } finally {
        setUploadingImages(prev => {
          const newSet = new Set(prev)
          newSet.delete(fileIndex)
          return newSet
        })
      }
    })

    await Promise.all(uploadPromises)
    // Reset input so same files can be selected again
    e.target.value = ''
  }

  const handleRemoveGalleryImage = (index: number) => {
    const newGallery = [...gallery]
    const imageUrl = newGallery[index]
    
    // If this is an ImageKit URL from an existing gallery (being edited)
    if (imageUrl && imageUrl.startsWith('https://') && originalGallery.includes(imageUrl)) {
      console.log("Removed saved gallery image, will delete from ImageKit:", imageUrl)
      setRemovedImageKitUrls(prev => new Set(prev).add(imageUrl))
    } else if (imageUrl && imageUrl.startsWith('https://')) {
      // If it's an uploaded but not saved ImageKit URL, remove from tracking
      setUploadedImageKitUrls(prev => {
        const newSet = new Set(prev)
        newSet.delete(imageUrl)
        return newSet
      })
    } else if (imageUrl && imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    
    newGallery.splice(index, 1)
    setGallery(newGallery)
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value)
    // Clear file if URL is provided
    if (e.target.value) {
      setVideoFile(null)
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }
      setVideoPreview(null)
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoUrl("")
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
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

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index))
  }

  const handleAddCertification = () => {
    if (newCertification.trim() && !certifications.includes(newCertification.trim())) {
      setCertifications([...certifications, newCertification.trim()])
      setNewCertification("")
    }
  }

  const handleRemoveCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index))
  }

  // Auto-fill function with sample data
  const handleAutoFill = () => {
    setName("John Doe")
    setCompanyName("PrintTech Solutions Ltd")
    setBio(`<p>PrintTech Solutions Ltd is a leading provider of professional printing equipment and services in Nigeria. With over 15 years of experience, we specialize in supplying high-quality printing machinery, parts, and comprehensive support services to businesses across West Africa.</p>

<h2>Our Services:</h2>
<ul>
<li>Sales of new and used printing equipment</li>
<li>Equipment installation and commissioning</li>
<li>Technical support and maintenance</li>
<li>Operator training programs</li>
<li>Parts supply and sourcing</li>
<li>Equipment consultation and assessment</li>
</ul>

<h2>Why Choose Us:</h2>
<ul>
<li>Extensive inventory of quality equipment</li>
<li>Expert technical team with years of experience</li>
<li>Comprehensive after-sales support</li>
<li>Competitive pricing and flexible payment options</li>
<li>Strong relationships with major manufacturers</li>
</ul>

<p>We are committed to helping our clients achieve their printing goals with reliable equipment and exceptional service.</p>`)
    setPhone("+234 801 234 5678")
    setEmail("contact@printtechsolutions.com")
    setLocation("Lagos, Nigeria")
    setCityState("Lagos State")
    setCountry("Nigeria")
    setCompanyWebsite("https://www.printtechsolutions.com")
    setLinkedinUrl("https://linkedin.com/company/printtechsolutions")
    setTwitterUrl("https://twitter.com/printtechng")
    setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    setVideoDescription(`<p>Watch this comprehensive video showcasing our state-of-the-art printing equipment and facilities. Learn about our capabilities, services, and why we're the trusted choice for printing solutions across West Africa.</p>

<h2>What You'll See:</h2>
<ul>
<li>Our modern printing facility and equipment</li>
<li>Expert technicians in action</li>
<li>Quality control processes</li>
<li>Customer testimonials</li>
<li>Our commitment to excellence</li>
</ul>

<p>Contact us today to discuss your printing needs and discover how we can help your business succeed.</p>`)
    setSpecialties([
      "Digital Printing Equipment",
      "Offset Printing Presses",
      "Label Printing Machines",
      "Packaging Equipment",
      "Print Finishing Solutions"
    ])
    setYearsInBusiness("15")
    setTeamSize("25-50")
    setCertifications([
      "ISO 9001:2015 Certified",
      "Heidelberg Authorized Dealer",
      "HP Partner",
      "Epson Certified Service Center"
    ])
    setCompletedProjects("1500")
    setActiveClients("250")
    setSatisfactionRate("98.5")
    
    // Add sample gallery images (placeholder URLs)
    if (gallery.length === 0) {
      setGallery([
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1581092160607-ee22621e8a1b?w=800&h=600&fit=crop",
      ])
    }
    
    toast({
      title: "Form auto-filled",
      description: "Sample vendor data has been filled in. You can edit any fields as needed.",
    })
  }

  // Cleanup orphaned images when component unmounts or user navigates away without saving
  useEffect(() => {
    return () => {
      // If there are uploaded ImageKit URLs that weren't saved, clean them up
      if (uploadedImageKitUrls.size > 0 && !isSubmitting) {
        const orphanedUrls = Array.from(uploadedImageKitUrls)
        console.warn("Orphaned ImageKit images detected (not saved to vendor):", orphanedUrls)
        
        // Clean up orphaned images from ImageKit
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (uploadingImages.size > 0 || uploadingLogo) {
      toast({
        title: "Please wait",
        description: "Some images are still uploading. Please wait for all uploads to complete.",
        variant: "destructive",
      })
      return
    }

    // Filter out blob URLs before submitting - only send valid ImageKit URLs
    const validLogo = logo && !logo.startsWith('blob:') ? logo : null
    const validGallery = gallery.filter(img => img && !img.startsWith('blob:'))

    setIsSubmitting(true)

    try {
      // Delete removed images from ImageKit if any were removed during editing
      if (removedImageKitUrls.size > 0) {
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
        }
      }
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

      // Prepare vendor data
      // Note: completedProjects and activeClients are calculated from agreements, not stored
      const vendorData = {
        name,
        companyName,
        bio,
        phone,
        email,
        location,
        cityState,
        country,
        companyWebsite,
        linkedinUrl,
        twitterUrl,
        logo: validLogo,
        gallery: validGallery,
        videoUrl: finalVideoUrl,
        videoDescription,
        specialties,
        yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
        teamSize,
        certifications,
        // satisfactionRate is calculated from agreements, not stored
      }

      // Update vendor profile
      const response = await fetch("/api/vendors/setup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      })

      if (!response.ok) {
        throw new Error("Failed to update vendor profile")
      }

      // Clear uploaded ImageKit URLs since they're now saved to the vendor profile
      setUploadedImageKitUrls(new Set())
      setRemovedImageKitUrls(new Set())
      // Update original images to current state
      setOriginalLogo(validLogo)
      setOriginalGallery(validGallery)
      console.log("Vendor profile saved successfully, cleared uploaded ImageKit URLs tracking")

      toast({
        title: "Success",
        description: "Your vendor profile has been updated successfully.",
      })

      if (session?.user?.id) {
        router.push(`/marketplace/vendor/${session.user.id}`)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error updating vendor profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update vendor profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <>
        <MainNav />
        <div className="flex min-h-screen items-center justify-center pt-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <MainNav />
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Setup Your Vendor Profile</h1>
                  <p className="text-muted-foreground">
                    Complete your vendor profile to showcase your business to potential customers
                  </p>
                </div>
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
              </div>
            </div>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-white">Profile</TabsTrigger>
                <TabsTrigger value="products" className="data-[state=active]:bg-primary data-[state=active]:text-white">Products ({products.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your company's basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="PrintTech Solutions Ltd"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Company Bio *</Label>
                    <RichTextEditor
                      content={bio}
                      onChange={setBio}
                      placeholder="Tell us about your company, services, and what makes you unique..."
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Lagos, Nigeria"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cityState">City/State</Label>
                      <Input
                        id="cityState"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        placeholder="Lagos State"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Nigeria"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How customers can reach you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 801 234 5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">Company Website</Label>
                    <Input
                      id="companyWebsite"
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://www.company.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Connect your social media profiles</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                      <Input
                        id="linkedinUrl"
                        type="url"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitterUrl">Twitter/X URL</Label>
                      <Input
                        id="twitterUrl"
                        type="url"
                        value={twitterUrl}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        placeholder="https://twitter.com/yourcompany"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logo & Gallery */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo & Gallery</CardTitle>
                  <CardDescription>Upload your company logo and gallery images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <div className="flex items-center gap-4">
                      {logo && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                          <Image
                            src={logo}
                            alt="Company logo"
                            fill
                            className="object-contain"
                          />
                          {uploadingLogo && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              // Track removed logo for deletion if it's an ImageKit URL
                              if (logo && logo.startsWith('https://') && originalLogo && logo === originalLogo) {
                                setRemovedImageKitUrls(prev => new Set(prev).add(logo))
                              } else if (logo && logo.startsWith('https://')) {
                                // Remove from uploaded tracking if not saved yet
                                setUploadedImageKitUrls(prev => {
                                  const newSet = new Set(prev)
                                  newSet.delete(logo)
                                  return newSet
                                })
                              }
                              setLogo(null)
                              setLogoFile(null)
                            }}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                            disabled={uploadingLogo}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                      <label
                        htmlFor="logo-upload"
                        className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      >
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Upload Logo</span>
                        <input
                          type="file"
                          id="logo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Gallery Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {gallery.map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                          <Image
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {uploadingImages.has(index) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                      ))}
                      <label
                        htmlFor="gallery-upload"
                        className="aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      >
                        <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-xs text-muted-foreground">Add Image</span>
                        <input
                          type="file"
                          id="gallery-upload"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleGalleryUpload}
                        />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Video</CardTitle>
                  <CardDescription>Upload a video showcasing your company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="videoUrl">Video URL (YouTube, Vimeo, or direct link)</Label>
                    <Input
                      id="videoUrl"
                      type="url"
                      value={videoUrl}
                      onChange={handleVideoUrlChange}
                      placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
                    />
                    <p className="text-xs text-muted-foreground">
                      Or upload a video file below (MP4, MOV, AVI up to 100MB)
                    </p>
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="videoDescription">Video Description</Label>
                    <RichTextEditor
                      content={videoDescription}
                      onChange={setVideoDescription}
                      placeholder="Describe your video content, services, or company overview..."
                      className="min-h-[150px]"
                    />
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
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>Additional information about your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Specialties</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {specialties.map((specialty, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{specialty}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecialty(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddSpecialty()
                          }
                        }}
                        placeholder="Add specialty (e.g., Digital Printing)"
                      />
                      <Button type="button" onClick={handleAddSpecialty} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business</Label>
                      <Input
                        id="yearsInBusiness"
                        type="number"
                        value={yearsInBusiness}
                        onChange={(e) => setYearsInBusiness(e.target.value)}
                        placeholder="8"
                        min="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamSize">Team Size</Label>
                      <Select value={teamSize} onValueChange={setTeamSize}>
                        <SelectTrigger id="teamSize">
                          <SelectValue placeholder="Select team size" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEAM_SIZE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {certifications.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                        >
                          <span>{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertification(index)}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddCertification()
                          }
                        }}
                        placeholder="Add certification (e.g., ISO 9001)"
                      />
                      <Button type="button" onClick={handleAddCertification} variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Statistics</CardTitle>
                  <CardDescription>Showcase your business achievements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="completedProjects">Completed Projects</Label>
                      <Input
                        id="completedProjects"
                        type="number"
                        value={completedProjects}
                        readOnly
                        disabled
                        placeholder="0"
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        Calculated from completed agreements
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="activeClients">Active Clients</Label>
                      <Input
                        id="activeClients"
                        type="number"
                        value={activeClients}
                        readOnly
                        disabled
                        placeholder="0"
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        Calculated from active agreements
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="satisfactionRate">Satisfaction Rate (%)</Label>
                      <Input
                        id="satisfactionRate"
                        type="number"
                        value={satisfactionRate}
                        readOnly
                        disabled
                        placeholder="0"
                        className="bg-muted cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        Calculated from completed and disputed agreements
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || uploadingImages.size > 0 || uploadingLogo} className="bg-primary hover:bg-primary/90 text-white">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </div>
            </form>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Your Products</CardTitle>
                        <CardDescription>Manage your products in the marketplace</CardDescription>
                      </div>
                      <Button asChild size="sm" className="gap-2 bg-primary hover:bg-primary/90 text-white">
                        <Link href="/marketplace/my-products/new">
                          <Plus className="h-4 w-4" />
                          Add Product
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {productsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : products.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Start selling by adding your first product to the marketplace.
                        </p>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                          <Link href="/marketplace/my-products/new">Add Your First Product</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {products.map((product) => {
                          // Parse images if it's a string
                          let productImages: string[] = []
                          try {
                            if (Array.isArray(product.images)) {
                              productImages = product.images
                            } else if (typeof product.images === 'string') {
                              productImages = JSON.parse(product.images || '[]')
                            }
                          } catch (e) {
                            console.error('Error parsing images:', e)
                            productImages = []
                          }
                          
                          // Format date
                          const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })

                          return (
                            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                              <Link href={`/marketplace/product/${product.id}`} className="relative aspect-[4/3] overflow-hidden bg-muted block">
                                <Image
                                  src={productImages[0] || "/placeholder.svg?height=300&width=400"}
                                  alt={product.title}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                />
                              </Link>
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="space-y-1 flex-1">
                                    <Link href={`/marketplace/product/${product.id}`}>
                                      <CardTitle className="text-lg line-clamp-1 hover:text-primary transition-colors">
                                        {product.title}
                                      </CardTitle>
                                    </Link>
                                    <CardDescription>{formattedDate}</CardDescription>
                                  </div>
                                  {product.categoryName && (
                                    <Badge variant="outline" className="shrink-0">
                                      {product.categoryName}
                                    </Badge>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {product.description?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ') || ''}
                                </p>
                                <div className="flex items-center justify-between">
                                  {product.brand && (
                                    <Badge variant="outline" className="text-xs">
                                      {product.brand}
                                    </Badge>
                                  )}
                                  {product.condition && (
                                    <Badge variant="secondary" className="text-xs">
                                      {product.condition === "NEW" ? "New" : "Used"}
                                    </Badge>
                                  )}
                                </div>
                              </CardContent>
                              <CardFooter className="grid grid-cols-2 gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="col-span-1"
                                  onClick={() => handlePreviewClick(product)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button asChild variant="outline" size="sm" className="col-span-1">
                                  <Link href={`/marketplace/my-products/${product.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </Button>
                              </CardFooter>
                            </Card>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />

      {/* Product Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl">Product Preview</DialogTitle>
            <DialogDescription>
              This is how your listing appears to visitors in the marketplace
            </DialogDescription>
          </DialogHeader>
          
          {loadingPreview ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading preview...</p>
              </div>
            </div>
          ) : previewProduct ? (
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Images and Details */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Product Images */}
                  <div className="bg-white rounded-xl">
                    <ProductImageGallery images={previewProduct.images || []} />
                  </div>

                  {/* Product Details */}
                  <div className="bg-white rounded-xl shadow-sm border">
                    <ProductDetail product={previewProduct} />
                  </div>

                  {/* Product Video Section */}
                  {previewProduct.videoUrl && (
                    <div className="bg-white rounded-xl shadow-sm border">
                      <ProductVideoSection
                        productId={previewProduct.id}
                        productName={previewProduct.title}
                        vendorName={previewProduct.owner?.name || "Vendor"}
                        vendorId={previewProduct.owner?.id}
                        videoUrl={previewProduct.videoUrl}
                        videoTitle="Product Demonstration"
                        videoDescription="Watch this video to see our product in action and learn about its features, specifications, and capabilities."
                        isEditable={false}
                      />
                    </div>
                  )}
                </div>

                {/* Right Column: Vendor Info */}
                <aside className="lg:col-span-4">
                  <div className="sticky top-6">
                    {previewProduct.owner && (
                      <ProductVendorCard 
                        vendor={previewProduct.owner} 
                        productId={previewProduct.id} 
                      />
                    )}
                  </div>
                </aside>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
