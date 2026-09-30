import bcrypt from "bcryptjs"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { UserRole } from "@prisma/client"

import { query } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const users = await query<{
          id: string
          email: string | null
          name: string | null
          role: UserRole
          isVerified: boolean
          yearsInBusiness: number | null
          teamSize: string | null
          companyName: string | null
          phone: string | null
          location: string | null
          bio: string | null
          password: string | null
        }>(
          'SELECT id, email, name, role, "isVerified", "yearsInBusiness", "teamSize", "companyName", phone, location, bio, password FROM "User" WHERE email = ? LIMIT 1',
          [credentials.email]
        )
        const user = users[0]

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
          yearsInBusiness: user.yearsInBusiness ?? undefined,
          teamSize: user.teamSize ?? undefined,
          companyName: user.companyName ?? undefined,
          phone: user.phone ?? undefined,
          location: user.location ?? undefined,
          bio: user.bio ?? undefined,
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.role = token.role as UserRole
        session.user.isVerified = token.isVerified as boolean
        session.user.yearsInBusiness = token.yearsInBusiness as number | undefined
        session.user.teamSize = token.teamSize as string | undefined
        session.user.companyName = token.companyName as string | undefined
        session.user.phone = token.phone as string | undefined
        session.user.location = token.location as string | undefined
        session.user.bio = token.bio as string | undefined
      }
      return session
    },
    async jwt({ token, user }) {
      const dbUsers = await query<{
        id: string
        name: string | null
        email: string | null
        role: UserRole
        isVerified: boolean
        yearsInBusiness: number | null
        teamSize: string | null
        companyName: string | null
        phone: string | null
        location: string | null
        bio: string | null
      }>(
        'SELECT id, name, email, role, "isVerified", "yearsInBusiness", "teamSize", "companyName", phone, location, bio FROM "User" WHERE email = ? LIMIT 1',
        [token.email as string]
      )
      const dbUser = dbUsers[0]

      if (!dbUser) {
        if (user) {
          token.id = user.id
        }
        return token
      }

      return {
        ...token,
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        isVerified: dbUser.isVerified,
        yearsInBusiness: dbUser.yearsInBusiness ?? undefined,
        teamSize: dbUser.teamSize ?? undefined,
        companyName: dbUser.companyName ?? undefined,
        phone: dbUser.phone ?? undefined,
        location: dbUser.location ?? undefined,
        bio: dbUser.bio ?? undefined,
      }
    },
  },
}

