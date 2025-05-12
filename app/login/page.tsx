"use client"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Printer } from "lucide-react"
import { Footer } from "@/components/footer"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [keepSignedIn, setKeepSignedIn] = useState(false)
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

  // Don't render the login form if user is already authenticated
  if (status === "authenticated") {
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else {
        router.push("/dashboard")
        toast({
          title: "Success",
          description: "You have been signed in successfully",
        })
      }
    } catch (error) {
      setError("An unexpected error occurred")
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
        <div className="hidden md:block w-1/2 relative h-[100vh] min-h-[600px]">
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
            <h1 className="text-3xl md:text-4xl lg:text-5xl  text-white leading-tight drop-shadow-2xl mb-2 max-w-xl">
              Grow your business to the rest of the world.
            </h1>
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center bg-white py-12 px-0">
          <div className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
            <h2 className="text-3xl font-bold mb-6 text-[#222] text-left">Login</h2>
            {error && (
              <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">
                {error === "CredentialsSignin" ? "Invalid email or password" : error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#326de0] text-base"
                  placeholder="m@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#326de0] text-base"
                />
                <div className="mt-2">
                  <Link href="/forgot-password" className="text-sm text-[#326de0] hover:underline">Forgot Password</Link>
                </div>
              </div>
              <div className="flex items-center mb-2">
                <input
                  id="keep-signed-in"
                  name="keep-signed-in"
                  type="checkbox"
                  checked={keepSignedIn}
                  onChange={e => setKeepSignedIn(e.target.checked)}
                  className="h-4 w-4 text-[#326de0] border-gray-300 rounded focus:ring-[#326de0]"
                />
                <label htmlFor="keep-signed-in" className="ml-2 block text-sm text-gray-700">Keep me signed in</label>
              </div>
              <Button
                className="w-full bg-[#326de0] hover:bg-[#254bb5] text-white font-bold py-2 rounded-lg text-lg transition-all"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>
            <div className="my-6" />
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#326de0] underline-offset-4 hover:underline font-semibold">
                Sign up
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
