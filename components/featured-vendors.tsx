import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export function FeaturedVendors() {
  const [api, setApi] = useState<any>()

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000) // Scroll every 5 seconds

    return () => clearInterval(interval)
  }, [api])

  // This would typically come from an API or database
  const vendors = [
    {
      id: 1,
      name: "PrintTech Solutions",
      image: "/images/Canon-pixma-2 1.png",
      category: "Press Equipment",
      verified: true,
      location: "Lagos, Nigeria",
      description: "Specializing in high-quality digital printing equipment and maintenance services.",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: 2,
      name: "Ink Masters Nigeria",
      image: "/images/C 1.png",
      category: "Consumables",
      verified: true,
      location: "Abuja, Nigeria",
      description: "Premium ink suppliers for all types of printing needs with nationwide delivery.",
      rating: 4.9,
      reviews: 89,
    },
    {
      id: 3,
      name: "GraphicPro Systems",
      image: "/images/image 87.png",
      category: "Software",
      verified: true,
      location: "Port Harcourt, Nigeria",
      description: "Leading provider of graphic design and printing workflow software solutions.",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 4,
      name: "Digital Print Hub",
      image: "/images/Canon-pixma-2 1.png",
      category: "Digital Printing",
      verified: true,
      location: "Ibadan, Nigeria",
      description: "State-of-the-art digital printing services with cutting-edge technology.",
      rating: 4.9,
      reviews: 203,
    },
    {
      id: 5,
      name: "Screen Masters",
      image: "/images/C 1.png",
      category: "Screen Printing",
      verified: true,
      location: "Kano, Nigeria",
      description: "Expert screen printing services for all your custom printing needs.",
      rating: 4.8,
      reviews: 167,
    },
    {
      id: 6,
      name: "UV Print Solutions",
      image: "/images/image 87.png",
      category: "UV Printing",
      verified: true,
      location: "Enugu, Nigeria",
      description: "Specialized UV printing services for high-quality, durable prints.",
      rating: 4.9,
      reviews: 145,
    },
  ]

  return (
    <div className="relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="ml-0 md:-ml-4">
          {vendors.map((vendor) => (
            <CarouselItem key={vendor.id} className="pl-0 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                <CardHeader className="p-0">
                  <div className="relative h-40 md:h-48 w-full bg-muted overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                    <Image
                      src={vendor.image}
                      alt={vendor.name}
                      width={400}
                      height={300}
                      className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-20">
                      <Badge variant="secondary" className="bg-white/90 text-foreground hover:bg-white text-xs md:text-sm">
                        {vendor.category}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-2 md:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 md:space-x-3">
                      <Avatar className="h-8 w-8 md:h-12 md:w-12 border-2 border-background shadow-md">
                        <AvatarImage src={vendor.image} alt={vendor.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {vendor.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base md:text-lg flex items-center gap-1">
                          {vendor.name}
                          {vendor.verified && (
                            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                          )}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-xs md:text-sm">
                          <MapPin className="h-3 w-3" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 md:mt-4 text-xs md:text-sm text-muted-foreground line-clamp-2">{vendor.description}</p>
                </CardContent>
                <CardFooter className="p-2 md:p-6 pt-0">
                  <Button asChild className="w-full bg-white text-primary hover:bg-gray-100 border border-primary/20 text-xs md:text-sm">
                    <Link href={`/marketplace/vendor/${vendor.id}`}>View Profile</Link>
                  </Button>
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute -left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10">
          <CarouselPrevious className="h-6 w-6 md:h-8 md:w-8 bg-white/80 backdrop-blur-sm hover:bg-white" />
        </div>
        <div className="absolute -right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10">
          <CarouselNext className="h-6 w-6 md:h-8 md:w-8 bg-white/80 backdrop-blur-sm hover:bg-white" />
        </div>
      </Carousel>
    </div>
  )
}

