"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Building2, UserCircle } from "lucide-react"

// B2B account types: map to existing backend roles
const ACCOUNT_TYPES = [
  { value: "company", label: "Company", description: "Advertise products and connect with industry partners", role: "COMMERCIAL_PRINTER" as const },
  { value: "professional", label: "Industry Professional", description: "Explore listings and contact companies", role: "END_USER_PRINTER" as const },
] as const

const COUNTRIES = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "united-states", label: "United States" },
  { value: "united-kingdom", label: "United Kingdom" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "china", label: "China" },
  { value: "india", label: "India" },
  { value: "south-africa", label: "South Africa" },
  { value: "kenya", label: "Kenya" },
  { value: "egypt", label: "Egypt" },
  { value: "brazil", label: "Brazil" },
  { value: "australia", label: "Australia" },
  { value: "other", label: "Other" },
]

const inputClassName =
  "w-full px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#326de0] text-base bg-white"

const selectTriggerClassName =
  "w-full h-auto min-h-[42px] px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-[#326de0] text-base"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [country, setCountry] = useState("")
  const [accountType, setAccountType] = useState<"company" | "professional">("professional")
  const [companyName, setCompanyName] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const role = ACCOUNT_TYPES.find((t) => t.value === accountType)?.role ?? "END_USER_PRINTER"

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (status === "authenticated") return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!agreeToTerms) {
      toast({
        title: "Terms required",
        description: "Please agree to the terms and privacy policy.",
        variant: "destructive",
      })
      return
    }
    if (!name.trim() || !email.trim() || !password.trim() || !country) {
      toast({
        title: "Missing fields",
        description: "Please fill in name, email, password, and country.",
        variant: "destructive",
      })
      return
    }
    if (accountType === "company" && !companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name.",
        variant: "destructive",
      })
      return
    }
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          country,
          role,
          companyName: companyName.trim() || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const msg = (data?.error as string) ?? "Something went wrong."
        setError(msg)
        toast({
          title: "Registration failed",
          description: msg,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const signInResult = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (signInResult?.error) {
        toast({
          title: "Account created",
          description: "Please sign in with your email and password.",
        })
        router.push("/login?registered=1")
        return
      }

      toast({
        title: "Welcome",
        description: "Your account has been created. Complete your profile in onboarding when you're ready.",
      })
      window.location.href = "/dashboard"
    } catch {
      const msg = "Something went wrong. Please try again."
      setError(msg)
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full fixed top-0 left-0 z-50  bg-[#326de0] shadow-md">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center">
            <Image src="/images/Nig-Print-Logo.png" alt="PrintMarket NG Logo" width={48} height={48} className="mr-3" />
            <span className="text-white text-xl font-bold tracking-wide">PRINTMARKET NG</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 min-h-0">
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
            <span className="uppercase text-white font-bold text-base mb-3 tracking-widest drop-shadow-lg">Welcome to PRINTMARKET NG</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl  text-white leading-tight drop-shadow-2xl mb-2 max-w-xl">
              Grow your business to the rest of the world.
            </h1>
          </div>
        </div>

        <div className="flex w-full md:w-1/2 items-center justify-center bg-white py-12 px-0 min-h-0 overflow-y-auto pb-24 md:pb-28">
          <div className="w-full h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-6">
            <h2 className="text-3xl font-bold mb-2 text-[#222] text-left">Create account</h2>
            <p className="text-sm text-gray-600 mb-6">
              Join the B2B printing platform. Connect with companies, list products, and negotiate agreements.
            </p>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={inputClassName}
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Select value={country} onValueChange={setCountry} required>
                  <SelectTrigger id="country" className={selectTriggerClassName}>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">I am a</span>
                <Select value={accountType} onValueChange={(v: "company" | "professional") => setAccountType(v)}>
                  <SelectTrigger className={selectTriggerClassName}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        <div className="flex items-center gap-2">
                          {t.value === "company" ? <Building2 className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />}
                          <span>{t.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1.5">
                  {ACCOUNT_TYPES.find((t) => t.value === accountType)?.description}
                </p>
              </div>
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company name {accountType === "company" ? "" : "(optional)"}
                </label>
                <input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company"
                  autoComplete="organization"
                  className={inputClassName}
                />
              </div>
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 text-[#326de0] border-gray-300 rounded focus:ring-[#326de0]"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 leading-tight">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#326de0] hover:underline font-medium">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#326de0] hover:underline font-medium">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#326de0] hover:bg-[#254bb5] text-white font-bold py-2 rounded-lg text-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </form>
            <div className="my-6" />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-[#326de0] underline-offset-4 hover:underline font-semibold">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#326de0] fixed bottom-0 left-0 z-50 text-white text-center py-3 text-xs font-medium shadow-inner">
        &copy;{new Date().getFullYear()} PrintMarket NG
      </footer>
    </div>
  )
}
