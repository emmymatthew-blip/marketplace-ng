"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"

export function MainNav({ hideAuthNav = false }: { hideAuthNav?: boolean } = {}) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      active: pathname === "/marketplace",
    },
    {
      href: "/forum",
      label: "Forum",
      active: pathname === "/forum",
    },
    {
      href: "/demonstrations",
      label: "Demonstrations",
      active: pathname === "/demonstrations",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ]

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <Image
              src="/images/Nig-Print-Logo.png"
              alt="NG Marketplace Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden font-bold sm:inline-block">NG MARKETPLACE</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  route.active ? "text-foreground" : "text-foreground/60",
                )}
              >
                {route.label}
              </Link>
            ))}
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
                {routes.map((route) => (
                  <DropdownMenuItem key={route.href} asChild>
                    <Link href={route.href}>{route.label}</Link>
                  </DropdownMenuItem>
                ))}
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
          {!hideAuthNav && <UserAccountNav />}
        </div>
      </div>
    </div>
  )
}
