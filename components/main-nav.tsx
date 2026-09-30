"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu, Shield, LogIn, UserPlus, HelpCircle, Mail, CreditCard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Badge } from "@/components/ui/badge"

interface NavRoute {
  href: string
  label: string
  active: boolean
  protected?: boolean
  icon?: React.ReactNode
}

export interface MainNavProps {
  hideAuthNav?: boolean
  /** When true, render without fixed wrapper and container (for use inside dashboard shell) */
  embedded?: boolean
  /** Optional slot at the start of the nav (e.g. dashboard sidebar toggle on mobile) */
  leftSlot?: React.ReactNode
}

export function MainNav({ hideAuthNav = false, embedded = false, leftSlot }: MainNavProps = {}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const routes: NavRoute[] = [
    { href: "/", label: "Home", active: pathname === "/" },
    { href: "/dashboard", label: "Dashboard", active: pathname === "/dashboard", protected: true },
    { href: "/marketplace", label: "Marketplace", active: pathname === "/marketplace" },
    { href: "/forum", label: "Forum", active: pathname === "/forum" },
    { href: "/demonstrations", label: "Demonstrations", active: pathname === "/demonstrations" },
    { href: "/subscription", label: "Pricing", active: pathname === "/subscription", icon: <CreditCard className="h-4 w-4 mr-2" /> },
    { href: "/about", label: "About", active: pathname === "/about" },
  ]

  const navContent = (
    <>
      <div className="flex flex-1 items-center gap-6 md:gap-10">
        {leftSlot}
        <Link href="/" className="hidden items-center space-x-2 md:flex">
          <Image
            src="/images/Nig-Print-Logo.png"
            alt="PrintMarket NG Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
          <span className="hidden font-bold sm:inline-block">PrintMarket NG</span>
        </Link>
        <div className="hidden gap-6 md:flex">
            {routes.map((route) => {
              if (route.protected && !session?.user) return null
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    route.active ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {route.icon}
                  {route.label}
                </Link>
              )
            })}
          </div>
          <div className="flex md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                {routes.map((route) => {
                  if (route.protected && !session?.user) return null
                  return (
                    <DropdownMenuItem key={route.href} asChild>
                      <Link href={route.href} className="flex items-center">
                        {route.icon}
                        {route.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!hideAuthNav && (
            <div className="hidden md:block">
              <Search />
            </div>
          )}
          {!hideAuthNav && (
            <>
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="h-9 w-16 bg-muted animate-pulse rounded-md" />
                  <div className="h-9 w-24 bg-muted animate-pulse rounded-md" />
                </div>
              ) : (
                <>
                  {session?.user ? (
                    <>
                      {!session.user.isVerified && (
                        <Link href="/verification">
                          <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600 hover:bg-yellow-50">
                            <Shield className="h-3 w-3" />
                            Verify
                          </Badge>
                        </Link>
                      )}
                      <NotificationBell />
                      <UserAccountNav user={session.user} />
                    </>
                  ) : (
                    <div className="flex items-center gap-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-2">
                            <LogIn className="h-4 w-4" />
                            <span>Login</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>Authentication</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <Link href="/login" className="w-full cursor-pointer">
                                <LogIn className="mr-2 h-4 w-4" />
                                <span>Login to Account</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/register" className="w-full cursor-pointer">
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Create Account</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                              <Link href="/help" className="w-full cursor-pointer">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Help Center</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/contact" className="w-full cursor-pointer">
                                <Mail className="mr-2 h-4 w-4" />
                                <span>Contact Support</span>
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button size="sm" className="gap-2 bg-secondary text-white font-bold" asChild>
                        <Link href="/register">
                          <UserPlus className="h-4 w-4" />
                          <span>Register</span>
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </>
  )

  if (embedded) {
    return navContent
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        {navContent}
      </div>
    </div>
  )
}
