"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FeaturedVendors } from "@/components/featured-vendors"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Printer, Users, FileText, BookOpen, Award, ArrowRight, CheckCircle2, Globe2, Briefcase, Phone, Mail, Linkedin, Instagram, Facebook, Twitter } from "lucide-react"
import { useState, useEffect } from "react"
import { FloatingForum } from "./components/floating-forum"
import { Footer } from "@/components/footer"
import { FeaturedProducts } from "@/components/featured-products"
import { Badge } from "@/components/ui/badge"
import { FeaturedLiveDemo } from "@/components/featured-live-demo"
import { WEEKLY_DEMO_APPLICATION_HREF } from "@/lib/demo-routes"

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
      src: "/images/b7a4dab131.jpg",
      alt: "Trusted Gateway"
    },
    title: "Secured access to the Nigeria Printing & Graphic Communication Market",
    subtitle: "",
            description: "Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Navigate the Nigerian printing landscape with confidence through our secure and reliable platform. Connect with verified sellers and access comprehensive printing solutions.",
    primaryButton: "Get Started",
    secondaryButton: "View Services"
  },
  {
    image: {
      src: "/images/8921fe63ae.jpg",
      alt: "Thriving Industry"
    },
    title: "Unlocking opportunities in Nigeria's thriving Printing and Graphics Communication Industry",
    subtitle: "",
            description: "Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Tap into the dynamic growth of Nigeria's printing sector. Discover new business opportunities, innovative technologies, and strategic partnerships in this rapidly expanding market.",
    primaryButton: "Discover Opportunities",
    secondaryButton: "Join Network"
  },
  {
    image: {
      src: "/images/797867fbc3.jpg",
      alt: "Buyers and Sellers"
    },
    title: "Connecting buyers and sellers in Nigeria Printing and Graphics Communications Sector",
    subtitle: "",
            description: "Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Facilitate seamless transactions between printing professionals. Our platform brings together verified buyers and sellers for mutually beneficial business relationships.",
    primaryButton: "Connect Now",
    secondaryButton: "Register"
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
    }, 10000)

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
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-6">
                  <div className="inline-block">
                    <h2 className="text-xl font-bold tracking-wider uppercase" style={{ color: '#ff9017' }}>PRINTMARKET NG</h2>
                    <div className="h-1 w-16 bg-[#ff9017] mt-2 rounded-full"></div>
                  </div>
                  
                  <div className="">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-white ">
                      Trusted gateway to Nigeria's Printing and Graphics Market.
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Button asChild size="lg" className="font-bold shadow-lg px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300 w-fit" style={{ backgroundColor: '#ff9017', color: 'white' }}>
                    <Link href="/register" className="flex items-center gap-2">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  
                  {/* Social Media Section - Positioned below CTA for better hierarchy */}
                  <div className="flex flex-col gap-3">
                    <p className="text-white/80 text-sm font-medium">Connect with us</p>
                    <div className="flex items-center gap-3">
                      <a href="tel:+2343006814" className="bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group" title="Phone">
                        <Phone className="h-4 w-4 text-white group-hover:text-[#ff9017]" />
                      </a>
                      <a href="mailto:info@printmarketng.com" className="bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group" title="Email">
                        <Mail className="h-4 w-4 text-white group-hover:text-[#ff9017]" />
                      </a>
                      <a href="https://linkedin.com/company/printmarketng" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group" title="LinkedIn">
                        <Linkedin className="h-4 w-4 text-white group-hover:text-[#ff9017]" />
                      </a>
                      <a href="https://instagram.com/printmarketng" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group" title="Instagram">
                        <Instagram className="h-4 w-4 text-white group-hover:text-[#ff9017]" />
                      </a>
                      <a href="https://facebook.com/printmarketng" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group" title="Facebook">
                        <Facebook className="h-4 w-4 text-white group-hover:text-[#ff9017]" />
                      </a>
                      <a href="https://twitter.com/printmarketng" target="_blank" rel="noopener noreferrer" className="bg-white/10 backdrop-blur-sm p-2 rounded-lg hover:bg-white/20 transition-all duration-300 group" title="Twitter">
                        <Twitter className="h-4 w-4 text-white group-hover:text-[#ff9017]" />
                      </a>
                    </div>
                  </div>
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
                              ? 'opacity-100 translate-x-0 z-10' 
                              : 'opacity-0 translate-x-4 '
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
                      {/* Enhanced Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                        {adContent.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentAdIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`rounded-full transition-all duration-300 ease-in-out ${
                              index === currentAdIndex 
                                ? 'bg-[#ff9017] w-8 h-3 shadow-lg' 
                                : 'bg-white/60 hover:bg-white/80 w-3 h-3'
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
                              ? 'opacity-100 translate-x-0 relative z-10' 
                              : 'opacity-0 -translate-x-4 absolute '
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
                    PrintMarket NG offers a comprehensive suite of services across three key dimensions:
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#326de0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#326de0]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <Globe2 className="h-8 w-8 text-[#326de0]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#326de0] text-xl font-bold">Global Market Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#326de0]" />
                        <span>Your trusted gateway to Nigeria's Printing and Graphics Communications Market</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#326de0]" />
                        <span>Opening up the world to Nigeria's vibrant printing market</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#326de0]" />
                        <span>Verified buyers and sellers network</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#ff9017]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff9017]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#ff9017]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="h-8 w-8 text-[#ff9017]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#ff9017] text-xl font-bold">Business Support Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Your trusted gateway to Nigeria's Printing and Graphics Communications Market</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Seamless operations and growth facilitation</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ff9017]" />
                        <span>Professional business advisory and support</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-2 border-[#ce057d]/10 shadow-xl hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ce057d]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader>
                    <div className="flex justify-center">
                      <div className="rounded-full bg-[#ce057d]/10 p-4 group-hover:scale-110 transition-transform duration-300">
                        <Users className="h-8 w-8 text-[#ce057d]" />
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-center text-[#ce057d] text-xl font-bold">Community Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ce057d]" />
                        <span>Fostering meaningful connections between Nigerian printers</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ce057d]" />
                        <span>Interactive forums and knowledge sharing</span>
                      </li>
                      <li className="flex items-center gap-3 group-hover:translate-x-1 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-[#ce057d]" />
                        <span>Discussion of business needs and collaboration</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-12 text-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-[#326de0] to-[#ce057d] text-white hover:from-[#326de0]/90 hover:to-[#ce057d]/90 px-8 py-3 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Link href="/about">
                    See More
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Featured Products Section */}
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

            <div className="container px-4 md:px-6 relative z-10">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8 md:mb-16">
                <div className="inline-block">
                  <h2 className="text-3xl font-bold tracking-tight md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#326de0] to-[#ce057d]">
                    PRIME PRODUCTS
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-[#326de0] to-[#ce057d] mx-auto mt-4 rounded-full"></div>
                </div>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                  Explore our prime featured product services to position your product for prominence
                </p>
              </div>

              <div className="relative">
                <div className="relative bg-white rounded-2xl shadow-2xl p-2 md:p-8 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#326de0]/5 to-[#ce057d]/5 rounded-2xl"></div>
                  <div className="relative z-10">
                    <FeaturedProducts />
                  </div>
                </div>
              </div>

              <div className="mt-8 md:mt-12 text-center">
                <Button 
                  asChild
                  className="bg-gradient-to-r from-[#326de0] to-[#ce057d] text-white hover:from-[#326de0]/90 hover:to-[#ce057d]/90 px-6 md:px-8 py-2 md:py-3 font-semibold transition-all duration-300 text-sm md:text-lg shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <Link href="/marketplace?activeTab=products">View All Products</Link>
                </Button>
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
                    VERIFIED SELLERS
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-[#326de0] to-[#ce057d] mx-auto mt-4 rounded-full"></div>
                </div>
                <p className="max-w-[900px] text-gray-600 text-sm md:text-xl/relaxed mt-4 md:mt-6">
                  Get connected to verified buyers and sellers to meet your needs
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
                  <Link href="/marketplace?activeTab=vendors">View All Sellers</Link>
                </Button>
              </div>
            </div>
          </section>

        <section className="w-full py-16 md:py-32 lg:py-40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Premium Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Premium Background Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12 md:mb-20">
              <div className="inline-block relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary text-white text-xs uppercase tracking-widest py-1 px-4 rounded-full font-semibold">
                  Premium Position
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                  Featured Live Demonstration
                </h2>
                <div className="h-1 w-32 bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary mx-auto mt-6 rounded-full"></div>
              </div>
              <p className="max-w-[800px] text-gray-300 text-lg md:text-xl/relaxed mt-6">
                Curated weekly live demonstrations: one featured spotlight per week, plus an approved pipeline of upcoming
                sessions. Connect with manufacturers — product video stays on listings; this is scheduled programme
                access only.
              </p>
              <div className="flex gap-4 mt-4">
                <Badge className="bg-gradient-to-r from-brand-primary to-brand-pink text-white px-4 py-1 text-sm font-semibold">
                  Weekly spotlight
                </Badge>
                <Badge className="bg-white/10 text-white px-4 py-1 text-sm font-semibold backdrop-blur-sm">
                  Application &amp; approval
                </Badge>
                <Badge className="bg-white/10 text-white px-4 py-1 text-sm font-semibold backdrop-blur-sm">
                  Scheduled sessions
                </Badge>
              </div>
            </div>

            <div className="relative">
              <FeaturedLiveDemo />
            </div>

            <div className="mt-12 text-center">
              <p className="text-white/60 text-sm mb-6">
                Apply to host a weekly demonstration — editorial review, then weekly slot assignment
              </p>
              <Button 
                asChild
                className="bg-gradient-to-r from-brand-primary via-brand-pink to-brand-secondary text-white hover:from-brand-primary/90 hover:via-brand-pink/90 hover:to-brand-secondary/90 px-8 py-3 font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href={WEEKLY_DEMO_APPLICATION_HREF}>
                  Apply to host a demonstration
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <FloatingForum />
      </main>
      <Footer />
    </div>
  )
}
