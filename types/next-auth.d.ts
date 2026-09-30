import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: UserRole
    isVerified: boolean
    yearsInBusiness?: number
    teamSize?: string
    companyName?: string
    phone?: string
    location?: string
    bio?: string
  }

  interface Session {
    user: User & {
      id: string
      role: string
      isVerified: boolean
      yearsInBusiness?: number
      teamSize?: string
      companyName?: string
      phone?: string
      location?: string
      bio?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    isVerified: boolean
    yearsInBusiness?: number
    teamSize?: string
    companyName?: string
    phone?: string
    location?: string
    bio?: string
  }
}
