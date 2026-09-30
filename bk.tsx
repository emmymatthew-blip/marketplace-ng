import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeaturedVendors } from "@/components/featured-vendors"
import { UpcomingDemos } from "@/components/upcoming-demos"
import { ForumHighlights } from "@/components/forum-highlights"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, Users, FileText, BookOpen, Award, ArrowRight, CheckCircle2 } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 50%, #9333EA 100%)'}}>
          {/* Decorative SVG Shape */}
          <svg className="absolute top-0 right-0 w-64 h-64 opacity-30 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#FDE68A" d="M44.8,-75.2C57.2,-67.2,65.7,-53.2,72.2,-39.1C78.7,-25,83.2,-10.8,81.2,2.7C79.2,16.2,70.7,28.9,61.2,41.2C51.7,53.5,41.2,65.4,28.1,71.7C15,78,0,78.7,-13.7,74.2C-27.4,69.7,-40,60,-51.2,48.2C-62.4,36.4,-72.2,22.5,-74.7,7.5C-77.2,-7.5,-72.4,-23.5,-63.7,-36.2C-55,-48.9,-42.4,-58.2,-28.2,-65.2C-14,-72.2,2.8,-76.8,19.2,-77.2C35.6,-77.6,51.2,-73.2,44.8,-75.2Z" transform="translate(100 100)" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/30 to-transparent z-0"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-yellow-400 mb-2 uppercase tracking-wide drop-shadow">Welcome to PrintMarket NG</h2>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 drop-shadow-lg">
                    Your trusted gateway to Nigeria's Printing and Graphics Communications Market
                  </h1>
                  <p className="max-w-[600px] text-white md:text-xl/relaxed mt-2 drop-shadow">
                    Connect with verified printers, manufacturers, and sellers. Discover opportunities, grow your network, and access exclusive industry resources.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 text-white font-bold shadow-xl px-8 py-4 text-lg hover:from-green-400 hover:to-pink-500">
                    <Link href="/register" className="flex items-center gap-2">
                      Get Started
                    </Link>
                  </Button>
                  <span className="text-base text-white font-semibold mt-2 sm:mt-0 sm:ml-6 drop-shadow">
                    Call <a href="tel:+2343006814" className="text-yellow-300 font-bold hover:underline">(234) 300-68-14</a>
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 relative overflow-hidden">
          <svg className="absolute left-0 top-0 w-48 h-48 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#A5B4FC" d="M44.8,-75.2C57.2,-67.2,65.7,-53.2,72.2,-39.1C78.7,-25,83.2,-10.8,81.2,2.7C79.2,16.2,70.7,28.9,61.2,41.2C51.7,53.5,41.2,65.4,28.1,71.7C15,78,0,78.7,-13.7,74.2C-27.4,69.7,-40,60,-51.2,48.2C-62.4,36.4,-72.2,22.5,-74.7,7.5C-77.2,-7.5,-72.4,-23.5,-63.7,-36.2C-55,-48.9,-42.4,-58.2,-28.2,-65.2C-14,-72.2,2.8,-76.8,19.2,-77.2C35.6,-77.6,51.2,-73.2,44.8,-75.2Z" transform="translate(100 100)" />
          </svg>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-blue-500 to-green-500">How It Works</h2>
              <p className="max-w-[900px] text-blue-700 md:text-xl/relaxed">
                PrintMarket NG is your trusted gateway to Nigeria's Printing and Graphics Communications Market. We're a specialized hub for the printing industry.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="relative overflow-hidden group bg-gradient-to-br from-white via-pink-50 to-blue-50 border-2 border-pink-200 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-pink-200 p-3">
                      <Users className="h-8 w-8 text-pink-500" />
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-center text-pink-600">Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-pink-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-400" />
                      <span>Find verified printers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-400" />
                      <span>Connect with manufacturers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-pink-400" />
                      <span>Network with sellers</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group bg-gradient-to-br from-white via-blue-50 to-green-50 border-2 border-blue-200 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-blue-200 p-3">
                      <Award className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-center text-blue-600">Verify</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      <span>CIPPON verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      <span>Legitimate professionals</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                      <span>Trusted partners</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group bg-gradient-to-br from-white via-green-50 to-yellow-50 border-2 border-green-200 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-200 p-3">
                      <FileText className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-center text-green-600">Agree</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Service agreements</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Clear terms</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span>Secure contracts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="relative overflow-hidden group bg-gradient-to-br from-white via-yellow-50 to-pink-50 border-2 border-yellow-200 shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader>
                  <div className="flex justify-center">
                    <div className="rounded-full bg-yellow-200 p-3">
                      <BookOpen className="h-8 w-8 text-yellow-500" />
                    </div>
                  </div>
                  <CardTitle className="mt-4 text-center text-yellow-600">Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-yellow-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                      <span>Demo classes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                      <span>Industry forums</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-yellow-400" />
                      <span>Expert knowledge</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 relative overflow-hidden">
          <svg className="absolute right-0 bottom-0 w-48 h-48 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#F9A8D4" d="M44.8,-75.2C57.2,-67.2,65.7,-53.2,72.2,-39.1C78.7,-25,83.2,-10.8,81.2,2.7C79.2,16.2,70.7,28.9,61.2,41.2C51.7,53.5,41.2,65.4,28.1,71.7C15,78,0,78.7,-13.7,74.2C-27.4,69.7,-40,60,-51.2,48.2C-62.4,36.4,-72.2,22.5,-74.7,7.5C-77.2,-7.5,-72.4,-23.5,-63.7,-36.2C-55,-48.9,-42.4,-58.2,-28.2,-65.2C-14,-72.2,2.8,-76.8,19.2,-77.2C35.6,-77.6,51.2,-73.2,44.8,-75.2Z" transform="translate(100 100)" />
          </svg>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-pink-500 to-blue-500">Featured Vendors</h2>
              <p className="max-w-[900px] text-green-700 md:text-xl/relaxed">
                Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Discover top verified printers and manufacturers in the Nigerian printing industry.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2">
                <Image
                  src="/images/C 1.png"
                  alt="Decorative Element"
                  width={200}
                  height={200}
                  className="opacity-20"
                />
              </div>
              <FeaturedVendors />
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-yellow-50 via-pink-50 to-blue-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="relative">
                <div className="absolute -right-4 top-0">
                  <Image
                    src="/images/image 87.png"
                    alt="Decorative Element"
                    width={150}
                    height={150}
                    className="opacity-20"
                  />
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-pink-500 to-blue-500">Upcoming Demonstrations</h2>
                  <p className="max-w-[900px] text-yellow-700 md:text-xl/relaxed">
                    Learn from industry experts through our manufacturer demonstration classes.
                  </p>
                </div>
                <UpcomingDemos />
              </div>
              <div className="relative">
                <div className="absolute -left-4 top-0">
                  <Image
                    src="/images/Canon-pixma-2 1.png"
                    alt="Decorative Element"
                    width={150}
                    height={150}
                    className="opacity-20"
                  />
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-green-500 to-pink-500">Forum Highlights</h2>
                  <p className="max-w-[900px] text-blue-700 md:text-xl/relaxed">
                    Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Join the conversation in our specialized printing industry forums.
                  </p>
                </div>
                <ForumHighlights />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gradient-to-r from-pink-500 via-blue-500 to-green-500">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="/images/logo.png"
                alt="PrintMarket NG Logo"
                width={32}
                height={32}
                className="rounded shadow-md"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-green-200">PrintMarket NG</span>
            </Link>
            <p className="text-sm text-white">© 2023 PrintMarket NG. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-white hover:text-yellow-200 transition-colors">
              Terms f Service
            </Link>
            <Link href="/privacy" className="text-sm text-white hover:text-yellow-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-sm text-white hover:text-yellow-200 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
