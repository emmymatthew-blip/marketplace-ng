"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, Printer } from "lucide-react"

// Mock data - would be fetched from API in production
const mockDemo = {
  id: "demo1",
  title: "Advanced Screen Printing Techniques",
  description:
    "Learn advanced screen printing techniques from industry experts. This workshop will cover multi-color printing, halftones, and special effects. Participants will get hands-on experience with professional equipment and take home their printed samples.\n\nThis demonstration is suitable for both beginners and experienced printers looking to enhance their skills. All materials will be provided.",
  manufacturer: {
    id: "manu1",
    name: "ScreenTech International",
    image: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    bio: "ScreenTech International is a leading provider of screen printing equipment and supplies in Nigeria. With over 15 years of experience, we offer high-quality products and expert training for printing professionals.",
  },
  date: "June 15, 2023",
  time: "10:00 AM - 12:00 PM",
  location: "ScreenTech Training Center, 25 Printing Avenue, Lagos, Nigeria",
  category: "Screen Printing",
  price: "₦5,000",
  isPaid: true,
  attendees: 12,
  maxAttendees: 20,
  isRegistered: false,
  topics: [
    "Introduction to advanced screen printing techniques",
    "Multi-color registration and printing",
    "Halftone printing and special effects",
    "Troubleshooting common issues",
    "Hands-on practice session",
  ],
}

interface DemoDetailPageClientProps {
  id: string
}

export function DemoDetailPageClient({ id }: DemoDetailPageClientProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(mockDemo.isRegistered)

  const handleRegister = async () => {
    if (!session) {
      redirect(`/login?callbackUrl=/demonstrations/${id}`)
      return
    }

    setIsRegistering(true)

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/demonstrations/${id}/register`, {
      //   method: "POST",
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setIsRegistered(true)
      toast({
        title: "Registration successful",
        description: "You have successfully registered for this demonstration.",
      })
    } catch (error) {
      console.error("Error registering for demonstration:", error)
      toast({
        title: "Registration failed",
        description: "There was an error registering for this demonstration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/demonstrations">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Demonstrations
                </Link>
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <div className="relative h-64 w-full bg-muted">
                    <img
                      src="/placeholder.svg?height=300&width=800"
                      alt={mockDemo.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-4 right-4">{mockDemo.category}</Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl">{mockDemo.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={mockDemo.manufacturer.image || "/placeholder.svg"}
                          alt={mockDemo.manufacturer.name}
                        />
                        <AvatarFallback>{mockDemo.manufacturer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="flex items-center">
                        {mockDemo.manufacturer.name}
                        {mockDemo.manufacturer.isVerified && <CheckCircle className="ml-1 h-4 w-4 text-green-600" />}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockDemo.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockDemo.time}
                      </div>
                      <div className="flex items-center col-span-2">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockDemo.location}
                      </div>
                      <div className="flex items-center col-span-2">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        {mockDemo.attendees} / {mockDemo.maxAttendees} attendees
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        {mockDemo.description.split("\n\n").map((paragraph, index) => (
                          <p key={index} className="mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Topics Covered</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {mockDemo.topics.map((topic, index) => (
                          <li key={index}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Registration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-2xl font-bold">{mockDemo.isPaid ? mockDemo.price : "Free"}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Available spots:</span>
                        <span>
                          {mockDemo.maxAttendees - mockDemo.attendees} / {mockDemo.maxAttendees}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(mockDemo.attendees / mockDemo.maxAttendees) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={isRegistered || isRegistering} onClick={handleRegister}>
                      {isRegistering ? "Registering..." : isRegistered ? "Registered" : "Register Now"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About the Host</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={mockDemo.manufacturer.image || "/placeholder.svg"}
                          alt={mockDemo.manufacturer.name}
                        />
                        <AvatarFallback>{mockDemo.manufacturer.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{mockDemo.manufacturer.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          Verified Manufacturer
                          {mockDemo.manufacturer.isVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-600" />}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{mockDemo.manufacturer.bio}</p>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/marketplace/vendor/${mockDemo.manufacturer.id}`}>View Profile</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t bg-muted">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Printer className="h-6 w-6" />
              <span className="">NG MARKETPLACE</span>
            </Link>
            <p className="text-sm text-muted-foreground">© 2023 NG MARKETPLACE. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 