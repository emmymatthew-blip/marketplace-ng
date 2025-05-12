'use client'

import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const carouselImages = [
  {
    src: "/images/IMG_9890 1 (2).png",
    alt: "NG MARKETPLACE Hero 1",
  },
  {
    src: "/images/8921fe63ae.jpg",
    alt: "NG MARKETPLACE Hero 2",
  },
  {
    src: "/images/b7a4dab131.jpg",
    alt: "NG MARKETPLACE Hero 3",
  },
  {
    src: "/images/797867fbc3.jpg",
    alt: "NG MARKETPLACE Hero 4",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  return (
    <div className="relative w-full max-w-[500px] aspect-square">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-2xl"></div>
      <div className="relative h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover rounded-xl shadow-2xl"
            />
          </div>
        ))}
        <div className="absolute -bottom-4 -right-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <Image
            src="/images/Canon-pixma-2 1.png"
            alt="Featured Printer"
            width={120}
            height={120}
            className="rounded-lg"
          />
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background/90 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-primary" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-background/90 transition-colors"
        >
          <ChevronRight className="h-6 w-6 text-primary" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary" : "bg-primary/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 