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
import { MessageSquare, PenSquare, Printer, ThumbsUp, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X } from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Post {
  id: number
  title: string
  author: string
  authorImage: string
  category: string
  replies: number
  likes: number
  time: string
  excerpt: string
}

interface PostsByTab {
  latest: Post[]
  popular: Post[]
  unanswered: Post[]
}

export default function ForumPage() {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { data: session } = useSession()

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

  // Update categories to match post category names
  const categories = [
    { id: "Press Equipment", name: "Press Equipment" },
    { id: "Screen Printing", name: "Screen Printing" },
    { id: "Textile", name: "Textile" },
    { id: "UV", name: "UV" },
    { id: "Software", name: "Software" },
    { id: "Graphics", name: "Graphics" },
    { id: "Consumables", name: "Consumables" },
    { id: "Promotional Materials", name: "Promotional Materials" },
    { id: "Pre-Press", name: "Pre-Press" },
    { id: "Post-Press", name: "Post-Press" },
  ]

  const allPosts: PostsByTab = {
    latest: [
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
        category: "Screen Printing",
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
      {
        id: 12,
        title: "Adobe Creative Cloud alternatives",
        author: "DesignPro",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Software",
        replies: 18,
        likes: 12,
        time: "4 days ago",
        excerpt:
          "Looking for cost-effective alternatives to Adobe CC for our small print shop. Need something that can handle CMYK color space well.",
      },
      {
        id: 13,
        title: "Best fabric for sublimation printing",
        author: "TextileMaster",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Textile",
        replies: 25,
        likes: 19,
        time: "6 days ago",
        excerpt:
          "Which polyester fabrics give the best results for sublimation printing? Looking for supplier recommendations in Lagos.",
      },
      {
        id: 14,
        title: "Promotional calendar printing tips",
        author: "PromoExpert",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Promotional Materials",
        replies: 9,
        likes: 7,
        time: "2 days ago",
        excerpt:
          "Starting preparation for end-of-year calendar orders. Any tips for bulk printing and finishing techniques?",
      }
    ],
    popular: [
      {
        id: 6,
        title: "Best practices for large format printing",
        author: "PrintMaster",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Press Equipment",
        replies: 45,
        likes: 32,
        time: "1 week ago",
        excerpt:
          "I've been in the industry for 15 years and want to share some tips for achieving consistent quality in large format printing...",
      },
      {
        id: 7,
        title: "Digital vs Offset - Cost Analysis",
        author: "BusinessPrinter",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Press Equipment",
        replies: 38,
        likes: 29,
        time: "5 days ago",
        excerpt:
          "A detailed breakdown of costs between digital and offset printing for different job sizes and requirements...",
      },
      {
        id: 8,
        title: "Guide: Color Management Workflow",
        author: "ColorPro",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Pre-Press",
        replies: 52,
        likes: 41,
        time: "2 weeks ago",
        excerpt:
          "Complete guide to setting up a color management workflow from design to final print. Including monitor calibration...",
      },
      {
        id: 15,
        title: "Screen Printing Business Success Story",
        author: "ScreenMaster",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Screen Printing",
        replies: 67,
        likes: 89,
        time: "3 weeks ago",
        excerpt:
          "How I grew my screen printing business from a small shop to a major supplier. Full breakdown of strategies and lessons learned...",
      },
      {
        id: 16,
        title: "UV Printing on Unusual Materials",
        author: "UVExpert",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "UV",
        replies: 73,
        likes: 95,
        time: "1 month ago",
        excerpt:
          "Comprehensive guide to UV printing on glass, metal, wood, and other unusual materials. Including printer settings and preparation techniques...",
      },
      {
        id: 17,
        title: "Textile Printing Market Analysis 2024",
        author: "TextileAnalyst",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Textile",
        replies: 48,
        likes: 62,
        time: "2 weeks ago",
        excerpt:
          "In-depth analysis of the Nigerian textile printing market. Trends, opportunities, and growth projections for 2024...",
      }
    ],
    unanswered: [
      {
        id: 9,
        title: "Paper jam issues with Xerox C60",
        author: "NewPrinter",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Press Equipment",
        replies: 0,
        likes: 2,
        time: "2 hours ago",
        excerpt:
          "Having frequent paper jams with specific paper types. Any Xerox technicians who can help troubleshoot?",
      },
      {
        id: 10,
        title: "Software for variable data printing",
        author: "DataPrint",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Software",
        replies: 0,
        likes: 1,
        time: "5 hours ago",
        excerpt:
          "Looking for recommendations on VDP software that integrates well with Adobe suite...",
      },
      {
        id: 11,
        title: "UV printer maintenance schedule",
        author: "UVBeginner",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "UV",
        replies: 0,
        likes: 3,
        time: "1 day ago",
        excerpt:
          "What's the recommended maintenance schedule for a new UV printer? Need help creating a checklist...",
      },
      {
        id: 18,
        title: "Post-press binding equipment comparison",
        author: "BinderyNew",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Post-Press",
        replies: 0,
        likes: 1,
        time: "3 hours ago",
        excerpt:
          "Need help comparing different perfect binding machines. Looking at Horizon and Muller Martini options...",
      },
      {
        id: 19,
        title: "Graphics tablet for packaging design",
        author: "PackageDesigner",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Graphics",
        replies: 0,
        likes: 2,
        time: "8 hours ago",
        excerpt:
          "Which graphics tablet would you recommend for packaging design work? Considering Wacom but open to alternatives...",
      },
      {
        id: 20,
        title: "Promotional product printing regulations",
        author: "PromoNewbie",
        authorImage: "/placeholder.svg?height=40&width=40",
        category: "Promotional Materials",
        replies: 0,
        likes: 1,
        time: "12 hours ago",
        excerpt:
          "Need clarification on safety regulations for printing on promotional products like water bottles and lunch boxes...",
      }
    ]
  }

  const filterPostsByCategory = (posts: Post[], category: string): Post[] => {
    if (category === "all") return posts;
    return posts.filter(post => post.category === category);
  }

  const filterPostsBySearch = (posts: Post[], query: string): Post[] => {
    if (!query.trim()) return posts;
    const searchTerm = query.toLowerCase().trim();
    return posts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm)
    );
  }

  const getFilteredPosts = (tab: keyof PostsByTab): Post[] => {
    const categoryFiltered = filterPostsByCategory(allPosts[tab], selectedCategory);
    return filterPostsBySearch(categoryFiltered, searchQuery);
  }

  const handleCategorySelect = (category: string): void => {
    setSelectedCategory(category);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-40 border-b bg-white shadow-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-4 sm:py-8">
          <div className="flex flex-col gap-4 sm:gap-8">
            {/* Advert Banner Section */}
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border-2 border-[#326de0]/10">
                <div className="relative h-[300px] sm:h-[200px]">
                  {advertisements.map((ad, index) => (
                    <div
                      key={ad.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentAdIndex ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div className="flex h-full flex-col sm:flex-row">
                        <div className="w-full sm:w-1/2 h-1/2 sm:h-full relative">
                          <img
                            src={ad.image}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-full sm:w-1/2 p-4 sm:p-6 flex flex-col justify-center bg-white h-1/2 sm:h-full">
                          <h3 className="text-lg sm:text-xl font-bold text-[#326de0] mb-2">{ad.title}</h3>
                          <p className="text-gray-600 mb-4 text-sm sm:text-base">{ad.description}</p>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                <div className="inline-block">
                  <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-[#326de0]">Forum</h1>
                  <div className="h-1 w-24 bg-[#326de0] mt-2 sm:mt-4 rounded-full"></div>
                </div>
                {session?.user && (
                  <Button asChild className="w-full sm:w-auto bg-[#326de0] text-white hover:bg-[#326de0]/90 shadow-lg hover:shadow-xl">
                    <Link href="/forum/new">
                      <PenSquare className="mr-2 h-4 w-4" />
                      New Post
                    </Link>
                  </Button>
                )}
              </div>
                              <p className="text-muted-foreground text-sm sm:text-base">Your trusted gateway to Nigeria's Printing and Graphics Communications Market. Join the conversation with other printing industry professionals.</p>
            </div>
            <div className="grid gap-4 sm:gap-8 grid-cols-1 md:grid-cols-[250px_1fr]">
              <div className="flex flex-col gap-4 sm:gap-6">
                {/* Mobile Dropdown */}
                <div className="md:hidden w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedCategory === "all" ? "Categories" : categories.find(c => c.id === selectedCategory)?.name || "Categories"}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full min-w-[200px]" align="start">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleCategorySelect("all")}>
                        All Categories
                      </DropdownMenuItem>
                      {categories.map((category) => (
                        <DropdownMenuItem 
                          key={category.id} 
                          className="cursor-pointer"
                          onClick={() => handleCategorySelect(category.id)}
                        >
                          {category.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Desktop Categories Card */}
                <Card className="relative overflow-hidden group hover:scale-105 transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl hidden md:block">
                  <CardHeader>
                    <CardTitle className="text-[#326de0]">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="ghost" 
                        className={`justify-start ${selectedCategory === "all" ? "text-[#326de0] bg-[#326de0]/10" : "hover:text-[#326de0]"}`}
                        onClick={() => handleCategorySelect("all")}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button 
                          key={category.id} 
                          variant="ghost" 
                          className={`justify-start ${selectedCategory === category.id ? "text-[#326de0] bg-[#326de0]/10" : "hover:text-[#326de0]"}`}
                          onClick={() => handleCategorySelect(category.id)}
                        >
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
              <div className="flex flex-col gap-4 sm:gap-6">
                <Tabs defaultValue="latest" className="w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                    <TabsList className="bg-white border-2 border-[#326de0]/10 w-full sm:w-auto">
                      <TabsTrigger value="latest" className="data-[state=active]:bg-[#326de0] data-[state=active]:text-white flex-1 sm:flex-none">Latest</TabsTrigger>
                      <TabsTrigger value="popular" className="data-[state=active]:bg-[#326de0] data-[state=active]:text-white flex-1 sm:flex-none">Popular</TabsTrigger>
                      <TabsTrigger value="unanswered" className="data-[state=active]:bg-[#326de0] data-[state=active]:text-white flex-1 sm:flex-none">Unanswered</TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2 w-full sm:w-auto relative">
                      <div className="relative w-full sm:w-[200px]">
                        <Input 
                          placeholder="Search forum..." 
                          className="w-full border-[#326de0]/20 focus:border-[#326de0] pr-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <TabsContent value="latest" className="mt-4 sm:mt-6">
                    <div className="flex flex-col gap-4">
                      {getFilteredPosts("latest").length > 0 ? (
                        getFilteredPosts("latest").map((post) => (
                          <Card key={post.id} className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                            <CardHeader className="pb-2">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
                                <Link href={`/forum/thread/${post.id}`}>
                                  <CardTitle className="text-base sm:text-lg hover:text-[#326de0] transition-colors">{post.title}</CardTitle>
                                </Link>
                                <Badge className="bg-[#326de0] text-white w-fit">{post.category}</Badge>
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
                            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MessageSquare className="mr-1 h-4 w-4 text-[#326de0]" />
                                {post.replies} replies
                                <ThumbsUp className="ml-3 mr-1 h-4 w-4 text-[#ce057d]" />
                                {post.likes} likes
                              </div>
                              <Button asChild variant="ghost" size="sm" className="hover:text-[#326de0] w-full sm:w-auto">
                                <Link href={`/forum/thread/${post.id}`}>View Thread</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <Card className="relative overflow-hidden bg-white border-2 border-[#326de0]/10 shadow-xl">
                          <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">
                              {searchQuery 
                                ? "No posts found matching your search criteria." 
                                : "No posts available in this category."}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="popular" className="mt-4 sm:mt-6">
                    <div className="flex flex-col gap-4">
                      {getFilteredPosts("popular").length > 0 ? (
                        getFilteredPosts("popular").map((post) => (
                          <Card key={post.id} className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                            <CardHeader className="pb-2">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
                                <Link href={`/forum/thread/${post.id}`}>
                                  <CardTitle className="text-base sm:text-lg hover:text-[#326de0] transition-colors">{post.title}</CardTitle>
                                </Link>
                                <Badge className="bg-[#326de0] text-white w-fit">{post.category}</Badge>
                              </div>
                              <CardDescription className="flex items-center">
                                <Avatar className="h-5 w-5 mr-1">
                                  <AvatarImage src={post.authorImage} alt={post.author} />
                                  <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                {post.author} • {post.time}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MessageSquare className="mr-1 h-4 w-4 text-[#326de0]" />
                                {post.replies} replies
                                <ThumbsUp className="ml-3 mr-1 h-4 w-4 text-[#ce057d]" />
                                {post.likes} likes
                              </div>
                              <Button asChild variant="ghost" size="sm" className="hover:text-[#326de0] w-full sm:w-auto">
                                <Link href={`/forum/thread/${post.id}`}>View Thread</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <Card className="relative overflow-hidden bg-white border-2 border-[#326de0]/10 shadow-xl">
                          <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">
                              {searchQuery 
                                ? "No posts found matching your search criteria." 
                                : "No posts available in this category."}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="unanswered" className="mt-4 sm:mt-6">
                    <div className="flex flex-col gap-4">
                      {getFilteredPosts("unanswered").length > 0 ? (
                        getFilteredPosts("unanswered").map((post) => (
                          <Card key={post.id} className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 bg-white border-2 border-[#326de0]/10 shadow-xl hover:shadow-2xl">
                            <CardHeader className="pb-2">
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
                                <Link href={`/forum/thread/${post.id}`}>
                                  <CardTitle className="text-base sm:text-lg hover:text-[#326de0] transition-colors">{post.title}</CardTitle>
                                </Link>
                                <Badge className="bg-[#326de0] text-white w-fit">{post.category}</Badge>
                              </div>
                              <CardDescription className="flex items-center">
                                <Avatar className="h-5 w-5 mr-1">
                                  <AvatarImage src={post.authorImage} alt={post.author} />
                                  <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                {post.author} • {post.time}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MessageSquare className="mr-1 h-4 w-4 text-[#326de0]" />
                                {post.replies} replies
                                <ThumbsUp className="ml-3 mr-1 h-4 w-4 text-[#ce057d]" />
                                {post.likes} likes
                              </div>
                              <Button asChild variant="ghost" size="sm" className="hover:text-[#326de0] w-full sm:w-auto">
                                <Link href={`/forum/thread/${post.id}`}>View Thread</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <Card className="relative overflow-hidden bg-white border-2 border-[#326de0]/10 shadow-xl">
                          <CardContent className="p-6">
                            <p className="text-center text-muted-foreground">
                              {searchQuery 
                                ? "No posts found matching your search criteria." 
                                : "No posts available in this category."}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" className="border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                    Previous
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
                      3
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#326de0]/20 hover:border-[#326de0] hover:text-[#326de0]">
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
