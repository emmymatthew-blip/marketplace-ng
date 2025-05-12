import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, CheckCircle, ArrowRight } from "lucide-react"

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
  price: string
  isPaid: boolean
  attendees?: number
  maxAttendees?: number
  isRegistered?: boolean
  image?: string
}

interface DemoCardProps {
  demo: DemoClass
  variant?: "full" | "compact"
}

export function DemoCard({ demo, variant = "full" }: DemoCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-48 w-full bg-muted">
        <img
          src={demo.image || "/images/Canon-pixma-2 1.png"}
          alt={demo.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2">
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
            <CardDescription className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={demo.manufacturer.image} alt={demo.manufacturer.name} />
                  <AvatarFallback>{demo.manufacturer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{demo.manufacturer.name}</span>
                {demo.manufacturer.isVerified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                    Verified
                  </Badge>
                )}
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {variant === "full" && <p className="text-sm text-muted-foreground mb-4">{demo.description}</p>}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4 text-primary" />
            {demo.date}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 text-primary" />
            {demo.time}
          </div>
          {demo.location && (
            <div className="flex items-center col-span-2 text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              {demo.location}
            </div>
          )}
          {demo.attendees !== undefined && demo.maxAttendees !== undefined && (
            <div className="flex items-center col-span-2 text-muted-foreground">
              <Users className="mr-2 h-4 w-4 text-primary" />
              {demo.attendees} / {demo.maxAttendees} attendees
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <div className="font-medium text-lg text-primary">{demo.isPaid ? demo.price : "Free"}</div>
        <Button
          asChild
          variant={demo.isRegistered ? "secondary" : "default"}
          size="sm"
          className={demo.isRegistered ? "" : "bg-gradient-to-r from-[#326de0] to-[#ce057d] text-white hover:from-[#326de0]/90 hover:to-[#ce057d]/90"}
          disabled={demo.isRegistered}
        >
          <Link href={`/demonstrations/${demo.id}`} className="flex items-center gap-2">
            {demo.isRegistered ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Registered
              </>
            ) : (
              <>
                Register Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
