"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  content: string
  rating: number
  createdAt: string
  author: {
    id: string
    name: string
    image?: string
  }
}

interface VendorReviewsProps {
  vendorId: string
}

export function VendorReviews({ vendorId }: VendorReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // This is a placeholder since we don't have a real reviews API yet
    // In a real implementation, we would fetch from /api/vendors/${vendorId}/reviews
    setTimeout(() => {
      setReviews([])
      setIsLoading(false)
    }, 1000)
  }, [vendorId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse mr-3"></div>
              <div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-2">This vendor has not received any reviews yet.</p>
        <p className="text-gray-500">Be the first to leave a review after working with them.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center mb-3">
            <Avatar className="mr-3">
              <AvatarImage src={review.author.image || "/placeholder.svg"} alt={review.author.name} />
              <AvatarFallback>{review.author.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.author.name}</p>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700">{review.content}</p>
        </div>
      ))}
    </div>
  )
}
