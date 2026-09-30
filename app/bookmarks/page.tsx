"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, MessageSquare, ThumbsUp, Clock, Trash2, Filter } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"

// Mock data - would be replaced with actual API calls
const mockBookmarks = [
  {
    id: "thread1",
    title: "Best UV printer for small business?",
    excerpt: "I'm looking to invest in a UV printer for my small business. Budget is around ₦2,000,000...",
    author: {
      name: "PrinterNewbie",
      image: "/images/b7a4dab131.jpg",
      role: "PRINTER"
    },
    category: {
      name: "UV Printing",
      icon: "/images/Canon-pixma-2 1.png"
    },
    replies: 15,
    likes: 8,
    createdAt: "2 hours ago",
    bookmarkedAt: "1 hour ago"
  },
  {
    id: "thread2",
    title: "Digital printing vs Offset printing: Cost comparison",
    excerpt: "Let's analyze the cost-effectiveness of digital printing compared to offset printing for different quantities...",
    author: {
      name: "PrintExpert",
      image: "/images/b7a4dab131.jpg",
      role: "EXPERT"
    },
    category: {
      name: "Digital Printing",
      icon: "/images/Canon-pixma-2 1.png"
    },
    replies: 32,
    likes: 24,
    createdAt: "1 day ago",
    bookmarkedAt: "5 hours ago"
  },
  {
    id: "thread3",
    title: "Paper quality guide for business cards",
    excerpt: "A comprehensive guide to choosing the right paper type and weight for professional business cards...",
    author: {
      name: "PaperPro",
      image: "/images/b7a4dab131.jpg",
      role: "SUPPLIER"
    },
    category: {
      name: "Materials",
      icon: "/images/Canon-pixma-2 1.png"
    },
    replies: 45,
    likes: 67,
    createdAt: "2 days ago",
    bookmarkedAt: "1 day ago"
  },
  {
    id: "thread4",
    title: "Maintenance tips for large format printers",
    excerpt: "Essential maintenance practices to keep your large format printer running smoothly and extend its lifespan...",
    author: {
      name: "TechMaster",
      image: "/images/b7a4dab131.jpg",
      role: "TECHNICIAN"
    },
    category: {
      name: "Equipment",
      icon: "/images/Canon-pixma-2 1.png"
    },
    replies: 28,
    likes: 42,
    createdAt: "3 days ago",
    bookmarkedAt: "2 days ago"
  },
  {
    id: "thread5",
    title: "Color management workflow setup",
    excerpt: "Step-by-step guide to setting up a professional color management workflow for consistent output...",
    author: {
      name: "ColorExpert",
      image: "/images/b7a4dab131.jpg",
      role: "EXPERT"
    },
    category: {
      name: "Color Management",
      icon: "/images/Canon-pixma-2 1.png"
    },
    replies: 56,
    likes: 89,
    createdAt: "4 days ago",
    bookmarkedAt: "3 days ago"
  }
]

export default function BookmarksPage() {
  const { data: session } = useSession()
  const [bookmarks, setBookmarks] = useState(mockBookmarks)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBookmark, setSelectedBookmark] = useState<string | null>(null)
  const { toast } = useToast()

  const handleRemoveBookmark = (bookmarkId: string) => {
    setSelectedBookmark(bookmarkId)
    setDeleteDialogOpen(true)
  }

  const confirmRemoveBookmark = () => {
    if (selectedBookmark) {
      setBookmarks(bookmarks.filter(bookmark => bookmark.id !== selectedBookmark))
      toast({
        title: "Bookmark removed",
        description: "The thread has been removed from your bookmarks",
      })
      setDeleteDialogOpen(false)
      setSelectedBookmark(null)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background py-10">
          <div className="container mx-auto">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Bookmarked Threads
              </h1>
              <p className="text-lg text-muted-foreground">Access your saved discussions here.</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6">
            {bookmarks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                  <p className="text-muted-foreground mb-4">
                    When you bookmark threads, they'll appear here for easy access.
                  </p>
                  <Button asChild>
                    <Link href="/forum">Browse Forum</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {bookmarks.length} bookmarked threads
                  </p>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                <div className="grid gap-4">
                  {bookmarks.map((bookmark) => (
                    <Card key={bookmark.id} className="group hover:shadow-lg transition-all duration-300">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                <div className="relative w-4 h-4 mr-1">
                                  <Image
                                    src={bookmark.category.icon}
                                    alt={bookmark.category.name}
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                                {bookmark.category.name}
                              </Badge>
                              <Badge variant="secondary" className="gap-1">
                                <Clock className="h-3 w-3" />
                                {bookmark.bookmarkedAt}
                              </Badge>
                            </div>
                            <Link href={`/forum/thread/${bookmark.id}`}>
                              <CardTitle className="text-xl hover:text-primary transition-colors">
                                {bookmark.title}
                              </CardTitle>
                            </Link>
                            <CardDescription className="line-clamp-2">{bookmark.excerpt}</CardDescription>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {bookmark.replies} replies
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                {bookmark.likes} likes
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleRemoveBookmark(bookmark.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove bookmark</span>
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Bookmark</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this thread from your bookmarks?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveBookmark} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 