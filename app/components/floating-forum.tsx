"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ChevronUp, ChevronDown, MessageSquare } from "lucide-react"

interface ForumPost {
  id: number
  title: string
  author: string
  excerpt: string
  replies: number
  timestamp: string
}

const mockPosts: ForumPost[] = [
  {
    id: 1,
    title: "Latest Printing Technology Trends",
    author: "John Doe",
    excerpt: "Discussing the newest innovations in digital printing technology...",
    replies: 15,
    timestamp: "2 hours ago"
  },
  {
    id: 2,
    title: "Best Practices for Color Management",
    author: "Jane Smith",
    excerpt: "Sharing tips on maintaining consistent color across different printers...",
    replies: 8,
    timestamp: "4 hours ago"
  },
  {
    id: 3,
    title: "Equipment Maintenance Tips",
    author: "Mike Johnson",
    excerpt: "Essential maintenance routines for keeping your printing equipment in top shape...",
    replies: 12,
    timestamp: "6 hours ago"
  },
  {
    id: 4,
    title: "Industry Standards Update",
    author: "Sarah Williams",
    excerpt: "Latest updates on printing industry standards and certifications...",
    replies: 5,
    timestamp: "8 hours ago"
  },
  {
    id: 5,
    title: "Sustainable Printing Solutions",
    author: "David Brown",
    excerpt: "Exploring eco-friendly printing options and sustainable practices...",
    replies: 20,
    timestamp: "1 day ago"
  }
]

export function FloatingForum() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMinimized) {
        setCurrentPostIndex((prev) => (prev + 1) % mockPosts.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isMinimized])

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {isOpen && (
        <div className={`relative transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card className="w-[350px] bg-white shadow-2xl rounded-lg overflow-hidden border-2 border-[#ce057d]">
            <div className="bg-gradient-to-r from-[#ce057d] to-[#ff9017] p-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Forum Highlights
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    {isMinimized ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <div className="p-4 transition-all duration-300 ease-in-out">
                <div className="space-y-4">
                  {mockPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`transition-all duration-500 ease-in-out transform ${
                        index === currentPostIndex 
                          ? 'opacity-100 translate-x-0' 
                          : 'opacity-0 translate-x-4 absolute'
                      }`}
                    >
                      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                        <h4 className="font-semibold text-[#ce057d] mb-2">
                          {post.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>By {post.author}</span>
                          <span>{post.replies} replies</span>
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-center gap-2">
                  {mockPosts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPostIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentPostIndex
                          ? "bg-[#ce057d] w-4"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  className="w-full mt-4 bg-gradient-to-r from-[#ce057d] to-[#ff9017] text-white hover:from-[#ce057d]/90 hover:to-[#ff9017]/90"
                  onClick={() => window.location.href = "/forum"}
                >
                  Join the Discussion
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {!isOpen && (
        <div className="relative transition-all duration-300 ease-in-out">
          <Button
            className="bg-gradient-to-r from-[#ce057d] to-[#ff9017] text-white hover:from-[#ce057d]/90 hover:to-[#ff9017]/90 rounded-full shadow-lg"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Forum
          </Button>
        </div>
      )}
    </div>
  )
} 