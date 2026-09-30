import Link from "next/link"
import { Search } from "@/components/search"
import { UserAccountNav } from "@/components/user-account-nav"
import { Button } from "@/components/ui/button"

export function MainNav({ hideAuthNav = false }: { hideAuthNav?: boolean } = {}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#ce057d] to-[#ff9017] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-white hover:text-white/90 transition">
              PrintMarket
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/marketplace" className="text-white hover:text-white/90 transition">
                Marketplace
              </Link>
              <Link href="/forum" className="text-white hover:text-white/90 transition">
                Forum
              </Link>
              <Link href="/about" className="text-white hover:text-white/90 transition">
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!hideAuthNav && (
              <div className="hidden md:block">
                <Search />
              </div>
            )}
            {!hideAuthNav ? (
              <UserAccountNav />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-white hover:text-white/90">
                  Sign In
                </Button>
                <Button className="bg-white text-[#ce057d] hover:bg-white/90">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 