"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, PenSquare, Printer, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"

export default function ForumPage() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)

  const advertisements = [
    {
      id: 1,
      title: "Premium Printing Equipment",
      description: "Get 20% off on all printing machines this month",
      image: "/images/IMG_9890 1 (2).png",
      link: "/advertise",
      cta: "Learn More"
    },
    {
      id: 2,
      title: "Printing Supplies Sale",
      description: "Bulk purchase discounts on all consumables",
      image: "/images/b7a4dab131.jpg",
      link: "/advertise",
      cta: "Shop Now"
    },
    {
      id: 3,
      title: "Training Programs",
      description: "Professional printing courses starting next week",
      image: "/images/8921fe63ae.jpg",
      link: "/advertise",
      cta: "Register Now"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIndex((prevIndex) => 
        prevIndex === advertisements.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  // This would typically come from an API or database
  const categories = [
    { id: "press", name: "Press Equipment" },
    { id: "screen", name: "Screen Printing" },
    { id: "textile", name: "Textile" },
    { id: "uv", name: "UV" },
    { id: "software", name: "Software" },
    { id: "graphics", name: "Graphics" },
    { id: "consumables", name: "Consumables" },
    { id: "promotional", name: "Promotional Materials" },
    { id: "prepress", name: "Pre-Press" },
    { id: "postpress", name: "Post-Press" },
  ]

  const posts = [
    {
      id: 1,
      title: "Best UV printer for small business?",
      author: "PrinterNewbie",
      authorImage: "/placeholder.svg?height=40&width=40",
      category: "UV",
      replies: 12,
      likes: 8,
      time: "2 hours ago",
      excerpt:
        "I'm looking to invest in a UV printer for my small business. Budget is around ₦2,000,000. Any recommendations from the community?",
    },
    {
      id: 2,
      title: "Troubleshooting color calibration issues",
      author: "ColorExpert",
      authorImage: "/placeholder.svg?height=40&width=40",
      category: "Pre-Press",
      replies: 24,
      likes: 15,
      time: "1 day ago",
      excerpt:
        "Having trouble with consistent color output across different print runs. I've tried recalibrating but still having issues...",
    },
    {
      id: 3,
      title: "Recommended suppliers for eco-solvent ink",
      author: "GreenPrinter",
      authorImage: "/placeholder.svg?height=40&width=40",
      category: "Consumables",
      replies: 7,
      likes: 5,
      time: "3 days ago",
      excerpt:
        "Looking for reliable suppliers of eco-solvent ink in Nigeria. Preferably with delivery to Port Harcourt area.",
    },
    {
      id: 4,
      title: "Screen printing vs. DTG for t-shirts",
      author: "FashionPrinter",
      authorImage: "/placeholder.svg?height=40&width=40",
      category: "Textile",
      replies: 32,
      likes: 21,
      time: "5 days ago",
      excerpt:
        "I'm expanding my t-shirt printing business and trying to decide between investing more in screen printing or moving to DTG...",
    },
    {
      id: 5,
      title: "CIPPON certification process",
      author: "NewToIndustry",
      authorImage: "/placeholder.svg?height=40&width=40",
      category: "General",
      replies: 15,
      likes: 10,
      time: "1 week ago",
      excerpt:
        "Can someone explain the process for getting CIPPON certification? What are the requirements and how long does it typically take?",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 border-b bg-white shadow-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-8">
          <div className="flex flex-col gap-8">
            {/* Advert Banner Section */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#326de0]/10">
                <div className="relative h-[200px]">
                  {advertisements.map((ad, index) => (
                    <div
                      key={ad.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentAdIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="flex h-full">
                        <div className="w-1/2 relative">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-1/2 p-6 flex flex-col justify-center bg-white">
                          <h3 className="text-xl font-bold text-[#326de0] mb-2">{ad.title}</h3>
                          <p className="text-gray-600 mb-4">{ad.description}</p>
                          <Button 
                            asChild
                            className="bg-[#326de0] text-white hover:bg-[#326de0]/90 w-fit"
                          >
                            <Link href={ad.link}>{ad.cta}</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentAdIndex((prev) => 
                    prev === 0 ? advertisements.length - 1 : prev - 1
                  )}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-[#326de0]" />
                </button>
                <button
                  onClick={() => setCurrentAdIndex((prev) => 
                    prev === advertisements.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-[#326de0]" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {advertisements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAdIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentAdIndex 
                          ? 'bg-[#326de0] w-4' 
                          : 'bg-[#326de0]/30 hover:bg-[#326de0]/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="inline-block">
                  <h1 className="text-3xl font-bold tracking-tight md:text-5xl text-[#326de0]">Forum</h1>
                  <div className="h-1 w-24 bg-[#326de0] mt-4 rounded-full"></div>
                </div>
                <Button className="bg-[#326de0] text-white hover:bg-[#326de0]/90 shadow-lg hover:shadow-xl">
                  <PenSquare className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </div>
              <p className="text-muted-foreground">Join the conversation with other printing industry professionals.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-[250px_1fr]">
              <div className="flex flex-col gap-6">
                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#326de0]">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" className="justify-start hover:text-[#326de0]">
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button key={category.id} variant="ghost" className="justify-start hover:text-[#326de0]">
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white border-2 border-[#ff9017]/10 shadow-xl hover:shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-[#ff9017]">Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-[#326de0]/10 text-[#326de0] hover:bg-[#326de0]/20">#printing</Badge>
                      <Badge variant="secondary" className="bg-[#ce057d]/10 text-[#ce057d] hover:bg-[#ce057d]/20">#nigeria</Badge>
                      <Badge variant="secondary" className="bg-[#ff9017]/10 text-[#ff9017] hover:bg-[#ff9017]/20">#cippon</Badge>
                      <Badge variant="secondary" className="bg-[#326de0]/10 text-[#326de0] hover:bg-[#326de0]/20">#digital</Badge>
                      <Badge variant="secondary" className="bg-[#ce057d]/10 text-[#ce057d] hover:bg-[#ce057d]/20">#ink</Badge>
                      <Badge variant="secondary" className="bg-[#ff9017]/10 text-[#ff9017] hover:bg-[#ff9017]/20">#equipment</Badge>
                      <Badge variant="secondary" className="bg-[#326de0]/10 text-[#326de0] hover:bg-[#326de0]/20">#maintenance</Badge>
                      <Badge variant="secondary" className="bg-[#ce057d]/10 text-[#ce057d] hover:bg-[#ce057d]/20">#training</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col gap-6">
                <Tabs defaultValue="latest">
                  <div className="flex items-center justify-between">
                    <TabsList className="bg-white border-2 border-[#326de0]/10">
                      <TabsTrigger value="latest" className="data-[state=active]:bg-[#326de0] data-[state=active]:text-white">Latest</TabsTrigger>
                      <TabsTrigger value="popular" className="data-[state=active]:bg-[#326de0] data-[state=active]:text-white">Popular</TabsTrigger>
                      <TabsTrigger value="unanswered" className="data-[state=active]:bg-[#326de0] data-[state=active]:text-white">Unanswered</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Search forum..." className="w-[200px] border-[#326de0]/20 focus:border-[#326de0]" />
                    </div>
                  </div>
                  <TabsContent value="latest" className="mt-6">
                    <div className="flex flex-col gap-4">
                      {posts.map((post) => (
                        <Card key={post.id} className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <Link href={`/forum/post/${post.id}`}>
                                <CardTitle className="text-lg hover:text-[#326de0] transition-colors">{post.title}</CardTitle>
                              </Link>
                              <Badge className="bg-[#326de0] text-white">{post.category}</Badge>
                            </div>
                            <CardDescription className="flex items-center">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={post.authorImage || "/placeholder.svg"} alt={post.author} />
                                <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              {post.author} • {post.time}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MessageSquare className="mr-1 h-4 w-4 text-[#326de0]" />
                              {post.replies} replies
                              <ThumbsUp className="ml-3 mr-1 h-4 w-4 text-[#ce057d]" />
                              {post.likes} likes
                            </div>
                            <Button asChild variant="ghost" size="sm" className="hover:text-[#326de0]">
                              <Link href={`/forum/post/${post.id}`}>View Thread</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="popular" className="mt-6">
                    <Card className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Popular posts will appear here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="unanswered" className="mt-6">
                    <Card className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                      <CardContent className="p-6">
                        <p className="text-center text-muted-foreground">Unanswered posts will appear here.</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
                <div className="flex items-center justify-center">
                  <Button variant="outline" size="sm" className="mx-1 border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="mx-1 border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="mx-1 border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="mx-1 border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="mx-1 border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
