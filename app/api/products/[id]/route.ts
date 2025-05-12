import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { z } from "zod"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { query } from "@/lib/db"

// Define validation schema
const productUpdateSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }).optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).optional(),
  category: z.string().optional(),
  images: z.array(z.string().url()).min(1, { message: "At least one image is required" }).optional(),
  contactInfo: z.string().optional(),
})

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const sql = `
      SELECT p.*, u.name as ownerName, u.role as ownerRole, u.isVerified as ownerIsVerified, 
      u.companyName as ownerCompanyName, u.location as ownerLocation
      FROM products p
      JOIN users u ON p.ownerId = u.id
      WHERE p.id = ?
    `
    const products = await query(sql, [params.id])

    if (!products || (products as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = (products as any[])[0]

    // Format the product to match the expected structure
    const formattedProduct = {
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
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const existingProducts = await query("SELECT * FROM products WHERE id = ?", [params.id])

    if (!existingProducts || (existingProducts as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = (existingProducts as any[])[0]

    // Check if user is the owner of the product
    if (product.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You are not authorized to update this product" }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, category, images, contactInfo } = productUpdateSchema.parse(body)

    // Build the update query dynamically based on provided fields
    let updateSql = "UPDATE products SET updatedAt = NOW()"
    const updateParams: any[] = []

    if (title !== undefined) {
      updateSql += ", title = ?"
      updateParams.push(title)
    }

    if (description !== undefined) {
      updateSql += ", description = ?"
      updateParams.push(description)
    }

    if (category !== undefined) {
      updateSql += ", category = ?"
      updateParams.push(category)
    }

    if (images !== undefined) {
      updateSql += ", images = ?"
      updateParams.push(JSON.stringify(images))
    }

    if (contactInfo !== undefined) {
      updateSql += ", contactInfo = ?"
      updateParams.push(contactInfo)
    }

    updateSql += " WHERE id = ?"
    updateParams.push(params.id)

    await query(updateSql, updateParams)

    // Fetch the updated product
    const updatedProducts = await query("SELECT * FROM products WHERE id = ?", [params.id])
    const updatedProduct = (updatedProducts as any[])[0]

    return NextResponse.json({
      ...updatedProduct,
      images: JSON.parse(updatedProduct.images),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if product exists
    const existingProducts = await query("SELECT * FROM products WHERE id = ?", [params.id])

    if (!existingProducts || (existingProducts as any[]).length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const product = (existingProducts as any[])[0]

    // Check if user is the owner of the product or an admin
    if (product.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "You are not authorized to delete this product" }, { status: 403 })
    }

    await query("DELETE FROM products WHERE id = ?", [params.id])

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
