import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { ProfileForm } from "@/components/settings/profile-form"
import { AccountForm } from "@/components/settings/account-form"
import { NotificationForm } from "@/components/settings/notification-form"
import { SecurityForm } from "@/components/settings/security-form"

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
    <div className="container max-w-screen-lg mx-auto py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-2/3 lg:w-1/2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">This is how others will see you on the platform.</p>
              </div>
              <ProfileForm user={session.user} />
            </div>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Account</h3>
                <p className="text-sm text-muted-foreground">Update your account settings.</p>
              </div>
              <AccountForm user={session.user} />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">Configure how you receive notifications.</p>
              </div>
              <NotificationForm userId={session.user.id} />
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">Update your security preferences.</p>
              </div>
              <SecurityForm userId={session.user.id} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
