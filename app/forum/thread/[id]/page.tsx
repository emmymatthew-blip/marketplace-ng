"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { ForumReplyList } from "@/components/forum/forum-reply-list"
import type { ForumReply } from "@/components/forum/forum-reply-list"
import { CreatePostForm } from "@/components/forum/create-post-form"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, MessageSquare, ThumbsUp, Building, Share2, Bookmark, Flag, Facebook, Twitter, Linkedin, MessageCircle, Copy, Mail, Send } from "lucide-react"
import { Footer } from "@/components/footer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - would be fetched from API in production
const mockThread = {
  id: "thread1",
  title: "Best UV printer for small business?",
  content:
    "I'm looking to invest in a UV printer for my small business. Budget is around ₦2,000,000. Any recommendations from the community? I've been looking at a few options but I'm not sure which one would be the best value for money. I mainly need it for printing on acrylic, wood, and some small promotional items.",
  author: {
    id: "user1",
    name: "PrinterNewbie",
    image: "/images/b7a4dab131.jpg",
    role: "PRINTER",
    isVerified: false,
    company: "PrintTech Solutions",
    joinDate: "Member since Jan 2023",
    expertise: []
  },
  category: {
    id: "cat1",
    name: "UV Printing",
    icon: "/images/Canon-pixma-2 1.png"
  },
  createdAt: "2 hours ago",
  likes: 8,
  views: 156,
  isBookmarked: false,
  headerImage: "/images/b7a4dab131.jpg"
}

