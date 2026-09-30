import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { isSeller, USER_ROLES } from "@/lib/user-roles"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user is already a seller
    if (isSeller(user.role)) {
      return NextResponse.json(
        { error: "You are already a seller" },
        { status: 400 }
      )
    }

    // Get the body to see what seller role they want
    const body = await req.json()
    const { sellerRole } = body

    // Validate seller role
    if (!sellerRole) {
      return NextResponse.json(
        { error: "Please select a seller role" },
        { status: 400 }
      )
    }

    // Check if the role is a valid seller role (not a buyer role)
    const buyerRoles = [...USER_ROLES.PRINT_BUYERS] as readonly string[]
    if (buyerRoles.includes(sellerRole)) {
      return NextResponse.json(
        { error: "Invalid seller role selected" },
        { status: 400 }
      )
    }

    // Update user role to seller role
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: sellerRole,
      },
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Successfully opted in as seller",
    })
  } catch (error) {
    console.error("Error opting in as seller:", error)
    return NextResponse.json(
      { error: "Failed to opt in as seller" },
      { status: 500 }
    )
  }
}
