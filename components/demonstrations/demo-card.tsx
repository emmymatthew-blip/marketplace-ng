"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { loginWithCallback } from "@/lib/auth-urls"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"

interface DemoClass {
  id: string
  title: string
  description: string
  manufacturer: {
    id: string
    name: string
    image?: string
    isVerified: boolean
  }
  date: string
  time: string
  location?: string
  category: string
  price?: string
  isPaid?: boolean
  attendees?: number
  maxAttendees?: number
  isRegistered?: boolean
  image?: string
  videoUrl?: string
  format?: "LIVE" | "HYBRID"
  /** Pipeline listings on the hub are scheduled only — live status belongs on the weekly spotlight card */
  status?: "UPCOMING"
  isFeatured?: boolean
}

interface DemoCardProps {
  demo: DemoClass
  isOwner?: boolean
}

export function DemoCard({ demo, isOwner = false }: DemoCardProps) {
  const { data: session } = useSession()
  const registerReturn = `/demonstrations/${demo.id}?action=register`
  const reserveHref = session ? registerReturn : loginWithCallback(registerReturn)

  const toneRing =
    "border-l-4 border-l-sky-500 shadow-[0_0_0_1px_rgba(14,165,233,0.1)]"

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-300 overflow-hidden border border-border bg-card ${toneRing}`}
    >
      <div className="relative h-48 w-full bg-muted">
        <img
          src={demo.image || "/images/Canon-pixma-2 1.png"}
          alt={demo.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 left-2 flex flex-wrap gap-2">
          <Badge className="border-none bg-sky-600 text-white">Weekly session</Badge>
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          {demo.isFeatured && (
            <Badge className="bg-gradient-to-r from-brand-primary to-brand-pink text-white border-none">
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="bg-white/90 text-primary hover:bg-white">
            {demo.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {demo.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={demo.manufacturer.image} alt={demo.manufacturer.name} />
                <AvatarFallback>{demo.manufacturer.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{demo.manufacturer.name}</span>
              {demo.manufacturer.isVerified && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{demo.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {demo.date}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4" />
            {demo.time}
          </div>
          {demo.location && (
            <div className="flex items-center text-muted-foreground col-span-2">
              <MapPin className="mr-2 h-4 w-4" />
              {demo.location}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between gap-3 mt-2">
          <div className="flex flex-col text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Approved weekly session — register interest
            </span>
            {demo.attendees != null && demo.maxAttendees != null && (
              <span>
                {demo.attendees} / {demo.maxAttendees} registered
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isOwner ? (
              <>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/demonstrations/${demo.id}/edit`}>Edit</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/demonstrations/${demo.id}`}>Manage</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/demonstrations/${demo.id}/leads`}>Leads</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  <Link href={`/demonstrations/${demo.id}`}>
                    View details
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={reserveHref}>Reserve interest</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
