"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { format } from "date-fns"
import { Crown, Calendar, Clock, Users, Video, MessageSquare, Star, ChevronRight, ArrowRight, Check, Loader2 } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useParams } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"

interface Manufacturer {
  id: string;
  name: string;
  image: string;
  rating: number;
  isVerified: boolean;
  description: string;
  expertise: string[];
  yearsInBusiness: number;
}

interface FeaturedDemo {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  date: Date;
  time: string;
  duration: string;
  platform: string;
  platformUrl: string;
  image: string;
  manufacturer: Manufacturer;
  attendees: {
    registered: number;
    maximum: number;
  };
  features: string[];
}

// Mock data - Replace with actual API call
const getFeaturedDemo = async (id: string): Promise<FeaturedDemo> => {
  return {
    id,
    title: "Next-Generation Industrial Printing Solutions",
    description: "Live demonstration of cutting-edge industrial printing technology.",
    longDescription: `Join us for an exclusive live demonstration of our latest industrial printing technology. We'll showcase advanced features, innovative applications, and conduct a detailed Q&A session.

• State-of-the-art printing capabilities
• Advanced material handling systems
• Real-time quality control features
• Industry 4.0 integration
• Sustainability features and eco-friendly solutions

This featured demonstration includes exclusive insights into upcoming features and special access to our development team.`,
    date: new Date("2024-04-20"),
    time: "10:00",
    duration: "60",
    platform: "zoom",
    platformUrl: "https://zoom.us/j/123456789",
    image: "/images/b7a4dab131.jpg",
    manufacturer: {
      id: "1",
      name: "TechPrint Solutions",
      image: "/manufacturer-logo.png",
      rating: 4.8,
      isVerified: true,
      description: "Leading manufacturer of industrial printing solutions",
      expertise: ["Industrial Printing", "Digital Solutions", "Automation"],
      yearsInBusiness: 15
    },
    attendees: {
      registered: 28,
      maximum: 50
    },
    features: [
      "Live Product Demonstration",
      "Interactive Q&A Session",
      "Technical Deep Dive",
      "Networking Opportunity",
      "Exclusive Offers"
    ]
  }
}

export default function FeaturedDemonstrationPage() {
  const { data: session } = useSession()
  const [demo, setDemo] = useState<FeaturedDemo | null>(null)
  const params = useParams()
  const [isRegistering, setIsRegistering] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const loadDemo = async () => {
      const data = await getFeaturedDemo(params.id as string)
      setDemo(data)
    }
    if (params.id) {
      loadDemo()
    }
  }, [params.id])

  const handleRegister = async () => {
    setRegistrationStatus('loading')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setRegistrationStatus('success')
    setIsRegistered(true)
    
    // Update local state to reflect registration
    setDemo(prev => {
      if (!prev) return null
      return {
        ...prev,
        attendees: {
          ...prev.attendees,
          registered: prev.attendees.registered + 1
        }
      }
    })

    // Close modal after 3 seconds of showing success
    setTimeout(() => {
      setShowRegistrationModal(false)
      setRegistrationStatus('idle')
    }, 3000)
  }

  if (!demo) {
    return null // Add proper loading state
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>

      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Register for Featured Demonstration</DialogTitle>
            <DialogDescription>
              You are registering for "{demo.title}" scheduled for {format(demo.date, "MMMM d, yyyy")} at {demo.time}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {registrationStatus === 'success' ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-green-600">Registration Successful!</h3>
                <p className="text-center text-sm text-gray-500 mb-4">
                  You will receive a confirmation email with the meeting details shortly.
                </p>
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-blue-900">Platform Access:</p>
                  <p className="text-sm text-blue-700 font-medium">{demo.platform.charAt(0).toUpperCase() + demo.platform.slice(1)}</p>
                  <a 
                    href={demo.platformUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {demo.platformUrl}
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-500">
                      By registering, you'll get:
                    </p>
                    <ul className="mt-2 text-sm text-gray-700 space-y-2">
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Access to live demonstration
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Q&A session participation
                      </li>
                      <li className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        Post-event resources
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {registrationStatus === 'loading' ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </Button>
            ) : registrationStatus === 'success' ? (
              <Button variant="ghost" onClick={() => setShowRegistrationModal(false)}>
                Close
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setShowRegistrationModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRegister}>
                  Confirm Registration
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[500px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={demo.image}
              alt={demo.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
            <div className="h-full flex flex-col justify-between py-8">
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
                    <span className="text-white font-medium">Featured</span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-brand-primary text-white px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Featured Demonstration
                  </span>
                  <Badge variant="outline" className="bg-white/90 text-brand-primary border-0">
                    {format(demo.date, "MMMM d, yyyy")}
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{demo.title}</h1>
                <p className="text-lg text-white/90 mb-6">{demo.description}</p>
                <div className="flex items-center gap-6">
                  {isRegistered ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white bg-green-600/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-400/30">
                        <Check className="h-5 w-5 text-green-300" />
                        <span className="font-medium">You're Registered!</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                        <p className="text-sm text-white/90 mb-2">Platform Access:</p>
                        <a 
                          href={demo.platformUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-white hover:text-white/80 underline break-all text-sm font-medium"
                        >
                          {demo.platformUrl}
                        </a>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="bg-brand-primary hover:bg-brand-primary/90"
                      onClick={() => setShowRegistrationModal(true)}
                    >
                      Register Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}
                  <div className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5" />
                    <span>{demo.attendees.registered}/{demo.attendees.maximum} registered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-4">About this Featured Demonstration</h2>
                  <div className="prose prose-gray max-w-none">
                    {demo.longDescription.split('\n').map((paragraph: string, i: number) => (
                      <p key={i} className="mb-4 text-gray-600 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Features Grid */}
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-semibold mb-6">What's Included</h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {demo.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                          <Star className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{feature}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Details Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Event Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{format(demo.date, "EEEE, MMMM d, yyyy")}</p>
                        <p className="text-sm text-gray-500">Date</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{demo.time} WAT</p>
                        <p className="text-sm text-gray-500">{demo.duration} minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                        <Video className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{demo.platform.charAt(0).toUpperCase() + demo.platform.slice(1)}</p>
                        <p className="text-sm text-gray-500">Platform</p>
                        {isRegistered && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-gray-500 mb-1">Access Link:</p>
                            <a 
                              href={demo.platformUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-brand-primary hover:text-brand-primary/80 underline break-all"
                            >
                              {demo.platformUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-brand-primary/10 text-brand-primary">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Q&A Session</p>
                        <p className="text-sm text-gray-500">Interactive discussion</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Manufacturer Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">About the Manufacturer</h3>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={demo.manufacturer.image} alt={demo.manufacturer.name} />
                      <AvatarFallback>{demo.manufacturer.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900">{demo.manufacturer.name}</h4>
                        {demo.manufacturer.isVerified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{demo.manufacturer.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Years in Business</span>
                      <span className="font-medium text-gray-900">{demo.manufacturer.yearsInBusiness}+ Years</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-gray-900">{demo.manufacturer.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Areas of Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {demo.manufacturer.expertise.map((skill: string, i: number) => (
                        <Badge key={i} variant="secondary" className="bg-gray-100">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Benefits */}
              <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Premium Benefits</h3>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                      <span className="text-white/90">Priority access to Q&A</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                      <span className="text-white/90">Exclusive technical insights</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                      <span className="text-white/90">Post-event consultation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                      <span className="text-white/90">Special offers & discounts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 