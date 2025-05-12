import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "New Message | NG Marketplace",
  description: "Start a new conversation with another user",
}

async function getUsers(currentUserEmail: string, searchQuery?: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { email: { not: currentUserEmail } },
          searchQuery ? {
            OR: [
              { name: { contains: searchQuery } },
              { email: { contains: searchQuery } },
              { companyName: { contains: searchQuery } }
            ]
          } : {}
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        companyName: true,
        isVerified: true
      },
      orderBy: {
        name: 'asc'
      },
      take: 50
    })
    return users
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

export default async function NewMessagePage({
  searchParams,
}: {
  searchParams: { search?: string }
}) {
  const session = await getServerSession()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const users = await getUsers(session.user.email, searchParams.search)

  return (
    <div className="container mx-auto py-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Start a New Conversation</h1>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <form>
            <Input
              name="search"
              placeholder="Search by name, email, or company..."
              className="pl-10"
              defaultValue={searchParams.search || ""}
            />
          </form>
        </div>

        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/messages/${user.id}`}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                  {user.image ? (
                    <img
                      src={user.image || "/placeholder.svg"}
                      alt={user.name || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{user.name}</h3>
                    {user.isVerified && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{user.companyName || user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                Try searching with a different name, email, or company name.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
