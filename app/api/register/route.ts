import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { Prisma, user_role, user_cipponMembershipType } from "@prisma/client"
import { randomUUID } from "crypto"

type UserCreateInput = Prisma.userCreateInput & {
  cipponMembershipNumber?: string | null
  cipponLicenseNumber?: string | null
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Registration request body:", body)

    const { 
      name, 
      email, 
      password, 
      phone, 
      location, 
      category, 
      role, 
      companyName, 
      hasCipponMembership, 
      cipponMembershipType,
      cipponMembershipNumber,
      cipponLicenseNumber 
    } = body

    // Validate required fields
    if (!name || !email || !password || !phone || !location || !category || !role) {
      console.log("Missing required fields:", { name, email, phone, location, category, role })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate CIPPON membership fields for printers
    if (role === "PRINTER" && hasCipponMembership) {
      if (!cipponMembershipType || cipponMembershipType === "NONE") {
        console.log("Invalid CIPPON membership type:", cipponMembershipType)
        return NextResponse.json(
          { error: "Please select a CIPPON membership type" },
          { status: 400 }
        )
      }
      if (cipponMembershipType === "INDIVIDUAL" && !cipponMembershipNumber) {
        console.log("Missing CIPPON membership number")
        return NextResponse.json(
          { error: "Please enter your CIPPON membership number" },
          { status: 400 }
        )
      }
      if (cipponMembershipType === "CORPORATE" && !cipponLicenseNumber) {
        console.log("Missing CIPPON license number")
        return NextResponse.json(
          { error: "Please enter your company's CIPPON license number" },
          { status: 400 }
        )
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user using Prisma's type-safe approach
    const userData: UserCreateInput = {
      id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      phone,
      location,
      role: role as user_role,
      companyName: role === "MANUFACTURER" ? companyName : null,
      hasCipponMembership: role === "PRINTER" ? hasCipponMembership : false,
      cipponMembershipType: role === "PRINTER" ? (cipponMembershipType as user_cipponMembershipType) : "NONE",
      cipponMembershipNumber: role === "PRINTER" && hasCipponMembership && cipponMembershipType === "INDIVIDUAL" ? cipponMembershipNumber : null,
      cipponLicenseNumber: role === "PRINTER" && hasCipponMembership && cipponMembershipType === "CORPORATE" ? cipponLicenseNumber : null,
      isVerified: false,
      updatedAt: new Date(),
    }

    console.log("Creating user with data:", userData)

    const user = await prisma.user.create({
      data: userData,
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Registration error details:", error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error occurred" },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error registering user" },
      { status: 500 }
    )
  }
}