// Mock replies data with nested structure
const mockReplies: ForumReply[] = [
  {
    id: "reply1",
    content: "Based on your requirements and budget, I would highly recommend the XYZ UV 3000. It's a versatile machine that excels in printing on both acrylic and wood surfaces. The print quality is exceptional, and the maintenance costs are reasonable. We've installed several units for small businesses, and the feedback has been overwhelmingly positive.",
    author: {
      id: "user2",
      name: "UVExpert",
      image: "/images/avatars/manufacturer1.jpg",
      role: "MANUFACTURER",
      isVerified: true,
      company: "XYZ Printing Solutions Ltd",
      joinDate: "Member since 2020",
      expertise: ["UV Printing", "Digital Printing", "Technical Support"]
    },
    createdAt: "1 hour ago",
    likes: 15,
    attachments: [
      {
        type: "image",
        url: "/images/products/xyz-uv-3000.jpg",
        caption: "XYZ UV 3000 Printer"
      },
      {
        type: "pdf",
        url: "/docs/xyz-uv-3000-specs.pdf",
        caption: "Technical Specifications"
      }
    ],
    replies: [
      {
        id: "reply1.1",
        content: "I can vouch for this recommendation. We've been using the XYZ UV 3000 for the past 6 months, and it has significantly improved our production efficiency. The print quality is consistent, and the software is user-friendly. The ROI has been excellent.",
        author: {
          id: "user3",
          name: "SmallBizPrinter",
          image: "/images/avatars/business1.jpg",
          role: "VERIFIED_BUSINESS",
          isVerified: true,
          company: "Creative Print Works",
          joinDate: "Member since 2021",
          expertise: ["UV Printing", "Small Business"]
        },
        createdAt: "45 minutes ago",
        likes: 8,
        attachments: [
          {
            type: "image",
            url: "/images/samples/print-samples.jpg",
            caption: "Print Samples from XYZ UV 3000"
          }
        ],
        replies: [
          {
            id: "reply1.1.1",
            content: "What's your average monthly maintenance cost? I'm considering this model but worried about long-term expenses.",
            author: {
              id: "user7",
              name: "NewPrinter23",
              image: "/images/avatars/default.jpg",
              role: "MEMBER",
              isVerified: false,
              company: "Self Employed",
              joinDate: "Member since Feb 2024",
              expertise: []
            },
            createdAt: "30 minutes ago",
            likes: 2,
            replies: []
          },
          {
            id: "reply1.1.2",
            content: "For our usage (about 8 hours per day, 5 days a week), maintenance costs average around ₦50,000 per month. This includes cleaning supplies and regular maintenance. The machine is quite efficient with ink usage too.",
            author: {
              id: "user3",
              name: "SmallBizPrinter",
              image: "/images/avatars/business1.jpg",
              role: "VERIFIED_BUSINESS",
              isVerified: true,
              company: "Creative Print Works",
              joinDate: "Member since 2021",
              expertise: ["UV Printing", "Small Business"]
            },
            createdAt: "25 minutes ago",
            likes: 4,
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: "reply2",
    content: "Before making a recommendation, could you share more about your experience with UV printing? Also, what's your typical monthly print volume? This will help us suggest the most suitable option for your specific needs.",
    author: {
      id: "user4",
      name: "PrintAdvisor",
      image: "/images/avatars/consultant1.jpg",
      role: "CERTIFIED_CONSULTANT",
      isVerified: true,
      company: "Print Industry Consultants",
      joinDate: "Member since 2019",
      expertise: ["UV Printing", "Print Consulting"],
      certifications: ["CIPPON Certified", "UV Print Specialist"]
    },
    createdAt: "55 minutes ago",
    likes: 12,
    attachments: [],
    replies: [
      {
        id: "reply2.1",
        content: "I'm completely new to UV printing. Currently running a small sign shop and looking to expand into UV printing. Expecting around 20-30 orders per week, mostly small items like phone cases, acrylic signs, and promotional items.",
        author: {
          id: "user1",
          name: "PrinterNewbie",
          image: "/images/avatars/user1.jpg",
          role: "PRINTER",
          isVerified: false,
          company: "PrintTech Solutions",
          joinDate: "Member since Jan 2024",
          expertise: []
        },
        createdAt: "50 minutes ago",
        likes: 3,
        replies: []
      }
    ]
  },
  {
    id: "reply3",
    content: "Be careful with the XYZ UV 3000. While it's a good printer, I've had some issues with their customer support. Took them 2 weeks to respond to a critical issue. Consider ABC Pro UV instead - similar price range but better support in Nigeria.",
    author: {
      id: "user5",
      name: "PrinterPro",
      image: "/images/avatars/user2.jpg",
      role: "MEMBER",
      isVerified: false,
      company: "Independent Consultant",
      joinDate: "Member since 2023",
      expertise: ["UV Printing"]
    },
    createdAt: "40 minutes ago",
    likes: 6,
    replies: [
      {
        id: "reply3.1",
        content: "I respectfully disagree. We've had excellent support from XYZ's local partner in Lagos. They usually respond within 24 hours and have on-site support available.",
        author: {
          id: "user6",
          name: "LagosUVPro",
          image: "/images/avatars/business2.jpg",
          role: "VERIFIED_BUSINESS",
          isVerified: true,
          company: "Lagos Print Solutions",
          joinDate: "Member since 2022",
          expertise: ["UV Printing", "Technical Support"]
        },
        createdAt: "35 minutes ago",
        likes: 8,
        attachments: [],
        replies: [
          {
            id: "reply3.1.1",
            content: "Could you share the contact for their Lagos support? Maybe I was dealing with the wrong department.",
            author: {
              id: "user5",
              name: "PrinterPro",
              image: "/images/avatars/user2.jpg",
              role: "MEMBER",
              isVerified: false,
              company: "Independent Consultant",
              joinDate: "Member since 2023",
              expertise: ["UV Printing"]
            },
            createdAt: "20 minutes ago",
            likes: 2,
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: "reply4",
    content: "Has anyone tried the budget-friendly options from Chinese manufacturers? I've seen some UV printers on Alibaba for around ₦1,500,000.",
    author: {
      id: "user8",
      name: "BudgetBuyer",
      image: "/images/avatars/default.jpg",
      role: "MEMBER",
      isVerified: false,
      company: "Startup Prints",
      joinDate: "Member since Mar 2024",
      expertise: []
    },
    createdAt: "15 minutes ago",
    likes: 1,
    replies: [
      {
        id: "reply4.1",
        content: "I would strongly advise against unbranded UV printers. The initial cost savings aren't worth the potential issues with quality, reliability, and lack of local support. Stick with established brands for business-critical equipment.",
        author: {
          id: "user4",
          name: "PrintAdvisor",
          image: "/images/avatars/consultant1.jpg",
          role: "CERTIFIED_CONSULTANT",
          isVerified: true,
          company: "Print Industry Consultants",
          joinDate: "Member since 2019",
          expertise: ["UV Printing", "Print Consulting"],
          certifications: ["CIPPON Certified", "UV Print Specialist"]
        },
        createdAt: "10 minutes ago",
        likes: 5,
        replies: []
      }
    ]
  }
]

export default function ThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null)
  const [threadLiked, setThreadLiked] = useState(false)
  const [threadBookmarked, setThreadBookmarked] = useState(false)
  const [replies, setReplies] = useState(mockReplies)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login?callbackUrl=/forum/thread/" + resolvedParams.id)
    }
  }, [status, resolvedParams.id])

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!session) {
    return null
  }

  const handleReply = (replyId: string) => {
    const findReply = (items: typeof mockReplies, id: string): typeof mockReplies[0] | null => {
      for (const item of items) {
        if (item.id === id) return item
        if (item.replies) {
          const found = findReply(item.replies, id)
          if (found) return found
        }
      }
      return null
    }

    const reply = findReply(replies, replyId)
    if (reply) {
      setReplyTo({
        id: replyId,
        username: reply.author.name,
      })
      // Scroll to reply form
      setTimeout(() => {
        document.getElementById("reply-form")?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }

  const handleLikeReply = (replyId: string) => {
    // In a real app, this would be an API call
    // For now, we'll just update the UI
    const updateReplies = (items: typeof mockReplies): typeof mockReplies => {
      return items.map(item => {
        if (item.id === replyId) {
          return { ...item, likes: item.likes + 1 }
        }
        if (item.replies) {
          return { ...item, replies: updateReplies(item.replies) }
        }
        return item
      })
    }
    setReplies(updateReplies(replies))
  }

  const handleLikeThread = () => {
    setThreadLiked(!threadLiked)
    // In a real app, this would be an API call
  }

  const handleReportReply = (replyId: string) => {
    toast({
      title: "Reply reported",
      description: "Thank you for reporting this reply. Our moderators will review it.",
    })
  }

  const handlePostCreated = () => {
    setReplyTo(null)
    // In a real app, we would fetch the updated replies
    // For now, we'll just add a mock reply
    const newReply: ForumReply = {
      id: `reply${Date.now()}`,
      content: "This is a new reply that would come from the API.",
      author: {
        id: session?.user?.id || "unknown",
        name: session?.user?.name || "User",
        image: session?.user?.image || "/images/avatars/default.jpg",
        role: "MEMBER",
        isVerified: false,
        company: "Not Specified",
        joinDate: "Member since 2024",
        expertise: []
      },
      createdAt: "Just now",
      likes: 0,
      attachments: [],
      replies: []
    }

    if (replyTo) {
      // Add as a nested reply
      const updateReplies = (items: ForumReply[]): ForumReply[] => {
        return items.map(item => {
          if (item.id === replyTo.id) {
            return {
              ...item,
              replies: [...(item.replies || []), newReply]
            }
          }
          if (item.replies) {
            return {
              ...item,
              replies: updateReplies(item.replies)
            }
          }
          return item
        })
      }
      setReplies(updateReplies(replies))
    } else {
      // Add as a top-level reply
      setReplies([...replies, newReply])
    }
  }

  const handleShare = (platform?: string) => {
    const url = window.location.href
    const title = mockThread.title
    const text = `Check out this discussion: ${title}`

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
        break
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
        break
      case 'copy':
      default:
        navigator.clipboard.writeText(url)
        toast({
          title: "Link copied to clipboard",
          description: "You can now share this thread with others",
        })
    }
  }

  const handleBookmark = () => {
    setThreadBookmarked(!threadBookmarked)
    toast({
      title: threadBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: threadBookmarked ? "Thread removed from your bookmarks" : "Thread saved to your bookmarks",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-4 md:py-8">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="ghost" size="sm" asChild className="w-fit">
                <Link href="/forum" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Forum
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
                      <Twitter className="h-4 w-4 mr-2 text-sky-500" />
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('linkedin')} className="cursor-pointer">
                      <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
                      Share on LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
                      <MessageCircle className="h-4 w-4 mr-2 text-green-500" />
                      Share on WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('telegram')} className="cursor-pointer">
                      <Send className="h-4 w-4 mr-2 text-sky-600" />
                      Share on Telegram
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('email')} className="cursor-pointer">
                      <Mail className="h-4 w-4 mr-2 text-gray-600" />
                      Share via Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBookmark}
                  className={`flex-1 sm:flex-none ${threadBookmarked ? "text-primary" : ""}`}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {threadBookmarked ? "Bookmarked" : "Bookmark"}
                </Button>
              </div>
            </div>

            <Card className="border-2 bg-gradient-to-b from-background to-background/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardHeader className="space-y-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 shadow-sm">
                      <div className="relative w-4 h-4 mr-1">
                        <Image
                          src={mockThread.category.icon}
                          alt={mockThread.category.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      {mockThread.category.name}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 shadow-sm">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {replies.length} Replies
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/20 shadow-sm">
                      {mockThread.views} Views
                    </Badge>
                  </div>
                  <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10" />
                    <Image
                      src={mockThread.headerImage || "/images/default-thread-header.jpg"}
                      alt={mockThread.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    {mockThread.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-primary/20 ring-2 ring-background shadow-xl">
                      <AvatarImage src={mockThread.author.image} alt={mockThread.author.name} />
                      <AvatarFallback>{mockThread.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {mockThread.author.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-lg">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.293 5.293L9 16.586l-4.293-4.293a1 1 0 0 0-1.414 1.414l5 5a1 1 0 0 0 1.414 0l12-12a1 1 0 0 0-1.414-1.414z" fill="currentColor"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-lg">{mockThread.author.name}</span>
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                        {mockThread.author.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {mockThread.author.company}
                    </p>
                    <p className="text-xs text-muted-foreground">{mockThread.author.joinDate}</p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert bg-muted/30 p-6 rounded-xl">
                  <p className="leading-relaxed">{mockThread.content}</p>
                </div>
              </CardContent>
              <div className="px-4 md:px-6 pb-4 md:pb-6 flex flex-wrap items-center justify-between border-t pt-4 gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${threadLiked ? "text-primary bg-primary/10 hover:bg-primary/20" : ""} transition-colors duration-200`}
                    onClick={handleLikeThread}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {mockThread.likes + (threadLiked ? 1 : 0)} Likes
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleReportReply(mockThread.id)}>
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
                  {mockThread.createdAt}
                </span>
              </div>
            </Card>

            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl">
                <h2 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                  Expert Replies
                </h2>
                <Button 
                  variant="default"
                  onClick={() => document.getElementById("reply-form")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Add Your Reply
                </Button>
              </div>

              <ForumReplyList
                replies={replies}
                onReply={handleReply}
                onLike={handleLikeReply}
                onReport={handleReportReply}
              />

              <div id="reply-form" className="pt-4 md:pt-6 border-t">
                <CreatePostForm
                  threadId={resolvedParams.id}
                  onPostCreated={handlePostCreated}
                  replyToPostId={replyTo?.id}
                  replyToUsername={replyTo?.username}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
