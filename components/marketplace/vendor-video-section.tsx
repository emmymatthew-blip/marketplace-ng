"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Download } from "lucide-react"

interface VendorVideoSectionProps {
  vendorId: string
  vendorName: string
  videoUrl?: string
  videoTitle?: string
  videoDescription?: string
  isEditable?: boolean
  onVideoUpload?: (file: File) => void
}

export function VendorVideoSection({
  vendorId,
  vendorName,
  videoUrl,
  videoTitle = "About Our Services",
  videoDescription = "Watch this video to learn more about our printing services and capabilities.",
  isEditable = false,
  onVideoUpload
}: VendorVideoSectionProps) {
  const [showUpload, setShowUpload] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onVideoUpload) {
      onVideoUpload(file)
      setShowUpload(false)
    }
  }

  // Helper function to check if URL is YouTube or Vimeo
  const isYouTubeOrVimeoUrl = (url: string): boolean => {
    if (!url) return false
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
    return youtubeRegex.test(url) || vimeoRegex.test(url)
  }

  // Helper function to convert YouTube/Vimeo URL to embed URL
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return ""
    
    // YouTube URL conversion
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const youtubeMatch = url.match(youtubeRegex)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`
    }
    
    // Vimeo URL conversion
    const vimeoRegex = /(?:vimeo\.com\/)(?:.*\/)?(\d+)/
    const vimeoMatch = url.match(vimeoRegex)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`
    }
    
    // Return original URL if not YouTube or Vimeo
    return url
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-semibold">Video Description</CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Featured
            </Badge>
          </div>
          {isEditable && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUpload(!showUpload)}
                className="text-sm"
              >
                {videoUrl ? "Change Video" : "Upload Video"}
              </Button>
              {videoUrl && (
                <Button variant="outline" size="sm" className="text-sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Upload Section */}
        {isEditable && showUpload && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Upload Video</h3>
                <p className="text-sm text-muted-foreground">
                  Share a video showcasing your services, equipment, or company overview
                </p>
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button asChild>
                    <span>Choose Video File</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground">
                  MP4, MOV, AVI up to 100MB
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        {videoUrl && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border">
            {(() => {
              const isEmbedUrl = isYouTubeOrVimeoUrl(videoUrl)
              
              if (isEmbedUrl) {
                // Use iframe for YouTube/Vimeo
                return (
                  <iframe
                    src={convertToEmbedUrl(videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${vendorName} video`}
                  />
                )
              } else {
                // Use video element for direct video URLs
                return (
                  <video
                    src={videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    poster="/images/video-poster.jpg"
                  />
                )
              }
            })()}
          </div>
        )}

        {/* Video Information */}
        <div className="space-y-3">
          {videoDescription && (
            <div 
              className="prose prose-sm max-w-none text-sm text-muted-foreground [&_p]:my-2 [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2 [&_blockquote]:my-2"
              dangerouslySetInnerHTML={{ __html: videoDescription }}
            />
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Duration: 2:45</span>
            <span>Views: 1,234</span>
            <span>Uploaded: 2 weeks ago</span>
          </div>

          {/* Video Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Printing Services
            </Badge>
            <Badge variant="outline" className="text-xs">
              Equipment Showcase
            </Badge>
            <Badge variant="outline" className="text-xs">
              Company Overview
            </Badge>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Interested in our services?</h4>
              <p className="text-sm text-muted-foreground">
                Contact us to learn more about our printing solutions
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Contact Vendor
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
