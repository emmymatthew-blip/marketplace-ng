"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { DemoCard } from "@/components/demonstrations/demo-card"
import { DemoFilter } from "@/components/demonstrations/demo-filter"
import { Printer, Plus } from "lucide-react"
import { useSession } from "next-auth/react"
import { Footer } from "@/components/footer"

// Mock data - would be fetched from API in production
const mockDemos = [
  {
    id: "demo1",
    title: "Advanced Screen Printing Techniques",
    description:
      "Learn advanced screen printing techniques from industry experts. This workshop will cover multi-color printing, halftones, and special effects.",
    manufacturer: {
      id: "manu1",
      name: "ScreenTech International",
      image: "/images/797867fbc3.jpg",
      isVerified: true,
    },
    date: "June 15, 2023",
    time: "10:00 AM - 12:00 PM",
    location: "Lagos, Nigeria",
    category: "Screen Printing",
    price: "₦5,000",
    isPaid: true,
    attendees: 12,
    maxAttendees: 20,
    isRegistered: false,
    image: "/images/797867fbc3.jpg"
  },
  {
    id: "demo2",
    title: "Digital Press Maintenance Workshop",
    description:
      "A comprehensive workshop on maintaining digital printing equipment. Learn how to troubleshoot common issues and perform routine maintenance to extend the life of your equipment.",
    manufacturer: {
      id: "manu2",
      name: "Canon Nigeria",
      image: "/images/Canon-pixma-2 1.png",
      isVerified: true,
    },
    date: "June 18, 2023",
    time: "2:00 PM - 4:00 PM",
    location: "Abuja, Nigeria",
    category: "Press Equipment",
    price: "₦7,500",
    isPaid: true,
    attendees: 8,
    maxAttendees: 15,
    isRegistered: true,
    image: "/images/Canon-pixma-2 1.png"
  },
  {
    id: "demo3",
    title: "Eco-Friendly Ink Solutions",
    description:
      "Discover the latest eco-friendly ink solutions for various printing applications. This demonstration will showcase sustainable options that don't compromise on quality.",
    manufacturer: {
      id: "manu3",
      name: "Green Print Nigeria",
      image: "/images/8921fe63ae.jpg",
      isVerified: true,
    },
    date: "June 22, 2023",
    time: "11:00 AM - 1:00 PM",
    location: "Port Harcourt, Nigeria",
    category: "Consumables",
    price: "Free",
    isPaid: false,
    attendees: 25,
    maxAttendees: 50,
    isRegistered: false,
    image: "/images/8921fe63ae.jpg"
  },
  {
    id: "demo4",
    title: "Introduction to UV Printing",
    description:
      "An introductory session on UV printing technology. Learn about the benefits, applications, and basic operation of UV printers.",
    manufacturer: {
      id: "manu4",
      name: "UV Solutions Ltd",
      image: "/images/image 87.png",
      isVerified: true,
    },
    date: "June 25, 2023",
    time: "1:00 PM - 3:00 PM",
    location: "Enugu, Nigeria",
    category: "UV",
    price: "₦3,000",
    isPaid: true,
    attendees: 15,
    maxAttendees: 30,
    isRegistered: false,
    image: "/images/image 87.png"
  },
  {
    id: "demo5",
    title: "Textile Printing Masterclass",
    description:
      "A comprehensive masterclass on textile printing techniques. This session will cover direct-to-garment, screen printing, and heat transfer methods for textiles.",
    manufacturer: {
      id: "manu5",
      name: "Textile Print Nigeria",
      image: "/images/149876-1 1.png",
      isVerified: true,
    },
    date: "June 28, 2023",
    time: "10:00 AM - 3:00 PM",
    location: "Ibadan, Nigeria",
    category: "Textile",
    price: "₦10,000",
    isPaid: true,
    attendees: 10,
    maxAttendees: 20,
    isRegistered: false,
    image: "/images/149876-1 1.png"
  },
  {
    id: "demo6",
    title: "Graphic Design for Print",
    description:
      "Learn essential graphic design principles for print production. This workshop will cover color management, file preparation, and common pitfalls to avoid.",
    manufacturer: {
      id: "manu6",
      name: "GraphicPro Systems",
      image: "/images/b7a4dab131.jpg",
      isVerified: true,
    },
    date: "July 2, 2023",
    time: "9:00 AM - 12:00 PM",
    location: "Virtual (Online)",
    category: "Software",
    price: "Free",
    isPaid: false,
    attendees: 45,
    maxAttendees: 100,
    isRegistered: false,
    image: "/images/b7a4dab131.jpg"
  },
]

const categories = ["Screen Printing", "Press Equipment", "Consumables", "UV", "Textile", "Software"]

export default function DemonstrationsPage() {
  const { data: session } = useSession()
  const [filteredDemos, setFilteredDemos] = useState(mockDemos)

  const handleFilterChange = (filters: {
    search: string
    category: string
    date: Date | undefined
    showFreeOnly: boolean
  }) => {
    const filtered = mockDemos.filter((demo) => {
      // Filter by search term
      if (
        filters.search &&
        !demo.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !demo.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      // Filter by category
      if (filters.category !== "all" && demo.category.toLowerCase() !== filters.category) {
        return false
      }

      // Filter by date
      if (filters.date) {
        const demoDate = new Date(demo.date)
        const filterDate = filters.date
        if (
          demoDate.getDate() !== filterDate.getDate() ||
          demoDate.getMonth() !== filterDate.getMonth() ||
          demoDate.getFullYear() !== filterDate.getFullYear()
        ) {
          return false
        }
      }

      // Filter by price (free only)
      if (filters.showFreeOnly && demo.isPaid) {
        return false
      }

      return true
    })

    setFilteredDemos(filtered)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav />
          <div className="flex items-center gap-4">
            <Search />
            <UserAccountNav />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="absolute inset-0">
            <Image
              src="/images/20170816_154040-scaled-e1583853764343 2.png"
              alt="Background Pattern"
              fill
              className="object-cover opacity-5"
            />
          </div>
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/none text-white">
                  Demonstrations
                </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-[#e94560] to-[#ff9017] mx-auto mt-4 rounded-full"></div>
              </div>
              <p className="max-w-[600px] text-white/90 md:text-xl/relaxed mt-2">
                Learn from industry experts through our exclusive manufacturer demonstration classes and stay ahead of the latest printing innovations.
              </p>
            </div>
          </div>
        </section>

        <div className="container py-8">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#326de0] to-[#ce057d]">
                  Upcoming Classes
                </h2>
                <p className="text-muted-foreground">
                  Discover and register for hands-on learning experiences with industry leaders.
                </p>
              </div>
              {session?.user.role === "MANUFACTURER" && (
                <Button asChild className="bg-gradient-to-r from-[#326de0] to-[#ce057d] text-white hover:from-[#326de0]/90 hover:to-[#ce057d]/90">
                  <Link href="/demonstrations/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Host Demonstration
                  </Link>
                </Button>
              )}
            </div>

            <div className="relative bg-white rounded-2xl shadow-2xl p-2 md:p-8 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#326de0]/5 to-[#ce057d]/5 rounded-2xl"></div>
              <div className="relative z-10">
                <DemoFilter categories={categories} onFilterChange={handleFilterChange} />
              </div>
            </div>

            {filteredDemos.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No demonstrations found</h3>
                <p className="text-muted-foreground mt-2">
                  Try adjusting your filters or check back later for new demonstrations.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDemos.map((demo) => (
                  <DemoCard key={demo.id} demo={demo} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
