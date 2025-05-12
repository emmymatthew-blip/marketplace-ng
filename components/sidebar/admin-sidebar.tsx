"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  AlertTriangle,
  BookOpen,
  LogOut,
  Printer,
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      active: pathname === "/admin/users",
    },
    {
      href: "/admin/verifications",
      label: "Verifications",
      icon: FileText,
      active: pathname === "/admin/verifications",
    },
    {
      href: "/admin/demos",
      label: "Demonstrations",
      icon: BookOpen,
      active: pathname === "/admin/demos",
    },
    {
      href: "/admin/disputes",
      label: "Disputes",
      icon: AlertTriangle,
      active: pathname === "/admin/disputes",
    },
    {
      href: "/admin/forum",
      label: "Forum",
      icon: MessageSquare,
      active: pathname === "/admin/forum",
    },
    {
      href: "/admin/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Printer className="h-6 w-6" />
              <span className="font-bold">NG MARKETPLACE</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButton asChild isActive={route.active}>
                    <Link href={route.href}>
                      <route.icon className="h-5 w-5" />
                      <span>{route.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {session && (
              <div className="px-3 py-2">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name || "Admin"} />
                    <AvatarFallback>
                      {session.user.name
                        ? session.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "AD"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">Administrator</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1" />
            {session && (
              <Button variant="ghost" size="icon" className="rounded-full" asChild>
                <Link href="/admin/settings">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
            )}
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
