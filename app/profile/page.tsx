"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { ProfileForm } from "@/components/profile/profile-form"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle, MapPin, Mail, Phone, Star, Activity, Users } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/profile")
    }
  }, [status])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    image: "/placeholder.svg",
    role: "PRINTER" as const,
    isVerified: true,
    cipponId: "CIPPON123",
    phone: "+234 701 234 5678",
    location: "Lagos",
    companyName: undefined,
    bio: "Professional printer with over 10 years of experience in the industry.",
    yearsInBusiness: 12,
    teamSize: "11–25",
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container relative"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <img 
                    src={mockUser.image} 
                    alt={mockUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {mockUser.isVerified && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}
              </motion.div>
              
              <div className="text-center md:text-left">
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                >
                  {mockUser.name}
                </motion.h1>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 flex flex-wrap gap-2 justify-center md:justify-start"
                >
                  <Badge variant="secondary" className="text-sm">
                    {mockUser.role}
                  </Badge>
                  {mockUser.isVerified && (
                    <Badge variant="outline" className="text-sm text-green-600 border-green-200 bg-green-50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified Member
                    </Badge>
                  )}
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground justify-center md:justify-start"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {mockUser.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {mockUser.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {mockUser.phone}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Form Section */}
        <div className="container py-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Quick Stats */}
            <div className="lg:col-span-1 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-primary/5 p-6">
                    <h3 className="font-semibold text-lg text-primary">Quick Stats</h3>
                  </div>
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Activity className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Projects</p>
                        <p className="text-2xl font-semibold">24</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Clients</p>
                        <p className="text-2xl font-semibold">18</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-background/40 backdrop-blur-sm border">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Star className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="text-2xl font-semibold">4.8</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="overflow-hidden">
                  <div className="bg-primary/5 p-6">
                    <h3 className="font-semibold text-lg text-primary">About Me</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-muted-foreground leading-relaxed">{mockUser.bio}</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Profile Form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <ProfileForm user={mockUser} />
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
