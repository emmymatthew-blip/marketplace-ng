import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings } from "lucide-react"
import { VerifiedBadge } from "@/components/verified-badge"
import Link from "next/link"
import Image from "next/image"

interface UserProfileSummaryProps {
  user: {
    id: string
    name: string
    email: string
    image?: string
    role: string
    isVerified: boolean
    cipponId?: string
    phone?: string
    location?: string
    companyName?: string
  }
}

export function UserProfileSummary({ user }: UserProfileSummaryProps) {
  // Choose profile image based on user's role or other criteria
  const profileImage = "/profile-images/photo-1570612861542-284f4c12e75f_fm=jpg&q=60&w=3000&ixlib=rb-4.1.jpeg"

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4 min-w-0">
          <div className="relative flex shrink-0 items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 p-[2px]">
              <div className="relative h-full w-full rounded-full overflow-hidden">
                <Image
                  src={profileImage}
                  alt={user.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold truncate">Your Profile</h2>
            <p className="text-muted-foreground truncate">Manage your profile information and settings</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="sm:ml-auto shrink-0" asChild>
          <Link href="/settings" className="whitespace-nowrap">
            <Settings className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {user.phone && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
            )}
            {user.location && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{user.location}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">Member Type</p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                <VerifiedBadge verified={user.isVerified} size="sm" />
              </p>
            </div>
            {user.role === "END_USER_PRINTER" && (
              <div className="space-y-1">
                <p className="text-sm font-medium">CIPPON Status</p>
                <p className="text-sm text-muted-foreground">
                  {user.isVerified ? "Verified Member" : "Verification Pending"}
                </p>
              </div>
            )}
            {user.companyName && (
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium">Company</p>
                <p className="text-sm text-muted-foreground">{user.companyName}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
