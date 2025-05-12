"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeaturedVendors } from "@/components/featured-vendors"
import { UpcomingDemos } from "@/components/upcoming-demos"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, Users, FileText, BookOpen, Award, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"
import { FloatingForum } from "./components/floating-forum"
import { Footer } from "@/components/footer"

const heroImages = [
  {
    src: "/images/IMG_9890 1 (2).png",
    alt: "Printing Industry"
  },
  {
    src: "/images/b7a4dab131.jpg",
    alt: "Printing Equipment"
  },
  {
    src: "/images/8921fe63ae.jpg",
    alt: "Printing Technology"
  },
  {
    src: "/images/797867fbc3.jpg",
    alt: "Printing Solutions"
  }
]

const adContent = [
  {
    image: {
      src: "/images/IMG_9890 1 (2).png",
      alt: "Premium Printing Equipment"
    },
    title: "Showcase Your Products",
    subtitle: "To Industry Leaders",
    description: "Join the premier platform for printing professionals. Reach thousands of verified buyers and expand your business reach.",
    primaryButton: "Start Advertising",
    secondaryButton: "View Pricing"
  },
  {
    image: {
      src: "/images/b7a4dab131.jpg",
      alt: "Printing Solutions"
    },
    title: "Connect With Experts",
    subtitle: "In Printing Technology",
    description: "Network with industry leaders and stay ahead of the latest printing innovations and trends.",
    primaryButton: "Join Network",
    secondaryButton: "Learn More"
  },
  {
    image: {
      src: "/images/8921fe63ae.jpg",
      alt: "Industry Technology"
    },
    title: "Grow Your Business",
    subtitle: "With Smart Solutions",
    description: "Access cutting-edge printing technology and solutions to scale your operations efficiently.",
    primaryButton: "Explore Solutions",
    secondaryButton: "Get Demo"
  },
  {
    image: {
      src: "/images/797867fbc3.jpg",
      alt: "Professional Printing"
    },
    title: "Premium Services",
    subtitle: "For Your Success",
    description: "Get access to exclusive printing services and professional support for your business needs.",
    primaryButton: "View Services",
    secondaryButton: "Contact Us"
  }
]

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    const adTimer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        prevIndex === adContent.length - 1 ? 0 : prevIndex + 1
      )
    }, 4000)

    return () => {
      clearInterval(timer)
      clearInterval(adTimer)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 border-b bg-white shadow-md">
        <div className="container mx-auto flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="absolute inset-0">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <div className="container mx-auto relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold" style={{ color: '#ff9017' }}>Welcome to NG MARKETPLACE</h2>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-white">
                    The Premier Platform for the Printing Industry
                  </h1>
                  <p className="max-w-[600px] text-white/90 md:text-xl/relaxed mt-2">
                    Connect with verified printers, manufacturers, and sellers. Discover opportunities, grow your network, and access exclusive industry resources.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button asChild size="lg" className="font-bold shadow-lg px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#ff9017', color: 'white' }}>
                    <Link href="/register" className="flex items-center gap-2">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <span className="text-base text-white font-semibold mt-2 sm:mt-0 sm:ml-6">
                    Call <a href="tel:+2347012345678" className="font-bold hover:underline" style={{ color: '#ff9017' }}>(234) 701-234-5678</a>
                  </span>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[600px] h-[450px]">
                  {heroImages.map((image, index) => (
                    <div
                      key={image.src}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover rounded-lg shadow-2xl"
                      />
                    </div>
                  ))}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-[#ff9017] w-6' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </section>
        
        {/* Banner */}
          <div className="mb-6 overflow-hidden">
            <div className="bg-primary text-white p-12 relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <Image
                  src="/images/20170816_154040-scaled-e1583853764343 2.png"
                  alt="Background Pattern"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="container mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  {/* Image Section */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="relative w-full max-w-[500px] h-[320px] rounded-lg overflow-hidden">
                      {adContent.map((item, index) => (
                        <div
                          key={item.image.src}
                          className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                            index === currentAdIndex 
                              ? 'opacity-100 translate-x-0' 
                              : 'opacity-0 translate-x-4'
                          }`}
                        >
                          <Image
                            src={item.image.src}
                            alt={item.image.alt}
                            fill
                            className="object-cover drop-shadow-2xl"
                          />
                        </div>
                      ))}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {adContent.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentAdIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ease-in-out ${
                              index === currentAdIndex 
                                ? 'bg-[#ff9017] w-4' 
                                : 'bg-white/50 hover:bg-white/75'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute -bottom-4 -right-4">
                        <Image
                          src="/images/C 1.png"
                          alt="Decorative Element"
                          width={80}
                          height={80}
                          className="opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2 flex justify-center">
                    <div className="max-w-xl">
                      {adContent.map((item, index) => (
                        <div
                          key={index}
                          className={`transition-all duration-700 ease-in-out transform ${
                            index === currentAdIndex 
                              ? 'opacity-100 translate-x-0' 
                              : 'opacity-0 -translate-x-4 absolute'
                          }`}
                        >
                          <div className="space-y-8">
                            <div className="space-y-3">
                              <h2 className="text-4xl font-bold leading-tight">
                                {item.title}
                              </h2>
                              <h3 className="text-2xl text-[#ff9017] font-semibold">
                                {item.subtitle}
                              </h3>
                            </div>
                            <p className="text-lg opacity-90 leading-relaxed">
                              {item.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4  pt-4">
                              <Button 
                                className="bg-white text-[#ce057d] hover:bg-gray-100 px-8 py-3 font-semibold transition-all duration-300 text-lg w-full sm:w-auto"
                                size="lg"
                              >
                                {item.primaryButton}
                              </Button>
                              <Button 
                                variant="outline"
                                className="border-2 border-white bg-primary hover:text-white text-white hover:bg-white/10 px-8 py-3 font-semibold transition-all duration-300 text-lg w-full sm:w-auto"
                                size="lg"
                              >
                                {item.secondaryButton}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-white via-primary/5 to-primary/10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <Image
                src="/images/20170816_154040-scaled-e1583853764343 2.png"
                alt="Background Pattern"
                fill
                className="object-cover"
              />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
                <div className="inline-block">
                  <h2 className="text-3xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#326de0]  to-[#ce057d]">
                    How It Works
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-[#326de0] to-[#ce057d] mx-auto mt-4 rounded-full"></div>
                </div>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                  NG MARKETPLACE is not just another e-commerce platform. We're a specialized hub for the printing industry.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#326de0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#326de0]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-8 w-8 text-[#326de0]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#326de0] text-xl font-bold">Connect</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#326de0]" />
                        <span>Find verified printers</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#326de0]" />
                        <span>Connect with manufacturers</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#326de0]" />
                        <span>Network with sellers</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#ff9017]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff9017]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#ff9017]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <Award className="h-8 w-8 text-[#ff9017]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#ff9017] text-xl font-bold">Verify</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>CIPPON verification</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Legitimate professionals</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Trusted partners</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#ce057d]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ce057d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#ce057d]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="h-8 w-8 text-[#ce057d]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#ce057d] text-xl font-bold">Agree</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ce057d]" />
                        <span>Service agreements</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ce057d]" />
                        <span>Clear terms</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ce057d]" />
                        <span>Secure contracts</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#ff9017]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff9017]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#ff9017]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <BookOpen className="h-8 w-8 text-[#ff9017]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#ff9017] text-xl font-bold">Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Demo classes</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Industry forums</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Expert knowledge</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

        {/* Featured Vendors Section */}
        <section className="w-full py-8 md:py-24 lg:py-32 bg-gradient-to-br from-white via-primary/5 to-primary/10 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="container px-2 md:px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-16">
              <div className="inline-block">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#326de0] to-[#ce057d]">
                  Featured Vendors
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-[#326de0] to-[#ce057d] mx-auto mt-4 rounded-full"></div>
              </div>
              <p className="max-w-[900px] text-gray-600 text-sm md:text-xl/relaxed mt-4 md:mt-6">
                Discover our verified and trusted printing industry partners who are ready to serve your needs.
              </p>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-2 md:p-8 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-[#326de0]/5 to-[#ce057d]/5 rounded-2xl"></div>
                <div className="relative z-10">
                  <FeaturedVendors />
                </div>
              </div>
            </div>

            <div className="mt-8 md:mt-12 text-center">
              <Button 
                className="bg-gradient-to-r from-[#326de0] to-[#ce057d] text-white hover:from-[#326de0]/90 hover:to-[#ce057d]/90 px-6 md:px-8 py-2 md:py-3 font-semibold transition-all duration-300 text-sm md:text-lg shadow-lg hover:shadow-xl"
                size="lg"
              >
                View All Vendors
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-8 md:py-24 lg:py-32 bg-gradient-to-br from-primary via-primary to-primary relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="container px-2 md:px-4 mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-16">
              <div className="inline-block">
                <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">
                  Upcoming Demonstrations
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-[#e94560] to-[#ff9017] mx-auto mt-4 rounded-full"></div>
              </div>
              <p className="max-w-[900px] text-gray-300 text-sm md:text-xl/relaxed mt-4 md:mt-6">
                Learn from industry experts through our exclusive manufacturer demonstration classes and stay ahead of the latest printing innovations.
              </p>
            </div>

            <div className="relative">
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-2 md:p-8 border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-br from-[#e94560]/10 to-[#ff9017]/10 rounded-2xl"></div>
                <div className="relative z-10">
                  <UpcomingDemos />
                </div>
              </div>
            </div>
          </div>
        </section>

        <FloatingForum />
      </main>
      <Footer />
    </div>
  )
}
