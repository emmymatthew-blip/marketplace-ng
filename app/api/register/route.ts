import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"
import { randomUUID } from "crypto"
import { query } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      password,
      country,
      role,
      companyName,
      phone,
      location,
      cityState,
      jobTitle,
      companyWebsite,
      firstName,
      lastName,
      hasCipponMembership,
      cipponMembershipType,
      cipponMembershipNumber,
      cipponLicenseNumber,
    } = body

    if (!name || !email || !password || !country || !role) {
      return NextResponse.json(
        { error: "Name, email, password, country, and role are required." },
        { status: 400 }
      )
    }

    const trimmedEmail = String(email).trim()
    const existingUser = await query<{ id: string }>(
      'SELECT id FROM "User" WHERE email = ? LIMIT 1',
      [trimmedEmail]
    )
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const trimmedName = String(name).trim()

    const safeRole = role as UserRole
    const userId = randomUUID()
    await query(
      `INSERT INTO "User" (
        id, name, email, password, phone, location, country, "cityState", role, "companyName",
        "jobTitle", "companyWebsite", "firstName", "lastName", "hasCipponMembership",
        "cipponMembershipType", "cipponMembershipNumber", "cipponLicenseNumber",
        "isVerified", "verificationLevel", "identityVerified", "businessVerified", "enterpriseVerified",
        "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        trimmedName,
        trimmedEmail,
        hashedPassword,
        phone ?? null,
        location ?? country ?? null,
        country ?? null,
        cityState ?? null,
        safeRole ?? "END_USER_PRINTER",
        companyName?.trim() || null,
        jobTitle ?? null,
        companyWebsite ?? null,
        firstName ?? null,
        lastName ?? null,
        hasCipponMembership ?? false,
        cipponMembershipType ?? "NONE",
        cipponMembershipNumber ?? null,
        cipponLicenseNumber ?? null,
        false,
        0,
        false,
        false,
        false,
      ]
    )

    return NextResponse.json({
      user: {
        id: userId,
        name: trimmedName,
        email: trimmedEmail,
        role: safeRole ?? "END_USER_PRINTER",
      },
      message: "User registered successfully.",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
