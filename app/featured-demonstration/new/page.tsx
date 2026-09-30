"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { format, addWeeks, startOfWeek, isAfter } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Upload, X, ChevronRight, Star, Info, Crown, Users, Clock, Video, MessageSquare, Wand2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { isSeller } from "@/lib/user-roles"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { loginWithCallback } from "@/lib/auth-urls"
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z.string().min(10, {
    message: "Title must be at least 10 characters.",
  }),
  description: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  date: z.date({
    required_error: "A date is required.",
  }),
  time: z.string({
    required_error: "Please select a time for your demonstration.",
  }),
  duration: z.string().min(1, {
    message: "Please select a duration for your live demonstration.",
  }),
  platform: z.enum(["zoom", "youtube", "instagram", "facebook"], {
    required_error: "Please select a platform for your live demonstration.",
  }),
  platformUrl: z.string().min(1, {
    message: "Please provide the URL or meeting details for your live demonstration.",
  }),
  headerImage: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  advertImage: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    )
    .optional(),
  price: z.string().optional(),
})

export default function FeaturedDemonstrationPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutoFilling, setIsAutoFilling] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewAdvertImage, setPreviewAdvertImage] = useState<string | null>(null)
  const [demoAccessStatus, setDemoAccessStatus] = useState<string | null>(null)
  const [isCheckingAccess, setIsCheckingAccess] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(loginWithCallback("/featured-demonstration/new"))
      return
    }

    if (status === "authenticated") {
      if (!isSeller(session.user.role)) {
        router.push(loginWithCallback("/featured-demonstration/new"))
        return
      }

      // Check demo access status
      const checkDemoAccess = async () => {
        try {
          const response = await fetch("/api/demo-access/status")
          const data = await response.json()
          
          if (data.status !== "APPROVED") {
            if (data.status === "NOT_APPLIED") {
              router.push("/demo-access/apply?redirect=/featured-demonstration/new")
            } else if (data.status === "PENDING") {
              router.push("/demo-access/apply?status=pending")
            } else if (data.status === "REJECTED") {
              router.push("/demo-access/apply?status=rejected")
            }
            return
          }
          
          setDemoAccessStatus(data.status)
        } catch (error) {
          console.error("Error checking demo access:", error)
        } finally {
          setIsCheckingAccess(false)
        }
      }

      checkDemoAccess()
    }
  }, [session, status, router])

  // Get next 12 Saturdays for available slots
  const getAvailableSaturdays = () => {
    const saturdays = []
    // Get the current date and find the next Saturday
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7 // Next Saturday (or today if it's Saturday)
    let currentDate = new Date(today)
    currentDate.setDate(today.getDate() + daysUntilSaturday)
    // Set time to midnight to avoid timezone issues
    currentDate.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 12; i++) {
      saturdays.push(new Date(currentDate))
      currentDate = addWeeks(currentDate, 1)
    }
    
    return saturdays
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "60",
      platform: "zoom",
      platformUrl: "",
      time: "10:00",
      price: "By Application",
    },
  })

  const watchPlatform = form.watch("platform")

  const getPlatformPlaceholder = (platform: string) => {
    switch (platform) {
      case "zoom":
        return "Enter Zoom Meeting ID or full meeting URL"
      case "youtube":
        return "Enter YouTube Live Stream URL"
      case "instagram":
        return "Enter Instagram handle (e.g., @username)"
      case "facebook":
        return "Enter Facebook Live URL or Page URL"
      default:
        return "Enter platform URL or details"
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("headerImage", {
          message: "Max file size is 5MB.",
        })
        return
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError("headerImage", {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
        })
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("headerImage", file)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    form.setValue("headerImage", undefined)
  }

  const handleAdvertImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError("advertImage", {
          message: "Max file size is 5MB.",
        })
        return
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        form.setError("advertImage", {
          message: "Only .jpg, .jpeg, .png and .webp formats are supported.",
        })
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewAdvertImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("advertImage", file)
    }
  }

  const removeAdvertImage = () => {
    setPreviewAdvertImage(null)
    form.setValue("advertImage", undefined)
  }

  const handleAutoFill = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use auto-fill.",
        variant: "destructive",
      })
      return
    }

    setIsAutoFilling(true)
    try {
      const response = await fetch("/api/vendors/setup")
      if (!response.ok) {
        throw new Error("Failed to fetch vendor data")
      }

      const data = await response.json()
      const vendor = data.vendor || data

      // Auto-fill relevant fields
      if (vendor.companyName && !form.getValues("title")) {
        form.setValue("title", `Live Demonstration: ${vendor.companyName}`)
      }

      if (vendor.bio && !form.getValues("description")) {
        const bioDescription = vendor.bio.length > 200 
          ? vendor.bio.substring(0, 200) + "..."
          : vendor.bio
        form.setValue("description", `Join us for an exclusive live demonstration showcasing our products and services. ${bioDescription} We'll be demonstrating our latest innovations, answering your questions, and providing insights into our industry expertise.`)
      }

      if (vendor.companyWebsite && !form.getValues("platformUrl")) {
        // If they have a website, suggest it as a platform URL
        form.setValue("platformUrl", vendor.companyWebsite)
        form.setValue("platform", "zoom") // Default to zoom, user can change
      }

      toast({
        title: "Auto-fill Complete",
        description: "Form fields have been populated with your vendor profile information.",
      })
    } catch (error: any) {
      console.error("Error auto-filling form:", error)
      toast({
        title: "Auto-fill Failed",
        description: error.message || "Failed to fetch vendor data. Please fill the form manually.",
        variant: "destructive",
      })
    } finally {
      setIsAutoFilling(false)
    }
  }

  const uploadImageToImageKit = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append("file", file)
      // Add folder parameter for featured demo images
      formData.append("folder", "/printmarket/featured-demos/")

      const response = await fetch("/api/upload/cloudinary", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload image")
      }

      const data = await response.json()
      if (!data.url) {
        throw new Error("No URL returned from upload")
      }
      return data.url
    } catch (error: any) {
      console.error("Error uploading image to ImageKit:", error)
      throw error
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      let headerImageUrl: string | null = null
      let advertImageUrl: string | null = null

      // Upload header image if provided
      if (values.headerImage && values.headerImage instanceof File) {
        headerImageUrl = await uploadImageToImageKit(values.headerImage)
        if (!headerImageUrl) {
          throw new Error("Failed to upload header image")
        }
      }

      // Upload advert image if provided
      if (values.advertImage && values.advertImage instanceof File) {
        advertImageUrl = await uploadImageToImageKit(values.advertImage)
        if (!advertImageUrl) {
          throw new Error("Failed to upload advertisement image")
        }
      }

      // Prepare submission data - ensure date is properly formatted
      const submissionData = {
        ...values,
        date: values.date instanceof Date 
          ? values.date.toISOString().split('T')[0] 
          : values.date,
        headerImage: headerImageUrl,
        advertImage: advertImageUrl,
      }

      // Here you would make an API call to save the featured demonstration
      const response = await fetch('/api/featured-demonstration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit demonstration')
      }

      toast({
        title: "Request Submitted",
        description: "Your Featured Live Demo request has been submitted successfully. It will be reviewed by an administrator.",
      })

      // Only redirect on successful submission
      router.push("/dashboard?status=demo-submitted")
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit demonstration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Preview data based on form values
  const previewData = {
    title: form.watch("title") || "Your Featured Demonstration Title",
    description: form.watch("description") || "Discover the innovative features and capabilities of your product through our exclusive live demonstration. Join us for an interactive session where we'll showcase cutting-edge technology and answer your questions in real-time.",
    date: form.watch("date") || new Date(),
    time: form.watch("time") || "10:00",
    duration: form.watch("duration") || "60",
    platform: form.watch("platform") || "zoom",
    image: previewImage || "/placeholder-demo.jpg",
  }

  if (status === "loading" || isCheckingAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (status === 'unauthenticated' || (status === 'authenticated' && !isSeller(session.user.role))) {
    return null
  }

  if (demoAccessStatus !== "APPROVED") {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-brand-primary text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--brand-secondary)_0%,_transparent_50%)]" />
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-white/70 hover:text-white transition-colors">
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/demonstrations" className="text-white/70 hover:text-white transition-colors">
                    Demonstrations
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/50" />
                <BreadcrumbItem>
                  <span className="text-white font-medium">Featured Application</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="mt-8 max-w-3xl relative">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand-secondary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-secondary/10 rounded-full blur-3xl" />
              <h1 className="text-5xl font-bold mb-6 tracking-tight">Featured Demonstration Application</h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Elevate your brand with an exclusive weekly spotlight position. Showcase your innovations to industry leaders and qualified buyers.
              </p>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Live Preview Section */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-semibold text-gray-900">Featured Preview</h2>
            </div>
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary rounded-xl blur opacity-30"></div>
              <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="h-[400px] relative">
                  {previewImage ? (
                    <Image
                      src={previewImage}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                      <div className="text-center text-white">
                        <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Upload a header image</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Featured Demonstration
                      </span>
                      <span className="bg-white/90 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
                        {format(previewData.date, "MMMM d, yyyy")}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {previewData.title || "Your Featured Demonstration Title"}
                    </h3>
                  </div>
                </div>
                <div className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-lg mb-4 text-gray-900">About this Demonstration</h4>
                      <p className="text-gray-600 leading-relaxed">
                        {previewData.description}
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{previewData.time}</p>
                            <p className="text-sm text-gray-500">Start Time (WAT)</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                            <Video className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{previewData.platform}</p>
                            <p className="text-sm text-gray-500">Platform</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{previewData.duration} minutes</p>
                            <p className="text-sm text-gray-500">Duration</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Included</p>
                            <p className="text-sm text-gray-500">Q&A Session</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="rounded-lg bg-gray-50 p-6">
                        <h4 className="font-semibold text-lg mb-4 text-gray-900 flex items-center gap-2">
                          <Crown className="h-5 w-5 text-yellow-500" />
                          Premium Features
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-600">
                            <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                            Homepage spotlight position
                          </li>
                          <li className="flex items-center gap-3 text-gray-600">
                            <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                            Priority notification to all users
                          </li>
                          <li className="flex items-center gap-3 text-gray-600">
                            <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                            Featured in weekly newsletter
                          </li>
                          <li className="flex items-center gap-3 text-gray-600">
                            <div className="h-2 w-2 rounded-full bg-brand-primary"></div>
                            Social media promotion
                          </li>
                        </ul>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="rounded-full p-2 bg-yellow-100">
                          <Users className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-yellow-800">Limited Availability</p>
                          <p className="text-sm text-yellow-600">Only one featured slot per week</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Premium Benefits Card */}
            <Card className="lg:col-span-4 bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="p-8">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  Premium Benefits
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Exclusive advantages for featured demonstrations
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="p-8">
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-brand-primary/10">
                      <Star className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Premium Placement</p>
                      <p className="text-base text-muted-foreground mt-1">Featured position on marketplace homepage</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-brand-primary/10">
                      <Star className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Enhanced Visibility</p>
                      <p className="text-base text-muted-foreground mt-1">Direct exposure to qualified buyers</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-brand-primary/10">
                      <Star className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Marketing Support</p>
                      <p className="text-base text-muted-foreground mt-1">Dedicated promotional campaign</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-brand-primary/10">
                      <Star className="h-5 w-5 text-brand-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">Analytics Access</p>
                      <p className="text-base text-muted-foreground mt-1">Detailed engagement metrics</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card className="lg:col-span-8 border-0 shadow-lg">
              <CardHeader className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">Application Details</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Complete the form below to apply for a featured demonstration slot.
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAutoFill}
                    disabled={isAutoFilling || !session?.user}
                    className="flex items-center gap-2"
                  >
                    {isAutoFilling ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Auto-filling...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Auto Fill
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="headerImage"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem className="max-w-full">
                          <FormLabel className="flex items-center gap-2 text-base">
                            Featured Image
                            <HoverCard>
                              <HoverCardTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </HoverCardTrigger>
                              <HoverCardContent>
                                Upload a high-quality image that represents your demonstration. This will be prominently displayed on the marketplace.
                              </HoverCardContent>
                            </HoverCard>
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {previewImage ? (
                                <div className="relative w-full max-h-[400px] h-[300px] overflow-hidden rounded-lg border border-gray-200 bg-white">
                                  <Image
                                    src={previewImage}
                                    alt="Header preview"
                                    fill
                                    className="object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={removeImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-8 h-[300px] max-h-[400px] transition-colors hover:bg-gray-50">
                                  <div className="rounded-full bg-brand-primary/10 p-3">
                                    <Upload className="h-8 w-8 text-brand-primary" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-base text-gray-600">
                                      Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      SVG, PNG, JPG or WEBP (max. 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                    onChange={handleImageChange}
                                    {...field}
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="advertImage"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem className="max-w-full">
                          <FormLabel className="flex items-center gap-2 text-base">
                            Advertisement Image
                            <HoverCard>
                              <HoverCardTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </HoverCardTrigger>
                              <HoverCardContent>
                                Upload an advertisement image that will be displayed in the Featured Live Demonstration section on the homepage. This image should be optimized for homepage display.
                              </HoverCardContent>
                            </HoverCard>
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {previewAdvertImage ? (
                                <div className="relative w-full max-h-[400px] h-[300px] overflow-hidden rounded-lg border border-gray-200 bg-white">
                                  <Image
                                    src={previewAdvertImage}
                                    alt="Advert preview"
                                    fill
                                    className="object-cover"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-2 top-2"
                                    onClick={removeAdvertImage}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-200 bg-white p-8 h-[300px] max-h-[400px] transition-colors hover:bg-gray-50">
                                  <div className="rounded-full bg-brand-primary/10 p-3">
                                    <Upload className="h-8 w-8 text-brand-primary" />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-base text-gray-600">
                                      Click to upload or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                      SVG, PNG, JPG or WEBP (max. 5MB)
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                      This image will be used for homepage advertising
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                                    onChange={handleAdvertImageChange}
                                    {...field}
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Demonstration Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your live demonstration title" {...field} />
                          </FormControl>
                          <FormDescription>
                            Create a compelling title that captures attention for your live demonstration.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe what you'll be demonstrating live and what attendees will learn"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Highlight the key benefits and innovations you'll be showcasing in your live demonstration.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="30">30 minutes</option>
                              <option value="45">45 minutes</option>
                              <option value="60">60 minutes</option>
                              <option value="90">90 minutes</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Select how long your live demonstration will run.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platform"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Live Demonstration Platform</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field}
                            >
                              <option value="zoom">Zoom Meeting</option>
                              <option value="youtube">YouTube Live</option>
                              <option value="instagram">Instagram Live</option>
                              <option value="facebook">Facebook Live</option>
                            </select>
                          </FormControl>
                          <FormDescription>
                            Choose the platform where you'll host your live demonstration. Make sure you have an active account on the selected platform.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="platformUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Platform Details</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={getPlatformPlaceholder(watchPlatform)}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {watchPlatform === "zoom" 
                              ? "You can update the actual meeting link closer to the demonstration date if needed."
                              : "Provide the URL or details where your audience can find your live demonstration."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-8 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Demonstration Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "EEEE, MMMM d, yyyy")
                                    ) : (
                                      <span>Pick a Saturday</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-4 bg-white shadow-lg border" align="start">
                                <div className="mb-3 pb-3 border-b">
                                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                    Available Saturdays
                                  </p>
                                </div>
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    if (date) {
                                      field.onChange(date)
                                    }
                                  }}
                                  disabled={(date) => {
                                    // Only allow Saturdays from the available slots
                                    const availableSaturdays = getAvailableSaturdays()
                                    // Normalize dates to compare only year, month, day
                                    const dateStr = format(date, "yyyy-MM-dd")
                                    const isAvailable = availableSaturdays.some((saturday) => {
                                      const saturdayStr = format(saturday, "yyyy-MM-dd")
                                      return saturdayStr === dateStr
                                    })
                                    // Disable if not available OR if it's not a Saturday
                                    const isSaturday = date.getDay() === 6
                                    return !isAvailable || !isSaturday
                                  }}
                                  modifiersClassNames={{
                                    available: "rdp-available"
                                  }}
                                  modifiers={{
                                    available: (date) => {
                                      const availableSaturdays = getAvailableSaturdays()
                                      const dateStr = format(date, "yyyy-MM-dd")
                                      return availableSaturdays.some((saturday) => {
                                        const saturdayStr = format(saturday, "yyyy-MM-dd")
                                        return saturdayStr === dateStr
                                      })
                                    }
                                  }}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Select a Saturday for your live demonstration. Only one featured demonstration is scheduled per week.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Demonstration Time</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                {...field}
                              >
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">1:00 PM</option>
                                <option value="14:00">2:00 PM</option>
                                <option value="15:00">3:00 PM</option>
                                <option value="16:00">4:00 PM</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              Choose a time slot for your demonstration (WAT - West African Time).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-col gap-4 pt-6">
                      <div className="text-sm text-muted-foreground">
                        By submitting this form, you agree to our terms and conditions for featured live demonstrations.
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary text-white hover:shadow-lg transition-shadow py-6 text-lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting Application...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 