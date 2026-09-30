"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, MapPin, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/app/hooks/use-media-query"

// Featured products data (subset of marketplace products)
const featuredProducts = [
  {
    id: "1",
    title: "Heidelberg Speedmaster XL 106",
    description: "High-performance offset printing press with advanced automation. Features perfecting, coating, and drying capabilities.",
    category: "Offset Press",
    images: ["/printer/H09789ceced794a57b385e3eeaf9af2cfW.jpg_960x960q80.jpeg"],
    location: "Lagos, Nigeria",
    owner: {
      name: "PrintTech Solutions",
      isVerified: true
    }
  },
  {
    id: "2",
    title: "Komori Lithrone G40",
    description: "Advanced offset press with H-UV curing system. Features automatic plate changing and color management.",
    category: "Offset Press",
    images: ["/printer/H24cf7d1c4cc549aaad4e2ac1bdcfb2f6c.jpg_960x960q80.jpeg"],
    location: "Abuja, Nigeria",
    owner: {
      name: "UV Solutions Ltd",
      isVerified: true
    }
  },
  {
    id: "3",
    title: "HP Indigo 12000 Digital Press",
    description: "High-speed digital press for commercial printing. Features 7-color printing and advanced color management.",
    category: "Digital Press",
    images: ["/printer/H319c504455484019822aa8d619db24e3I.jpg_960x960q80.jpeg"],
    location: "Port Harcourt, Nigeria",
    owner: {
      name: "ScreenTech International",
      isVerified: true
    }
  },
  {
    id: "4",
    title: "Canon imagePRESS C10000VP",
    description: "Production digital press with high-speed printing up to 100 pages per minute. Features advanced finishing options.",
    category: "Digital Press",
    images: ["/printer/H791fd3324c1048c59de39dd48df9e0d9A.jpg_960x960q80.jpeg"],
    location: "Kano, Nigeria",
    owner: {
      name: "GraphicPro Systems",
      isVerified: true
    }
  },
  {
    id: "5",
    title: "Vastex V-2000HD Screen Press",
    description: "Automatic screen printing press with 6-color capability. Features micro-registration and flash curing.",
    category: "Screen Press",
    images: ["/printer/H86e497e1e3db45f98847fb01bd7c1f9e9.jpg_960x960q80.jpeg"],
    location: "Ibadan, Nigeria",
    owner: {
      name: "Textile Print Nigeria",
      isVerified: true
    }
  },
  {
    id: "6",
    title: "Kodak Magnus Q800 CTP System",
    description: "Computer-to-plate system for thermal plates. Features high-resolution imaging and automatic plate handling.",
    category: "CTP Systems",
    images: ["/printer/H8c3ff0af66a948eaa4694ef6f65b1e17U.jpg_960x960q80.jpeg"],
    location: "Enugu, Nigeria",
    owner: {
      name: "Textile Print Nigeria",
      isVerified: true
    }
  },
  {
    id: "7",
    title: "Epson SureColor P9000 Proofing System",
    description: "Large format proofing printer with 11-color ink system. Features advanced color management and media handling.",
    category: "Proofing Systems",
    images: ["/printer/H918bafd52a5041c98631010d9b2906a1q.jpg_960x960q80.jpeg"],
    location: "Lagos, Nigeria",
    owner: {
      name: "ScreenTech International",
      isVerified: true
    }
  },
  {
    id: "8",
    title: "Adobe Creative Suite 2024",
    description: "Complete design software suite including Photoshop, Illustrator, and InDesign. Features cloud integration.",
    category: "Pre-press Software",
    images: ["/printer/Hb7e97600d9374e9fb5aeaf63c2223292X.jpg_960x960q80.jpeg"],
    location: "Lagos, Nigeria",
    owner: {
      name: "Textile Print Nigeria",
      isVerified: true
    }
  },
  {
    id: "9",
    title: "Polar 115 XT Cutting System",
    description: "Programmable cutting system with automatic knife adjustment. Features high-precision cutting and safety systems.",
    category: "Cutting Equipment",
    images: ["/printer/Hc1782d3d7d0e496a92c48d950ba84c09n.jpg_960x960q80.jpeg"],
    location: "Abuja, Nigeria",
    owner: {
      name: "GraphicPro Systems",
      isVerified: true
    }
  },
  {
    id: "10",
    title: "MBO K8 Folding Machine",
    description: "High-speed folding machine with 8-buckle capability. Features automatic setup and quality monitoring.",
    category: "Folding Equipment",
    images: ["/printer/Hc3395a7bdcc04c129641524d1f203813o.jpg_960x960q80.jpeg"],
    location: "Port Harcourt, Nigeria",
    owner: {
      name: "PrintTech Solutions",
      isVerified: true
    }
  },
  {
    id: "11",
    title: "Muller Martini Presto II Binder",
    description: "Perfect binding system with automatic setup. Features glue application and cover attachment.",
    category: "Binding Equipment",
    images: ["/printer/Hc360f8d99cce40c3a19a87492d556cd8w.jpeg"],
    location: "Kano, Nigeria",
    owner: {
      name: "GraphicPro Systems",
      isVerified: true
    }
  },
  {
    id: "12",
    title: "Epson SureColor P20000",
    description: "Large format inkjet printer for signage and graphics. Features 10-color ink system and roll-to-roll printing.",
    category: "Inkjet Printers",
    images: ["/printer/Hc54c402d5e0745b7be5402da1ed38433f.jpg_350x350.jpeg"],
    location: "Lagos, Nigeria",
    owner: {
      name: "PrintTech Solutions",
      isVerified: true
    }
  }
]

export function FeaturedProducts() {
  const [currentPage, setCurrentPage] = useState(0)
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")
  
  // Determine items per page based on screen size
  const itemsPerPage = isMobile ? 1 : isTablet ? 2 : 4
  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage)

  // Reset current page when screen size changes
  useEffect(() => {
    setCurrentPage(0)
  }, [itemsPerPage])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages)
    }, 5000)

    return () => clearInterval(timer)
  }, [totalPages])

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentProducts = featuredProducts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  return (
    <div className="relative px-4">
      {/* Navigation Buttons */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-lg"
          onClick={prevPage}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous slide</span>
        </Button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-white/80 hover:bg-white shadow-lg"
          onClick={nextPage}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
            <CardHeader className="p-0">
              <div className="relative h-48 w-full bg-muted overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6 border-2 border-primary">
                    <AvatarImage src={product.images[0]} alt={product.owner.name} />
                    <AvatarFallback>{product.owner.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xs flex items-center">
                      {product.owner.name}
                      {product.owner.isVerified && (
                        <CheckCircle className="ml-1 h-3 w-3 text-green-600" />
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center text-[10px]">
                      <MapPin className="mr-1 h-2 w-2" />
                      {product.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="border-primary text-primary text-[10px] px-2 py-0">
                  {product.category}
                </Badge>
              </div>
              <h3 className="font-semibold mb-1 text-sm">{product.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 text-xs h-8 px-3"
              >
                <Link href={`/messages/${product.id}`}>
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Contact Seller
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white text-xs h-8 px-3"
              >
                <Link href={`/marketplace/product/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentPage
                ? "bg-primary w-4"
                : "bg-primary/20 hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
} 