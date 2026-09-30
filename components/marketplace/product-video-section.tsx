"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoginModal } from "@/components/auth/login-modal"
import { Play, Pause, Volume2, VolumeX, Maximize2, Settings, Download, MessageSquare } from "lucide-react"

interface ProductVideoSectionProps {
  productId: string
  productName: string
  vendorName: string
  vendorId?: string
  videoUrl?: string
  videoTitle?: string
  videoDescription?: string
  isEditable?: boolean
  onVideoUpload?: (file: File) => void
}

export function ProductVideoSection({
  productId,
  productName,
  vendorName,
  vendorId,
  videoUrl,
  videoTitle = "Product Demonstration",
  videoDescription = "Watch this video to see our product in action and learn about its features and capabilities.",
  isEditable = false,
  onVideoUpload
}: ProductVideoSectionProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginCallbackUrl, setLoginCallbackUrl] = useState<string>()
  const isOwner = Boolean(vendorId && (session?.user as any)?.id === vendorId)

  // Sync video element with state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(console.error)
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch(console.error)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen()
        } else if ((videoRef.current as any).webkitRequestFullscreen) {
          (videoRef.current as any).webkitRequestFullscreen()
        } else if ((videoRef.current as any).mozRequestFullScreen) {
          (videoRef.current as any).mozRequestFullScreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen()
        }
      }
    }
  }

  useEffect(() => {
    const onFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ??
        (document as any).webkitFullscreenElement ??
        (document as any).mozFullScreenElement
      )
      setIsFullscreen(isCurrentlyFullscreen)
    }
    document.addEventListener("fullscreenchange", onFullscreenChange)
    document.addEventListener("webkitfullscreenchange", onFullscreenChange)
    document.addEventListener("mozfullscreenchange", onFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange)
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange)
      document.removeEventListener("mozfullscreenchange", onFullscreenChange)
    }
  }, [])

  // Handle video events
  const handleVideoPlay = () => setIsPlaying(true)
  const handleVideoPause = () => setIsPlaying(false)
  const handleVideoEnded = () => setIsPlaying(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onVideoUpload) {
      onVideoUpload(file)
      setShowUpload(false)
    }
  }

  const handleContactVendor = () => {
    if (!vendorId) return
    if (!session) {
      setLoginCallbackUrl(`/messages/${vendorId}?productId=${productId}`)
      setShowLoginModal(true)
      return
    }
    router.push(`/messages/${vendorId}?productId=${productId}`)
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
    
    return url
  }

  const isEmbedUrl = videoUrl ? isYouTubeOrVimeoUrl(videoUrl) : false
  const embedUrl = videoUrl ? convertToEmbedUrl(videoUrl) : ""

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-xl font-semibold">Product Video</CardTitle>
            {videoUrl && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Demo Available
              </Badge>
            )}
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
        <p className="text-sm text-muted-foreground">
          {videoDescription}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {/* Video Upload Section */}
        {isEditable && showUpload && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Upload Product Video</h3>
                <p className="text-sm text-muted-foreground">
                  Share a video demonstrating your product features, operation, or installation process
                </p>
              </div>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="product-video-upload"
                />
                <label htmlFor="product-video-upload">
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
        {videoUrl && videoUrl.trim() && (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {isEmbedUrl ? (
              // Use iframe for YouTube/Vimeo embeds
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoTitle}
              />
            ) : (
              // Use video element for direct video URLs (including ImageKit)
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-contain"
                  poster="/images/video-poster.jpg"
                  controls={!isPlaying}
                  muted={isMuted}
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                  onEnded={handleVideoEnded}
                  onError={() => {}}
                  playsInline
                  preload="metadata"
                />
                
                {/* Custom Video Controls - Show when paused */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 pointer-events-auto">
                      <Button
                        onClick={handlePlayPause}
                        size="lg"
                        className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 text-white"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Video Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handlePlayPause}
                        className="text-white hover:bg-white/20"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMuteToggle}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/20"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleFullscreen}
                        className="text-white hover:bg-white/20"
                        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Video Title Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <h3 className="text-white font-medium">{videoTitle}</h3>
                    <p className="text-white/80 text-sm">{productName} by {vendorName}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Video Information */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg">{videoTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {videoDescription}
            </p>
          </div>

          {/* Video Tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              Product Demo
            </Badge>
            <Badge variant="outline" className="text-xs">
              Features Showcase
            </Badge>
            <Badge variant="outline" className="text-xs">
              Installation Guide
            </Badge>
            <Badge variant="outline" className="text-xs">
              Quality Test
            </Badge>
          </div>
        </div>

        {/* Product-Specific Call to Action */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{isOwner ? "Manage this listing" : "Interested in this product?"}</h4>
              <p className="text-sm text-muted-foreground">
                {isOwner
                  ? "Review messages, update the listing, and monitor buyer interest from your workspace."
                  : "Contact the company for pricing, availability, and technical specifications"}
              </p>
            </div>
            <div className="flex gap-2">
              {isOwner ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/marketplace/my-products/${productId}/edit`)}>
                    Edit Listing
                  </Button>
                  <Button size="sm" onClick={() => router.push("/messages")} className="bg-primary hover:bg-primary/90 text-white">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleContactVendor}>
                    Request Quote
                  </Button>
                  {vendorId && (
                    <Button 
                      onClick={handleContactVendor}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Company
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </CardContent>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        callbackUrl={loginCallbackUrl}
      />
    </Card>
  )
}
