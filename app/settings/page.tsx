import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { authOptions } from "@/lib/auth"
import { ProfileForm } from "@/components/settings/profile-form"
import { AccountForm } from "@/components/settings/account-form"
import { NotificationForm } from "@/components/settings/notification-form"
import { SecurityForm } from "@/components/settings/security-form"
import { User, Shield, Bell, UserCog } from "lucide-react"
import { DashboardHeader, DashboardPageContainer } from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <DashboardPageContainer className="space-y-6">
      <DashboardHeader
        title="Settings"
        description="Manage your account, profile, notifications, and security preferences."
        breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Settings" }]}
      />

      <Tabs defaultValue="profile" className="w-full space-y-4">
        <TabsList className="flex w-full flex-wrap gap-2 rounded-lg border border-border bg-muted/40 p-1">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <UserCog className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <Card className="rounded-xl border border-border bg-card shadow-sm">
          <CardContent className="p-4 sm:p-6 space-y-6">
            <TabsContent value="profile" className="mt-0 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  This is how others will see you on the platform.
                </p>
              </div>
              <ProfileForm user={session.user} />
            </TabsContent>

            <TabsContent value="account" className="mt-0 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Account</h3>
                <p className="text-sm text-muted-foreground">Update your account settings.</p>
              </div>
              <AccountForm user={session.user} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive notifications.
                </p>
              </div>
              <NotificationForm userId={session.user.id} />
            </TabsContent>

            <TabsContent value="security" className="mt-0 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Security</h3>
                <p className="text-sm text-muted-foreground">Update your security preferences.</p>
              </div>
              <SecurityForm userId={session.user.id} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </DashboardPageContainer>
  )
}
