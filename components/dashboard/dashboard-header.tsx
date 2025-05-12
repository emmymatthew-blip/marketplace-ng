import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, Users, Calendar } from "lucide-react"

interface DashboardHeaderProps {
  userRole?: string
  stats: {
    agreements: number
    messages: number
    forumActivity: number
    upcomingDemos: number
  }
}

export function DashboardHeader({ userRole = "CONSUMER", stats }: DashboardHeaderProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.agreements}</div>
          <p className="text-xs text-muted-foreground">
            {userRole === "PRINTER" || userRole === "MANUFACTURER"
              ? "Manage your business agreements"
              : "Track your service agreements"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.messages}</div>
          <p className="text-xs text-muted-foreground">
            {stats.messages > 0 ? `${Math.min(stats.messages, 3)} unread messages` : "No new messages"}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Forum Activity</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.forumActivity}</div>
          <p className="text-xs text-muted-foreground">Posts and replies this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming Demos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingDemos}</div>
          <p className="text-xs text-muted-foreground">
            {userRole === "MANUFACTURER"
              ? "Classes you're hosting"
              : stats.upcomingDemos > 0
                ? "Registered for this week"
                : "No upcoming demonstrations"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
