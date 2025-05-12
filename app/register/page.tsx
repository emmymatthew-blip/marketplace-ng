"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Printer } from "lucide-react"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import Image from "next/image"

type UserType = "PRINTER" | "MANUFACTURER" | "CONSUMER"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<UserType>("PRINTER")
  const [hasCipponMembership, setHasCipponMembership] = useState(false)
  const [cipponMembershipType, setCipponMembershipType] = useState<"INDIVIDUAL" | "CORPORATE" | "NONE">("NONE")
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  // Show loading state while checking session
  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  // Don't render the register form if user is already authenticated
  if (status === "authenticated") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    
    // Debug log all form data
    console.log("All form data:")
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`)
    }

    // Get CIPPON numbers based on membership type
    const membershipNumber = formData.get("cipponMembershipNumber")
    const licenseNumber = formData.get("cipponLicenseNumber")

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      category: formData.get("category"),
      role: userType,
      companyName: userType === "MANUFACTURER" ? formData.get("company") : null,
      hasCipponMembership: userType === "PRINTER" ? hasCipponMembership : false,
      cipponMembershipType: userType === "PRINTER" ? cipponMembershipType : "NONE",
      cipponMembershipNumber: userType === "PRINTER" && hasCipponMembership && cipponMembershipType === "INDIVIDUAL" ? membershipNumber : null,
      cipponLicenseNumber: userType === "PRINTER" && hasCipponMembership && cipponMembershipType === "CORPORATE" ? licenseNumber : null,
    }

    console.log("Processed form data:", {
      userType,
      hasCipponMembership,
      cipponMembershipType,
      membershipNumber,
      licenseNumber,
      data
    })

    // Validate required fields
    if (!data.name || !data.email || !data.password || !data.phone || !data.location || !data.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate CIPPON membership for printers
    if (userType === "PRINTER" && hasCipponMembership) {
      if (cipponMembershipType === "INDIVIDUAL") {
        if (!membershipNumber) {
          toast({
            title: "Error",
            description: "Please enter your CIPPON membership number",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }
      if (cipponMembershipType === "CORPORATE") {
        if (!licenseNumber) {
          toast({
            title: "Error",
            description: "Please enter your company's CIPPON license number",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }
    }

    try {
      console.log("Sending data to API:", data)
      // Register the user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong")
      }
      
      // Sign in the user
      const signInResult = await signIn("credentials", {
        email: data.email as string,
        password: data.password as string,
        redirect: false,
        callbackUrl: "/dashboard"
      })

      if (signInResult?.error) {
        throw new Error("Failed to sign in after registration")
      }

      if (signInResult?.ok) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        })
        
        // Force a hard navigation to the dashboard
        window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Registration error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Bar */}
      <header className="w-full fixed top-0 left-0 z-50  bg-[#326de0] shadow-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <Image src="/images/Nig-Print-Logo.png" alt="NG Marketplace Logo" width={48} height={48} className="mr-3" />
            <span className="text-white text-xl font-bold tracking-wide">NG MARKETPLACE</span>
          </Link>
        </div>
      </header>
      {/* Main Split Section */}
      <main className="flex flex-1 min-h-0">
        {/* Left: Image & Promo Text */}
        <div className="hidden md:block w-1/2 fixed left-0 top-0 h-screen min-h-[600px] overflow-hidden z-10">
          <Image
            src="/images/IMG_9890 1 (2).png"
            alt="Smiling Black businessman"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute left-0 bottom-0 z-10 px-10 md:px-16 lg:px-24 pb-16 md:pb-20 lg:pb-28 flex flex-col items-start max-w-[90%]">
            <span className="uppercase text-white font-bold text-base mb-3 tracking-widest drop-shadow-lg">Welcome to NG MARKETPLACE</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl text-white leading-tight drop-shadow-2xl mb-2 max-w-xl">
              Grow your business to the rest of the world.
            </h1>
          </div>
        </div>
        {/* Right: Register Form */}
        <div className="flex w-full md:w-1/2 ml-auto items-center justify-center bg-white py-32 px-0 min-h-screen">
          <div className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold mb-6 text-[#222] text-left">Create an account</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Tabs defaultValue="PRINTER" onValueChange={(value) => setUserType(value as UserType)}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="PRINTER">Printer</TabsTrigger>
                    <TabsTrigger value="MANUFACTURER">Manufacturer</TabsTrigger>
                    <TabsTrigger value="CONSUMER">Consumer</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <Input id="name" name="name" placeholder="Enter your full name" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input id="email" name="email" type="email" placeholder="Enter your email" required />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Input id="password" name="password" type="password" placeholder="Create a password" required />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <Input id="confirm-password" type="password" placeholder="Confirm your password" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <Input id="phone" name="phone" placeholder="Enter your phone number" />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select name="location">
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select your location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja</SelectItem>
                    <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="ibadan">Ibadan</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {userType === "PRINTER" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CIPPON Membership</label>
                  <RadioGroup 
                    defaultValue="no" 
                    onValueChange={(value) => {
                      setHasCipponMembership(value === "yes")
                      if (value === "yes") {
                        setCipponMembershipType("INDIVIDUAL")
                      } else {
                        setCipponMembershipType("NONE")
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="cippon-yes" />
                      <label htmlFor="cippon-yes" className="text-sm text-gray-700">I have a CIPPON membership number</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="cippon-no" />
                      <label htmlFor="cippon-no" className="text-sm text-gray-700">I don't have a CIPPON membership yet</label>
                    </div>
                  </RadioGroup>

                  {hasCipponMembership && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
                        <RadioGroup 
                          value={cipponMembershipType}
                          onValueChange={(value) => setCipponMembershipType(value as "INDIVIDUAL" | "CORPORATE")}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="INDIVIDUAL" id="individual" />
                            <label htmlFor="individual" className="text-sm text-gray-700">Individual Member</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="CORPORATE" id="corporate" />
                            <label htmlFor="corporate" className="text-sm text-gray-700">Corporate Member</label>
                          </div>
                        </RadioGroup>
                      </div>

                      {cipponMembershipType === "INDIVIDUAL" && (
                        <div>
                          <label htmlFor="cipponMembershipNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            CIPPON Membership Number
                          </label>
                          <Input 
                            id="cipponMembershipNumber" 
                            name="cipponMembershipNumber"
                            type="text"
                            placeholder="Enter your CIPPON membership number" 
                            required={hasCipponMembership}
                            onChange={(e) => console.log("Membership number changed:", e.target.value)}
                          />
                        </div>
                      )}

                      {cipponMembershipType === "CORPORATE" && (
                        <div>
                          <label htmlFor="cipponLicenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            CIPPON License Number
                          </label>
                          <Input 
                            id="cipponLicenseNumber" 
                            name="cipponLicenseNumber"
                            type="text"
                            placeholder="Enter your company's CIPPON license number" 
                            required={hasCipponMembership}
                            onChange={(e) => console.log("License number changed:", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              {userType === "MANUFACTURER" && (
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input id="company" name="company" placeholder="Enter your company name" required />
                </div>
              )}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Primary Category</label>
                <Select name="category">
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select your primary category" />
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
              <Button className="w-full bg-[#326de0] hover:bg-[#254bb5] text-white font-bold py-2 rounded-lg text-lg transition-all" type="submit" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="my-6" />
            <div className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </div>
            <div className="text-center text-sm mt-2">
              Already have an account?{' '}
              <Link href="/login" className="text-[#326de0] underline-offset-4 hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full bg-[#326de0] fixed bottom-0 left-0 z-50 text-white text-center py-3 text-xs font-medium shadow-inner">
        &copy;{new Date().getFullYear()} NG MARKETPLACE
      </footer>
    </div>
  )
}
