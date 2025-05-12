import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from "@/lib/db"

// Define validation schema
const productSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  category: z.string(),
  images: z.array(z.string().url()).min(1, { message: "At least one image is required" }),
  contactInfo: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const location = searchParams.get("location")
    const ownerId = searchParams.get("ownerId")

    let sql = `
      SELECT p.*, u.name as ownerName, u.role as ownerRole, u.isVerified as ownerIsVerified, 
      u.companyName as ownerCompanyName, u.location as ownerLocation
      FROM products p
      JOIN users u ON p.ownerId = u.id
      WHERE 1=1
    `
    const params: any[] = []

    if (category) {
      sql += " AND p.category = ?"
      params.push(category)
    }

    if (ownerId) {
      sql += " AND p.ownerId = ?"
      params.push(ownerId)
    }

    if (location) {
      sql += " AND u.location LIKE ?"
      params.push(`%${location}%`)
    }

    sql += " ORDER BY p.createdAt DESC"

    const products = await query(sql, params)

    // Format the products to match the expected structure
    const formattedProducts = products.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      images: JSON.parse(product.images),
      contactInfo: product.contactInfo,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      owner: {
        id: product.ownerId,
        name: product.ownerName,
        companyName: product.ownerCompanyName,
        location: product.ownerLocation,
        isVerified: Boolean(product.ownerIsVerified),
        role: product.ownerRole,
      },
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only printers and manufacturers can create products
    if (session.user.role !== "PRINTER" && session.user.role !== "MANUFACTURER") {
      return NextResponse.json({ error: "Only printers and manufacturers can create products" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, category, images, contactInfo } = productSchema.parse(body)

    const result = await query(
      `INSERT INTO products (title, description, category, images, contactInfo, ownerId) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, category, JSON.stringify(images), contactInfo, session.user.id],
    )

    const productId = (result as any).insertId

    const product = {
      id: productId,
      title,
      description,
      category,
      images,
      contactInfo,
      ownerId: session.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
