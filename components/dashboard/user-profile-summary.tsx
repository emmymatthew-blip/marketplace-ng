import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Settings } from "lucide-react"
import Link from "next/link"

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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.image || "/placeholder.svg?height=80&width=80"} alt={user.name} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <p className="text-muted-foreground">Manage your profile information and settings</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Edit Profile
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">{user.phone}</p>
              </div>
            )}
            {user.location && (
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{user.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium">Member Type</p>
              <p className="text-sm text-muted-foreground flex items-center">
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                {user.isVerified && <CheckCircle className="ml-1 h-3 w-3 text-green-600" />}
              </p>
            </div>
            {user.role === "PRINTER" && (
              <div>
                <p className="text-sm font-medium">CIPPON Status</p>
                <p className="text-sm text-muted-foreground">
                  {user.isVerified ? "Verified Member" : "Verification Pending"}
                </p>
              </div>
            )}
            {user.companyName && (
              <div>
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
