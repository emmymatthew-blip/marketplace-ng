import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, ArrowRight, MapPin, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UpcomingDemos() {
  const [currentPage, setCurrentPage] = useState(0)
  const demosPerPage = 3

  // This would typically come from an API or database
  const demos = [
    {
      id: 1,
      title: "Advanced Screen Printing Techniques",
      manufacturer: {
        name: "ScreenTech International",
        image: "/images/Canon-pixma-2 1.png",
        isVerified: true,
        rating: 4.8
      },
      date: "June 15, 2023",
      time: "10:00 AM - 12:00 PM",
      category: "Screen Printing",
      price: "₦5,000",
      attendees: 45,
      maxAttendees: 50,
      location: "Lagos Business Hub",
      image: "/images/Canon-pixma-2 1.png",
      description: "Learn advanced screen printing techniques from industry experts. Perfect for both beginners and experienced printers.",
      tags: ["Hands-on", "Certified", "Materials Included"]
    },
    {
      id: 2,
      title: "Digital Press Maintenance Workshop",
      manufacturer: {
        name: "Canon Nigeria",
        image: "/images/C 1.png",
        isVerified: true,
        rating: 4.9
      },
      date: "June 18, 2023",
      time: "2:00 PM - 4:00 PM",
      category: "Press Equipment",
      price: "₦7,500",
      attendees: 32,
      maxAttendees: 40,
      location: "Canon Experience Center",
      image: "/images/C 1.png",
      description: "Master the art of digital press maintenance. Learn preventive care, troubleshooting, and optimization techniques.",
      tags: ["Technical", "Certified", "Tool Kit Included"]
    },
    {
      id: 3,
      title: "Eco-Friendly Ink Solutions",
      manufacturer: {
        name: "Green Print Nigeria",
        image: "/images/image 87.png",
        isVerified: true,
        rating: 4.7
      },
      date: "June 22, 2023",
      time: "11:00 AM - 1:00 PM",
      category: "Consumables",
      price: "Free",
      attendees: 78,
      maxAttendees: 100,
      location: "Virtual Event",
      image: "/images/image 87.png",
      description: "Discover sustainable printing solutions and eco-friendly ink alternatives for your business.",
      tags: ["Virtual", "Free", "Sustainability"]
    },
    {
      id: 4,
      title: "UV Printing Masterclass",
      manufacturer: {
        name: "UV Tech Solutions",
        image: "/images/Canon-pixma-2 1.png",
        isVerified: true,
        rating: 4.9
      },
      date: "June 25, 2023",
      time: "9:00 AM - 11:00 AM",
      category: "UV Printing",
      price: "₦6,000",
      attendees: 25,
      maxAttendees: 30,
      location: "UV Tech Training Center",
      image: "/images/Canon-pixma-2 1.png",
      description: "Comprehensive training on UV printing technology, applications, and best practices.",
      tags: ["Hands-on", "Advanced", "Materials Included"]
    }
  ]

  const totalPages = Math.ceil(demos.length / demosPerPage)
  const currentDemos = demos.slice(currentPage * demosPerPage, (currentPage + 1) * demosPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            className="rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            className="rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentPage ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {currentDemos.map((demo) => (
          <Card key={demo.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="grid md:grid-cols-[300px,1fr] gap-6">
              <div className="relative h-[200px] md:h-full">
                <img
                  src={demo.image}
                  alt={demo.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  {demo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/90 text-primary hover:bg-white">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <CardHeader className="p-0 pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {demo.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={demo.manufacturer.image} alt={demo.manufacturer.name} />
                            <AvatarFallback>{demo.manufacturer.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{demo.manufacturer.name}</span>
                          {demo.manufacturer.isVerified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{demo.manufacturer.rating}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {demo.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-0 pb-4">
                  <p className="text-sm text-muted-foreground mb-4">{demo.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4 text-primary" />
                      {demo.date}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 text-primary" />
                      {demo.time}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4 text-primary" />
                      {demo.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-2 h-4 w-4 text-primary" />
                      {demo.attendees}/{demo.maxAttendees} registered
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-0 flex justify-between items-center">
                  <div className="font-medium text-lg text-white">{demo.price}</div>
                  <Button asChild className="group-hover:bg-primary group-hover:text-white-foreground">
                    <Link href={`/demonstration/${demo.id}`} className="flex items-center gap-2 text-white">
                      Register Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button asChild variant="link" className="text-white hover:text-white/80">
          <Link href="/demonstrations" className="flex items-center gap-2">
            View All Demonstrations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
