"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Filter, Grid3X3, List, MapPin, MessageSquare, Printer, Star } from "lucide-react"
import { Footer } from "@/components/footer"

// Mock data - would be fetched from API in production
const vendors = [
  {
    id: 1,
    name: "PrintTech Solutions",
    image: "/images/Canon-pixma-2 1.png",
    category: "press",
    verified: true,
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviews: 24,
    description: "Specializing in high-quality digital printing equipment and maintenance services.",
  },
  {
    id: 2,
    name: "Ink Masters Nigeria",
    image: "/images/8921fe63ae.jpg",
    category: "consumables",
    verified: true,
    location: "Abuja, Nigeria",
    rating: 4.5,
    reviews: 18,
    description: "Premium ink suppliers for all types of printing needs with nationwide delivery.",
  },
  {
    id: 3,
    name: "GraphicPro Systems",
    image: "/images/b7a4dab131.jpg",
    category: "software",
    verified: true,
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviews: 32,
    description: "Leading provider of graphic design and printing workflow software solutions.",
  },
  {
    id: 4,
    name: "ScreenTech International",
    image: "/images/797867fbc3.jpg",
    category: "screen",
    verified: true,
    location: "Kano, Nigeria",
    rating: 4.6,
    reviews: 15,
    description: "Experts in screen printing equipment, supplies, and technical support.",
  },
  {
    id: 5,
    name: "Textile Print Nigeria",
    image: "/images/149876-1 1.png",
    category: "textile",
    verified: true,
    location: "Ibadan, Nigeria",
    rating: 4.4,
    reviews: 21,
    description: "Specialized in textile printing machinery and fabric printing solutions.",
  },
  {
    id: 6,
    name: "UV Solutions Ltd",
    image: "/images/image 87.png",
    category: "uv",
    verified: true,
    location: "Enugu, Nigeria",
    rating: 4.9,
    reviews: 27,
    description: "Providing cutting-edge UV printing technology and technical expertise.",
  },
  {
    id: 7,
    name: "Local Print Hub",
    image: "/images/IMG_9890 1 (2).png",
    category: "local",
    verified: true,
    location: "Lagos, Nigeria",
    rating: 4.7,
    reviews: 45,
    description: "Your neighborhood printing solution offering quick turnaround times and personalized service for all your local printing needs.",
  },
  {
    id: 8,
    name: "Quick Print Express",
    image: "/images/Canon-pixma-2 1.png",
    category: "local",
    verified: true,
    location: "Ikeja, Lagos",
    rating: 4.6,
    reviews: 38,
    description: "24/7 express printing services for urgent documents, business cards, and small format prints. Same-day delivery available.",
  },
  {
    id: 9,
    name: "Community Print Shop",
    image: "/images/797867fbc3.jpg",
    category: "local",
    verified: true,
    location: "Surulere, Lagos",
    rating: 4.8,
    reviews: 52,
    description: "Family-owned print shop offering affordable printing services for students, small businesses, and community events.",
  },
  {
    id: 10,
    name: "Digital Print Corner",
    image: "/images/8921fe63ae.jpg",
    category: "local",
    verified: true,
    location: "Victoria Island, Lagos",
    rating: 4.9,
    reviews: 41,
    description: "Premium digital printing services specializing in high-quality photo prints, canvas prints, and personalized gifts.",
  },
  {
    id: 11,
    name: "Neighborhood Print & Copy",
    image: "/images/149876-1 1.png",
    category: "local",
    verified: true,
    location: "Lekki, Lagos",
    rating: 4.5,
    reviews: 29,
    description: "Your one-stop shop for all printing needs - from photocopying to large format prints, banners, and signage.",
  },
  {
    id: 12,
    name: "Print & Design Studio",
    image: "/images/b7a4dab131.jpg",
    category: "local",
    verified: true,
    location: "Ikoyi, Lagos",
    rating: 4.7,
    reviews: 36,
    description: "Creative print studio offering design services, custom printing, and professional finishing for business materials.",
  },
  {
    id: 13,
    name: "Graphics Supply Co",
    image: "/images/149876-1 1.png",
    category: "graphics",
    verified: true,
    location: "Lagos, Nigeria",
    rating: 4.6,
    reviews: 33,
    description: "Premium graphics materials supplier offering high-quality paper, vinyl, and specialty printing substrates.",
  },
  {
    id: 14,
    name: "Promo Print Solutions",
    image: "/images/8921fe63ae.jpg",
    category: "promo",
    verified: true,
    location: "Lagos, Nigeria",
    rating: 4.7,
    reviews: 28,
    description: "Specialized in promotional materials including banners, flyers, brochures, and branded merchandise.",
  },
  {
    id: 15,
    name: "PrePress Technologies",
    image: "/images/Canon-pixma-2 1.png",
    category: "prepress",
    verified: true,
    location: "Lagos, Nigeria",
    rating: 4.8,
    reviews: 19,
    description: "Leading provider of pre-press equipment and solutions for professional printing operations.",
  },
  {
    id: 16,
    name: "PostPress Equipment Ltd",
    image: "/images/797867fbc3.jpg",
    category: "postpress",
    verified: true,
    location: "Lagos, Nigeria",
    rating: 4.5,
    reviews: 22,
    description: "Specialized in post-press finishing equipment including binding, cutting, and folding machines.",
  }
]

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVendors = vendors.filter((vendor) => {
    if (activeCategory !== "all" && vendor.category !== activeCategory) {
      return false
    }

    if (
      searchQuery &&
      !vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    return true
  })

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
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
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-white">
                  Marketplace
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-[#e94560] to-[#ff9017] mx-auto mt-4 rounded-full"></div>
              </div>
              <p className="max-w-[600px] text-white/90 md:text-xl/relaxed mt-2">
                Connect with verified printers, manufacturers, and sellers in the Nigerian printing industry and around the world.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Tabs 
                    defaultValue="all" 
                    value={activeCategory} 
                    onValueChange={setActiveCategory}
                    className="bg-white rounded-lg shadow-md"
                  >
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">All</TabsTrigger>
                      <TabsTrigger value="local" className="data-[state=active]:bg-primary data-[state=active]:text-white">Local Market</TabsTrigger>
                      <TabsTrigger value="press" className="data-[state=active]:bg-primary data-[state=active]:text-white">Press Equipment</TabsTrigger>
                      <TabsTrigger value="consumables" className="data-[state=active]:bg-primary data-[state=active]:text-white">Consumables</TabsTrigger>
                      <TabsTrigger value="software" className="data-[state=active]:bg-primary data-[state=active]:text-white">Software</TabsTrigger>
                      <select 
                        className="ml-2 px-3 py-2 bg-transparent border-2 border-primary rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        onChange={(e) => setActiveCategory(e.target.value)}
                        value={activeCategory}
                      >
                        <option value="" disabled>More Categories</option>
                        <option value="screen">Screen Printing</option>
                        <option value="textile">Textile Printing</option>
                        <option value="uv">UV Printing</option>
                        <option value="graphics">Graphics Material</option>
                        <option value="promo">Promotional Materials</option>
                        <option value="prepress">Pre-Press Equipment</option>
                        <option value="postpress">Post-Press Equipment</option>
                      </select>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Search marketplace..."
                    className="w-[200px] border-2 focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="sr-only">Grid view</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">List view</span>
                  </Button>
                </div>
              </div>

              {filteredVendors.length === 0 ? (
                <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground">No vendors found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredVendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300">
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full bg-muted">
                          <img
                            src={vendor.image || "/placeholder.svg"}
                            alt={vendor.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-10 w-10 border-2 border-primary">
                              <AvatarImage src={vendor.image || "/placeholder.svg"} alt={vendor.name} />
                              <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm flex items-center">
                                {vendor.name}
                                {vendor.verified && <CheckCircle className="ml-1 h-4 w-4 text-green-600 text-green" />}
                              </CardTitle>
                              <CardDescription className="flex items-center">
                                <MapPin className="mr-1 h-3 w-3" />
                                {vendor.location}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-primary text-primary">{vendor.category}</Badge>
                        </div>
                        <div className="mt-2 flex items-center">
                          <Star className="h-4 w-4 text-[#F6BD55] fill-yellow-500" />
                          <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                          <span className="ml-1 text-sm text-muted-foreground">({vendor.reviews} reviews)</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">{vendor.description}</p>
                      </CardContent>
                      <CardFooter className="p-6 pt-0 flex justify-between">
                        <Button asChild variant="outline" size="sm" className="border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300">
                          <Link href={`/marketplace/contact/${vendor.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Contact
                          </Link>
                        </Button>
                        <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                          <Link href={`/marketplace/vendor/${vendor.id}`}>View Profile</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredVendors.map((vendor) => (
                    <Card key={vendor.id} className="bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-xl transition-all duration-300">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto">
                          <img
                            src={vendor.image || "/placeholder.svg"}
                            alt={vendor.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-10 w-10 border-2 border-primary">
                                <AvatarImage src={vendor.image || "/placeholder.svg"} alt={vendor.name} />
                                <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-sm flex items-center">
                                  {vendor.name}
                                  {vendor.verified && <CheckCircle className="ml-1 h-4 w-4 text-green-600 text-green" />}
                                </CardTitle>
                                <CardDescription className="flex items-center">
                                  <MapPin className="mr-1 h-3 w-3" />
                                  {vendor.location}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-primary text-primary">{vendor.category}</Badge>
                          </div>
                          <div className="flex items-center mb-2">
                            <Star className="h-4 w-4 text-[#F6BD55] fill-yellow-500" />
                            <span className="ml-1 text-sm font-medium">{vendor.rating}</span>
                            <span className="ml-1 text-sm text-muted-foreground">({vendor.reviews} reviews)</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{vendor.description}</p>
                          <div className="flex justify-end gap-2">
                            <Button asChild variant="outline" size="sm" className="border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300">
                              <Link href={`/marketplace/contact/${vendor.id}`}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Contact
                              </Link>
                            </Button>
                            <Button asChild size="sm" className="bg-primary text-white hover:bg-primary/90">
                              <Link href={`/marketplace/vendor/${vendor.id}`}>View Profile</Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}