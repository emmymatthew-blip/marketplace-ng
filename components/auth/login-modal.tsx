"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  callbackUrl?: string
}

export function LoginModal({ isOpen, onClose, callbackUrl }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [keepSignedIn, setKeepSignedIn] = useState(false)

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
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error)
        toast({
          title: "Error",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else {
        onClose()
        toast({
          title: "Success",
          description: "You have been signed in successfully",
        })
        if (callbackUrl) {
          router.push(callbackUrl)
        }
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl">
        <DialogTitle className="sr-only">Login to PrintMarket NG</DialogTitle>
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Left: Image & Promo */}
          <div className="hidden md:block w-1/2 relative">
            <div className="relative h-full min-h-[500px]">
              <Image
                src="/images/IMG_9890 1 (2).png"
                alt="Smiling Black businessman"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute left-0 bottom-0 z-10 p-8">
                <span className="uppercase text-white font-bold text-sm mb-2 tracking-widest drop-shadow-lg">Welcome to PRINTMARKET NG</span>
                <h2 className="text-2xl text-white leading-tight drop-shadow-2xl mb-2">
                  Grow your business to the rest of the world.
                </h2>
              </div>
            </div>
          </div>
          {/* Right: Login Form */}
          <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center min-w-[320px]">
            <h3 className="text-2xl font-bold mb-6 text-[#222]">Login</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-100 text-red-700 text-sm p-2 rounded">
                  {error === "CredentialsSignin" ? "Invalid email or password" : error}
                </div>
              )}
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
                  <Link href="/forgot-password" className="text-sm text-[#326de0] hover:underline">
                    Forgot Password?
                  </Link>
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
              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/register" className="text-[#326de0] underline-offset-4 hover:underline font-semibold">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 