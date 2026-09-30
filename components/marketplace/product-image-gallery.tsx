"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PLACEHOLDER_IMAGE } from "@/lib/constants"

interface ProductImageGalleryProps {
  images: string[]
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [hoveredImage, setHoveredImage] = useState<number | null>(null)

  const imageList = images && images.length > 0 ? images : [PLACEHOLDER_IMAGE]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageList.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageList.length) % imageList.length)
  }

  const openLightbox = () => {
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const handleThumbnailHover = (index: number) => {
    setHoveredImage(index)
  }

  const handleThumbnailLeave = () => {
    setHoveredImage(null)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") closeLightbox()
      if (e.key === "ArrowLeft") prevImage()
      if (e.key === "ArrowRight") nextImage()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [lightboxOpen, imageList.length])

  const displayImage = hoveredImage !== null ? hoveredImage : currentImage

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Main Image */}
      <div className="flex-1 min-w-0 order-1 md:order-2">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted group">
          <Image 
            src={imageList[displayImage]} 
            alt="Product image" 
            fill 
            className="object-contain"
            priority
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-sm"
              onClick={openLightbox}
              aria-label="View full size"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
            {imageList.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-sm"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-sm"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next image</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnails - Horizontal on mobile (bottom), Vertical on desktop (left) */}
      {imageList.length > 1 && (
        <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-x-visible md:overflow-y-visible shrink-0">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              onMouseEnter={() => handleThumbnailHover(index)}
              onMouseLeave={handleThumbnailLeave}
              className={cn(
                "relative w-16 h-16 rounded-lg overflow-hidden bg-muted transition-all hover:opacity-80 shrink-0",
                (currentImage === index || hoveredImage === index) && "ring-2 ring-primary"
              )}
            >
              <Image
                src={image}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:text-white/80 z-50 pointer-events-auto"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 z-50 pointer-events-auto"
              onClick={prevImage}
              disabled={imageList.length <= 1}
            >
              <ChevronLeft className="h-8 w-8" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 z-50 pointer-events-auto"
              onClick={nextImage}
              disabled={imageList.length <= 1}
            >
              <ChevronRight className="h-8 w-8" />
              <span className="sr-only">Next image</span>
            </Button>
            <div className="relative w-full h-full p-8 z-0 pointer-events-none">
              <Image
                src={imageList[displayImage]}
                alt={`Product image ${displayImage + 1}`}
                fill
                className="object-contain"
                quality={100}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
